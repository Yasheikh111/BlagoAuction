namespace Auction.Core.Entities;

public abstract class BaseIntEntity : IBaseEntity<int>
{
    public int Id { get; set; }
}