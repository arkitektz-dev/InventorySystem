using InventorySystem.Models;
using System;
using System.Data.Entity;
using System.Linq;
using System.Web.Mvc;

namespace InventorySystem.Controllers
{
    public class SupplierController : Controller
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
        public virtual ActionResult AddEditSupplier(int Id)
        {
            Supplier model = new Supplier();
            var lst = _Entity.Suppliers.Where(x => x.SupplierId == Id).SingleOrDefault();
            if (lst != null)
            {
                model = lst;
            }
            return PartialView("_AddEditSupplier", model);
        }
        [HttpPost]
        public virtual JsonResult SupplierDelete(int Id)
        {
            try
            {
                var _Data = _Entity.Suppliers.Where(x => x.SupplierId == Id).SingleOrDefault();
                if (_Data != null)
                {
                    _Entity.Entry(_Data).State = EntityState.Deleted;
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
        public virtual JsonResult SaveSupplierApi(Supplier model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return Json("false", JsonRequestBehavior.AllowGet);

                if (model.SupplierId == 0)
                {
                    var obj = _Entity.Suppliers.AsNoTracking().Where(x => x.Name == model.Name).FirstOrDefault();

                    if (obj != null)
                    {
                        return Json("false", JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    var row = _Entity.Suppliers.Where(x => x.SupplierId == model.SupplierId).FirstOrDefault();
                    if (row != null)
                    {

                        _Entity.Entry(row).CurrentValues.SetValues(model);

                        _Entity.SaveChanges();

                        return Json("true", JsonRequestBehavior.AllowGet);
                    }
                }
                _Entity.Entry(model).State = (model.SupplierId == 0 ? EntityState.Added : EntityState.Modified);
                _Entity.SaveChanges();


                return Json("true", JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {
                return Json("[]", JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public virtual JsonResult SaveSupplier(Supplier model, FormCollection frm)
        {
            try
            {
                if (!ModelState.IsValid)
                    return Json("false", JsonRequestBehavior.AllowGet);

                if (model.SupplierId == 0)
                {
                    var obj = _Entity.Suppliers.AsNoTracking().Where(x => x.Name == model.Name).FirstOrDefault();

                    if (obj != null)
                    {
                        return Json("false", JsonRequestBehavior.AllowGet);
                    }
                }
                _Entity.Entry(model).State = (model.SupplierId == 0 ? EntityState.Added : EntityState.Modified);
                _Entity.SaveChanges();
                return Json("true", JsonRequestBehavior.AllowGet);

            }
            catch (Exception)
            {
                return Json("[]", JsonRequestBehavior.AllowGet);
            }
        }

        public virtual JsonResult GetSupplierList()
        {
            if (Session["UserID"] != null)
            {
                _Entity.Configuration.ProxyCreationEnabled = false;
                var lst = _Entity.Suppliers.ToList();
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
        public JsonResult Supplierdrp()
        {
            try
            {

                var lst = _Entity.Suppliers.Select(x => new
                {
                    ID = x.SupplierId,
                    Name = x.Name
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