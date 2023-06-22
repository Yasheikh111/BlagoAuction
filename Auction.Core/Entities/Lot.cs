using System.ComponentModel.DataAnnotations.Schema;
using System.Data;
using System.Data.SqlTypes;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using Auction.Core.Entities.Enums;
using JetBrains.Annotations;

namespace Auction.Core.Entities;



public class Lot : BaseIntEntity
{
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    
    

    public string Description { get; set; } = "";

    
    public virtual Item Item { get; set; }


    public string? TargetCard { get; set; }

    public string Goal { get; set; }

    public double Step { get; set; } = 0.1;


    public virtual IEnumerable<Theme> Themes { get; set; }
    public virtual ICollection<LotBet> Bets { get; set; }    
    public virtual ICollection<AuctionUser> RegisteredUsers { get; set; }

    public virtual LotCreation LotCreation { get; set; }

    public AuctionUser Winner => 
        Ended && LatestBet != null ?
            LatestBet.AuctionUser :
            throw new ArgumentException("Cannot get winner.");


    public void ReturnFundsForParticipants()
    {
        var winnerId = LatestBet.Id;
        foreach (var user in RegisteredUsers)
        {
            if (LatestUserBet(user).Id != winnerId)
                user.Balance += LatestUserBet(user).BetAmount;
        }
    }

    public LotStatus LotStatus
    {
        get
        {
            if (StartTime > DateTime.Now)
                return LotStatus.Scheduled;
            if (StartTime < DateTime.Now && DateTime.Now < EndTime)
                return LotStatus.Started;
            if (EndTime < DateTime.Now)
                return LotStatus.Ended;
            return LotStatus.AwaitingForAccept;
        }
    }

    public LotBet LatestUserBet(AuctionUser auctionUser) => Bets.LastOrDefault(b => b.AuctionUserId == auctionUser.Id);

    public TimeSpan TimeRemaining => TimeToBeatPreviousBet - (DateTime.Now - LatestBetTime);
    public DateTime ExpectedEndDate => LatestBetTime + TimeToBeatPreviousBet;

    public TimeSpan TimeToBeatPreviousBet { get; set; }
    

    public LotBet? MaxBet => Bets?.MaxBy(bet => bet.BetAmount);
    public decimal MinBet { get; set; }
    public LotBet? LatestBet => Bets.LastOrDefault();
    public decimal LatestBetAmount => LatestBet?.BetAmount ?? MinBet;

    public DateTime LatestBetTime => LatestBet?.BetTime ?? StartTime;

    public void AddBet(AuctionUser auctionUser,LotBet bet)
    {
        if (UserCanPlaceBet(auctionUser, bet))
            Bets.Add(bet);
    }

    public bool NotStarted => LotStatus == LotStatus.Scheduled;

    public bool Started => LotStatus == LotStatus.Started;

    public bool Ended => LotStatus == LotStatus.Ended;

    public bool UserRegistered(AuctionUser auctionUser) =>
        RegisteredUsers.Any(a => a.Id == auctionUser.Id);

    public bool UserCanRegister (AuctionUser auctionUser) => 
        NotStarted && !UserRegistered(auctionUser);

    public decimal CurrentBetStep => (decimal)(Step * (double)LatestBetAmount);

    public bool EnoughTimePassedFromPreviousBet => DateTime.Now > LatestBetTime + TimeSpan.FromMilliseconds(2000);


    public bool EnsureUserCanBet(AuctionUser auctionUser)
    {
        return Started && UserRegistered(auctionUser) && EnoughTimePassedFromPreviousBet &&
               BetNotFromSameUser(auctionUser);
    }
    
    public bool CanUserPlaceBet(AuctionUser auctionUser)
    {
        if (!Started)
            throw new ArgumentException("Lot is not ongoing.");
        if (!UserRegistered(auctionUser))
            throw new ArgumentException("User is not registered in this lot.");
        if (!EnoughTimePassedFromPreviousBet)
            throw new ArgumentException("Not enough time passed from previous bet.");
        if (!BetNotFromSameUser(auctionUser))
            throw new ArgumentException("Wait before another user place bet.");
        return true;
    }


    public bool UserCanPlaceBet(AuctionUser auctionUser, LotBet bet)
    {
        if (!BetAmountCorrect(bet))
            throw new ArgumentException("User doesnt have money for bet.");
        if (!auctionUser.CanBet(bet.BetAmount))
            throw new ArgumentException("User dont have enough funds.");
        if (!CanUserPlaceBet(auctionUser))
            throw new ArgumentException("User cant bet.");

        return true;
    }


    public bool BetNotFromSameUser(AuctionUser auctionUser) =>
        LatestBet?.AuctionUserId != auctionUser.Id;

    public bool BetAmountCorrect(LotBet lotBet) =>
        lotBet.BetAmount > LatestBetAmount + CurrentBetStep;
    
    public void RegisterUser(AuctionUser auctionUser)
    {
        if(!UserCanRegister(auctionUser))
            throw new ArgumentException("You already participate in lot");

        RegisteredUsers.Add(auctionUser);
    }
}