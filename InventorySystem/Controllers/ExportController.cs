using ClosedXML.Excel;
using InventorySystem.Dtos;
using InventorySystem.Models;
using Rotativa;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace InventorySystem.Controllers
{
    public class ExportController : Controller
    {
        InventorySystemEntities _Entity = new InventorySystemEntities();
      

        //Warehouse Print and Excel
        
        public ActionResult Warehouse()
        {
            var list = _Entity.Warehouses.ToList();
            return View(list);
        }

        public ActionResult PrintWarehouse()
        {
            return new Rotativa.ActionAsPdf("Warehouse")
            {
                FileName = $"Warehouse{DateTime.Now.Date}.pdf",
                CustomSwitches = "--print-media-type --header-center \"Warehouse List\""
            };
        }

        public ActionResult ExportExcel()
        {
            DataTable dt = getWarehouseData();
            //Name of File  
            string fileName = $"Warehouse{DateTime.Now.Date}.xlsx";
            using (XLWorkbook wb = new XLWorkbook())
            {
                //Add DataTable in worksheet  
                wb.Worksheets.Add(dt);
                using (MemoryStream stream = new MemoryStream())
                {
                    wb.SaveAs(stream);
                    //Return xlsx Excel File  
                    return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
                }
            }
        }

        public DataTable getWarehouseData()
        {
            //Creating DataTable  
            DataTable dt = new DataTable();
            //Setiing Table Name  
            dt.TableName = "Warehouse";
            //Add Columns  
            dt.Columns.Add("#", typeof(int));
            dt.Columns.Add("Name", typeof(string));
            dt.Columns.Add("Street", typeof(string));
            dt.Columns.Add("Address", typeof(string));
            dt.Columns.Add("City", typeof(string));
            dt.Columns.Add("State", typeof(string));
            dt.Columns.Add("PostalCode", typeof(string));
            dt.Columns.Add("Country", typeof(string));
            dt.Columns.Add("PhoneNo", typeof(string));
            dt.Columns.Add("Description", typeof(string));
            //Add Rows in DataTable  

            var list = _Entity.Warehouses.ToList();
            int counter = 0;
            foreach (var item in list) {
                counter++;
                dt.Rows.Add(counter, item.Name,item.Street, item.Address, item.City,item.State, item.PostalCode, item.Country, item.PhoneNo, item.Description);
            }
            dt.AcceptChanges();
            return dt;
        }



        //Warehouse Print and Excel

        public ActionResult Supplier()
        {
            var list = _Entity.Suppliers.ToList();
            return View(list);
        }

        public ActionResult PrintSupplier()
        {
            return new Rotativa.ActionAsPdf("Supplier")
            {
                FileName = $"Supplier{DateTime.Now.Date}.pdf",
                CustomSwitches = "--print-media-type --header-center \"Supplier List\""
            };
        }

        public ActionResult ExportSupplierExcel()
        {
            DataTable dt = getSupplierData();
            //Name of File  
            string fileName = $"Supplier{DateTime.Now.Date}.xlsx";
            using (XLWorkbook wb = new XLWorkbook())
            {
                //Add DataTable in worksheet  
                wb.Worksheets.Add(dt);
                using (MemoryStream stream = new MemoryStream())
                {
                    wb.SaveAs(stream);
                    //Return xlsx Excel File  
                    return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
                }
            }
        }

        public DataTable getSupplierData()
        {
            //Creating DataTable  
            DataTable dt = new DataTable();
            //Setiing Table Name  
            dt.TableName = "Supplier";
            //Add Columns  
            dt.Columns.Add("#", typeof(int));
            dt.Columns.Add("Name", typeof(string));
            dt.Columns.Add("Street", typeof(string));
            dt.Columns.Add("Address", typeof(string));
            dt.Columns.Add("City", typeof(string));
            dt.Columns.Add("State", typeof(string));
            dt.Columns.Add("PostalCode", typeof(string));
            dt.Columns.Add("Country", typeof(string));
            dt.Columns.Add("PhoneNo", typeof(string));
            dt.Columns.Add("TermOfPaymnet", typeof(string));
            //Add Rows in DataTable  

            var list = _Entity.Suppliers.ToList();
            int counter = 0;
            foreach (var item in list)
            {
                counter++;
                dt.Rows.Add(counter, item.Name, item.Street, item.Address, item.City, item.State, item.PostalCode, item.Country, item.PhoneNo, item.TermOfPayment);
            }
            dt.AcceptChanges();
            return dt;
        }

        //Product Print and Excel

        public ActionResult Product()
        {
            var list = _Entity.Products.ToList();
            return View(list);
        }

        public ActionResult PrintProduct()
        {
            return new Rotativa.ActionAsPdf("Product")
            {
                FileName = $"Product{DateTime.Now.Date}.pdf",
                CustomSwitches = "--print-media-type --header-center \"Product List\""
            };
        }

        public ActionResult ExportProductExcel()
        {
            DataTable dt = getSupplierData();
            //Name of File  
            string fileName = $"Product{DateTime.Now.Date}.xlsx";
            using (XLWorkbook wb = new XLWorkbook())
            {
                //Add DataTable in worksheet  
                wb.Worksheets.Add(dt);
                using (MemoryStream stream = new MemoryStream())
                {
                    wb.SaveAs(stream);
                    //Return xlsx Excel File  
                    return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
                }
            }
        }

        public DataTable getProductData()
        {
            //Creating DataTable  
            DataTable dt = new DataTable();
            //Setiing Table Name  
            dt.TableName = "Product";
            //Add Columns  
            dt.Columns.Add("#", typeof(int));
            dt.Columns.Add("Barcode", typeof(string));
            dt.Columns.Add("ProductName", typeof(string));
            dt.Columns.Add("ProductCode", typeof(string));
            dt.Columns.Add("UnitOfMeasure", typeof(string));
            dt.Columns.Add("Price", typeof(string));
            dt.Columns.Add("SaleMargin", typeof(string));
            dt.Columns.Add("SalePrice", typeof(string));
            dt.Columns.Add("RawMaterial", typeof(string));
            dt.Columns.Add("Description", typeof(string));
            dt.Columns.Add("Date", typeof(string));
            //Add Rows in DataTable  

            var list = _Entity.Products.ToList();
            int counter = 0;
            foreach (var item in list)
            {
                counter++;
                dt.Rows.Add(counter, item.Barcode, item.ProductName,item.ProductCode, item.UnitOfMeasure, item.Price, item.SalesMargin, item.SalesPrice, item.RawMaterial, item.Description, item.CreateDate);
            }
            dt.AcceptChanges();
            return dt;
        }

        //Customer Print and Excel

        public ActionResult Customer()
        {
            var list = _Entity.Customers.ToList();
            return View(list);
        }

 
        public ActionResult PrintCustomer()
        {
            return new Rotativa.ActionAsPdf("Customer")
            {
                FileName = $"Customer{DateTime.Now.Date}.pdf",
                CustomSwitches = "--print-media-type --header-center \"Customer List\""
            };
        }

        public ActionResult ExportCustomerExcel()
        {
            DataTable dt = getCustomerData();
            //Name of File  
            string fileName = $"Customer{DateTime.Now.Date}.xlsx";
            using (XLWorkbook wb = new XLWorkbook())
            {
                //Add DataTable in worksheet  
                wb.Worksheets.Add(dt);
                using (MemoryStream stream = new MemoryStream())
                {
                    wb.SaveAs(stream);
                    //Return xlsx Excel File  
                    return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
                }
            }
        }

        public DataTable getCustomerData()
        {
            //Creating DataTable  
            DataTable dt = new DataTable();
            //Setiing Table Name  
            dt.TableName = "Product";
            //Add Columns  
            dt.Columns.Add("#", typeof(int));
            dt.Columns.Add("Code", typeof(string));
            dt.Columns.Add("Name", typeof(string));
            dt.Columns.Add("AccountEmail", typeof(string));
            dt.Columns.Add("CustomerGroup", typeof(string));
            dt.Columns.Add("PaymentTerms", typeof(string));
            dt.Columns.Add("CreditLimit", typeof(string));
            dt.Columns.Add("BusinessSize", typeof(string));
            dt.Columns.Add("Discount", typeof(string)); 
            dt.Columns.Add("StopCredit", typeof(string));
            dt.Columns.Add("Street", typeof(string));
            dt.Columns.Add("Address", typeof(string));
            dt.Columns.Add("City", typeof(string));
            dt.Columns.Add("State", typeof(string));
            dt.Columns.Add("PostalCode", typeof(string));
            dt.Columns.Add("Country", typeof(string));
            //Add Rows in DataTable  

            var list = _Entity.Customers.ToList();
            int counter = 0;
            foreach (var item in list)
            {
                counter++;
                dt.Rows.Add(counter, item.Code, item.Name, item.AccountEmail, item.CustomerGroup, 
                    item.PaymentTerms, item.CreditLimit,item.BusinessSize, item.Discount, item.StopCredit,
                    item.Street, item.Address, item.City, item.State, item.PostalCode, item.Country);
            }
            dt.AcceptChanges();
            return dt;
        }

        //Stock Print and Excel

        public ActionResult Stocks()
        {
            var list = (from stock in _Entity.Stocks
                       join product in _Entity.Products on stock.ProductId equals product.ProductId
                       join warehouse in _Entity.Warehouses on stock.WarehouseId equals warehouse.WarehouseId
                       select new StockDtos()
                       {
                           Location = stock.Location,
                           WarehouseName = warehouse.Name,
                           ProductName = product.ProductName,
                           QuantityReceiving = stock.QuantityReceiving,
                           QuantityOnHand = stock.QuantityOnHand
                       }).ToList();

            return View(list);
        }

        public ActionResult PrintStock()
        {
            return new Rotativa.ActionAsPdf("Stocks")
            {
                FileName = $"Stocks{DateTime.Now.Date}.pdf",
                CustomSwitches = "--print-media-type --header-center \"Stock List\""
            };
        }


        public DataTable getStockData()
        {
            //Creating DataTable  
            DataTable dt = new DataTable();
            //Setiing Table Name  
            dt.TableName = "Product";
            //Add Columns  
            dt.Columns.Add("#", typeof(int));
            dt.Columns.Add("Location", typeof(string));
            dt.Columns.Add("WarehouseName", typeof(string));
            dt.Columns.Add("ProductName", typeof(string));
            dt.Columns.Add("QuantityReceiving", typeof(string));
            dt.Columns.Add("QuantityOnHand", typeof(string));
            //Add Rows in DataTable  

            var list = (from stock in _Entity.Stocks
                        join product in _Entity.Products on stock.ProductId equals product.ProductId
                        join warehouse in _Entity.Warehouses on stock.WarehouseId equals warehouse.WarehouseId
                        select new StockDtos()
                        {
                            Location = stock.Location,
                            WarehouseName = warehouse.Name,
                            ProductName = product.ProductName,
                            QuantityReceiving = stock.QuantityReceiving,
                            QuantityOnHand = stock.QuantityOnHand
                        }).ToList();

            int counter = 0;
            foreach (var item in list)
            {
                counter++;
                dt.Rows.Add(counter,item.Location, item.WarehouseName, item.ProductName, item.QuantityReceiving, item.QuantityOnHand);
            }
            dt.AcceptChanges();
            return dt;
        }

        public ActionResult ExportStockExcel()
        {
            DataTable dt = getStockData();
            //Name of File  
            string fileName = $"Stock{DateTime.Now.Date}.xlsx";
            using (XLWorkbook wb = new XLWorkbook())
            {
                //Add DataTable in worksheet  
                wb.Worksheets.Add(dt);
                using (MemoryStream stream = new MemoryStream())
                {
                    wb.SaveAs(stream);
                    //Return xlsx Excel File  
                    return File(stream.ToArray(), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
                }
            }
        }


    }


}