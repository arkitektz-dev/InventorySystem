using InventorySystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;


namespace InventorySystem.Controllers
{
    public class LoginController : Controller
    {
        // GET: Login
        #region Override Default Methods
         InventorySystemEntities DB = new InventorySystemEntities();

        public bool CheckRefererURL()
        {
            if (HttpContext.Request.Headers["Referer"] == null)
                return true;
            else
                return false;
        }
        #endregion

        public virtual ActionResult Index()
        {
            if (Session["UserID"] == null)
            {
                //Session.Abandon();
                Session["UserID"] = null;
                Session["LoginID"] = null;
                Session["UserName"] = null;
                Session["PlanID"] = null;
                Session["isSessionTimeOut"] = "0";
                return View();
            }
            else
            {
                return RedirectToAction("Index", "Home");
            }
        }
        public virtual ActionResult Logout()
        {

            Session["UserID"] = null;
            Session["LoginID"] = null;
            Session["UserName"] = null;
            Session["isSessionTimeOut"] = null;
            TempData["Result"] = "Log Out Successfully";
            return RedirectToAction("Index", "Login");
        }
        [HttpPost]
        [AllowAnonymous]
        [ValidateAntiForgeryToken]
        public virtual ActionResult Index(LoginViewModel model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return View(model);
                }
                using (var _Entity = new InventorySystemEntities())
                {
                    DateTime myexp = DateTime.UtcNow;
                    var _User = _Entity.Users.Where(c => c.Email == model.UserName && c.Password == model.Password).FirstOrDefault();
                    if (_User != null)
                    {
                        Session["UserName"] = _User.UserName;
                        Session["UserID"] = _User.UserId;
                        return RedirectToAction("Index", "Home");
                    }
                    else
                    {
                        ModelState.AddModelError("", "Invalid Username Or Password.");
                        return View(model);
                    }
                }
            }
            catch (Exception e)
            {
                ModelState.AddModelError("", e.InnerException.Message.ToString());
                return View(model);
            }
        }

    }
}