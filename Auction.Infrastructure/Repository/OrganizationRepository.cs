using Auction.Core.Entities;
using Auction.Core.Interfaces.Repositories;
using Auction.Infrastructure.Db;

namespace Auction.Infrastructure.Repository;

public class OrganizationRepository : BaseEfRepository<Organization,int>,IOrganizationRepository
{
    public OrganizationRepository(AppDbContext context) : base(context)
    { }

    public IEnumerable<Organization> GetByNameMatch(string match)
    {
        return BaseSet.Where(org => org.Name.StartsWith(match));
    }
}