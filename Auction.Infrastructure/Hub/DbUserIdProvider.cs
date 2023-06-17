using Auction.Core.Interfaces.Repositories;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.VisualBasic;

namespace Auction.Infrastructure.Hub;

// public class DbUserIdProvider : IUserIdProvider
// {
//     public string? GetUserId(HubConnectionContext connection)
//     {
//         return connection.User?.Identity.Name;
//     }
// }