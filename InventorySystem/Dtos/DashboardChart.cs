using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace InventorySystem.Dtos
{
    public class DashboardChart
    {
        public List<string> Label { get; set; }
        public List<string> Value { get; set; }
    }
}