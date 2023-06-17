using Auction.Core.Entities;
using Auction.Core.Interfaces.Repositories;
using Auction.Infrastructure.Db;

namespace Auction.Infrastructure.Repository;

public class LotCreationRepository : BaseEfRepository<LotCreation,int>,ILotCreationRepository
{
    public LotCreationRepository(AppDbContext context) : base(context)
    {
    }
}