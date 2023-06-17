using Auction.Core.Entities;

namespace Auction.Core.Interfaces.Services;

public interface IOrganizationService
{
    Task<decimal> GetOrganizationRevenue(int orgId);
    Task<int> GetOrganizationCompletedLotsCount(int orgId);
    Task<Organization> Get(int orgId);

    Task AddUser(int userId);
    Task<List<Organization>> GetAll();
    List<Organization> GetByNameMatch(string match);
    

    Task<Organization> Add(string name,byte[] logo);
    Task Delete(int orgId);
}