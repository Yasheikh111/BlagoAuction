using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Ardalis.GuardClauses;
using Auction.Core.Entities;
using Auction.Core.Interfaces.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace Auction.Client.Services;

public class AuthService : IAuthService
{
    private readonly ILogger<AuthService> _logger;
    
    private readonly UserManager<AuctionUser> _userManager;
    private readonly SignInManager<AuctionUser> _signInManager;
    
    private readonly IConfiguration _configuration;
    
    
    public AuthService(ILogger<AuthService> logger,
        UserManager<AuctionUser> userManager,
        SignInManager<AuctionUser> signInManager,
        IConfiguration configuration)
    {
        _logger = logger;
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
    }

    
    public async Task<AuctionUser> GetCurrentUser(ClaimsPrincipal user)
    {
        var currentUserName = user.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new ArgumentException("Username not found.");
        var appUser = await _userManager.FindByNameAsync(currentUserName);
        if (appUser == null)
            throw new ArgumentException("user not found.");
        return appUser;
    }

    public async Task<AuctionUser> SignInAsModerator(string email, string password, string firstname, string surname, int orgId)
    {
        var user = await SignIn(email, password, firstname, surname);
        await AddToModerators(user);
        await _userManager.RemoveFromRoleAsync(user, "User");
        
        user.OrganizationId = orgId;
        await _userManager.UpdateAsync(user);
        return user;
    }

    public async Task<bool> InitAdmin()
    {
        var user = new AuctionUser
        {
            Id = "9f27d19c-db02-4b2a-b140-f16a8b95b11f",
            Name = "vit",
            Surname = "zhuk",
            Email = "y@gmail.com",
            UserName = "y@gmail.com",
        };
        if ((await _userManager.FindByIdAsync(user.Id)) != null)
            return false;
        var result = await _userManager.CreateAsync(user, "3228");
        if (!result.Succeeded)
            return false;
        await _userManager.AddToRolesAsync(user, new[] {"Admin"});
        await _userManager.AddClaimsAsync(user,new[]{
            new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Role, (await _userManager.GetRolesAsync(user)).First())
        });
        _logger.LogInformation("User successfully registered");
        return true;
    }

    public async Task<AuctionUser> LogIn(string email, string password)
    {
        _logger.LogInformation("Trying to log in");
        var signInResult = await _signInManager.PasswordSignInAsync(email, password, false, false);

        if (!signInResult.Succeeded)
            throw new ArgumentException("Password or nickname are incorrect.Please try again.");

        _logger.LogInformation($"Login succeeded with email : {email}" +
                               $" and password : {password}");

        var user = await _userManager.FindByEmailAsync(email);
        user.Balance = 200;
        await _userManager.UpdateAsync(user);
        
        return user;
    }

    public async Task AddToModerators(AuctionUser auctionUser) => await AddToRole(auctionUser, "Moderator");
    
    public async Task AddToUser(AuctionUser auctionUser) => await AddToRole(auctionUser, "User");

    private async Task AddToRole(AuctionUser auctionUser,string role)
    {
        await _userManager.AddToRoleAsync(auctionUser, role );
        await _userManager.AddClaimAsync(auctionUser,
            new Claim(ClaimTypes.Role, role)
        );
    }

    public async Task<AuctionUser> SignIn(string email, string password, string firstname, string surname)
    {
        _logger.LogInformation("Trying to register new user");
        var existingUserModel = await _userManager.FindByEmailAsync(email);
        
        if (existingUserModel == null)
        {
            var user = new AuctionUser
            {
                Name = firstname,   
                Surname = surname,
                Email = email,
                UserName = email
            };

            var result = await _userManager.CreateAsync(user, password);
            if (!result.Succeeded)
                throw new ArgumentException("Error registering user.Please, try again.");
            await AddToUser(user);
            await _userManager.AddClaimsAsync(user,new[]{
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(ClaimTypes.Name, user.UserName),
            });
            _logger.LogInformation("User successfully registered");
            return user;
        }

        _logger.LogInformation("Found user with this credentials.Throwing exception.");
        throw new NotFoundException("User","Such user already exist.Please, try another credentials.");
    }
    
    public async Task<string> GenerateJwtToken(AuctionUser appUser)
    {
        var keyString = _configuration.GetSection("SecretKey").Value;
        var encodedKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));   

        var credentials = new SigningCredentials(encodedKey,
            SecurityAlgorithms.HmacSha256);

        var issuer = _configuration.GetSection("Issuer").Value;
        var audience = _configuration.GetSection("Audience").Value;
        
        var role = await _userManager.GetRolesAsync(appUser);
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, appUser.UserName),
            new Claim(ClaimTypes.Name, appUser.UserName),
            new Claim(ClaimTypes.Role, role.First())
        };
        
        var token = new JwtSecurityToken(issuer,
            audience,
            claims,
            expires: DateTime.Now.AddHours(1),
            signingCredentials: credentials);
        
        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}