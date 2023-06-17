using Auction.Core.Entities;
using Auction.Core.Interfaces.Repositories;
using Auction.Infrastructure.Db;
using Microsoft.EntityFrameworkCore;

namespace Auction.Infrastructure.Repository;

public class AuctionUserRepository : BaseEfRepository<AuctionUser,string>, IUserRepository
{
    public AuctionUserRepository(AppDbContext context) : base(context) { }


    public List<LotBet> GetAllUsersAuctionBets(string userId,int auctionId)
    {
        return BaseContext.Set<Lot>().Find(auctionId)?.Bets.Where(b => b.AuctionUserId == userId).ToList() ??
               new List<LotBet>();
    }

    public List<UserOwnedLot> GetAllOwnedLots(string userId)
    {
        return BaseContext.Set<UserOwnedLot>().Include(l => l.Lot)
            .ThenInclude(e => e.Bets)
            .Where(uo => uo.AuctionUserId == userId)
            .ToList();
    }
}