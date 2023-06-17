using Auction.Client.Dto;
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
public class OrganizationController : ControllerBase
{
    private readonly ILogger<OrganizationController> _logger;
    private readonly IOrganizationService _organizationService;
    private readonly IRegistrationTicketRepository _registrationTicketRepository;

    public OrganizationController(ILogger<OrganizationController> logger,
        IOrganizationService organizationService,
        IRegistrationTicketRepository registrationTicketRepository)
    {
        _logger = logger;
        _organizationService = organizationService;
        _registrationTicketRepository = registrationTicketRepository;
    }
    
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> AddOrganization([FromBody] OrganizationCreationDto creationDto)
    {
        _logger.LogInformation("Trying to create organization...");
        try
        {
            var org = await _organizationService.Add(creationDto.Name,
                Convert.FromBase64String(creationDto.Image)
            );
            _logger.LogInformation("Organization created.");
            return Ok();
        }
        catch (Exception e)
        {
            _logger.LogInformation(e.Message);
            return BadRequest(e.Message);
        }
    }
    
    [HttpGet("delete/{orgId:int}")]
    public async Task<IActionResult> Delete(int orgId)
    {
        try
        {
            await _organizationService.Delete(orgId);
             
            return Ok();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            return BadRequest(e.Message);
        }
    }

    private OrganizationPageDto ToDto(Organization org) => new OrganizationPageDto
        {
            Id = org.Id,
            Name = org.Name,
            Image = org.Logo
        };
    
    [AllowAnonymous]
    [HttpGet("match/{name}")]
    public async Task<IActionResult> GetByName(string name)
    {
        try
        {
            var orgs = _organizationService.GetByNameMatch(name);

            return Ok(orgs.Select(ToDto));
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return BadRequest(e.Message);
        }
        
    }

    [HttpGet("{orgId:int}")]
    public async Task<IActionResult> Get(int orgId)
    {
        try
        {
            var org = await _organizationService.Get(orgId);

            var orgDto = ToDto(org);
            orgDto.AmountReceived = await _organizationService.GetOrganizationRevenue(orgId);
            orgDto.CompletedLots = await _organizationService.GetOrganizationCompletedLotsCount(orgId);
            orgDto.Lots = org.Lots().Select(LotsController.ToLotDto).ToList();
            
            return Ok(orgDto);
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return BadRequest(e.Message);
        }
        
    }
    
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        try
        {
            var orgs = await _organizationService.GetAll();

            var orgDtos = orgs.Select(async or =>
            {
                var dto = ToDto(or);
                dto.AmountReceived = await _organizationService.GetOrganizationRevenue(or.Id);
                dto.CompletedLots = await _organizationService.GetOrganizationCompletedLotsCount(or.Id);
                return dto;
            }).Select(t => t.Result);

            return Ok(orgDtos);
        }
        catch (Microsoft.EntityFrameworkCore.DbUpdateException e)
        {
            return BadRequest("Організація з такою назвою вже існує.");
        }
        catch (Exception e)
        {
            _logger.LogError(e.Message);
            return BadRequest(e.Message);
        }
    }



}