using Auction.Core.Entities;

namespace Auction.Core.Interfaces.Services;

public interface IPaymentService<TPaymentResponse> where TPaymentResponse: class
{
    Task<TPaymentResponse> FormPayData(string userId, decimal amount);
    Task<Payment> Verify(string data,string signature);
    Task CompletePayment(string data, string signature);
    void SendToOrg(decimal amount, string target);
}