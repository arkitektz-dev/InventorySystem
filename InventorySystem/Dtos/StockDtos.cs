using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace InventorySystem.Dtos
{
    public class StockDtos
    {
        public string Location { get; set; }
        public string WarehouseName { get; set; }
        public string ProductName { get; set; }
        public decimal? QuantityReceiving { get; set; }
        public decimal? QuantityOnHand { get; set; }
    }
}