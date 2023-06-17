using System.ComponentModel.DataAnnotations.Schema;

namespace Auction.Core.Entities;

public class Payment : IBaseEntity<string>
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public string Id { get; set; }
    
    public string? UserId { get; set; }
    public virtual AuctionUser? AuctionUser { get; set; }
    
    public string? Signature { get; set; }
    
    public bool Completed { get; set; }
    
    public decimal Amount { get; set; }
}