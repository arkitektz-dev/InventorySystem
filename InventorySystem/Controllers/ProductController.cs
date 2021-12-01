using InventorySystem.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace InventorySystem.Controllers
{
    public class ProductController : Controller
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
        public virtual ActionResult AddEditProduct(int Id)
        {
            Product model = new Product();
            var lst = _Entity.Products.Where(x => x.ProductId == Id).SingleOrDefault();
            if (lst != null)
            {
                model = lst;
            }
            return PartialView("_AddEditProduct", model);
        }
        [HttpPost]
        public virtual JsonResult ProductDelete(int Id)
        {
            try
            {
                var _Data = _Entity.Products.Where(x => x.ProductId == Id).SingleOrDefault();
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
        public virtual JsonResult SaveProduct(Product model, vmRawMaterial frm)
        {
            try
            {
                if (!ModelState.IsValid)
                    return Json("false", JsonRequestBehavior.AllowGet);

                var obj = _Entity.Products.AsNoTracking().Where(x => x.Barcode == model.Barcode).FirstOrDefault();

                if (model.ProductId == 0)
                {
                    if (obj != null)
                    {
                        return Json("1", JsonRequestBehavior.AllowGet);
                    }

                    obj = _Entity.Products.AsNoTracking().Where(x => x.ProductCode == model.ProductCode).FirstOrDefault();
                    if (obj != null)
                    {
                        return Json("2", JsonRequestBehavior.AllowGet);
                    }
                }
                _Entity.Entry(model).State = (model.ProductId == 0 ? EntityState.Added : EntityState.Modified);
                _Entity.SaveChanges();
                return Json("true", JsonRequestBehavior.AllowGet);

            }
            catch (Exception)
            {
                return Json("[]", JsonRequestBehavior.AllowGet);
            }
        }




        [HttpPost]
        public virtual JsonResult SaveProductApi(Product model, List<vmRawMaterial> frm)
        {
            try
            {

                if (model.ProductId == 0)
                {
                    model.CreateDate = DateTime.Now;
                    model.IsActive = true;
                    var obj = _Entity.Products.AsNoTracking().Where(x => x.ProductName == model.ProductName ||
                        x.Barcode == model.Barcode || x.ProductCode == model.ProductCode).FirstOrDefault();

                    if (obj != null)
                    {
                        string message = string.Empty;
                        if (obj.ProductName == model.ProductName)
                            message += "AlreadyExists";

                        if (obj.ProductCode == model.ProductCode)
                            message += ",CodeExists";

                        if (obj.Barcode == model.Barcode)
                            message += ",BarcodeExists";

                        return Json(message, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {

                    decimal TotalRawMaterailPrice = 0;
                    decimal TotalRawMaterailSalesPrice = 0;
                    //Edit
                    var row = _Entity.Products.Where(x => x.ProductId == model.ProductId).FirstOrDefault();
                    if (row != null)
                    {
                        _Entity.RawMaterails.RemoveRange(_Entity.RawMaterails.Where(x => x.ProductId == model.ProductId));
                        _Entity.SaveChanges();
                        if (frm != null && frm.Count() > 0) {

                            

                            foreach (var item in frm) {
                                 

                                var product = _Entity.Products.Where(x => x.ProductId == item.ProductId).FirstOrDefault();
                                if (product != null)
                                {

                                    RawMaterail rawMaterial = new RawMaterail()
                                    {
                                        ProductId = model.ProductId,
                                        Code = product.ProductCode,
                                        Quantity = item.Quantity
                                    };

                                    _Entity.RawMaterails.Add(rawMaterial);
                                    _Entity.SaveChanges();

                                    TotalRawMaterailPrice += product.Price.Value * item.Quantity;
                                    TotalRawMaterailSalesPrice += product.SalesPrice.Value * item.Quantity;

                                }

                            }
                        }


                        //Cost Price
                        model.Price = TotalRawMaterailPrice;
                        //Sale Margin
                        model.SalesPrice = TotalRawMaterailSalesPrice;

                        if (model.Price > 0)
                        {
                            model.SalesMargin = ((TotalRawMaterailSalesPrice - TotalRawMaterailPrice) * 100) / model.Price;
                            model.SalesMargin = Math.Round(Convert.ToDecimal(model.SalesMargin), 2);
                        }
                        else
                            model.SalesMargin = 0;
                        //((parseFloat(salesPrice) - parseFloat(price)) * 100) / parseFloat(price)
                        //Sale Price

                        _Entity.Entry(row).CurrentValues.SetValues(model);
                        _Entity.SaveChanges();


                        return Json("true", JsonRequestBehavior.AllowGet);
                    }
                }


                _Entity.Entry(model).State = (model.ProductId == 0 ? EntityState.Added : EntityState.Modified);
                _Entity.SaveChanges();


                if (frm != null && frm.Count() > 0) {
                    foreach (var item in frm)
                    {

                        var product = _Entity.Products.Where(x => x.ProductId == item.ProductId).FirstOrDefault();
                        if (product != null)
                        {

                            RawMaterail rawMaterial = new RawMaterail()
                            {
                                ProductId = model.ProductId,
                                Code = product.ProductCode,
                                Quantity = item.Quantity
                            };

                            _Entity.RawMaterails.Add(rawMaterial);
                            _Entity.SaveChanges();

                        }

                    }
                }

                return Json("true", JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json("[]", JsonRequestBehavior.AllowGet);
            }
        }


        public virtual JsonResult GetProductById(int Id)
        {
            var _Data = _Entity.Products.Where(x => x.ProductId == Id).SingleOrDefault();
            return Json(_Data, JsonRequestBehavior.AllowGet);
        }

        public virtual JsonResult GetProductList()
        {
            if (Session["UserID"] != null)
            {
                _Entity.Configuration.ProxyCreationEnabled = false;
                var lst = _Entity.Products.Where(x => x.IsActive == true).ToList();
                var stock = _Entity.Stocks.ToList();
                foreach (var item in lst)
                {
                    item.QtyInHand = stock.Where(y => y.ProductId == item.ProductId).Select(x => x.QuantityOnHand).Sum();
                }

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

        public virtual JsonResult GetRawMaterails(int Id)
        {
            if (Session["UserID"] != null)
            {
                var lst = _Entity.RawMaterails.Where(x => x.ProductId == Id).ToList();
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
        [HttpPost]
        public JsonResult Productdrp()
        {
            try
            {
                var lst = _Entity.Products.Select(x => new
                {
                    ID = x.ProductId,
                    Name = x.ProductName
                }).ToList();
                return Json(lst, JsonRequestBehavior.AllowGet);

            }
            catch
            {
                return Json("[]", JsonRequestBehavior.AllowGet);
            }
        }


        public JsonResult GetRawMaterialByProductId(int ProductId)
        {

            try
            {
                List<vmProductRawMaterial> list = new List<vmProductRawMaterial>();
                var rawMaterails = _Entity.RawMaterails.Where(x => x.ProductId == ProductId).ToList();
                foreach (var item in rawMaterails) {
                    vmProductRawMaterial objRaw = new vmProductRawMaterial();
                    var row = _Entity.Products.Where(x => x.ProductCode == item.Code).FirstOrDefault();
                    objRaw.ProductId = row.ProductId;
                    objRaw.Quantity = (int)item.Quantity;
                    objRaw.text = row.ProductCode;

                    list.Add(objRaw);
                }

                return Json(list, JsonRequestBehavior.AllowGet);

            }
            catch (Exception ex)
            {
                return Json(null, JsonRequestBehavior.AllowGet);
            }
        }

        public PartialViewResult GetRawMaterialDropdown()
        {
            ViewBag.ProductCodeList = new SelectList(_Entity.Products.Where(x => x.RawMaterial == true), "ProductId", "ProductCode");

            return PartialView();
        }

        public JsonResult DeleteProductById(int ProductId) {

            try
            {
                
                var productDetail = _Entity.Products.Where(x => x.ProductId == ProductId).FirstOrDefault();
                if (productDetail != null) {

                    if (productDetail.RawMaterial == true)
                    {
                        bool isAllowedToDelete = true;

                        //Check for raw material table
                        var searchInRawMaterial = _Entity.RawMaterails.Where(x => x.Code == productDetail.ProductCode).FirstOrDefault();
                        if (searchInRawMaterial != null)
                        {
                            isAllowedToDelete = false;
                        }
                        else
                        {
                            isAllowedToDelete = true;
                        }

                        if(isAllowedToDelete)
                        {
                            var isRawMaterialInStock = _Entity.Stocks.Where(x => x.ProductId == ProductId).FirstOrDefault();
                            if (isRawMaterialInStock != null)
                            {
                                isAllowedToDelete = false;
                            }
                            else
                            {
                                isAllowedToDelete = true;
                            }
                        }
                        //check for stock table
                        

                        if (isAllowedToDelete == true) {
                            _Entity.Products.Remove(productDetail);
                            _Entity.SaveChanges();
                            return Json("true", JsonRequestBehavior.AllowGet);
                        }


                        return Json("false", JsonRequestBehavior.AllowGet);

                    }
                    else 
                    {

                        bool isAllowedToDelete = true;

                        var checkInStockTable = _Entity.Stocks.Where(x => x.ProductId == ProductId).FirstOrDefault();
                        if (checkInStockTable != null)
                        {
                            isAllowedToDelete = false;
                        }
                        else {
                            isAllowedToDelete = true;
                        }

                        if(isAllowedToDelete)
                        {
                            var checkInRawMaterial = _Entity.RawMaterails.Where(x => x.ProductId == ProductId).ToList();
                            if (checkInRawMaterial.Count() > 0)
                            {

                                foreach (var item in checkInRawMaterial)
                                {
                                    _Entity.RawMaterails.Remove(item);
                                    _Entity.SaveChanges();
                                }

                                isAllowedToDelete = true;

                                _Entity.Products.Remove(productDetail);
                                _Entity.SaveChanges();
                            }
                        }
                        



                        if (isAllowedToDelete == false) {
                            return Json("false", JsonRequestBehavior.AllowGet);
                        }


                        return Json("true", JsonRequestBehavior.AllowGet);

                    }

                    
                }

               


              return Json("true", JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex) { 
            
              return Json("[]", JsonRequestBehavior.AllowGet);
            
            }
        }
    
    



    }

    public class vmRawMaterial
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public string text { get; set; }
    }

    public class vmProductRawMaterial
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public string text { get; set; }
    }

}