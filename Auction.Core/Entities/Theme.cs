namespace Auction.Core.Entities;

public class Theme : BaseIntEntity
{
    public string Name { get; set; }
    
    public virtual IEnumerable<Lot> Lots { get; }
}