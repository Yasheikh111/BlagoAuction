using Auction.Core.Entities;

namespace Auction.Core.Interfaces.Repositories;

public interface IPaymentRepository : IRepository<Payment,string>
{
    Task<Payment?> GetPaymentBySignature(string sign);
}