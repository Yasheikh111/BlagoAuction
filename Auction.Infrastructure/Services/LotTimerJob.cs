using Auction.Core.Interfaces.Services;
using Microsoft.Extensions.Logging;
using Quartz;

namespace Auction.Infrastructure.Services;

public sealed class LotTimerJob : IJob
{
    private readonly ILogger<LotTimerJob> _logger;
    private readonly ILotService _lotService;


    public LotTimerJob(ILogger<LotTimerJob> logger,ILotService lotService)
    {
        _logger = logger;
        _lotService = lotService;
    }

    public async Task Execute(IJobExecutionContext context)
    {
        _logger.LogCritical($"Triggered lot end for lot {(int)context.JobDetail.JobDataMap["LotId"]} time: " + DateTime.Now);
        var lotId = (int)context.JobDetail.JobDataMap["LotId"];
        await _lotService.TryEndLot(lotId);
    }
}