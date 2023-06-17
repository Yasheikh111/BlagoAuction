using Auction.Core.Entities;

namespace Auction.Core.Interfaces.Repositories;

public interface IUserRepository : IRepository<AuctionUser, string>
{
    List<LotBet> GetAllUsersAuctionBets(string userId,int auctionId);
    List<UserOwnedLot> GetAllOwnedLots(string userId);
}