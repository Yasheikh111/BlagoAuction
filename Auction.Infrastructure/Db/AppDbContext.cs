using Auction.Core.Entities;
using Auction.Infrastructure.Db.Initializer;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Auction.Infrastructure.Db;

public sealed class AppDbContext : IdentityDbContext<AuctionUser>
{
    public static bool IsInitalized = false;
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
        
            DefaultDbInitializer.Initialize(this);
    }
    
    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<Organization>()
            .HasIndex(u => u.Name)
            .IsUnique();
        base.OnModelCreating(builder);
    }
    
    public DbSet<Lot> Lots { get; set; }
    public DbSet<LotBet> LotBets { get; set; }
    public DbSet<Theme> Themes { get; set; }
    public DbSet<UserOwnedLot> UserOwnedLots { get; set; }
    public DbSet<Item> Items { get; set; }
    public DbSet<HubConnection> Connections { get; set; }
    public DbSet<Payment> Payments { get; set; }
    public DbSet<Organization> Organizations { get; set; }
    public DbSet<LotCreation> Creations { get; set; }
    public DbSet<RegistrationTicket> RegistrationTickets { get; set; }
    
}