using Auction.Client.Dto.Org;
using Auction.Client.Dto.User;
using Auction.Core.Entities;
using Auction.Core.Interfaces.Repositories;
using Auction.Core.Interfaces.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Auction.Client.Controllers;

[Authorize]
[Route("api/[controller]/")]
[ApiController]
public class TicketController : ControllerBase
{
    private readonly ILogger<OrganizationController> _logger;
    private readonly IOrganizationService _organizationService;
    private readonly IRegistrationTicketRepository _registrationTicketRepository;
    private readonly IAuthService _authService;

    public TicketController(ILogger<OrganizationController> logger,
        IOrganizationService organizationService,
        IRegistrationTicketRepository registrationTicketRepository,
        IAuthService authService)
    {
        _logger = logger;
        _organizationService = organizationService;
        _registrationTicketRepository = registrationTicketRepository;
        _authService = authService;
    }
    
    [AllowAnonymous]
    [HttpPost]
    public async Task<IActionResult> AddToOrganizationTicket([FromBody] ModeratorRegistrationRequestDto creationDto)
    {
        _logger.LogInformation("Trying to add user to org...");
        try
        {
            var org = await _organizationService.Get(creationDto.SelectedOrgId);

            var creationTicket = new RegistrationTicket
            {
                RequestedPassword = creationDto.RequestedPassword,
                RequestedName = creationDto.RequestedName,
                OrganizationId = org.Id,
                RequestedSurname = creationDto.RequestedSurname,
                RequestedEmail = creationDto.RequestedEmail,
                Phone = creationDto.Phone
            };

            await _registrationTicketRepository.Add(creationTicket);
            _logger.LogInformation($"Created ticket for user {creationTicket.RequestedEmail} to organization " + org.Name);

            return Ok();
        }
        catch (Exception e)
        {
            _logger.LogInformation(e.Message);
            return BadRequest(e.Message);
        }
    }
    
    [Authorize(Roles = "Admin")]
    [HttpGet]
    public async Task<IActionResult> GetTickets()
    {
        _logger.LogInformation("Trying to get org tickets...");
        try
        {
            var tickets = await _registrationTicketRepository.GetAll();
            return Ok(tickets.Select(t => new
            {
                t.Id,
                Email = t.RequestedEmail,
                Firstname = t.RequestedName,
                Surname = t.RequestedSurname,
                t.Phone,
                Organization = t.Organization.Name,
            }));
        }
        catch (Exception e)
        {
            _logger.LogInformation(e.Message);
            return BadRequest(e.Message);
        }
    }
    
    [Authorize(Roles = "Admin")]
    [HttpGet("approve/{ticketId:int}")]
    public async Task<IActionResult> ApproveTicket(int ticketId)
    {
        _logger.LogInformation("Trying to get org tickets...");
        try
        {
            var ticket = await _registrationTicketRepository.Get(ticketId);
            if (ticket == null) return BadRequest("Ticket not found.");
            
            await _authService.SignInAsModerator(ticket.RequestedEmail, ticket.RequestedPassword,
                    ticket.RequestedName, ticket.RequestedSurname, ticket.OrganizationId);

            await _registrationTicketRepository.Delete(ticket);
            
            return Ok();
        }
        catch (Exception e)
        {
            _logger.LogInformation(e.Message);
            return BadRequest(e.Message);
        }
    }
    
}