using InventorySystem.Dtos;
using InventorySystem.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;

namespace InventorySystem.Controllers
{
    public class HomeController : Controller
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
        // GET: Home
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public   JsonResult PieChartDraw()
        {
            List<PieData> pieDatas = new List<PieData>();
            var result = _Entity.ProductTypes.ToList();
            var resultListRazer = string.Empty;
            string resultList = "10, 35, 15, 40";
            foreach (var item in result)
            {
                resultListRazer = resultListRazer + item.Type + ",";
            }
            PieData pieData1 = new PieData();
            pieData1.Count_ListRazer = resultList.TrimEnd(',').Trim().Split(',').ToList();
            pieData1.Status_ListRazer = resultListRazer.TrimEnd(',').Trim().Split(',').ToList();
            pieDatas.Add(pieData1);
           
          return Json (pieDatas, JsonRequestBehavior.AllowGet );
        }

        public virtual JsonResult GetRealTimeList()
        {
            if (Session["UserID"] != null)
            {
                var lst = _Entity.ProductQtyVs.ToList();
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

        public virtual JsonResult DashboardTopCard() {

            DashboardDtos model = new DashboardDtos();
            model.PurchaseOrder = _Entity.POes.Where(x => x.Status == "Completed").Count();
            model.SalesOrder = _Entity.SOes.Where(x => x.SoStatus == "Completed").Count();
            model.Receiving = _Entity.Receivings.Count();
            model.Shipment = _Entity.Shipments.Count();



            return Json(model, JsonRequestBehavior.AllowGet);
        }

        public virtual JsonResult GetSalesData()
        {
            DashboardChart model = new DashboardChart();

            model.Label = _Entity.SOes.OrderByDescending(x => x.Id).Take(10).Select(x => x.SoDate.ToString()).ToList();
            model.Value = _Entity.SOes.OrderByDescending(x => x.Id).Take(10).Select(x => x.Total.ToString()).ToList();
             


            return Json(model, JsonRequestBehavior.AllowGet);
        }

    }


    public class PieData
    {
        public List<string> Count_ListRazer { get; set; } // store count lists 
        public List<string> Status_ListRazer { get; set; } // store label lists
    }
}