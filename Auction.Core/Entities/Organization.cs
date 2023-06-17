namespace Auction.Core.Entities;

public class Organization : BaseIntEntity
{
    public string Name { get; set; }
    public byte[] Logo { get; set; }
    
    public virtual ICollection<LotCreation> SponsoredLots { get; set; }
    
    public virtual ICollection<AuctionUser> Sponsors { get; set; }

    public IList<Lot> Lots() => SponsoredLots.Select(s => s.Lot).ToList();
    


}