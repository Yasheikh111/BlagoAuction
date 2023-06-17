using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Auction.Core.Interfaces.Services
{
    public interface IDeliveryService
    {
        void RequestDelivery(int ownedItemId, string city, string warehouse);

    }
}
