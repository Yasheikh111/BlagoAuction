using Newtonsoft.Json;

namespace Auction.Infrastructure.Services;

public class LiqPayCompleteResponse
{
    public string Status { get; set; }
    [JsonProperty("order_id")]
    public string OrderId { get; set; }
    
}