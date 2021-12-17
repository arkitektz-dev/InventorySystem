
function ShowTableNumber() {
    var SaleOrder = $("#SONumber").val();

    BindGridSalesOrderItemlist(SaleOrder);
}

$(document).ready(function () {

    $("#SONumber").change(function () {
        var SaleOrder = $("#SONumber").val();

        BindGridSalesOrderItemlist(SaleOrder);
    });




    $("#btnCreateShipping").on('click', function () {

        let ShipmentId = $("#ShipmentId").val();
        let DONumber = $("#DONumber").val();
        let DODate = $("#DODate").val();
        let SONumber = $("#SONumber").val();
        let Courier = $("#Courier").val();
        let Installer = $("#Installer").val();
        let Status = $("#Status").val();
        let TrackingNumber = $("#TrackingNumber").val();
        let Description = $("#Description").val();
        let isFormComplete = false

        isFormComplete = textFieldValidion(DONumber, "DONumber", "Val_DONumber", "Please enter DONumber");
        isFormComplete = textFieldValidion(DODate, "DODate", "Val_DODate", "Please enter do date");
        isFormComplete = textFieldValidion(SONumber, "SONumber", "Val_SONumber", "Please enter SO Number");
        isFormComplete = textFieldValidion(Courier, "Courier", "Val_Courier", "Please enter Courier");
        isFormComplete = textFieldValidion(Installer, "Installer", "Val_Installer", "Please enter Installer");
        isFormComplete = textFieldValidion(Status, "Status", "Val_Status", "Please select Status");
        isFormComplete = textFieldValidion(TrackingNumber, "TrackingNumber", "Val_TrackingNumber", "Please select Tracking Number");
        isFormComplete = textFieldValidion(Description, "Description", "Val_Description", "Please enter Description");

        if ($("#SONumber").val() == '') {
            isFormComplete = false;
        }

        var row = {
            Id: ShipmentId,
            DONumber: DONumber,
            DODate: DODate,
            SalesOrderId: Number(SONumber),
            CourierId: Courier,
            Installer: Installer,
            Status: Status,
            TrackingNumber: TrackingNumber,
            Description: Description
        };


        if (isFormComplete == true) {


            $.ajax({
                type: "POST",
                url: "/Shipment/AddEditProduct",
                data: { model: row },
                success: function (response) {
                    $("#displayShipmentList").show();
                    $("#AddShipment").hide();
                    BindGridShipmnetList();
                    toastr.success('Record is saved');
                },
                failure: function (response) {
                    console.error(response.responseText);
                },
                error: function (response) {
                    console.error(response.responseText);
                }
            });
        }


    });

    $("#addShipment").on('click', function () {
        DefaultShipmentfunctions();
        Clear();
        $.ajax({
            type: "GET",
            url: "/Shipment/GetNewSalesOrderList",
            success: function (dropdownResponse) {
                 
                $("#ChangeForEdit").html(dropdownResponse);  


            },
            failure: function (response) {
                console.error(response.responseText);
            },
            error: function (response) {
                console.error(response.responseText);
            }
        });

        $("#displayShipmentList").hide();
        $("#AddShipment").show();
    })

    $("#closeButton").on('click', function () {
       // DefaultShipmentfunctions();
        Clear();
        $("#displayShipmentList").show();
        $("#AddShipment").hide();
    })
});


function textFieldValidion(inputField, inputId, validationId, message) {


    if (inputField === '') {
        $(`#${validationId}`).html(`${message}`);
        $(`#${inputId}`).addClass("show-warning");
        return false;
    } else {
        $(`#${validationId}`).html("");
        $(`#${inputId}`).removeClass("show-warning");
        return true;
    }


}

