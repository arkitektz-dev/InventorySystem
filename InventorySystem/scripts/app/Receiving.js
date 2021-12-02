$(function () {
    bindDatatable();

    $('#addReceiving').click(openForm);

    $('#closeButton').click(hideForm);

    $('#btnSubmit').click(insertReceivingRequest)

    $("#POId").change(function () {
        const purchaseOrderId = this.value;
        getTotalInvoiceByPurchaseOrder(purchaseOrderId);
    });

 
});

function openForm() {
    getGSRNNumber();

    $('#ReceivingLists').hide();
    $('#AddReceiving').show();
}

function hideForm() {
    ResetForm();

    $('#ReceivingLists').show();
    $('#AddReceiving').hide();
}

function insertReceivingRequest() {
    let isFormComplete = true;
    const receivingId = $('#ReceivingId').val() || 0;
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
        ReceivingId: receivingId,
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

function deleteReceivingRequest(receivingId) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {

            $.ajax({
                type: "POST",
                url: "/Receiving/DeleteReceiving",
                data: { ReceivingId: receivingId },
                success: function (response) {


                    if (response == "true") {
                        Swal.fire(
                            'Deleted!',
                            'Your record has been deleted.',
                            'success'
                        )

                        setTimeout(() => {
                            bindDatatable()
                        }, 50)


                    } else {
                        toastr.error('Product is associated with another record');
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
    })
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
        url: "/Receiving/GetTotalInvoiceByPurchaseOrder/?poId=" + purchaseOrderId,
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
            { title: "GSRN Date", data: "GSRNDate", render: function (value) { return GetFormattedDate(value); } },
            { title: "PO Number", data: "PONumber" },
            { title: "PO Number", data: "PONumber" },
            { title: "Vendor DO #", data: "VendorDONumber" },
            { title: "Total Invoice", data: "TotalInvoice" },
            {
                title: "Action",
                data: null,
                render: function (data, type, row) {
                    btnview = `<button class="btn btn-warning btn-large btn-sm"  style="color: white;" onclick="editClick( ${data.ReceivingId}, '${data.GSRNNumber}', '${data.GSRNDate}', '${data.POId}', '${data.VendorInvoiceNumber}','${data.VendorDONumber}', '${data.TotalInvoice}')" title="Edit;"> <i class="fa fa-edit"></i></button>`;
                    btnview = btnview + `&nbsp;<button class="btn btn-danger btn-sm icon-btn ml-2 mb-2m" onclick="deleteReceivingRequest(${data.ReceivingId})" title="Delete Record"> <i class="fa fa-trash"></i></button>`;
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

function editClick(ReceivingId, GSRNNumber, GSRNDate, POId, VendorInvoiceNumber, VendorDONumber, TotalInvoice) {
    ResetForm();

    var gsrnDate = GSRNDate.replace(/\D/g, "");

    $('#ReceivingId').val(ReceivingId);
    $('#GSRNNumber').val(GSRNNumber);
    $('#POId').val(POId);
    $('#VendorInvoiceNumber').val(VendorInvoiceNumber);
    $('#VendorDONumber').val(VendorDONumber);
    $('#TotalInvoice').val(TotalInvoice);

    var now = new Date(Number(gsrnDate));
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + "-" + (month) + "-" + (day);

    $('#GSRNDate').val(today);

    openForm();
}

function ResetForm() {
    $('.show-warning').removeClass('show-warning');
    $('.text-danger').text('');

    $('#ReceivingId').val('');
    $('#GSRNNumber').val('');
    $('#POId').val('');
    $('#GSRNDate').val('');
    $('#VendorDONumber').val('');
    $('#VendorInvoiceNumber').val('');
    $('#TotalInvoice').val('');
}
