using Auction.Core.Entities;
using Auction.Core.Interfaces.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Auction.Core.Services;

[Authorize]
public class BetHubService : Hub
{
    private readonly IHubConnectionRepository _connectionRepository;
    private readonly IHubContext<BetHubService> _context;
    private readonly ILogger<BetHubService> _logger;

    public BetHubService(IHubConnectionRepository connectionRepository,IHubContext<BetHubService> context,ILogger<BetHubService> logger)
    {
        _connectionRepository = connectionRepository;
        _context = context;
        _logger = logger;
    }
    public override Task OnConnectedAsync()
    {
        var userId = Context.UserIdentifier;
        var connectionIdentity = Context.ConnectionId;
        if (userId == null)
        {
            _logger.LogInformation("Hub connection established with errors");
            return Task.CompletedTask;
        }

        var connection = _connectionRepository.GetByUserId(userId).Result;

        if (connection == null)
        {
            var result = _connectionRepository.Add(new HubConnection
                { ConnectionId = connectionIdentity, AuctionUserId = userId }).Result;
            _logger.LogInformation("User connected to hub.");
        }
        else
        {
            connection.ConnectionId = connectionIdentity; 
            _connectionRepository.Update(connection);
            _logger.LogInformation($"User ${userId} connection updated with ${connection}.");
        }
        
        return base.OnConnectedAsync();
    }
    
    public override  Task OnDisconnectedAsync(Exception exception)
    {
         return base.OnDisconnectedAsync(exception);
    }

    public async Task SendBetNotification(LotBet lotBet) =>
        await _context
            .Clients.All
            .SendAsync("newBetNotification", new {
                username = lotBet.AuctionUser.Email,
                amount = lotBet.BetAmount 
            });
    public async Task SendLotEndNotification(Lot lot) =>
        await _context
            .Clients.All
            .SendAsync("lotEndNotification");
}