namespace Auction.Client.Dto.Org;

public class OrganizationDto : OrganizationCreationDto
{
    public int Id { get; set; }
    public new byte[] Image { get; set; }
}