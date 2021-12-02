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

        
    }
}