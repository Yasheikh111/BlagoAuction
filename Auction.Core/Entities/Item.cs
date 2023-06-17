namespace Auction.Core.Entities;

public class Item : BaseIntEntity
{
    public int LotId { get; set; }
    public virtual Lot Lot { get; set; }
    public string Description { get; set; }
    public byte[] Photo { get; set; }
}