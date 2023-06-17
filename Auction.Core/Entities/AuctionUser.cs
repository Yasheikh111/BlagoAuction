using Microsoft.AspNetCore.Identity;

namespace Auction.Core.Entities;

public class AuctionUser : IdentityUser, IBaseEntity<string>
{
    
    public string Name { get; set; }
    public string Surname { get; set; }
    
    public virtual HubConnection HubConnection { get; }


    public bool CanBet(decimal amount) => amount <= Balance;

    public void Bet(decimal amount)
    {
        if (!CanBet(amount))
            throw new ArgumentException("Не вистачає коштів.");
        Balance -= amount;
    }
    
    public decimal Balance { get; set; }

    public virtual IEnumerable<Lot> ParticipationLots { get; }
    public virtual IEnumerable<UserOwnedLot> UserOwnedLots { get; init; }
    
    public int? OrganizationId { get; set; }
    public virtual Organization? Organization { get; set; }
}