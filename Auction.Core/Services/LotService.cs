using System.Data;
using Ardalis.GuardClauses;
using Auction.Core.Entities;
using Auction.Core.Interfaces.Repositories;
using Auction.Core.Interfaces.Services;
using Auction.Infrastructure.Services;
using Microsoft.Extensions.Logging;

namespace Auction.Core.Services;

public class LotService : ILotService
{
    private readonly ILogger<LotService> _logger; 
    private readonly ILotRepository _lotRepository;
    private readonly IUserRepository _userRepository;
    private readonly ITimerService _timerService;
    private readonly ILotBetsRepository _lotBetsRepository;
    
    private readonly BetHubService _betHubService;
    private readonly IUserOwnershipRepository _ownershipRepository;
    private readonly IPaymentService<LiqPayResponseDto> _paymentService;

    public LotService(ILogger<LotService> logger,
        ILotRepository lotRepository,
        IUserRepository userRepository,
        ITimerService timerService,
        ILotBetsRepository lotBetsRepository,
        BetHubService betHubService,
        IUserOwnershipRepository ownershipRepository, IPaymentService<LiqPayResponseDto> paymentService) {
        _logger = logger;
        _lotRepository = lotRepository;
        _userRepository = userRepository;
        _timerService = timerService;
        _lotBetsRepository = lotBetsRepository;
        _betHubService = betHubService;
        _ownershipRepository = ownershipRepository;
        _paymentService = paymentService;
    }

    //maybe implement some kind of lock to resolve simultaneous bets situation.
    public async Task AddBet(LotBet bet)
    {
        var user = await _userRepository.Get(bet.AuctionUserId);
        if (user == null) throw new ArgumentException($"Such user does not exist");

        var lot = await _lotRepository.GetWithDetails(bet.LotId);
        if (lot == null) throw new ArgumentException($"Lot with id:{bet.LotId} does not exist");


        user.Balance += lot.LatestUserBet(user)?.BetAmount ?? 0;
        _logger.LogInformation("Adding Bet...");
        lot.AddBet(user,bet);
        
        user.Balance -= bet.BetAmount;

        _lotRepository.Update(lot);
        _userRepository.Update(user);
        _logger.LogInformation("Lot updated.");

        
        if (lot.Bets.Count == 1)
            await _timerService.StartTimer(bet.LotId);
        else
            await _timerService.RestartTimer(bet.LotId);

        await _betHubService.SendBetNotification(bet);
    }

    public void AddLot(int itemId, decimal minBet)
    {
        throw new NotImplementedException();
    }

    public async Task TryEndLot(int lotId)
    {
        var lot = Guard.Against.Null(await _lotRepository.GetWithDetails(lotId))!;

        var endTime = DateTime.Now;
        lot.EndTime = endTime;
        _logger.LogInformation("Adding owner claim on item to db...");
        var lotOnwer = new UserOwnedLot();
        lotOnwer.LotId = lot.Id;
        lotOnwer.AuctionUserId = lot.LatestBet.AuctionUserId;
        lotOnwer.ClaimTime = endTime;
        await _ownershipRepository.Add(lotOnwer);
        _logger.LogInformation("Done.");

        _logger.LogInformation("Refunding money to participants...");
        lot.ReturnFundsForParticipants();
        _lotRepository.Update(lot);
        _logger.LogInformation("Done.");
        _paymentService.SendToOrg(lot.LatestBet.BetAmount,lot.TargetCard);

        await _betHubService.SendLotEndNotification(lot);
    }


    public void RemoveLot(int lotId)
    {
        throw new NotImplementedException();
    }

    public void UpdateLot(Lot lot)
    {
        throw new NotImplementedException();
    }

    public void AcceptLot(int lotId, DateTime start, TimeSpan duration)
    {
        throw new NotImplementedException();
    }

    public async Task RegisterForLot(int lotId, string userId)
    {
        var user = await _userRepository.Get(userId);
        if (user == null)
            throw new ArgumentException("User not found");
        var lot = await _lotRepository.GetWithDetails(lotId);
        if (lot == null)
            throw new ArgumentException("Lot not found");

        lot.RegisterUser(user);

        _lotRepository.Update(lot);
    }
}