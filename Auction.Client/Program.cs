using System.Text;
using Auction.Client.Services;
using Auction.Core.Entities;
using Auction.Core.Interfaces.Repositories;
using Auction.Core.Interfaces.Services;
using Auction.Core.Services;
using Auction.Infrastructure.Db;
using Auction.Infrastructure.Repository;
using Auction.Infrastructure.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.IdentityModel.Tokens;
using Quartz;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        b => b.SetIsOriginAllowed(_ => true)
            .AllowCredentials()
            .AllowAnyHeader());
});



builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString: "Server=DESKTOP-0IRDPAP\\SQLEXPRESS;" +
                                           "Database=AuctionDb;" +
                                           "User Id=prog;" +
                                           "Password=wtf3228"
    ).UseLazyLoadingProxies());

builder.Services.AddLogging(options =>
    options.AddFilter("Microsoft.EntityFrameworkCore.Database.Command", LogLevel.Critical + 1));

builder.Services.AddIdentity<AuctionUser, IdentityRole>(options =>
    {
        options.Password.RequiredLength = 4;
        options.Password.RequireLowercase = false;
        options.Password.RequireUppercase = false;
        options.Password.RequireNonAlphanumeric = false;
        options.Password.RequireDigit = true;
    })
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

builder.Services.AddScoped<BetHubService>();

builder.Services.AddSignalR();

var issuer = builder.Configuration.GetSection("Issuer").Value;
var audience = builder.Configuration.GetSection("Audience").Value;
var secret = builder.Configuration.GetSection("SecretKey").Value;


builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.SaveToken = true;
        options.RequireHttpsMetadata = false;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidIssuers = new List<string>
            {
                issuer
            },
            ValidAudiences = new List<string>
            {
                audience
            },
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret))
        };
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];

                var path = context.HttpContext.Request.Path;
                if (!string.IsNullOrEmpty(accessToken) &&
                    (path.StartsWithSegments("/betHub")))
                {
                    context.Token = accessToken;
                }
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization(options =>
{
    var defaultAuthorizationPolicyBuilder = new AuthorizationPolicyBuilder(
        JwtBearerDefaults.AuthenticationScheme);

    defaultAuthorizationPolicyBuilder =
        defaultAuthorizationPolicyBuilder.RequireAuthenticatedUser();

    options.DefaultPolicy = defaultAuthorizationPolicyBuilder.Build();
});

builder.Services.AddQuartz(q =>
{
    q.UseMicrosoftDependencyInjectionJobFactory();
    // Just use the name of your job that you created in the Jobs folder.
});
builder.Services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);


builder.Services.AddTransient<ILotRepository, LotRepository>();
builder.Services.AddTransient<IUserRepository, AuctionUserRepository>();
builder.Services.AddTransient<ILotBetsRepository, LotBetsRepository>();
builder.Services.AddTransient<IHubConnectionRepository, HubConnectionRepository>();
builder.Services.AddTransient<IUserOwnershipRepository, UserOwnershipRepository>();
builder.Services.AddTransient<IPaymentRepository, PaymentRepository>();
builder.Services.AddTransient<IOrganizationRepository, OrganizationRepository>();
builder.Services.AddTransient<ILotCreationRepository, LotCreationRepository>();
builder.Services.AddTransient<IRegistrationTicketRepository, RegistrationTicketRepository>();


builder.Services.AddScoped<IPaymentService<LiqPayResponseDto>, LiqPayPaymentService>();
builder.Services.AddScoped<IAuthService,AuthService>();
builder.Services.AddScoped<IOrganizationService, OrganizationService>();
builder.Services.AddScoped<ILotService, LotService>();
builder.Services.AddScoped<ITimerService, TimerService>();
builder.Services.AddHttpClient();

//builder.Services.AddSingleton<IUserIdProvider, DbUserIdProvider>();
var app = builder.Build();
app.UseCors("AllowAllOrigins");


// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseRouting();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
        name: "default",
        pattern: "{controller}/{action}/{id?}");
});


app.UseAuthentication();
app.MapHub<BetHubService>("/betHub");

app.Run();
var hubConnections = app.Services.GetRequiredService<AppDbContext>().Connections;