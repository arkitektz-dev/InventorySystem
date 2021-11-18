using InventorySystem.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Mvc;

namespace InventorySystem.Controllers
{
    public class CustomerController : Controller
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
            var users = _Entity.Users.ToList();
            var customerGroup = _Entity.CustomerGroups.ToList();
            var paymentTerms = _Entity.PaymentTerms.ToList();
            var lastCustomer = _Entity.Customers.OrderByDescending(x => x.CreateDate).FirstOrDefault();
            var lastCustomerCode = "CA" + DateTime.Now.Year.ToString() + DateTime.Now.Month.ToString();
            if (lastCustomer == null)
                lastCustomerCode += "01";
            else
                lastCustomerCode += (Convert.ToInt32(lastCustomer.Code.Substring(lastCustomer.Code.Length-2)) + 1).ToString("00");
            List<SelectListItem> usersList = new List<SelectListItem>();
            List<SelectListItem> customerGroupList = new List<SelectListItem>();
            List<SelectListItem> paymentTermsList = new List<SelectListItem>();
            SelectListItem item = new SelectListItem();

            foreach (var usr in users)
            {
                item = new SelectListItem();
                item.Value = usr.UserId.ToString();
                item.Text = usr.UserName;
                usersList.Add(item);
            }
            item = new SelectListItem() { 
                Text = "-- Select Sales Person --",
                Value = ""
            };
            usersList.Insert(0, item);

            foreach (var grp in customerGroup)
            {
                item = new SelectListItem();
                item.Value = grp.CustomerGroup1;
                item.Text = grp.CustomerGroup1;
                customerGroupList.Add(item);
            }
            item = new SelectListItem()
            {
                Text = "-- Select Customer Group --",
                Value = ""
            };
            customerGroupList.Insert(0, item);

            foreach (var term in paymentTerms)
            {
                item = new SelectListItem();
                item.Value = term.PaymentTerm1;
                item.Text = term.PaymentTerm1;
                paymentTermsList.Add(item);
            }
            item = new SelectListItem()
            {
                Text = "-- Select Payment Terms --",
                Value = ""
            };
            paymentTermsList.Insert(0, item);

            ViewBag.Users = usersList;
            ViewBag.CustomerGroup = customerGroupList;
            ViewBag.PaymentTerms = paymentTermsList;
            ViewBag.lastCustomerCode = lastCustomerCode;

            return View();
        }
        public virtual ActionResult AddEditCustomer(int Id)
        {
            Customer model = new Customer();
            var lst = _Entity.Customers.Where(x => x.CustomerId == Id).SingleOrDefault();
            if (lst != null)
            {
                model = lst;
            }
            return PartialView("_AddEditCustomer", model);
        }
        [HttpPost]
        public virtual JsonResult CustomerDelete(int Id)
        {
            try
            {
                var _Data = _Entity.Customers.Where(x => x.CustomerId == Id).SingleOrDefault();
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
        public virtual JsonResult SaveCustomerApi(Customer model)
        {
            try
            {
                if (model.CustomerId == 0)
                {
                    model.CreateDate = DateTime.Now;
                    model.Active = true;
                    var obj = _Entity.Customers.AsNoTracking().Where(x => x.Name == model.Name).FirstOrDefault();

                    if (obj != null)
                    {
                        return Json("false", JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    var row = _Entity.Customers.Where(x => x.CustomerId == model.CustomerId).FirstOrDefault();
                    if (row != null)
                    {

                        _Entity.Entry(row).CurrentValues.SetValues(model);

                        _Entity.SaveChanges();

                        return Json("true", JsonRequestBehavior.AllowGet);
                    }
                }
                _Entity.Entry(model).State = (model.CustomerId == 0 ? EntityState.Added : EntityState.Modified);
                _Entity.SaveChanges();


                return Json("true", JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json("[]", JsonRequestBehavior.AllowGet);
            }

        }

        [HttpPost]
        public virtual JsonResult SaveCustomer(Customer model, FormCollection frm)
        {
            try
            {
                if (!ModelState.IsValid)
                    return Json("false", JsonRequestBehavior.AllowGet);

                if (model.CustomerId == 0)
                {
                    var obj = _Entity.Customers.AsNoTracking().Where(x => x.Name == model.Name).FirstOrDefault();

                    if (obj != null)
                    {
                        return Json("false", JsonRequestBehavior.AllowGet);
                    }
                }
                _Entity.Entry(model).State = (model.CustomerId == 0 ? EntityState.Added : EntityState.Modified);
                _Entity.SaveChanges();
                return Json("true", JsonRequestBehavior.AllowGet);

            }
            catch (Exception)
            {
                return Json("[]", JsonRequestBehavior.AllowGet);
            }
        }

        public virtual JsonResult GetCustomerList()
        {
            if (Session["UserID"] != null)
            {
                var lst = _Entity.Customers.ToList();
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
        public JsonResult Customerdrp()
        {
            try
            {

                var lst = _Entity.Customers.Select(x => new
                {
                    ID = x.CustomerId,
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