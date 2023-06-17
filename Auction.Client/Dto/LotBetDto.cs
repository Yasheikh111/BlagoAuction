namespace Auction.Client.Dto;

public class LotBetDto
{
    public int Id { get; set; }
    public string Username { get; set; }
    public decimal Amount { get; set; }
    public DateTime BetTime { get; set; }
}