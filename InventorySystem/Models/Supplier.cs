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
    
    public partial class Supplier
    {
        public int SupplierId { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public string Street { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string PhoneNo { get; set; }
        public string TermOfPayment { get; set; }
        public string State { get; set; }
        public string PostalCode { get; set; }
        public Nullable<bool> IsDeleted { get; set; }
    }
}
