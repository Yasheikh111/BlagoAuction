using Auction.Core.Entities;
using Auction.Core.Interfaces.Repositories;
using Auction.Infrastructure.Db;
using Microsoft.EntityFrameworkCore;

namespace Auction.Infrastructure.Repository;

public class LotBetsRepository : BaseEfRepository<LotBet,int>, ILotBetsRepository
{
    public LotBetsRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<ICollection<LotBet>> GetAllWithDetailsAsync()
    {
        return await BaseSet.Include(u => u.AuctionUser)
            .Include(d => d.Lot)
            .ToListAsync();
    }
}