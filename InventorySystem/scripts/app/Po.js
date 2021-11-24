$(document).ready(function () {
    BindGrid("PoList", "PoList", '/Po/GetPoList');

    $('#addProduct').click(function () {

        let purchaseOrderNumber = GetNewPONumber();
        console.log(purchaseOrderNumber);
        

        $('#PurchaseOrderList').hide()
        $('#AddPurchaseOrder').show()
    });


    $('#closeButton').click(function () {
        $('#PurchaseOrderList').show()
        $('#AddPurchaseOrder').hide()

        $('#AddPurchaseOrder').find('input:text').val(''); 
    });


    $('#btnSubmit').click(function () {

        let isFormComplete = true; 
        const PurchaseNumber = $('#PoNumber').val();
        const SupplierId = $('#SupplierId').val();
        const Reference = $('#Reference').val();
        const Status = $('#Status').val();
        const DeliveryDate = $('#DeliveryDate').val();
        const TermOfPaymnet = $('#TermOfPaymnet').val();
        const Discount = $('#Discount').val();
        const Address = $('#Address').val();
        const DeliveryAddress = $('#DeliveryAddress').val();
        const Suburb = $('#Suburb').val();
        const City = $('#City').val();
        const Country = $('#Country').val();

        var row = {
            PONumber: PurchaseNumber,
            Date: DeliveryDate,
            SupplierId: SupplierId,
            Status: Status,
            DeliveryAddress: DeliveryAddress,
            Discount: Discount,
            TermOfPaymnet: TermOfPaymnet
        }

        if (Country === '') {
            $('#Val_Country').html("Please enter Country");
            $('#Country').addClass("show-warning");
            isFormComplete = false;
        } else {
            $('#Val_Country').html("");
            $('#Country').removeClass("show-warning");
        }


        if (City === '') {
            $('#Val_City').html("Please enter city");
            $('#City').addClass("show-warning");
            isFormComplete = false;
        } else {
            $('#Val_City').html("");
            $('#City').removeClass("show-warning");
        }

        if (Suburb === '') {
            $('#Val_Suburb').html("Please enter Suburb");
            $('#Suburb').addClass("show-warning");
            isFormComplete = false;
        } else {
            $('#Val_Suburb').html("");
            $('#Suburb').removeClass("show-warning");
        }


        if (DeliveryAddress === '') {
            $('#Val_DeliveryAddress').html("Please enter Delivery Address");
            $('#DeliveryAddress').addClass("show-warning");
            isFormComplete = false;
        } else {
            $('#Val_DeliveryAddress').html("");
            $('#DeliveryAddress').removeClass("show-warning");
        }

        if (Address === '') {
            $('#Val_Address').html("Please enter Address");
            $('#Address').addClass("show-warning");
            isFormComplete = false;
        } else {
            $('#Val_Address').html("");
            $('#Address').removeClass("show-warning");
        }


        if (Discount === '') {
            $('#Val_Discount').html("Please enter Discount");
            $('#Discount').addClass("show-warning");
            isFormComplete = false;
        } else {
            $('#Val_Discount').html("");
            $('#Discount').removeClass("show-warning");
        }


        if (TermOfPaymnet === '') {
            $('#Val_TermOfPaymnet').html("Please enter term of paymnet");
            $('#TermOfPaymnet').addClass("show-warning");
            isFormComplete = false;
        } else {
            $('#Val_TermOfPaymnet').html("");
            $('#TermOfPaymnet').removeClass("show-warning");
        }


        if (DeliveryDate === '') {
            $('#Val_DeliveryDate').html("Please select a date");
            $('#DeliveryDate').addClass("show-warning");
            isFormComplete = false;
        } else {
            $('#Val_DeliveryDate').html("");
            $('#DeliveryDate').removeClass("show-warning");
        }

        if (Status === '') {
            $('#Val_Status').html("Please select a status");
            $('#Status').addClass("show-warning");
            isFormComplete = false;
        } else {
            $('#Val_Status').html("");
            $('#Status').removeClass("show-warning");
        }


        if (Reference === '') {
            $('#Val_Reference').html("Please enter a Reference");
            $('#Reference').addClass("show-warning");
            isFormComplete = false;
        } else {
            $('#Val_SupplierId').html("");
            $('#Reference').removeClass("show-warning");
        }

        if (SupplierId === '') {
            $('#Val_SupplierId').html("Please select a supplier");
            $('#SupplierId').addClass("show-warning");
            isFormComplete = false;
        } else {
            $('#Val_SupplierId').html("");
            $('#SupplierId').removeClass("show-warning");
        }


        if (isFormComplete == false) {
            return;
        }

     

        $.ajax({
            type: "POST",
            url: "/PO/SavePurchaseOrder",
            data: { model: Customer },
            success: function (response) {

            },
            failure: function (response) {
                console.error(response.responseText);
            },
            error: function (response) {
                console.error(response.responseText);
            }
        });


    });


});


