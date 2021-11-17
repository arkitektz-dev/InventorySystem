using InventorySystem.Models;
using System;
using System.Data.Entity;
using System.Linq;
using System.Web.Mvc;

namespace InventorySystem.Controllers
{
    public class WarehouseController : Controller
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
        public virtual ActionResult AddEditWarehouse(int Id)
        {
            Warehouse model = new Warehouse();
            var lst = _Entity.Warehouses.Where(x => x.WarehouseId == Id).SingleOrDefault();
            if (lst != null)
            {
                model = lst;
            }
            return PartialView("_AddEditWarehouse", model);
        }
        [HttpPost]
        public virtual JsonResult WarehouseDelete(int Id)
        {
            try
            {
                var _Data = _Entity.Warehouses.Where(x => x.WarehouseId == Id).SingleOrDefault();
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
        public virtual JsonResult SaveWarehouseApi(Warehouse model)
        {
            try
            {
                if (!ModelState.IsValid)
                    return Json("false", JsonRequestBehavior.AllowGet);

                if (model.WarehouseId == 0)
                {
                    var obj = _Entity.Warehouses.AsNoTracking().Where(x => x.Name == model.Name).FirstOrDefault();

                    if (obj != null)
                    {
                        return Json("false", JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    var row = _Entity.Warehouses.Where(x => x.WarehouseId == model.WarehouseId).FirstOrDefault();
                    if (row != null)
                    {

                        _Entity.Entry(row).CurrentValues.SetValues(model);

                        _Entity.SaveChanges();

                        return Json("true", JsonRequestBehavior.AllowGet);
                    }
                }
                _Entity.Entry(model).State = (model.WarehouseId == 0 ? EntityState.Added : EntityState.Modified);
                _Entity.SaveChanges();


                return Json("true", JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {
                return Json("[]", JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public virtual JsonResult SaveWarhouse(Warehouse model, FormCollection frm)
        {
            try
            {
                if (!ModelState.IsValid)
                    return Json("false", JsonRequestBehavior.AllowGet);

                if (model.WarehouseId == 0)
                {
                    var obj = _Entity.Warehouses.AsNoTracking().Where(x => x.Name == model.Name).FirstOrDefault();

                    if (obj != null)
                    {
                        return Json("false", JsonRequestBehavior.AllowGet);
                    }
                }
                _Entity.Entry(model).State = (model.WarehouseId == 0 ? EntityState.Added : EntityState.Modified);
                _Entity.SaveChanges();
                return Json("true", JsonRequestBehavior.AllowGet);

            }
            catch (Exception)
            {
                return Json("[]", JsonRequestBehavior.AllowGet);
            }
        }

        public virtual JsonResult GetWarehouseList()
        {
            if (Session["UserID"] != null)
            {
                var lst = _Entity.Warehouses.ToList();
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
        public JsonResult Warehousedrp()
        {
            try
            {

                var lst = _Entity.Warehouses.Select(x => new
                {
                    ID = x.WarehouseId,
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