namespace Auction.Client.Dto.User;

public class ModeratorRegistrationRequestDto
{
    public string RequestedEmail { get; set; }
    public string RequestedPassword { get; set; }
    public string RequestedName { get; set; }
    public string RequestedSurname { get; set; }
    public string Phone { get; set; }
    
    public int SelectedOrgId { get; set; }
    
}