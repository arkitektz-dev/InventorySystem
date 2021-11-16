﻿using InventorySystem.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace InventorySystem.Controllers
{
    public class PoDetailController : Controller
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

        public ActionResult Index(int Id)
        {
            Session["_PoId"] = Id.ToString();
            var lst = _Entity.PODetailVs.Where(x => x.POId == Id).ToList();
            return View(lst);
        }
        public virtual ActionResult AddEditPoItem(int Id)
        {
            PODetail model = new PODetail();
            var lst = _Entity.PODetails.Where(x => x.PODetailId == Id).SingleOrDefault();
            if (lst != null)
            {
                model = lst;
            }
            return PartialView("_AddEditPoItem", model);
        }
        [HttpPost]
        public virtual JsonResult PoItemDelete(int Id)
        {
            try
            {
                var _Data = _Entity.PODetails.Where(x => x.PODetailId == Id).SingleOrDefault();
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
        //public virtual JsonResult SavePoItem(PODetail model, FormCollection frm)
        public virtual JsonResult SavePoItem(PODetail model)
        {
            try
            {
                int PoId = Convert.ToInt32(Session["_PoId"].ToString());
                if (!ModelState.IsValid)
                    return Json("false", JsonRequestBehavior.AllowGet);

                //if (model.PODetailId == 0)
                //{
                    model.POId = PoId;
                //}

                //(quantity * Price) * Discount
                model.Total = (model.Quantity * model.Price) * model.Discount;

                _Entity.Entry(model).State = (model.PODetailId == 0 ? EntityState.Added : EntityState.Modified);
                _Entity.SaveChanges();
                return Json("true", JsonRequestBehavior.AllowGet);

            }
            catch (Exception)
            {
                return Json("false", JsonRequestBehavior.AllowGet);
            }
        }

        public virtual JsonResult GetPOItemsList(int Id)
        {
            Session["_PoId"] = Id.ToString();
            if (Session["UserID"] != null)
            {
                var lst = _Entity.PODetailVs.Where(x => x.POId == Id).ToList();
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