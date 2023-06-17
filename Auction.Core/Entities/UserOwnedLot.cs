using JetBrains.Annotations;

namespace Auction.Core.Entities;

public class UserOwnedLot : BaseIntEntity
{
    public string AuctionUserId { get; set; }
    public virtual AuctionUser AuctionUser { get; set; }
    public int LotId { get; set; }
    public virtual Lot Lot { get; set; }

    public DateTime ClaimTime { get; set; }
    public bool ClaimRequested { get; set; }
}