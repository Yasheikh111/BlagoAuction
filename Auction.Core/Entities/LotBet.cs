using System.Data.SqlTypes;
using Ardalis.GuardClauses;

namespace Auction.Core.Entities;

public class LotBet : BaseIntEntity
{
    public LotBet(string auctionUserId, int lotId, decimal betAmount)
    {
        AuctionUserId = Guard.Against.NullOrEmpty(auctionUserId);
        LotId = Guard.Against.Negative(lotId);
        BetAmount = Guard.Against.NegativeOrZero(betAmount);
        BetTime = DateTime.Now;
    }
    
    public string AuctionUserId { get; set; }
    public virtual AuctionUser AuctionUser { get; set; }
    
    public int LotId { get; set; }
    public virtual Lot Lot { get; set; }

    public decimal BetAmount { get; set; }
    public DateTime BetTime { get; set; }
}