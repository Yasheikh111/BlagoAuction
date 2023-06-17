namespace Auction.Client.Dto.Bet;

public class LotBetDto
{
    public string UserId { get; set; }

    public int LotId { get; set; }

    public decimal BetAmount { get; set; }
}