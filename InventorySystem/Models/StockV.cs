//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace InventorySystem.Models
{
    using System;
    using System.Collections.Generic;
    
    public partial class StockV
    {
        public int StockId { get; set; }
        public string Location { get; set; }
        public Nullable<int> WarehouseId { get; set; }
        public Nullable<int> ProductId { get; set; }
        public Nullable<decimal> QuantityReceiving { get; set; }
        public Nullable<decimal> QuantityOnHand { get; set; }
        public string ProductName { get; set; }
        public string Warehouse { get; set; }
        public string Barcode { get; set; }
        public string ProductCode { get; set; }
    }
}
