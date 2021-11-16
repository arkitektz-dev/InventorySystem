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
        public virtual JsonResult SaveStock(Stock model, FormCollection frm)
        {
            try
            {

                if (!ModelState.IsValid)
                    return Json("false", JsonRequestBehavior.AllowGet);

                if (model.QuantityOnHand == null)
                {
                    model.QuantityOnHand = 0;
                }

                if (model.QuantityReceiving == null)
                {
                    model.QuantityReceiving = 0;
                }


                _Entity.Entry(model).State = (model.StockId == 0 ? EntityState.Added : EntityState.Modified);
                _Entity.SaveChanges();
                return Json("true", JsonRequestBehavior.AllowGet);

            }
            catch (Exception)
            {
                return Json("[]", JsonRequestBehavior.AllowGet);
            }
        }

        public virtual JsonResult GetStockList()
        {
            if (Session["UserID"] != null)
            {
                var lst = _Entity.StockVs.ToList();
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
        public virtual JsonResult GetStockByBarcode(string Id)
        {

            if (Session["UserID"] != null)
            {
                var obj = _Entity.Products.AsNoTracking().Where(x => x.Barcode == Id).FirstOrDefault();
                if (obj != null)
                {
                    //Stock rec = new Stock
                    //{
                    //    ProductId = obj.ProductId
                    //};
                    var lst = _Entity.StockVs.Where(x => x.ProductId == obj.ProductId).FirstOrDefault();
                    return Json(lst, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json("false", JsonRequestBehavior.AllowGet);
                }
            }
            else
                return Json("[]");
        }
    }
}