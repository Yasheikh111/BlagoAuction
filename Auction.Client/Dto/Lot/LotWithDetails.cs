namespace Auction.Client.Dto.Lot;

public class LotWithDetailsDto : LotDto
{
    public bool CanUserBet { get; set; }
    public List<LotBetDto> LotBetDtos { get; set; }
    public ItemDto? Item { get; set; }
    
    public UserDto Creator { get; set; }
    public double BetStep { get; set; }
}