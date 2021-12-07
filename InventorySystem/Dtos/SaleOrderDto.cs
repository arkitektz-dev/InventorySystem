using InventorySystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace InventorySystem.Dtos
{
    public class SaleOrderDto
    {
        public SO saleOrder { get; set; }

        public List<SODetail> saleDetail { get; set; }
        public Customer cust { get; set; }
        public List<SaleOrderItem> SaleOrderItem { get; set; }
    }

    public class SaleOrderItem
    { 
        public string ProudctCode { get; set; }
        public string ProuductDescription { get; set; }
        public decimal? Quantity { get; set; }
        public decimal? UnitPrice { get; set; }
        public decimal? Total { get; set; }
    }
     
}