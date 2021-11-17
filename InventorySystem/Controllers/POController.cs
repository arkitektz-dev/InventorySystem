using InventorySystem.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace InventorySystem.Controllers
{
    public class POController : Controller
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
        public virtual ActionResult AddEditPo(int Id)
        {
            PO model = new PO();
            var lst = _Entity.POes.Where(x => x.POId == Id).SingleOrDefault();
            if (lst != null)
            {
                Session["_PoId"] = lst.POId;
                model = lst;
            }
            else
            {
                model.Date = DateTime.Now;
            }
            return PartialView("_AddEditPo", model);
        }
        [HttpPost]
        public ActionResult GetPo(int Id)
        {
            var lst = _Entity.PoVs.Where(x => x.POId == Id).SingleOrDefault();
            return Json(lst, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public virtual JsonResult PoDelete(int Id)
        {
            try
            {
                var _Data = _Entity.POes.Where(x => x.POId == Id).SingleOrDefault();
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
        public virtual JsonResult SavePo(PO model, FormCollection frm)
        {
            try
            {

                // I need to fix this
                if (model.DeliveryDate == null)
                    model.DeliveryDate = DateTime.Now;
                //-------------------

                //if (!ModelState.IsValid)
                //    return Json("false", JsonRequestBehavior.AllowGet);

                if (model.POId == 0)
                {
                    var obj = _Entity.POes.AsNoTracking().Where(x => x.PONumber == model.PONumber).FirstOrDefault();

                    if (obj != null)
                    {
                        return Json("false", JsonRequestBehavior.AllowGet);
                    }
                }
                _Entity.Entry(model).State = (model.POId == 0 ? EntityState.Added : EntityState.Modified);
                _Entity.SaveChanges();
                return Json(model, JsonRequestBehavior.AllowGet);

            }
            catch (Exception)
            {
                return Json("[]", JsonRequestBehavior.AllowGet);
            }
        }

        public virtual JsonResult GetPOList()
        {
            if (Session["UserID"] != null)
            {
                var lst = _Entity.POes.ToList();
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