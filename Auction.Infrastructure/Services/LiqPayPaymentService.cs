using System.ComponentModel.DataAnnotations;
using System.ComponentModel.Design;
using System.Diagnostics;
using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using Auction.Core.Entities;
using Auction.Core.Interfaces.Repositories;
using Auction.Core.Interfaces.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Auction.Infrastructure.Services;

public class LiqPayPaymentService : IPaymentService<LiqPayResponseDto>
{
    private readonly ILogger<LiqPayPaymentService> _logger;
    private readonly IPaymentRepository _paymentRepository;
    private readonly IUserRepository _userRepository;
    private readonly IHttpClientFactory _httpClient;
    private static readonly string SECRET_KEY = "sandbox_DFu3mUlIxc9QcAFO9df0OapaJTd7rNwurHG5fc32";

    public LiqPayPaymentService(ILogger<LiqPayPaymentService> logger,IPaymentRepository paymentRepository,
        IUserRepository userRepository,
        IHttpClientFactory httpClientFactory)
    {
        _logger = logger;
        _paymentRepository = paymentRepository;
        _userRepository = userRepository;
        _httpClient = httpClientFactory;
    }
    
    
    public async Task<LiqPayResponseDto> FormPayData(string userId, decimal amount)
    {
        _logger.LogInformation("Creating payment entity..");
        var payment = new Payment{ UserId = userId,Amount = amount, Completed = false };
        await _paymentRepository.Add(payment);
        _logger.LogInformation("Payment entity created");

        _logger.LogInformation("Creating liquipay request data..");
        var param = new Dictionary<string, string>();
        param.Add("public_key","sandbox_i86338810906");
        param.Add("private_key",SECRET_KEY);
        param.Add("action","pay");
        param.Add("amount", amount.ToString(CultureInfo.InvariantCulture));
        param.Add("currency", "UAH");
        param.Add($"description", $"Поповнення балансу користувача {userId}");
        param.Add($"order_id", payment.Id);
        param.Add("server_url",$"http://wauction.asuscomm.com:8080/api/payment/complete/");
        
        var requestData = JsonConvert.SerializeObject(param);

        var base64data = EncryptToBase64(requestData);
        var sig = EncryptWithSha1(base64data);
        
        _logger.LogInformation("Request data created.");

        payment.Signature = sig;
        
        _paymentRepository.Update(payment);

        return new LiqPayResponseDto
        {
            Signature = sig,
            Data = base64data
        };
    }
    
    public async void SendToOrg(decimal amount,string target)
    {
        _logger.LogInformation("Creating checkout entity..");
        
        _logger.LogInformation("Creating liquipay request data..");
        var param = new Dictionary<string, string>();
        param.Add("public_key","sandbox_i86338810906");
        param.Add("private_key",SECRET_KEY);
        param.Add("action","p2pcredit");
        param.Add("amount", amount.ToString(CultureInfo.InvariantCulture));
        param.Add("currency", "UAH");
        param.Add($"description", $"Поповнення від BlagoUA");
        param.Add($"order_id", Guid.NewGuid().ToString());
        param.Add("receiver_card", target);
        
        param.Add("server_url",$"http://wauction.asuscomm.com:8080/api/payment/complete/");
        
        var requestData = JsonConvert.SerializeObject(param);

        var base64data = EncryptToBase64(requestData);
        var sig = EncryptWithSha1(base64data);
        
        _logger.LogInformation("Request data created.");
        using var cl = _httpClient.CreateClient();
        await cl.PostAsync("https://www.liqpay.ua/api/request",
            new FormUrlEncodedContent(new []{new KeyValuePair<string, string>("data",base64data),
                new KeyValuePair<string, string>("signature",sig)}));
    }

    private string EncryptToBase64(string data)
    {
        var plainTextBytes = Encoding.UTF8.GetBytes(data);
        return Convert.ToBase64String(plainTextBytes);
    }
    
    private string EncryptWithSha1(string jsonBase64)
    {
        var ligPaySign = SECRET_KEY + jsonBase64 + SECRET_KEY;
        var signBytes = Encoding.UTF8.GetBytes(ligPaySign);
        using var sha1 = SHA1.Create();
        var sha1EncryptedSign = sha1.ComputeHash(signBytes);
        
        var sig = Convert.ToBase64String(sha1EncryptedSign);
        return sig;
    }

    public async Task<Payment> Verify(string data,string signature)
    {
        _logger.LogInformation("Comparing signature...");
        var computedSignature = EncryptWithSha1(data);

        if (computedSignature != signature)
            throw new ArgumentException("Signature do not match");
        _logger.LogInformation("Signature is valid.");

        
        _logger.LogInformation("Checking response data...");

        var decodedData = Encoding.UTF8.GetString(Convert.FromBase64String(data));
        var response = JsonConvert.DeserializeObject<LiqPayCompleteResponse>(decodedData);
        
        if (response.Status != "success")
            throw new ArgumentException("Оплата не була здійснена.");

        var payment = await _paymentRepository.Get(response.OrderId);
        if (payment == null)
            throw new ArgumentException("Помилка.");
        
        _logger.LogInformation("Response is valid.");

        return payment;
    }

    public async Task CompletePayment(string data,string signature)
    {
        var payment = await Verify(data, signature);
        Debug.Assert(payment.UserId != null, "payment.UserId != null");

        _logger.LogInformation("Checking internal payment data...");
        if (payment.Completed)
            throw new ArgumentException("This payment is already completed.");
        
        var user = await _userRepository.Get(payment.UserId);
        if (user == null)
            throw new ArgumentException("Something went wrong.");
        _logger.LogInformation("Data is valid.");
        
        _logger.LogInformation("Updating user balance...");
        payment.Completed = true;

        user.Balance += payment.Amount;

        _userRepository.Update(user);
        _paymentRepository.Update(payment);
        _logger.LogInformation("Update complete.");
    }
}