function GetNewPONumber() {

    $.ajax({
        type: "GET",
        url: "/PO/NewPurchaseOrderNumberApi",
        success: function (response) {
            $('#PoNumber').val(response);
        },
        failure: function (response) {
            console.error(response.responseText);
        },
        error: function (response) {
            console.error(response.responseText);
        }
    })


}

function OnAddNew() {
    var url = "/Po/AddEditPo?Id=" + 0;
    $("#SubscriptionModelBody").load(url, function () {
        $("#ModelSubscription").modal("show");
    });
}

function OnGridEdit(e) {
    var table = $('#GridPoList').DataTable();
    var data = table.row(e.parentNode).data();
    var url = "/Po/AddEditPo?Id=" + data.POId;
    $("#SubscriptionModelBody").load(url, function () {
        $("#ModelSubscription").modal("show");
    });
}

function OnGridView(e) {
    var table = $('#GridPoList').DataTable();
    var data = table.row(e.parentNode).data();
    var url = "/PoDetail/Index?Id=" + data.POId;
    window.location.replace(url);
}
function OnGridDelete(e) {
    var data, GetDeleteStatus;
    var table = $('#GridPoList').DataTable();
    data = table.row(e.parentNode).data();
    swalMy({
        title: "",
        text: "are you sure ?",
        type: "info",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        cancelButtonText: "No, I am not sure!",
        closeOnConfirm: true,
        closeOnCancel: true
    },
        function (isConfirm) {
            if (isConfirm) {
                AjaxCall('/Po/PoDelete', JSON.stringify({ "Id": data.POId }), GetDeletedStatus, null);
            }
        });
}
function GetDeletedStatus(data) {
    if (data == "true") {
        BindGrid("PoList", "PoList", '/Po/GetPoList');
        showSuccessToast("Purchase Order Deleted Successfully.");
    }
    else {
        showErrorToast("Something Went Wrong");
    }
}

function BindGridWOption(divid, tbl, url) {
    $('#' + divid).html("");
    $('#' + divid).append('<table id="Grid' + divid + '" class="table table-striped dataTable no-footer" width="100%"></table>');
    $('#Grid' + divid).DataTable({
        sAjaxSource: (RootPath == '/' ? '' : RootPath) + url,
        columns: GetCol(tbl),
        dom: 'Blfrtip',
        //buttons: ['excelHtml5', 'csvHtml5', 'pdfHtml5'],
        buttons: [
            {
                extend: 'csvHtml5',
                exportOptions: {
                    columns: [0,1,2,3,4,5,6,7]
                }
            },
            {
                extend: 'excelHtml5',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6, 7]
                }
            },
            {
                extend: 'pdfHtml5',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6, 7]
                }
            }
        ],
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "pageLength": 50,
        initComplete: function () {
            var btns = $('.dt-button');
            btns.addClass('btn btn-success btn-sm');
            btns.css('margin', '2px');
            btns.removeClass('dt-button');

        }

        //fixedColumns: false,
        //"scrollX": true,
        //"autoWidth": false,
    });

}
