using Auction.Client.Dto.Bet;
using Auction.Core.Entities;
using Auction.Core.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Auction.Client.Controllers;

[Authorize]
[Route("api/[controller]/")]
[ApiController]
public class BetController : ControllerBase
{
    private readonly ILogger<BetController> _logger;
    private readonly ITimerService _timerService;
    private readonly ILotService _lotService;
    private IAuthService _authService;


    public BetController(ILogger<BetController> logger,ITimerService timerService,ILotService lotService, IAuthService authService)
    {
        _logger = logger;
        _timerService = timerService;
        _lotService = lotService;
        _authService = authService;
    }

    [HttpPost]
    public async Task<IActionResult> PlaceBet([FromBody] LotBetDto lotBetDto) {
        try
        {
            var user = await _authService.GetCurrentUser(User);
            var bet = new LotBet(user.Id, lotBetDto.LotId, lotBetDto.BetAmount);
            
            _logger.LogInformation("Started bet addition.");
            await _lotService.AddBet(bet);
            _logger.LogInformation("Bet added.");
            
            return Ok();
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return BadRequest(e.Message);
        }
    }   
}