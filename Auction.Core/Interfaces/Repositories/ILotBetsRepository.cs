using Auction.Core.Entities;

namespace Auction.Core.Interfaces.Repositories;

public interface ILotBetsRepository : IRepository<LotBet, int>
{
    Task<ICollection<LotBet>> GetAllWithDetailsAsync();
}