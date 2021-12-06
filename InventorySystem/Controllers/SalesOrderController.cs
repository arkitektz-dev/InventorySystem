using InventorySystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace InventorySystem.Controllers
{
    public class SalesOrderController : Controller
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
            var customers = _Entity.Customers.ToList();
            var contactPersons = _Entity.Contacts.ToList();

            List<SelectListItem> usersList = new List<SelectListItem>();
            List<SelectListItem> customersList = new List<SelectListItem>();
            List<SelectListItem> contactPersonList = new List<SelectListItem>();


            SelectListItem item = new SelectListItem();
            
            foreach (var usr in users)
            {
                item = new SelectListItem();
                item.Value = usr.UserId.ToString();
                item.Text = usr.UserName;
                usersList.Add(item);
            }
            item = new SelectListItem()
            {
                Text = "-- Select Sales Person --",
                Value = ""
            };
            usersList.Insert(0, item);

            foreach (var cust in customers)
            {
                item = new SelectListItem();
                item.Value = cust.CustomerId.ToString();
                item.Text = cust.Code;
                customersList.Add(item);
            }
            item = new SelectListItem()
            {
                Text = "-- Select Customer Code --",
                Value = ""
            };
            customersList.Insert(0, item);

            foreach (var cust in contactPersons)
            {
                item = new SelectListItem();
                item.Value = cust.CustomerId.ToString();
                item.Text = cust.FirstName + " " + cust.LastName;
                contactPersonList.Add(item);
            }
            item = new SelectListItem()
            {
                Text = "-- Select Contact Person --",
                Value = ""
            };
            contactPersonList.Insert(0, item);

            ViewBag.Users = usersList;
            ViewBag.CustomerCode = customersList;
            ViewBag.ContactPerson = contactPersonList;
            return View();
        }

        public JsonResult GetAssignedSalesCustomer(int SalesPersonId)
        {
            _Entity.Configuration.ProxyCreationEnabled = false;
            List<Customer> listCustomer = new List<Customer>();

            var customers = _Entity.Customers.Where(x => x.UserId == SalesPersonId).ToList();
            if (customers.Count() > 0) {
                foreach (var item in customers) { 
                    var findCustomer = _Entity.Customers.Where(x => x.CustomerId == item.CustomerId).FirstOrDefault();
                    if (findCustomer != null) {
                        listCustomer.Add(findCustomer);
                    }

                    return Json(customers, JsonRequestBehavior.AllowGet);
                }
            }
            return Json("[]", JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetCustomerContact(int CustomerId) {

            List<Contact> listContact = new List<Contact>();
            var contact = _Entity.Contacts.Where(x => x.CustomerId == CustomerId).ToList();
            if (contact.Count() > 0) {
                foreach (var item in contact) {
                    listContact.Add(item);
                }

                return Json(listContact, JsonRequestBehavior.AllowGet);
            }

            return Json("[]", JsonRequestBehavior.AllowGet);
        }


        public virtual JsonResult NewSaleOrderNumberApi()
        {

            var lastSaleOrder = _Entity.SOes.OrderByDescending(x => x.Id).FirstOrDefault();
            var lastSaleOrderCode = "SO" + DateTime.Now.Year.ToString() + DateTime.Now.Month.ToString();
            if (lastSaleOrder == null)
                lastSaleOrderCode += "01";
            else
                lastSaleOrderCode += (Convert.ToInt32(lastSaleOrder.SoNumber.Substring(lastSaleOrder.SoNumber.Length - 2)) + 1).ToString("00");

            return Json(lastSaleOrderCode, JsonRequestBehavior.AllowGet);
        }

        public virtual JsonResult GetSOList()
        {

            //var lst = _Entity.POes.ToList();

            var lst = (from so in _Entity.SOes
                       join customer in _Entity.Customers on so.CustomerCodeId equals customer.CustomerId into pso
                       from p in pso.DefaultIfEmpty()
                       select new
                       {
                           so.Id,
                           so.SoNumber,
                           so.CustomerCodeId,
                           so.SoStatus,
                           so.CustomerReference
                       }).ToList();


            GridDataSource gobj = new GridDataSource
            {
                data = lst.ToList(),
                length = lst.Count
            };
            return Json(gobj, JsonRequestBehavior.AllowGet);


        }

        public virtual JsonResult GetSalesDetail(int Id) {

            var row = _Entity.SOes.Where(x => x.Id == Id).FirstOrDefault();
            return Json(row, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult AddSalesOrder(SO param) {

            if (param != null) {

                if (param.Id == 0) {

                    _Entity.SOes.Add(param);
                    _Entity.SaveChanges();

                    return Json("true", JsonRequestBehavior.AllowGet);
                }
                else
                {
                    //Edit


                    var row = _Entity.SOes.Where(x => x.Id == param.Id).FirstOrDefault();
                    if (row != null)
                    {

                        _Entity.Entry(row).CurrentValues.SetValues(param);

                        _Entity.SaveChanges();

                        return Json("true", JsonRequestBehavior.AllowGet);
                    }
                     

                }

                 
            }

            return Json("[]", JsonRequestBehavior.AllowGet);
        }


        public JsonResult DeleteSalesOrder(int Id) {

            var rowSaleOrder = _Entity.SOes.Where(x => x.Id == Id).FirstOrDefault();
            if (rowSaleOrder != null) {
                _Entity.SOes.Remove(rowSaleOrder);
                _Entity.SaveChanges();
                return Json("true", JsonRequestBehavior.AllowGet);
            }

            return Json("false", JsonRequestBehavior.AllowGet);
        }
    }
}