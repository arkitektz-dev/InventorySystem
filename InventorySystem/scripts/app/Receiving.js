$(function () {
    bindDatatable();

    $('#addReceiving').click(openNewForm);

    $('#closeButton').click(hideForm);

    $('#btnSubmit').click(insertReceiving)

    $("#POId").change(function () {
        const purchaseOrderId = this.value;
        getTotalInvoiceByPurchaseOrder(purchaseOrderId);
    });

});

function openNewForm() {
    getGSRNNumber();

    $('#ReceivingLists').hide();
    $('#AddReceiving').show();
}


function hideForm() {
    $('#ReceivingLists').show();
    $('#AddReceiving').hide();
}

function insertReceiving() {
    let isFormComplete = true;
    const gsrnNumber = $('#GSRNNumber').val();
    const purchaseOrderId = $('#POId').val();
    const gsrnDate = $('#GSRNDate').val();
    const vendorDONumber = $('#VendorDONumber').val();
    const vendorInvoiceNumber = $('#VendorInvoiceNumber').val();
    const totalInvoice = $('#TotalInvoice').val();

    if (gsrnNumber === '') {
        $('#Val_GSRNNumber').html("Please enter GSRN Number");
        $('#GSRNNumber').addClass("show-warning");
        isFormComplete = false;
    } else {
        $('#Val_GSRNNumber').html("");
        $('#GSRNNumber').removeClass("show-warning");
    }

    if (purchaseOrderId === '') {
        $('#Val_POId').html("Please enter Purchase Order");
        $('#POId').addClass("show-warning");
        isFormComplete = false;
    } else {
        $('#Val_POId').html("");
        $('#POId').removeClass("show-warning");
    }

    if (gsrnDate === '') {
        $('#Val_GSRNDate').html("Please enter GSRN Date");
        $('#GSRNDate').addClass("show-warning");
        isFormComplete = false;
    } else {
        $('#Val_GSRNDate').html("");
        $('#GSRNDate').removeClass("show-warning");
    }

    if (vendorDONumber === '') {
        $('#Val_VendorDONumber').html("Please enter Vendor DO Number");
        $('#VendorDONumber').addClass("show-warning");
        isFormComplete = false;
    } else {
        $('#Val_VendorDONumber').html("");
        $('#VendorDONumber').removeClass("show-warning");
    }

    if (vendorInvoiceNumber === '') {
        $('#Val_VendorInvoiceNumber').html("Please enter GSRN Date");
        $('#VendorInvoiceNumber').addClass("show-warning");
        isFormComplete = false;
    } else {
        $('#Val_VendorInvoiceNumber').html("");
        $('#VendorInvoiceNumber').removeClass("show-warning");
    }

    if (isFormComplete == false) {
        return;
    }


    var row = {
        GSRNNumber: gsrnNumber,
        POId: purchaseOrderId,
        GSRNDate: gsrnDate,
        VendorDONumber: vendorDONumber,
        VendorInvoiceNumber: vendorInvoiceNumber,
        TotalInvoice: totalInvoice
    };

    $.ajax({
        type: "POST",
        url: "/Receiving/SaveReceiving",
        data: { model: row },
        success: function (response) {
            if (response == "true") {
                setTimeout(() => {
                    toastr.success('Your record is saved');
                    hideForm();
                    bindDatatable();
                }, 50)
            }
        },
        failure: function (response) {
            console.error(response.responseText);
        },
        error: function (response) {
            console.error(response.responseText);
        }
    });


}

function getGSRNNumber() {
    $.ajax({
        type: "GET",
        url: "/Receiving/GenerateGSRNNumber",
        success: function (response) {
            $('#GSRNNumber').val(response);
        },
        failure: function (response) {
            console.error(response.responseText);
        },
        error: function (response) {
            console.error(response.responseText);
        }
    })
}

function getTotalInvoiceByPurchaseOrder(purchaseOrderId) {
    $.ajax({
        type: "GET",
        url: "/Receiving/GetTotalInvoiceByPurchaseOrder/" + purchaseOrderId,
        success: function (response) {
            $('#TotalInvoice').val(response);
        },
        failure: function (response) {
            console.error(response.responseText);
        },
        error: function (response) {
            console.error(response.responseText);
        }
    })
}

function bindDatatable() {
    $('#ReceivingList').html("");
    $('#ReceivingList').append('<table id="GridReceivingList" class="table table-striped dataTable no-footer" width="100%"></table>');
    $('#GridReceivingList').DataTable({
        sAjaxSource: '/Receiving/GetReceivingList',
        columns: [
            { title: "Id", data: "ReceivingId", visible: false },
            { title: "GSRN #", data: "GSRNNumber" },
            { title: "GSRN Date", data: "GSRNDate", render: function (value) { return parseJsonDateforRemarks(value); } },
            { title: "Vendor DO #", data: "VendorDONumber" },
            { title: "Vendor Invoice #", data: "VendorInvoiceNumber" },
            { title: "Total Invoice", data: "TotalInvoice" },
            {
                title: "Action",
                data: null,
                render: function (data, type, row) {
                    btnview = `<button class="btn btn-warning btn-large btn-sm"  style="color: white;" onclick="EditPurchaseOrder( ${data.POId}, '${data.PONumber}', '${data.Supplier}', '${data.Status}', '${data.Date}', '${data.DeliveryDate}', ${data.SupplierId}, '${data.DeliveryAddress}', ${data.Discount}, '${data.TermsOfPayment}', '${data.RefNumber}', '${data.Address}', '${data.State}', '${data.City}', '${data.Country}', '${data.PostalCode}', '${data.Street}', '${data.Description}')" title="Edit;"> <i class="fa fa-edit"></i></button>`;
                    btnview = btnview + `&nbsp;<button class="btn btn-danger btn-sm icon-btn ml-2 mb-2m" onclick="DeletePurchaseOrder(${data.POId})" title="Delete Record"> <i class="fa fa-trash"></i></button>`;
                    return btnview;
                },
                width: "180px",
                sortable: false,
                className: "text-center"
            }
        ],
        dom: 'Blfrtip',
        buttons: [],
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "pageLength": 10,
        initComplete: function () {
            var btns = $('.dt-button');
            btns.addClass('btn btn-success btn-sm');
            btns.css('margin', '2px');
            btns.removeClass('dt-button');

        }
    });

}