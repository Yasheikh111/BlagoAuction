using System.Net.Mime;
using Auction.Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Drawing;
using System.Drawing.Imaging;

namespace Auction.Infrastructure.Db.Initializer;

public static class DefaultDbInitializer
{
    public static void Initialize(AppDbContext context)
    {
        if (!AppDbContext.IsInitalized)
        {
            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();
        }

        if (!context.Roles.Any(r => r.Name == "User"))
            context.Roles.Add(new IdentityRole("User")
            {
                NormalizedName = "USER"
            });

        if (!context.Roles.Any(r => r.Name == "Admin"))
            context.Roles.Add(new IdentityRole("Admin")
            {
                NormalizedName = "ADMIN"
            });

        if (!context.Roles.Any(r => r.Name == "Moderator"))
            context.Roles.Add(new IdentityRole("Moderator")
            {
                NormalizedName = "MODERATOR"
            });

        if (!context.Users.Any())
        {
        }
        context.SaveChanges();

        if (!context.Lots.Any())
        {
            context.Lots.Add(new Lot
            {
                MinBet = 20,
                StartTime = DateTime.Now + TimeSpan.FromSeconds(30),
                EndTime = DateTime.Now + TimeSpan.FromMinutes(10),
                Step = 0.1,
                Target = "mono",
                Description = "Some lot1",
                TimeToBeatPreviousBet = TimeSpan.FromSeconds(10),
                Bets = new List<LotBet>()
            });
            context.Lots.Add(new Lot
            {
                MinBet = 30,
                StartTime = DateTime.Now + TimeSpan.FromMinutes(20),
                EndTime = DateTime.Now + TimeSpan.FromMinutes(40),
                Target = "privat",
                TimeToBeatPreviousBet = TimeSpan.FromSeconds(10),
                Description = "Some lot2",
                Bets = new List<LotBet>(),
            });
            context.SaveChanges();
        }
        context.SaveChanges();

        if (!context.Organizations.Any())
        {
            var image = Image.FromFile(
                "C:\\Users\\38095\\RiderProjects\\Auction\\Auction.Infrastructure\\Db\\Initializer\\pz.jpeg");
            var ms = new MemoryStream();
            image.Save(ms, ImageFormat.Jpeg);
            context.Organizations.Add(new Organization()
            {
                Name = "Повернись живим.",
                Logo = ms.ToArray()
            });
        }
        context.SaveChanges();

        if (!context.Creations.Any() && context.Users.Any())
        {
            context.Creations.Add(new LotCreation
                { CreatorUserId = "9f27d19c-db02-4b2a-b140-f16a8b95b11f", LotId = 1,OrganizationId = 1});
            context.Creations.Add(new LotCreation
                { CreatorUserId = "9f27d19c-db02-4b2a-b140-f16a8b95b11f", LotId = 2,OrganizationId = 1 });
        }
        context.SaveChanges();

        if (!context.Items.Any())
        {
            //load image for testing purpose
            var image = Image.FromFile(
                "C:\\Users\\38095\\RiderProjects\\Auction\\Auction.Infrastructure\\Db\\Initializer\\test1.jpg");
            var ms = new MemoryStream();
            image.Save(ms, ImageFormat.Jpeg);
            context.Items.Add(new Item { LotId = 1, Description = "Щось", Photo = ms.ToArray() });
            context.Items.Add(new Item { LotId = 2, Description = "Ще щось", Photo = ms.ToArray() });
        }
         
        context.SaveChanges();
        AppDbContext.IsInitalized = true;
    }
}