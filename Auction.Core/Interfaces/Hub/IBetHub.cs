using Auction.Core.Entities;

namespace Auction.Core.Interfaces.Hub;

public interface IBetHubService
{
    Task SendBetNotification(LotBet lotBet);
}