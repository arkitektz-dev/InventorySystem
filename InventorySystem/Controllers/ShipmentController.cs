using InventorySystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace InventorySystem.Controllers
{
    public class ShipmentController : Controller
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

        // GET: Shipment
        public ActionResult Index()
        {
            SelectListItem item = new SelectListItem();

            var completeSalesOrder = _Entity.SOes.Where(x => x.SoStatus == "Completed").ToList();
            var duplicateSalesOrder = _Entity.SOes.Where(x => x.SoStatus == "Completed").ToList(); 

            foreach (var saleOrder in completeSalesOrder) {
                var isUSed = _Entity.Shipments.Where(x => x.SalesOrderId == saleOrder.Id).FirstOrDefault();
                if (isUSed != null) {
                    duplicateSalesOrder.Remove(saleOrder);
                }
            }


            var salesOrderList = duplicateSalesOrder.ToList();

            var Listcouriers = _Entity.Couriers.ToList();

            List<SelectListItem> salesList = new List<SelectListItem>();
            List<SelectListItem> couriersList = new List<SelectListItem>();

            foreach (var saleOrder in salesOrderList)
            {
                item = new SelectListItem();
                item.Value = saleOrder.Id.ToString();
                item.Text = saleOrder.SoNumber;
                salesList.Add(item);
            }
            item = new SelectListItem()
            {
                Text = "-- Select SO Name --",
                Value = ""
            };
            salesList.Insert(0, item);

            foreach (var courier in Listcouriers)
            {
                item = new SelectListItem();
                item.Value = courier.Id.ToString();
                item.Text = courier.Name;
                couriersList.Add(item);
            }
            item = new SelectListItem()
            {
                Text = "-- Select couriersList Name --",
                Value = ""
            };
            couriersList.Insert(0, item);



            ViewBag.SalesOrderList = salesList;
            ViewBag.CourierList = couriersList;


            return View();
        }

        public virtual JsonResult NewShipmentNumberApi()
        {

            var lastShipmnet = _Entity.Shipments.OrderByDescending(x => x.Id).FirstOrDefault();
            var lastShipmnetOrderCode = "SH" + DateTime.Now.Year.ToString() + DateTime.Now.Month.ToString();
            if (lastShipmnet == null)
                lastShipmnetOrderCode += "01";
            else
                lastShipmnetOrderCode += (Convert.ToInt32(lastShipmnet.DONumber.Substring(lastShipmnet.DONumber.Length - 2)) + 1).ToString("00");

            return Json(lastShipmnetOrderCode, JsonRequestBehavior.AllowGet);
        }

        public virtual JsonResult GetProductList(int SalesId)
        {
            if (SalesId != 0)
            {
                //var lst = _Entity.SODetails.Where(x => x.SOId == SalesId).ToList();

                var lst = (from detail in _Entity.SODetails
                           join product in _Entity.Products on detail.ProductId equals product.ProductId
                           where detail.SOId == SalesId
                           select new
                           {
                               product.ProductCode,
                               product.ProductName,
                               detail.Quantity
                           }).ToList();

                GridDataSource gobj = new GridDataSource
                {
                    data = lst.ToList(),
                    length = lst.Count
                };

                return Json(gobj, JsonRequestBehavior.AllowGet);

            }
            return Json("[]", JsonRequestBehavior.AllowGet);
        }

        public virtual JsonResult GetShipmentList()
        {
            var lst = (from shipment in _Entity.Shipments
                       join saleOrder in _Entity.SOes on shipment.SalesOrderId equals saleOrder.Id
                       join customer in _Entity.Customers on saleOrder.CustomerCodeId equals customer.CustomerId
                       select new
                       {
                           shipment.Id,
                           shipment.DONumber,
                           shipment.DODate,
                           shipment.Status,
                           saleOrder.SoNumber,
                           customer.Name

                       }).ToList();

            GridDataSource gobj = new GridDataSource
            {
                data = lst.ToList(),
                length = lst.Count
            };

            return Json(gobj, JsonRequestBehavior.AllowGet);
        }

        public virtual JsonResult DeleteShipmnetById(int Shipmnet)
        {
            var row = _Entity.Shipments.Where(x => x.Id == Shipmnet).FirstOrDefault();
            _Entity.Shipments.Remove(row);
            _Entity.SaveChanges();

            return Json("true", JsonRequestBehavior.AllowGet);
        }

        public virtual JsonResult GetShipmnetById(int Shipment)
        {

            var row = _Entity.Shipments.Where(x => x.Id == Shipment).FirstOrDefault();

            return Json(row, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public virtual JsonResult AddEditProduct(Shipment model)
        {
            if (model.Id == 0)
            {
                //Create

                _Entity.Shipments.Add(model);
                _Entity.SaveChanges();


                return Json("true", JsonRequestBehavior.AllowGet);
            }
            else
            {
                //Edit

                var row = _Entity.Shipments.Where(x => x.Id == model.Id).FirstOrDefault();
                if (row != null)
                {

                    _Entity.Entry(row).CurrentValues.SetValues(model);

                    _Entity.SaveChanges();

                    return Json("true", JsonRequestBehavior.AllowGet);
                }


                return Json("true", JsonRequestBehavior.AllowGet);

            }

        }

        public virtual ActionResult GetSalesOrderList()
        {
            SelectListItem item = new SelectListItem();

            var salesOrderList = _Entity.SOes.Where(x => x.SoStatus == "Completed").ToList();

            List<SelectListItem> salesList = new List<SelectListItem>();

            foreach (var saleOrder in salesOrderList)
            {
                item = new SelectListItem();
                item.Value = saleOrder.Id.ToString();
                item.Text = saleOrder.SoNumber;
                salesList.Add(item);
            }
            item = new SelectListItem()
            {
                Text = "-- Select SO Name --",
                Value = ""
            };
            salesList.Insert(0, item);


            ViewBag.SalesOrderList = salesList; 
            return View();
        }

        public virtual ActionResult GetNewSalesOrderList()
        {

            SelectListItem item = new SelectListItem();

            var completeSalesOrder = _Entity.SOes.Where(x => x.SoStatus == "Completed").ToList();
            var duplicateSalesOrder = _Entity.SOes.Where(x => x.SoStatus == "Completed").ToList();

            foreach (var saleOrder in completeSalesOrder)
            {
                var isUSed = _Entity.Shipments.Where(x => x.SalesOrderId == saleOrder.Id).FirstOrDefault();
                if (isUSed != null)
                {
                    duplicateSalesOrder.Remove(saleOrder);
                }
            }


            var salesOrderList = duplicateSalesOrder.ToList();

            List<SelectListItem> salesList = new List<SelectListItem>();

            foreach (var saleOrder in salesOrderList)
            {
                item = new SelectListItem();
                item.Value = saleOrder.Id.ToString();
                item.Text = saleOrder.SoNumber;
                salesList.Add(item);
            }
            item = new SelectListItem()
            {
                Text = "-- Select SO Name --",
                Value = ""
            };
            salesList.Insert(0, item);





            ViewBag.SalesOrderList = salesList;

            return View();
        }

    }

}