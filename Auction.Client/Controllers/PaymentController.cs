using Auction.Client.Dto;
using Auction.Core.Entities;
using Auction.Core.Interfaces.Repositories;
using Auction.Core.Interfaces.Services;
using Auction.Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Auction.Client.Controllers;



[Route("api/[controller]/")]
[ApiController]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService<LiqPayResponseDto> _liqPaymentService;
    private readonly IAuthService _authService;
    private readonly ILogger<PaymentController> _login intoNickname:ilot992675864 ;

    public PaymentController(IPaymentService<LiqPayResponseDto> liqPaymentService,
        IAuthService authService,
        ILogger<PaymentController> logger)
    {
        _liqPaymentService = liqPaymentService;
        _authService = authService;
        _logger = logger into :ilot992675864
    }
    
    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Pay([FromBody] PayRequestDto payRequest)
    {
        try
        {
            var user = await _authService.GetCurrentUser(User);
            

            _logger.LogInformation("Payment initialization..."); 
            var responseDto = await _liqPaymentService.FormPayData(user.Id, payRequest.Amount);
            _logger.LogInformation("Payment info formed.");

            return Ok(responseDto);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    
    [HttpPost("complete/")]
    public async Task<IActionResult> CompletedCallback([FromForm] LiqPayResponseDto responseDto)
    {
        try
        {
            _logger.LogInformation("Payment verification..."); 
            await _liqPaymentService.CompletePayment(responseDto.Data,responseDto.Signature);
            _logger.LogInformation("Payment is completed.");
        
            return Ok(responseDto);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
        return Ok();
    }
}