function BindGridSalesOrderItemlist(SaleOrder) {
    $('#SalesOrderItemlist').html("");
    $('#SalesOrderItemlist').append('<table id="GridSalesOrderItemlist" class="table table-striped dataTable no-footer" width="100%"></table>');
    $('#GridSalesOrderItemlist').DataTable({
        sAjaxSource: "/Shipment/GetProductList?SalesId=" + SaleOrder,
        columns: [ 
            { title: "Product Code", data: "ProductCode" },
            { title: "Product Name", data: "ProductName" },
            { title: "Quantity", data: "Quantity" }
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


function BindGridShipmnetList() {

    $('#ShipmentList').html("");
    $('#ShipmentList').append('<table id="GridShipmentList" class="table table-striped dataTable no-footer" width="100%"></table>');
    $('#GridShipmentList').DataTable({
        sAjaxSource: "/Shipment/GetShipmentList",
        columns: [
            { title: "DO Number", data: "DONumber" },
            { title: "Customer Name", data: "Name" },
            { title: "Delivery Date", data: "DODate", width: "100px", render: function (value) { return GetFormattedDate(value); } },
            { title: "Status", data: "Status" },
            { title: "So Number", data: "SoNumber" },
            {
                title: "Action",
                data: null,
                render: function (data, type, row) {
                    btnview = `<button class="btn btn-warning btn-large btn-sm"  style="color: white;" onclick="EditShipment('${data.Id}')" title="Edit;"> <i class="fa fa-edit"></i></button>`;
                    btnview = btnview + '&nbsp;<button class="btn btn-danger btn-sm icon-btn ml-2 mb-2m" onclick="DeleteShipment(' + data.Id + ')" title="Delete Record"> <i class="fa fa-trash"></i></button>';
                    return btnview;
                },
                width: "200px",
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

function GetNewPONumber() {

    $.ajax({
        type: "GET",
        url: "/Shipment/NewShipmentNumberApi",
        success: function (response) {
            console.log(response);
            $('#DONumber').val(response);
        },
        failure: function (response) {
            console.error(response.responseText);
        },
        error: function (response) {
            console.error(response.responseText);
        }
    })


}

function DefaultShipmentfunctions() {

    GetNewPONumber();
   

}


function EditShipment(ShipmentId) {

    $("#displayShipmentList").hide();
    $("#AddShipment").show();
    Clear();

    console.log(ShipmentId)


    $.ajax({
        type: "GET",
        url: "/Shipment/GetShipmnetById",
        data: { Shipment: ShipmentId },
        success: function (response) {
            console.log(response);

            $.ajax({
                type: "GET",
                url: "/Shipment/GetSalesOrderList", 
                success: function (dropdownResponse) { 

                    $("#ShipmentId").val(response.Id);
                    $("#DONumber").val(response.DONumber);
                    //$("#DODate").val(GetFormattedDate(response.DODate));
                    $("#ChangeForEdit").html(dropdownResponse);
                    $("#SONumber").val(response.SalesOrderId);
                    $("#Courier").val(response.CourierId);
                    $("#Installer").val(response.Installer);
                    $("#Status").val(response.Status);
                    $("#TrackingNumber").val(response.TrackingNumber);
                    $("#Description").val(response.Description);

                    var SaleOrder = $("#SONumber").val();

                    BindGridSalesOrderItemlist(SaleOrder);


                    document.getElementById('DODate').value = CustomerFormatedDate(response.DODate)

                    $("#txtShipmnetHeading").text("Edit Shipment")

                   
                },
                failure: function (response) {
                    console.error(response.responseText);
                },
                error: function (response) {
                    console.error(response.responseText);
                }
            });



           
        },
        failure: function (response) {
            console.error(response.responseText);
        },
        error: function (response) {
            console.error(response.responseText);
        }
    });




}

function Clear() {
     $("#ShipmentId").val('');
     $("#DONumber").val('');
     $("#DODate").val('');
     $("#SONumber").val('');
     $("#Courier").val('');
     $("#Installer").val('');
     $("#Status").val('');
     $("#TrackingNumber").val('');
     $("#Description").val(''); 
     $('.show-warning').removeClass('show-warning');
     $('.text-danger').text('');

}

//DefaultShipmentfunctions();


function DeleteShipment(ShipmnetId) {
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
                type: "GET",
                url: "/Shipment/DeleteShipmnetById",
                data: { Shipmnet: ShipmnetId },
                success: function (response) {


                    if (response == "true") {
                        Swal.fire(
                            'Deleted!',
                            'Your record has been deleted.',
                            'success'
                        )

                        setTimeout(() => { 
                            BindGridShipmnetList();
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

$("#printShipmnet").on("click", function () {
    var SaleOrder = $("#DONumber").val();
    let urlitem = `/Export/ShipmentOrderPrint?ShipmentNumber=${SaleOrder}`;
    window.open(urlitem, '_blank');
})



BindGridShipmnetList();
