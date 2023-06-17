using Auction.Core.Entities;

namespace Auction.Core.Interfaces.Repositories;

public interface IHubConnectionRepository : IRepository<HubConnection,int>
{
    Task<HubConnection?> GetByUserId(string userId);
    HubConnection? GetByConnectionId(string connId);
}