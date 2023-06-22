using Auction.Client.Dto.Org;

namespace Auction.Client.Dto.Lot;

public class LotDto
{
    public long StartTime { get; set; }
    public long EndTime { get; set; }
    
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    
    public int Step { get; set; }
    public decimal LatestBet { get; set; }
    public OrganizationDto? Organization { get; set; }
    public decimal MinBet { get; set; }
    public string Description { get; set; }
    
    public int BetTime { get; set; }
    public int Id { get; set; }

    public byte[] Image { get; set; }

    public bool IsUserRegistered { get; set; }
    
    public int Participants { get; set; }
    
    public string Goal { get; set; }

}