using System.Text.Json.Serialization;

namespace Auction.Infrastructure.Services;

public class LiqPayResponseDto
{
    [JsonPropertyName("signature")]
    public string Signature { get; set; }
    [JsonPropertyName("data")]
    public string Data { get; set; }
}