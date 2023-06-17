namespace Auction.Core.Entities;

public class LotCreation : BaseIntEntity
{
    public virtual AuctionUser CreatorUser { get; set; }
    public string CreatorUserId { get; set; }
    
    public virtual Organization Organization { get; set; }
    public int OrganizationId { get; set; }

    public virtual Lot Lot { get; set; }
    public int LotId { get; set; }
}