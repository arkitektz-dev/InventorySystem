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
    
    public partial class SO
    {
        public int Id { get; set; }
        public string SoNumber { get; set; }
        public Nullable<System.DateTime> SoDate { get; set; }
        public Nullable<System.DateTime> EstimatedDateofDispatch { get; set; }
        public Nullable<System.DateTime> DeliveryDate { get; set; }
        public Nullable<int> SalesPersonId { get; set; }
        public Nullable<int> CustomerCodeId { get; set; }
        public Nullable<int> ContactPersonId { get; set; }
        public string CustomerReference { get; set; }
        public Nullable<int> BillCustomerCodeId { get; set; }
        public string SoStatus { get; set; }
        public string DeliveryAddress { get; set; }
        public string Street { get; set; }
        public string Suburb { get; set; }
        public string City { get; set; }
        public Nullable<int> PostalCode { get; set; }
        public string Country { get; set; }
        public Nullable<decimal> Discount { get; set; }
        public string Description { get; set; }
        public Nullable<decimal> SubTotal { get; set; }
        public Nullable<decimal> DiscountAmount { get; set; }
        public Nullable<decimal> Total { get; set; }
    }
}
