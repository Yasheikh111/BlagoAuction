using System.Security;
using Ardalis.GuardClauses;
using Auction.Client.Dto.Bet;
using Auction.Client.Dto.Lot;
using Auction.Client.Dto.Org;
using Auction.Core.Entities;
using Auction.Core.Interfaces.Repositories;
using Auction.Core.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Diagnostics;


namespace Auction.Client.Controllers;

[Authorize]
[Route("api/[controller]/")]
[ApiController]
public class LotsController : ControllerBase
{
    private readonly ILogger<LotsController> _logger;
    private readonly ILotRepository _lotRepository;
    private IAuthService _authService;
    private ILotService _lotService;
    private IUserRepository _userRepository;
    private ILotCreationRepository _lotCreationRepository;




    public LotsController(ILogger<LotsController> logger,ILotRepository lotRepository, IAuthService authService, ILotService lotService, IUserRepository userRepository, ILotCreationRepository lotCreationRepository)
    {
        _logger = logger;
        _lotRepository = lotRepository;
        _authService = authService;
        _lotService = lotService;
        _userRepository = userRepository;
        _lotCreationRepository = lotCreationRepository;
    }

    [HttpGet("reg/{lotId:int}")]
    public async Task<IActionResult> RegisterInLot(int lotId)
    {
        try
        {
            var user = await _authService.GetCurrentUser(User);
            await _lotService.RegisterForLot(lotId,user.Id);
            return Ok();
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
    }
    
    [Authorize(Roles = "Admin,Moderator")]
    [HttpPost("add/")]
    public async Task<IActionResult> Add([FromBody] LotCreationRequestDto lotDto)
    {
        try
        {
            var user = await _authService.GetCurrentUser(User);
            var lot = new Lot();

            if (User.IsInRole("Moderator"))
                lotDto.OrganizationId = user.OrganizationId ?? 0;    
            
            lot.Item = new Item();
            lot.Item.Description = lotDto.Description;
            lot.Item.Photo = Convert.FromBase64String(lotDto.Image);
        
            lot.StartTime = DateTimeOffset.FromUnixTimeMilliseconds(lotDto.StartTime).UtcDateTime;
            lot.EndTime = DateTimeOffset.FromUnixTimeMilliseconds(lotDto.EndTime).UtcDateTime;
            lot.Step = (double)lotDto.BetStep / 100;
            lot.TimeToBeatPreviousBet = new TimeSpan(0,0,lotDto.SecondsToBeatPrevBet);
            lot.MinBet = lotDto.MinBet;
            lot.Target = lotDto.Target;
            lot.Description = lotDto.Description;

            await _lotRepository.Add(lot);

            var creationEntity = new LotCreation
            {
                CreatorUser = user,
                Lot = lot,
                OrganizationId = lotDto.OrganizationId
            };

            await _lotCreationRepository.Add(creationEntity);
                
            return Ok();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
        
    }
    
     
     [HttpGet("delete/{lotId:int}")]
     public async Task<IActionResult> Delete(int lotId)
     {
         try
         {
             var user = await _authService.GetCurrentUser(User);
             await _lotRepository.Delete(lotId);
             
             return Ok();
         }
         catch (Exception e)
         {
             Console.WriteLine(e);
             return BadRequest(e.Message);
         }
     }
     
     [HttpPost("update/{lotId:int}")]
     public async void Delete([FromHeader] int lotId,
         LotCreationRequestDto creationRequestDto)
     {
         var lot = await _lotRepository.Delete(lotId);
     }
     
    // public void Update(Lot lot) { }
    [HttpGet("{lotId:int}")]
    public async Task<IActionResult> Get(int lotId)
    {
        try
        {
            var user = await _authService.GetCurrentUser(User);
            var lot = Guard.Against.Null(await _lotRepository.GetWithDetails(lotId))!;
            
            var lotDto = new LotWithDetailsDto
            {
                Id = lot.Id,
                Item = lot.Item != null
                    ? new ItemDto { Description = lot.Item.Description, Image = lot.Item.Photo }
                    : null,
                Description = lot.Description,
                LotBetDtos = lot.Bets.Any() ?
                    lot.Bets.Select(bet => new Dto.LotBetDto
                    {
                        Id = bet.Id,
                        Amount = bet.BetAmount,
                        BetTime = bet.BetTime,
                        Username = bet.AuctionUser.Email
                    }).ToList():new List<Dto.LotBetDto>(),
                MinBet = lot.MinBet,
                CanUserBet = lot.EnsureUserCanBet(user),
                StartDate = lot.StartTime,
                EndDate = lot.EndTime,
                BetStep = lot.Step,
                Participants = lot.RegisteredUsers.Count
            };
            
            return Ok(lotDto);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return BadRequest(e.Message);
        }
        
    }
    
    [HttpGet("{lotId:int}/winner")]
    public async Task<IActionResult> GetWinner(int lotId)
    {
        try
        {
            var user = await _authService.GetCurrentUser(User);
            var lot = Guard.Against.Null(await _lotRepository.GetWithDetails(lotId))!;
            var winner = lot.Winner;
            
            return Ok(new
            {
                Id = winner.Id,
                Email = winner.Email,
                BetAmount = lot.LatestBetAmount
            });
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return BadRequest(e.Message);
        }
        
    }
    
    [HttpPut("{lotId:int}/timeRemaining")]
    public async Task<IActionResult> GetTimeRemaining(int lotId)
    {
        try
        {
            var user = await _authService.GetCurrentUser(User);
            var lot = Guard.Against.Null(await _lotRepository.GetWithDetails(lotId))!;
            return Ok(lot.TimeToBeatPreviousBet.Milliseconds);

        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return BadRequest(e.Message);
        }
    }


    [HttpGet("{lotId:int}/bets")]
    public async Task<IActionResult> GetAllBets(int lotId)
    {
        var lot = await _lotRepository.GetWithDetails(lotId);
        return Ok(lot.Bets.Select(bet => new Dto.LotBetDto
        {
            Id = bet.Id,
            Amount = bet.BetAmount,
            BetTime = bet.BetTime,
            Username = bet.AuctionUser?.Email ?? "Ya"
        }).ToList());
    }

    public static LotDto ToLotDto(Lot lot) => new LotDto
    {
        Id = lot.Id,
        Description = lot.Description,
        StartDate = lot.StartTime,
        EndDate = lot.EndTime,
        MinBet = lot.MinBet,
        Image = lot.Item.Photo,
        Participants = lot.RegisteredUsers.Count,
        Organization = new OrganizationDto
        {
            Id = lot.LotCreation.Organization.Id,
            Image = lot.LotCreation.Organization.Logo,
            Name = lot.LotCreation.Organization.Name
        }
    };

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var user = await _authService.GetCurrentUser(User);
            var lots = await _lotRepository.GetAllWithDetailsAsync();
            var dtos = lots.Select(lot =>
            {
                var dto = ToLotDto(lot);
                dto.IsUserRegistered = lot.UserRegistered(user);
                return dto;
            });
            return Ok(dtos);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return BadRequest(e.Message);
        }
    }

}