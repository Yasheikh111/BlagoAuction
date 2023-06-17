using Auction.Client.Dto.Lot;

namespace Auction.Client.Dto.Org;

public class OrganizationPageDto
{
    public int Id { get; set; }
    public string Name { get; set; } = "";

    public byte[] Image { get; set; } = {};
    
    public decimal AmountReceived { get; set; }
    public int CompletedLots { get; set; }

    public List<LotDto> Lots { get; set; } = new();

}