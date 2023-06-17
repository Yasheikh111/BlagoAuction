using Auction.Core.Entities;
using Auction.Core.Interfaces.Repositories;
using Auction.Infrastructure.Db;

namespace Auction.Infrastructure.Repository;

public class UserOwnershipRepository : BaseEfRepository<UserOwnedLot,int>,IUserOwnershipRepository
{
    public UserOwnershipRepository(AppDbContext context) : base(context)
    {
    }
}