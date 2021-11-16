
using System.ComponentModel.DataAnnotations;

namespace InventorySystem.Models
{
    public class WarehouseDto
    {
        public int Id { get; set; }
        [Required]        
        public string WarehouseName { get; set; }
        [Required]        
        public string WarehouseAddress { get; set; }
        public string Street { get; set; }
        public string Suburb { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string Phone { get; set; }
        public string Description { get; set; }
    }
}