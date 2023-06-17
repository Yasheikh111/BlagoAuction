namespace Auction.Core.Entities;

public class RegistrationTicket : BaseIntEntity
{
    public string RequestedEmail { get; set; }
    public string RequestedPassword { get; set; }
    public string RequestedName { get; set; }
    public string RequestedSurname { get; set; }
    public string Phone { get; set; }
    public int OrganizationId { get; set; }

    public virtual Organization Organization { get; set; }
}