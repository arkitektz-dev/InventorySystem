using InventorySystem.Models;
using System;
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

        // GET: Customer
        public ActionResult Index()
        {
            return View();
        }
    }
}