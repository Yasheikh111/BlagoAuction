using System.Text.Json.Serialization;

namespace Auction.Client.Dto.User;

[JsonSerializable(typeof(RegisterCredentials))]
public record RegisterCredentials(
    string Email,
    string Password,
    string Firstname,
    string Surname);
public record LogInCredentials(
    string Email,
    string Password);
