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
        public virtual JsonResult SaveProduct(Product model, FormCollection frm)
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

        public virtual JsonResult GetProductById(int Id)
        {
            var _Data = _Entity.Products.Where(x => x.ProductId == Id).SingleOrDefault();
            return Json(_Data, JsonRequestBehavior.AllowGet);
        }

        public virtual JsonResult GetProductList()
        {
            if (Session["UserID"] != null)
            {
                var lst = _Entity.ProductVs.ToList();
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
    }
}