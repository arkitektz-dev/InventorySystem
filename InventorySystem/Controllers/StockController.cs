using InventorySystem.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace InventorySystem.Controllers
{
    public class StockController : Controller
    {
        InventorySystemEntities _Entity = new InventorySystemEntities();

        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (Session["UserID"] == null)
            {
                //Session["isSessionTimeOut"] = "1";
                filterContext.Result = RedirectToAction("Index", "Login", new { area = "" });
            }
            base.OnActionExecuting(filterContext);
        }
        public bool CheckRefererURL()
        {
            if (HttpContext.Request.Headers["Referer"] == null)
                return true;
            else
                return false;
        }
        public ActionResult Index()
        {
            SelectListItem item = new SelectListItem();
            var unitOfMeasure = _Entity.UnitOfMeasures.ToList();
            var warehouses = _Entity.Warehouses.ToList();
            var productTypes = _Entity.ProductTypes.ToList();

            List<SelectListItem> uomList = new List<SelectListItem>();
            List<SelectListItem> warehouseList = new List<SelectListItem>();
            List<SelectListItem> productTypeLists = new List<SelectListItem>();

            foreach (var unit in unitOfMeasure)
            {
                item = new SelectListItem();
                item.Value = unit.Symbol;
                item.Text = unit.UnitOfMeasure1;
                uomList.Add(item);
            }
            item = new SelectListItem()
            {
                Text = "-- Select Unit of measure --",
                Value = ""
            };
            uomList.Insert(0, item);

            foreach (var wh in warehouses)
            {
                item = new SelectListItem();
                item.Value = wh.WarehouseId.ToString();
                item.Text = wh.Name;
                warehouseList.Add(item);
            }
            item = new SelectListItem()
            {
                Text = "-- Select warehouse --",
                Value = ""
            };
            warehouseList.Insert(0, item);

            foreach (var pt in productTypes)
            {
                item = new SelectListItem();
                item.Value = pt.TypeId.ToString();
                item.Text = pt.Type;
                productTypeLists.Add(item);
            }
            item = new SelectListItem()
            {
                Text = "-- Select product type --",
                Value = ""
            };
            productTypeLists.Insert(0, item);

            ViewBag.UomList = uomList;
            ViewBag.WarehouseList = warehouseList;
            ViewBag.ProductTypeLists = productTypeLists;
            ViewBag.ProductCodeList = new SelectList(_Entity.Products.Where(x => x.RawMaterial == true), "ProductId", "ProductCode");

            return View();
        }
        public virtual ActionResult AddEditStock(int Id)
        {
            Stock model = new Stock();
            var lst = _Entity.Stocks.Where(x => x.StockId == Id).SingleOrDefault();
            if (lst != null)
            {
                model = lst;
            }
            return PartialView("_AddEditStock", model);
        }
        [HttpPost]
        public virtual JsonResult StockDelete(int Id)
        {
            try
            {
                var _Data = _Entity.Stocks.Where(x => x.StockId == Id).SingleOrDefault();
                if (_Data != null)
                {
                    _Entity.Entry(_Data).State = System.Data.Entity.EntityState.Deleted;
                    _Entity.SaveChanges();
                    return Json("true", JsonRequestBehavior.AllowGet);
                }
                return Json("false", JsonRequestBehavior.AllowGet);

            }
            catch (Exception)
            {
                return Json("false", JsonRequestBehavior.AllowGet);
            }
        }


        [HttpPost]
        public virtual JsonResult SaveStock(vmStock model)
        {
            try
            {
                //Add
                if (model.StockId == 0)
                {
                    var rowStock = _Entity.Products.Where(x => x.Barcode == model.Barcode).FirstOrDefault();
                    var quantityInHand = _Entity.Stocks.Where(x => x.ProductId == rowStock.ProductId && x.Location == model.Location).Select(y=>y.QuantityReceiving).Sum();
                    

                    Stock row = new Stock();
                    row.Location = model.Location;
                    row.WarehouseId = rowStock.WarehouseId;
                    row.ProductId = rowStock.ProductId;
                    row.QuantityReceiving = model.QuantityOnReceiving;
                    row.QuantityOnHand = quantityInHand;

                    _Entity.Stocks.Add(row);
                    _Entity.SaveChanges();
                     




                    return Json("true", JsonRequestBehavior.AllowGet);

                }
                //Edit
                else
                {

                    if (model.QuantityOnHand == 0)
                    {
                        model.QuantityOnHand = 0;
                    }

                    if (model.QuantityOnReceiving == 0)
                    {
                        model.QuantityOnReceiving = 0;
                    }


                    var rowStock = _Entity.Stocks.Where(x => x.StockId == model.StockId).FirstOrDefault();
                    if (rowStock != null) {


                        var getProudctDetail = _Entity.Products.Where(x => x.Barcode == model.Barcode).FirstOrDefault();

                        rowStock.Location = model.Location;
                        rowStock.WarehouseId = getProudctDetail.WarehouseId;
                        rowStock.ProductId = getProudctDetail.ProductId;
                        rowStock.QuantityOnHand = model.QuantityOnHand;
                        rowStock.QuantityReceiving = model.QuantityOnReceiving;

                        _Entity.SaveChanges();


                        return Json("true", JsonRequestBehavior.AllowGet);
                    }


                    //_Entity.Entry(model).State = (model.StockId == 0 ? EntityState.Added : EntityState.Modified);
                    //_Entity.SaveChanges();
                    return Json("true", JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json("[]", JsonRequestBehavior.AllowGet);
            }
        }

        public virtual JsonResult GetStockList()
        {
            if (Session["UserID"] != null)
            {
                //var lst = _Entity.Stocks.ToList();
                var lst = (from stock in _Entity.Stocks 
                          join product in _Entity.Products on stock.ProductId equals product.ProductId 
                          join warehouse in _Entity.Warehouses on stock.WarehouseId equals warehouse.WarehouseId
                          select new {
                              warehouse.Name,
                              product.Barcode,
                              stock.StockId,
                              product.WarehouseId,
                              product.ProductCode,
                              product.ProductName,
                              stock.Location,
                              stock.QuantityReceiving,
                              stock.QuantityOnHand
                          }).ToList();



                GridDataSource gobj = new GridDataSource
                {
                    data = lst.ToList(),
                    length = lst.Count
                };
                return Json(gobj, JsonRequestBehavior.AllowGet);
            }
            else
                return Json("[]");
        }
        public virtual JsonResult GetStockByProductId(int Id)
        {
            if (Session["UserID"] != null)
            {
                var obj = _Entity.Products.AsNoTracking().Where(x => x.ProductId == Id).FirstOrDefault();
                if (obj != null)
                {

                    return Json(obj, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(null, JsonRequestBehavior.AllowGet);
                }
            }
            else
                return Json("[]");
        }

        [HttpPost]
        public ActionResult GetStockByBarcode(string Barcode)
        {
            var obj = (from warehouse in _Entity.Warehouses
                       join product in _Entity.Products
                       on warehouse.WarehouseId equals product.WarehouseId into ps
                       from p in ps.DefaultIfEmpty()
                       where p.Barcode == Barcode
                       select new
                       {
                           p.ProductName,
                           warehouse.Name
                       }).FirstOrDefault();

            if (obj != null)
            {
                return Json( new { obj },JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json("false", JsonRequestBehavior.AllowGet);
            } 
        }

        [HttpPost]
        public virtual JsonResult DeleteStockById(int StockId)
        {
            try
            {

                var getStock = _Entity.Stocks.Where(x => x.StockId == StockId).FirstOrDefault();
                if (getStock != null)
                {
                    _Entity.Stocks.Remove(getStock);
                    _Entity.SaveChanges();
                    return Json("true", JsonRequestBehavior.AllowGet);
                }
                else { 
                    return Json("false", JsonRequestBehavior.AllowGet);
                }



            }
            catch (Exception ex) {
                return Json("[]", JsonRequestBehavior.AllowGet);
            }
            

          
        }

        

    }

    public class vmStock
    { 
        public int StockId { get; set; }
        public string Barcode { get; set; }
        public string ProductName { get; set; }
        public string Location { get; set; }
        public int WarehouseId { get; set; }
        public int QuantityOnHand { get; set; }
        public int QuantityOnReceiving { get; set; }
    }
     

}