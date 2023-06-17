using System.Security.Claims;
using Auction.Client.Dto;
using Auction.Client.Dto.Lot;
using Auction.Core.Entities;
using Auction.Core.Interfaces.Repositories;
using Auction.Infrastructure.Repository;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Auction.Client.Controllers;

[Authorize]
[Route("api/[controller]/")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserRepository _userRepository;
    private readonly UserManager<AuctionUser> _userManager;

    public UserController(IUserRepository userRepository, UserManager<AuctionUser> userManager)
    {
        _userRepository = userRepository;
        _userManager = userManager;
    }

    [HttpGet("lots/")]
    public async Task<IActionResult> GetUserLots()
    {
        try
        {
            var user = await GetCurrentUser();
            var lots = _userRepository.GetAllOwnedLots(user.Id);
            var dtos = lots.Select(lot =>
            {
                var dto = LotsController.ToLotDto(lot.Lot);
                return dto;
            });
            return Ok(dtos);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return NotFound(e.Message);
        }
        
    }
    
    [HttpGet("validate/")]
    public async Task<IActionResult> GetUserData()
    {
        try
        {
            var user = await GetCurrentUser();
            return Ok(new UserDto
            {
                Email = user.Email,
                Balance = user.Balance,
                Role = (await _userManager.GetRolesAsync(user)).First()
            });
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return NotFound(e.Message);
        }
    }

    public async Task<AuctionUser> GetCurrentUser()
    {
        var currentUserName = User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? throw new ArgumentException("Username not found.");
        var appUser = await _userManager.FindByNameAsync(currentUserName);
        if (appUser == null)
            throw new ArgumentException("user not found.");
        return appUser;
    }
}