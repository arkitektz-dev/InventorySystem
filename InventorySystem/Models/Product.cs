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
    
    public partial class Product
    {
        public int ProductId { get; set; }
        public string Barcode { get; set; }
        public string ProductName { get; set; }
        public string ProductCode { get; set; }
        public string UnitOfMeasure { get; set; }
        public Nullable<int> WarehouseId { get; set; }
        public Nullable<int> ProductTypeId { get; set; }
        public Nullable<decimal> Price { get; set; }
        public Nullable<int> SNo { get; set; }
        public Nullable<decimal> QtyInHand { get; set; }
        public Nullable<decimal> SalesMargin { get; set; }
        public Nullable<decimal> SalesPrice { get; set; }
        public Nullable<bool> RawMaterial { get; set; }
        public string Description { get; set; }
        public Nullable<bool> IsActive { get; set; }
        public Nullable<System.DateTime> CreateDate { get; set; }
    }
}
