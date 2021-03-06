using InventorySystem.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace InventorySystem.Controllers
{
    public class TypeController : Controller
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
        public virtual ActionResult AddEditType(int Id)
        {
            ProductType model = new ProductType();
            var lst = _Entity.ProductTypes.Where(x => x.TypeId == Id).SingleOrDefault();
            if (lst != null)
            {
                model = lst;
            }
            return PartialView("_AddEditType", model);
        }

        [HttpPost]
        public virtual JsonResult SaveTypeApi(ProductType model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return Json("false", JsonRequestBehavior.AllowGet);

                if (model.TypeId == 0)
                {
                    var obj = _Entity.ProductTypes.AsNoTracking().Where(x => x.Type == model.Type).FirstOrDefault();

                    if (obj != null)
                    {
                        return Json("false", JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    var row = _Entity.ProductTypes.Where(x => x.TypeId == model.TypeId).FirstOrDefault();
                    if (row != null)
                    {

                        _Entity.Entry(row).CurrentValues.SetValues(model);

                        _Entity.SaveChanges();

                        return Json("true", JsonRequestBehavior.AllowGet);
                    }
                }
                _Entity.Entry(model).State = (model.TypeId == 0 ? EntityState.Added : EntityState.Modified);
                _Entity.SaveChanges();


                return Json("true", JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json("[]", JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public virtual JsonResult TypeDelete(int Id)
        {
            try
            {
                var _Data = _Entity.ProductTypes.Where(x => x.TypeId == Id).SingleOrDefault();
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
        public virtual JsonResult SaveType(ProductType model, FormCollection frm)
        {
            try
            {
                if (!ModelState.IsValid)
                    return Json("false", JsonRequestBehavior.AllowGet);

                if (model.TypeId == 0)
                {
                    var obj = _Entity.ProductTypes.AsNoTracking().Where(x => x.Type == model.Type).FirstOrDefault();

                    if (obj != null)
                    {
                        return Json("flase", JsonRequestBehavior.AllowGet);
                    }
                }
                _Entity.Entry(model).State = (model.TypeId == 0 ? EntityState.Added : EntityState.Modified);
                _Entity.SaveChanges();
                return Json("true", JsonRequestBehavior.AllowGet);

            }
            catch (Exception)
            {
                return Json("[]", JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public JsonResult Typedrp()
        {
            try
            {

                var lst = _Entity.ProductTypes.Select(x => new
                {
                    ID = x.TypeId,
                    Name = x.Type
                }).ToList();
                return Json(lst, JsonRequestBehavior.AllowGet);

            }
            catch
            {
                return Json("[]", JsonRequestBehavior.AllowGet);
            }
        }
        public virtual JsonResult GetTypeList()
        {
            if (Session["UserID"] != null)
            {
                var lst = _Entity.ProductTypes.ToList();
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
    }
}