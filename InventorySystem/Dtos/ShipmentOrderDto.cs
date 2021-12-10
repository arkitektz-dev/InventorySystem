using InventorySystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace InventorySystem.Dtos
{
    public class ShipmentOrderDto
    {
        public Customer Customer { get; set; }

        public Shipment Shipment { get; set; }

        public SO SalesOrder { get; set; }

        public List<SaleOrderItem> SalesItemList { get; set; }

    }
}