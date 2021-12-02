using InventorySystem.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace InventorySystem.Controllers
{
    public class ReceivingController : Controller
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

        // GET: Receiving
        public ActionResult Index()
        {
            var purchaseOrders = _Entity.POes.Where(x => x.Status == "Open").ToList();
            ViewBag.PurchaseOrders = purchaseOrders;

            return View();
        }

        public JsonResult GenerateGSRNNumber()
        {
            var lastReceiving = _Entity.Receivings.OrderByDescending(x => x.ReceivingId).FirstOrDefault();
            var lastReceivingGSRNNumber = DateTime.Now.Year.ToString() + DateTime.Now.Month.ToString() + DateTime.Now.Day.ToString() + "#GSRN";
            if (lastReceiving == null)
                lastReceivingGSRNNumber += "01";
            else
                lastReceivingGSRNNumber += (Convert.ToInt32(lastReceiving.GSRNNumber.Substring(lastReceiving.GSRNNumber.Length - 2)) + 1).ToString("00");

            return Json(lastReceivingGSRNNumber, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetReceivingList()
        {
            var lst = (from re in _Entity.Receivings
                       join purchaseOrder in _Entity.POes on re.POId equals purchaseOrder.POId into pso
                       from p in pso.DefaultIfEmpty()
                       select new
                       {
                           re.ReceivingId,
                           re.GSRNNumber,
                           re.GSRNDate,
                           re.VendorDONumber,
                           re.VendorInvoiceNumber,
                           re.TotalInvoice,
                           p.POId,
                           p.PONumber
                       }).ToList();


            GridDataSource gobj = new GridDataSource
            {
                data = lst.ToList(),
                length = lst.Count
            };
            return Json(gobj, JsonRequestBehavior.AllowGet);
        }

        public JsonResult SaveReceiving(ReceivingViewModel model)
        {
            try
            {
                if (model.ReceivingId == 0)
                {
                    //new

                    Receiving rowReceiving = new Receiving
                    {
                        GSRNNumber = model.GSRNNumber,
                        GSRNDate = model.GSRNDate,
                        VendorDONumber = model.VendorDONumber,
                        VendorInvoiceNumber = model.VendorInvoiceNumber,
                        TotalInvoice = model.TotalInvoice,
                        POId = model.POId
                    };

                    var purchaseOrder = _Entity.POes.Where(x => x.POId == model.POId).FirstOrDefault();
                    if(purchaseOrder != null) {
                        purchaseOrder.Status = "Completed";
                        _Entity.SaveChanges();
                    }


                    _Entity.Receivings.Add(rowReceiving);
                    _Entity.SaveChanges();


                    return Json("true", JsonRequestBehavior.AllowGet);
                }
                else
                {
                    //edit

                    var modelReceiving = _Entity.Receivings.Where(x => x.ReceivingId == model.ReceivingId).FirstOrDefault();
                    if (modelReceiving != null)
                    {
                        modelReceiving.GSRNNumber = model.GSRNNumber;
                        modelReceiving.GSRNDate = model.GSRNDate;
                        modelReceiving.VendorDONumber = model.VendorDONumber;
                        modelReceiving.VendorInvoiceNumber = model.VendorInvoiceNumber;
                        modelReceiving.TotalInvoice = model.TotalInvoice;
                        modelReceiving.POId = model.POId;

                        _Entity.SaveChanges();

                        return Json("true", JsonRequestBehavior.AllowGet);


                    }


                }


                return Json("true", JsonRequestBehavior.AllowGet);
            }
            catch (Exception)
            {
                return Json("false", JsonRequestBehavior.AllowGet);
            }
        }

        public JsonResult DeleteReceiving(int ReceivingId)
        {

            var rowReceiving = _Entity.Receivings.Where(x => x.ReceivingId == ReceivingId).FirstOrDefault();
            if (rowReceiving != null)
            {
                _Entity.Receivings.Remove(rowReceiving);
                _Entity.SaveChanges();

                return Json("true", JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json("false", JsonRequestBehavior.AllowGet);
            }

        }

        public JsonResult GetTotalInvoiceByPurchaseOrder(int poId)
        {
            _Entity.Configuration.ProxyCreationEnabled = false;
            var purchaseOrder = _Entity.POes.Where(x => x.POId == poId).FirstOrDefault();
            return Json(purchaseOrder.Total, JsonRequestBehavior.AllowGet);
        }

        public class ReceivingViewModel
        {
            public int ReceivingId { get; set; }

            public string GSRNNumber { get; set; }

            public DateTime? GSRNDate { get; set; }

            public string VendorDONumber { get; set; }

            public string VendorInvoiceNumber { get; set; }

            public decimal TotalInvoice { get; set; }

            public int POId { get; set; }
        }

    }
}