using InventorySystem.enums;
using InventorySystem.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace InventorySystem.Controllers
{
    public class POController : Controller
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
            SelectListItem item = new SelectListItem();
            var supliers = _Entity.Suppliers.ToList();
            var purchaseStatus = Enum.GetValues(typeof(PurchaseOrderStatus)).Cast<PurchaseOrderStatus>();
            var termOfPaymnet = _Entity.PaymentTerms.ToList();


            List<SelectListItem> supplierList = new List<SelectListItem>();
            List<SelectListItem> termOfPaymnetList = new List<SelectListItem>(); 
            
            foreach (var supplier in supliers)
            {
                item = new SelectListItem();
                item.Value = supplier.SupplierId.ToString();
                item.Text = supplier.Name;
                supplierList.Add(item);
            }
            item = new SelectListItem()
            {
                Text = "-- Select supplier --",
                Value = ""
            };
            supplierList.Insert(0, item);



            foreach (var paymentOfTerm in termOfPaymnet) {
                item = new SelectListItem();
                item.Value = paymentOfTerm.PaymentTerm1.ToString();
                item.Text = paymentOfTerm.Description.ToString();
                termOfPaymnetList.Add(item);
            }
            item = new SelectListItem()
            {
                Text = "-- Select payment of terms--",
                Value = ""
            };
            termOfPaymnetList.Insert(0, item);


            ViewBag.SupplierList = supplierList;
            ViewBag.PaymentTermList = termOfPaymnetList;

            return View();
        }
        public virtual ActionResult AddEditPo(int Id)
        {
            PO model = new PO();
            var lst = _Entity.POes.Where(x => x.POId == Id).SingleOrDefault();
            if (lst != null)
            {
                Session["_PoId"] = lst.POId;
                model = lst;
            }
            else
            {
                model.Date = DateTime.Now;
            }
            return PartialView("_AddEditPo", model);
        }
        [HttpPost]
        public ActionResult GetPo(int Id)
        {
            _Entity.Configuration.ProxyCreationEnabled = false;
            var lst = _Entity.POes.Where(x => x.POId == Id).Select(x => new {
                PONumber = x.PONumber,
                Date = x.Date,
                Address = x.Address,
                Status = x.Status,
                TermsOfPayment = _Entity.PaymentTerms.Where(y => y.PaymentTerm1 == x.TermsOfPayment).FirstOrDefault().Description,
                DeliveryDate = x.DeliveryDate,
                Supplier = x.Supplier,
                State = x.State,
                City = x.City,
                Country = x.Country,
                Street = x.Street,
            }).FirstOrDefault();
            return Json(lst, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public virtual JsonResult PoDelete(int Id)
        {
            try
            {
                var _Data = _Entity.POes.Where(x => x.POId == Id).SingleOrDefault();
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
        public virtual JsonResult SavePo(PO model, FormCollection frm)
        {
            try
            {

                // I need to fix this
                if (model.DeliveryDate == null)
                    model.DeliveryDate = DateTime.Now;
                //-------------------

                //if (!ModelState.IsValid)
                //    return Json("false", JsonRequestBehavior.AllowGet);

                if (model.POId == 0)
                {
                    var obj = _Entity.POes.AsNoTracking().Where(x => x.PONumber == model.PONumber).FirstOrDefault();

                    if (obj != null)
                    {
                        return Json("false", JsonRequestBehavior.AllowGet);
                    }
                }
                _Entity.Entry(model).State = (model.POId == 0 ? EntityState.Added : EntityState.Modified);
                _Entity.SaveChanges();
                return Json(model, JsonRequestBehavior.AllowGet);

            }
            catch (Exception)
            {
                return Json("[]", JsonRequestBehavior.AllowGet);
            }
        }

        public virtual JsonResult GetPOList()
        {
            
            //var lst = _Entity.POes.ToList();

            var lst = (from po in _Entity.POes
                       join supplier in _Entity.Suppliers on po.SupplierId equals supplier.SupplierId into pso
                       from p in pso.DefaultIfEmpty()
                       select new
                       {
                         po.POId,
                         po.PONumber,
                         Supplier = p.Name,
                         po.Status,
                         po.Date,
                         po.DeliveryDate,
                         po.SupplierId,
                         po.DeliveryAddress,
                         po.Discount,
                         po.TermsOfPayment,
                         po.RefNumber,
                         po.Address,
                         po.Street,
                         po.City,
                         po.State,
                         po.Country,
                         po.Description,
                         po.PostalCode,
                       }).ToList();


                GridDataSource gobj = new GridDataSource
                {
                    data = lst.ToList(),
                    length = lst.Count
                };
                return Json(gobj, JsonRequestBehavior.AllowGet);

             
        }


        public virtual JsonResult NewPurchaseOrderNumberApi()
        {

            var lastPurchaseOrder = _Entity.POes.OrderByDescending(x => x.POId).FirstOrDefault();
            var lastPurchaseOrderCode = "PO" + DateTime.Now.Year.ToString() + DateTime.Now.Month.ToString();
            if (lastPurchaseOrder == null)
                lastPurchaseOrderCode += "01";
            else
                lastPurchaseOrderCode += (Convert.ToInt32(lastPurchaseOrder.PONumber.Substring(lastPurchaseOrder.PONumber.Length - 2)) + 1).ToString("00");

            return Json(lastPurchaseOrderCode, JsonRequestBehavior.AllowGet);
        }

        public virtual JsonResult SavePurchaseOrder(vmPurchaseOrder model)
        {
            try
            {
                if (model.POId == 0)
                {
                    //new

                    PO rowPO = new PO();
                    rowPO.PONumber = model.PONumber;
                    rowPO.DeliveryDate = model.DeliveryDate;
                    rowPO.SupplierId = model.SupplierId;
                    rowPO.Status = model.Status;
                    rowPO.DeliveryAddress = model.DeliveryAddress;
                    rowPO.Discount = model.Discount;
                    rowPO.TermsOfPayment = model.TermsOfPayment;
                    rowPO.RefNumber = model.RefNumber;
                    rowPO.Address = model.Address;
                    rowPO.Street = model.Street;
                    rowPO.State = model.State;
                    rowPO.City = model.City;
                    rowPO.PostalCode = model.PostalCode;
                    rowPO.Country = model.Country;
                    rowPO.Date = DateTime.Now.Date;

                    _Entity.POes.Add(rowPO);
                    _Entity.SaveChanges();


                    return Json("true", JsonRequestBehavior.AllowGet);
                }
                else {
                    //edit

                    var modelPo = _Entity.POes.Where(x => x.POId == model.POId).FirstOrDefault();
                    if (modelPo != null) {
                        modelPo.DeliveryDate = model.DeliveryDate;
                        modelPo.SupplierId = model.SupplierId;
                        modelPo.Status = model.Status;
                        modelPo.DeliveryAddress = model.DeliveryAddress;
                        modelPo.Discount = model.Discount;
                        modelPo.TermsOfPayment = model.TermsOfPayment;
                        modelPo.RefNumber = model.RefNumber;
                        modelPo.Address = model.Address;
                        modelPo.Street = model.Street;
                        modelPo.State = model.State;
                        modelPo.City = model.City;
                        modelPo.PostalCode = model.PostalCode;
                        modelPo.Country = model.Country;
                        modelPo.Date = DateTime.Now.Date;

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


        public virtual JsonResult DeletePurchaseOrder(int PurchaseOrder) {

            var rowPurchaseOrder = _Entity.POes.Where(x => x.POId == PurchaseOrder).FirstOrDefault();
            if (rowPurchaseOrder != null)
            {
                _Entity.POes.Remove(rowPurchaseOrder);
                _Entity.SaveChanges();

                return Json("true", JsonRequestBehavior.AllowGet);
            }
            else {
                return Json("false", JsonRequestBehavior.AllowGet);
            }

        }
    }

    public class vmPurchaseOrder
    {
        public int POId { get; set; }
        public string PONumber { get; set; }
        public Nullable<System.DateTime> DeliveryDate { get; set; }
        public Nullable<int> SupplierId { get; set; }
        public string Status { get; set; }
        public string DeliveryAddress { get; set; }
        public Nullable<decimal> Discount { get; set; }
        public string TermsOfPayment { get; set; }
        public string RefNumber { get; set; }
        public string Address { get; set; }
        public string Street { get; set; }
        public string State { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string PostalCode { get; set; }
    }
}     