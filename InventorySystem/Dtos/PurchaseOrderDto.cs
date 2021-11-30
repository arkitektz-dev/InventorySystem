using InventorySystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace InventorySystem.Dtos
{
    public class PurchaseOrderDto
    {
        public PO purchaseOrder { get; set; }

        public List<PODetail> purchaseDetail { get; set;}

        public Supplier supplierDetail { get; set; }

    }
     
}