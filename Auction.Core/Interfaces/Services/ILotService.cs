using Auction.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Auction.Core.Interfaces.Services
{
    public interface ILotService
    {
        void AddLot(int itemId, decimal minBet);
        void RemoveLot(int lotId);
        void UpdateLot(Lot lot);
        public Task TryEndLot(int lotId);
        void AcceptLot(int lotId, DateTime start, TimeSpan duration);
        Task AddBet(LotBet lotBet);

        Task RegisterForLot(int lotId, string userId);
    }
}
