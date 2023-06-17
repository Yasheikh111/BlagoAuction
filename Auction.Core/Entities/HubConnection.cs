namespace Auction.Core.Entities;

public class HubConnection : BaseIntEntity
{
    public virtual AuctionUser AuctionUser { get; }
    public string AuctionUserId { get; set; }
    public string ConnectionId { get; set; }
}