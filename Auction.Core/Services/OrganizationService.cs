using Auction.Core.Entities;
using Auction.Core.Interfaces.Repositories;
using Auction.Core.Interfaces.Services;
using Microsoft.Extensions.Logging;

namespace Auction.Core.Services;

public class OrganizationService : IOrganizationService
{
    private readonly ILogger<OrganizationService> _logger;
    private readonly IOrganizationRepository _organizationRepository;

    public OrganizationService(ILogger<OrganizationService> logger,
        IOrganizationRepository organizationRepository
        )
    {
        _logger = logger;
        _organizationRepository = organizationRepository;
    }

    private async Task<Organization> EnsureEntityExists(int orgId)
    {
        _logger.LogInformation("Trying to find org.");
        var org = await _organizationRepository.Get(orgId);
        
        if (org != null) return org;
        
        const string message = "Org not found.";
        _logger.LogInformation(message);
        throw new ArgumentException(message);
    }
        
    public async Task<decimal> GetOrganizationRevenue(int orgId)
    {
        var org = await EnsureEntityExists(orgId);

        return org.Lots()
            .Where(orgLot => orgLot.Ended)
            .Sum(orgLot => orgLot.LatestBetAmount);
    }

    public async Task<int> GetOrganizationCompletedLotsCount(int orgId)
    {
        var org = await EnsureEntityExists(orgId);

        return org.Lots()
            .Count(orgLot => orgLot.Ended);
    }

    public async Task<Organization> Get(int orgId) =>
        await EnsureEntityExists(orgId);

    public Task AddUser(int userId)
    {
        throw new NotImplementedException();
    }

    public Task<List<Organization>> GetAll()
    {
        return _organizationRepository.GetAll();
    }

    public List<Organization> GetByNameMatch(string nameMatch) =>
        _organizationRepository.GetByNameMatch(nameMatch).ToList();

    public async Task<Organization> Add(string name, byte[] logo)
    {
        var org = new Organization
        {
            Name = name,
            Logo = logo
        };
        await _organizationRepository.Add(org);
        return org;
    }

    public async Task Delete(int orgId)
    {
        await _organizationRepository.Delete(orgId);
    }
}