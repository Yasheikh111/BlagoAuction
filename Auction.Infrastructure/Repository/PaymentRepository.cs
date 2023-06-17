using Auction.Core.Entities;
using Auction.Core.Interfaces.Repositories;
using Auction.Infrastructure.Db;
using Microsoft.EntityFrameworkCore;

namespace Auction.Infrastructure.Repository;

public class PaymentRepository : BaseEfRepository<Payment, string>, IPaymentRepository
{
    public PaymentRepository(AppDbContext context) : base(context)
    {

    }

    public async Task<Payment?> GetPaymentBySignature(string sign) => 
        await BaseSet.FirstOrDefaultAsync(p =>
            p.Signature == sign);
}