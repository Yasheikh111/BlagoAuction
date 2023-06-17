using System.ComponentModel.DataAnnotations;
using Auction.Client.Dto.User;
using Auction.Client.Services;
using Auction.Core.Interfaces;
using Auction.Core.Interfaces.Services;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WebAPI.ViewModels;

namespace Auction.Client.Controllers;

[Route("api/[controller]/")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService  authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }
    
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> LogIn([FromBody] LogInCredentials loginModel)
    {
        if (!ModelState.IsValid)
        {
            const string message = "User provided invalid data.";
            _logger.LogInformation(message);
            return BadRequest(message);
        }

        await _authService.InitAdmin();

        try
        {
            var authorizedUser = await _authService.LogIn(loginModel.Email, loginModel.Password);
            var token = await _authService.GenerateJwtToken(authorizedUser);
            
            _logger.LogInformation($"Log in success with token: {token}");
            
            return Ok(new AuthorizationResponseDto
            {
                Id = authorizedUser.Id,
                Email = authorizedUser.Email,
                Balance = authorizedUser.Balance,
                Token = token
            });
        }
        catch (Exception e)
        {
            _logger.LogInformation($"Log in failed: {e.Message}");
            return BadRequest(e.Message);
        }
    }

    [AllowAnonymous]
    [HttpPost("signup")]
    public async Task<IActionResult> SingUp([FromBody] RegisterCredentials registerModel)
    {
        try
        {
            await _authService.SignIn(registerModel.Email
                ,registerModel.Password,
                registerModel.Firstname,
                registerModel.Surname);
            return Ok();
        }
        catch (Exception e)
        {
            _logger.LogInformation(e.Message);
            return BadRequest(e.Message);
        }
    }
    
    [Authorize(Roles = "Admin")]
    [HttpPost("moderator/signup/")]
    public async Task<IActionResult> SingUpModerator([FromBody] ModeratorRegistrationRequestDto registerModel)
    {
        try
        {
            var user = await _authService.SignInAsModerator(registerModel.RequestedEmail
                ,registerModel.RequestedPassword,
                registerModel.RequestedName,
                registerModel.RequestedSurname,registerModel.SelectedOrgId);
            return Ok();
        }
        catch (Exception e)
        {
            _logger.LogInformation(e.Message);
            return BadRequest(e.Message);
        }
    }
}