namespace Auction.Client.Dto.Lot;

public class LotCreationRequestDto : LotDto
{
    public string Image { get; set; }
    public int BetStep { get; set; }
    
    public int OrganizationId { get; set; }
    
    public int SecondsToBeatPrevBet { get; set; }
    public string TargetCard { get; set; }
    public string Goal { get; set; }

}