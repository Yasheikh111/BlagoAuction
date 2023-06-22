using System.Diagnostics;
using System.Net.Mime;
using Auction.Core.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Drawing;
using System.Drawing.Imaging;
using System.Security.Claims;
using Microsoft.IdentityModel.JsonWebTokens;

namespace Auction.Infrastructure.Db.Initializer;

public static class DefaultDbInitializer
{
    public static void Initialize(AppDbContext context)
    {
        if (!AppDbContext.IsInitalized)
        {
            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();


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

            context.SaveChanges();
            AppDbContext.IsInitalized = true;
        }
    }
}