using Auction.Core.Entities;

namespace Auction.Core.Interfaces.Repositories;

public interface ILotRepository : IRepository<Lot, int>
{
    Task<ICollection<Lot>> GetAllWithDetailsAsync();
    Task<Lot?> GetWithDetails(int id);
}