using System.Security.Claims;
using Auction.Core.Entities;

namespace Auction.Core.Interfaces.Services;

public interface IAuthService
{
    Task<AuctionUser> LogIn(string email, string password);
    Task<AuctionUser> SignIn(string email, string password, string firstname, string surname);
    Task<AuctionUser> GetCurrentUser(ClaimsPrincipal principal);
    
    Task<AuctionUser> SignInAsModerator(string email, string password, string firstname, string surname,int orgId);
    
    Task AddToModerators(AuctionUser auctionUser);
    Task AddToUser(AuctionUser auctionUser);

    Task<bool> InitAdmin();

    Task<string> GenerateJwtToken(AuctionUser appUser);
}