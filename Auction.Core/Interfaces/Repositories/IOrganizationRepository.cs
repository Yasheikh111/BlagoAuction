using Auction.Core.Entities;

namespace Auction.Core.Interfaces.Repositories;

public interface IOrganizationRepository : IRepository<Organization,int>
{
    IEnumerable<Organization> GetByNameMatch(string match);
}