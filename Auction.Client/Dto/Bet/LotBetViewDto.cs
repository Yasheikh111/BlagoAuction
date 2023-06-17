using System.ComponentModel.DataAnnotations;

namespace Auction.Client.Dto.Bet;

public class LotBetViewDto
{
    [Required]
    public string Username { get; set; }
    
    [Required]
    public decimal BetAmount { get; set; }
    
    public DateTime BetTime { get; set; }
}