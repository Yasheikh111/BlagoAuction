namespace Auction.Core.Entities;

public interface IBaseEntity<TKey>
{
    public TKey Id { get; set; }
}