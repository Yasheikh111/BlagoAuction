namespace Auction.Core.Interfaces.Services;

public interface ITimerService
{
    public Task StartTimer(int lotId);
    public Task RestartTimer(int lotId);
    public Task StopTimer(int lotId);
}