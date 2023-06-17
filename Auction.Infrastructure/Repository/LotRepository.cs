using Auction.Core.Entities;
using Auction.Core.Interfaces.Repositories;
using Auction.Infrastructure.Db;
using Microsoft.EntityFrameworkCore;

namespace Auction.Infrastructure.Repository;

public class LotRepository : BaseEfRepository<Lot,int>, ILotRepository
{
    public LotRepository(AppDbContext context) : base(context)
    {
    }

    public async Task<ICollection<Lot>> GetAllWithDetailsAsync() => 
        await BaseSet
            .Include(x => x.Item)
            .Include(x => x.Bets)
                .ThenInclude(b => b.AuctionUser)
            .Include(b => b.RegisteredUsers)
            .ToListAsync();

    public async Task<Lot> GetWithDetails(int id) =>
        await BaseSet
            .Include(x => x.Bets)
                .ThenInclude(b => b.AuctionUser)
            .Include(x => x.Item)
            .Include(x => x.RegisteredUsers)
            .FirstAsync(l => l.Id == id);

}