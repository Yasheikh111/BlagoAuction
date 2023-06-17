namespace WebAPI.ViewModels;

public class AuthorizationResponseDto
{
    public string Id { get; set; }
    public string Email { get; set; }
    public decimal Balance { get; set; }
    public string Token { get; set; }
}