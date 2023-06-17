using Auction.Core.Entities;
using Auction.Core.Interfaces.Repositories;
using Auction.Infrastructure.Db;
using Microsoft.EntityFrameworkCore;

namespace Auction.Infrastructure.Repository;

public class HubConnectionRepository:BaseEfRepository<HubConnection,int>,IHubConnectionRepository
{
    public HubConnectionRepository(AppDbContext context) : base(context) { }

    public async Task<HubConnection?> GetByUserId(string userId) => await BaseSet
        .Where(conn => conn.AuctionUserId == userId)
        .FirstOrDefaultAsync();

    public HubConnection? GetByConnectionId(string connId)
    {
        return BaseSet
            .FirstOrDefault(conn => conn.ConnectionId == connId);
    }
}