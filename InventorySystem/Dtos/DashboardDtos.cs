using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace InventorySystem.Dtos
{
    public class DashboardDtos
    {
        public int PurchaseOrder { get; set; }
        public int SalesOrder { get; set; }
        public int Receiving { get; set; }
        public int Shipment { get; set; }
    }
}