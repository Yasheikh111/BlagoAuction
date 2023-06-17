using Auction.Core.Interfaces.Repositories;
using Auction.Core.Interfaces.Services;
using Quartz;
using Quartz.Impl;
using Quartz.Spi;

namespace Auction.Infrastructure.Services;

public class TimerService : ITimerService
{
    private readonly ILotRepository _lotRepository;
    private readonly IJobFactory _jobFactory;

    public TimerService(ILotRepository lotRepository,IJobFactory jobFactory)
    {
        _lotRepository = lotRepository;
        _jobFactory = jobFactory;
    }

    public async Task StartTimer(int lotId)
    {
        var lot = await _lotRepository.GetWithDetails(lotId);
        var scheduler = await StdSchedulerFactory.GetDefaultScheduler();
        scheduler.JobFactory = _jobFactory;
        await scheduler.Start();
        
        var job = JobBuilder.Create<LotTimerJob>().UsingJobData("LotId",lotId).Build();
        var trigger = TriggerBuilder.Create()
            .WithIdentity("LotEndTrigger", "default")
            .StartAt(DateTimeOffset.Now + lot.TimeToBeatPreviousBet) 
            .UsingJobData("LotId",lotId)
            .ForJob(job)
            .WithSimpleSchedule(sc => sc.WithRepeatCount(0))
            .Build();
        await scheduler.ScheduleJob(job, trigger);

    }

    public async Task RestartTimer(int lotId)
    {
        var lot = await _lotRepository.GetWithDetails(lotId);
        var scheduler = await StdSchedulerFactory.GetDefaultScheduler();
        scheduler.JobFactory = _jobFactory;
        
        var job = JobBuilder.Create<LotTimerJob>().Build();
        var trigger = TriggerBuilder.Create()
            .WithIdentity("LotEndTrigger", "default")
            .StartAt(DateTimeOffset.Now + lot.TimeToBeatPreviousBet) 
            .UsingJobData("LotId",lotId)
            .WithSimpleSchedule(sc => sc.WithRepeatCount(0))
            .ForJob(job)
            .Build();
        await scheduler.RescheduleJob(new TriggerKey("LotEndTrigger", "default"), trigger);
    }

    public Task StopTimer(int lotId)
    {
        throw new NotImplementedException();
    }
}