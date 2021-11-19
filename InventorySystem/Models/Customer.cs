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
    
    public partial class Customer
    {
        public int CustomerId { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
        public Nullable<int> UserId { get; set; }
        public string AccountEmail { get; set; }
        public string CustomerGroup { get; set; }
        public string PaymentTerms { get; set; }
        public Nullable<decimal> CreditLimit { get; set; }
        public string BusinessSize { get; set; }
        public Nullable<decimal> Discount { get; set; }
        public Nullable<bool> StopCredit { get; set; }
        public string Street { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string PostalCode { get; set; }
        public string Country { get; set; }
        public bool Active { get; set; }
        public Nullable<System.DateTime> CreateDate { get; set; }
    }
}