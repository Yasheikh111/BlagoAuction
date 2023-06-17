using Auction.Core.Entities;
using Auction.Core.Interfaces.Repositories;
using Auction.Infrastructure.Db;

namespace Auction.Infrastructure.Repository;

public class RegistrationTicketRepository : BaseEfRepository<RegistrationTicket,int>,IRegistrationTicketRepository
{
    public RegistrationTicketRepository(AppDbContext context) : base(context)
    {
    }
}