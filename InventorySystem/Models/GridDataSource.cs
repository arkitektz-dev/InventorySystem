using System;
using System.Collections;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;


public class GridDataSource
{
    public IEnumerable data { get; set; }
    public long length { get; set; }
}
