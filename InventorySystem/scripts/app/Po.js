let PurchaseDetailId = 0;


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
        Clear(); 
    });


    $('#btnSubmit').click(function () {

        let isFormComplete = true; 
        const PurchaseOrderId = $('#PurchaseOrderId').val();
        const PurchaseNumber = $('#PoNumber').val();
        const SupplierId = $('#SupplierId').val();
        const Reference = $('#Reference').val();
        const Status = $('#Status').val();
        const DeliveryDate = $('#DeliveryDate').val();
        const TermOfPaymnet = $('#TermOfPaymnet').val();
        const Discount = $('#Discount').val();
        const Address = $('#Address').val();
        const DeliveryAddress = $('#DeliveryAddress').val();
        const State = $('#State').val();
        const Street = $('#Street').val();
        const City = $('#City').val();
        const Country = $('#Country').val();

     

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

        if (Street === '') {
            $('#Val_Street').html("Please enter Street");
            $('#Street').addClass("show-warning");
            isFormComplete = false;
        } else {
            $('#Val_Street').html("");
            $('#Street').removeClass("show-warning");
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


        var row = {
            POId: PurchaseOrderId,
            PONumber: PurchaseNumber,
            DeliveryDate: DeliveryDate,
            SupplierId: SupplierId,
            Status: Status,
            DeliveryAddress: DeliveryAddress,
            Discount: Discount,
            TermsOfPayment: TermOfPaymnet,
            RefNumber: Reference,
            Address: Address,
            Street: Street,
            State: State,
            City: City,
            Country: Country
        }


        console.log(row);

        $.ajax({
            type: "POST",
            url: "/PO/SavePurchaseOrder",
            data: { model: row },
            success: function (response) {

                if (response == "true") {
                    setTimeout(() => {

                        toastr.success('Your record is saved');
                        $('#PurchaseOrderList').show()
                        $('#AddPurchaseOrder').hide()
                        Clear();
                        BindGrid("PoList", "PoList", '/Po/GetPoList');

                    },50)
                }
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


function DeletePurchaseOrder(PurchaseOrderId) {
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
                url: "/PO/DeletePurchaseOrder",
                data: { PurchaseOrder: PurchaseOrderId },
                success: function (response) {


                    console.log(response);
                    if (response == "true") {
                        Swal.fire(
                            'Deleted!',
                            'Your record has been deleted.',
                            'success'
                        )

                        setTimeout(() => {
                            BindGrid("PoList", "PoList", '/Po/GetPoList');
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

function GetDeletedStatus(data) {
    if (data == "true") {
        BindGrid("PoList", "PoList", '/Po/GetPoList');
        showSuccessToast("Purchase Order Deleted Successfully.");
    }
    else {
        showErrorToast("Something Went Wrong");
    }
}

function EditPurchaseOrder(POId, PONumber, Supplier, Status, Date1, DeliveryDate, SupplierId, DeliveryAddress, Discount, TermsOfPayment, RefNumber, Address, Suburb, City, Country, Description) {
    console.log(POId, PONumber, Supplier, Status, Date1, DeliveryDate, SupplierId, DeliveryAddress, Discount, TermsOfPayment, RefNumber, Address, Suburb, City, Country, Description);

    var dDelivery = DeliveryDate.replace(/\D/g, "");
    console.log(dDelivery);
    var inputDate =  Date.now;
    console.log(inputDate);

    $('#PurchaseOrderId').val(POId);
    $('#PoNumber').val(PONumber);
    $('#SupplierId').val(SupplierId);
    $('#Reference').val(RefNumber);
    $('#Status').val(Status);

    var now = new Date(Number(dDelivery));
    var day = ("0" + now.getDate()).slice(-2);
    var month = ("0" + (now.getMonth() + 1)).slice(-2);
    var today = now.getFullYear() + "-" + (month) + "-" + (day);

    $('#DeliveryDate').val(today);
    $('#TermOfPaymnet').val(TermsOfPayment);
    $('#Discount').val(Discount);
    $('#Address').val(Address);
    $('#DeliveryAddress').val(DeliveryAddress);
    $('#Suburb').val(Suburb);
    $('#City').val(City);
    $('#Country').val(Country);
    $('#PurchaseOrderList').hide()
    $('#AddPurchaseOrder').show()
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

function PurchaseOrderDetail(POID) {

    $.ajax({
        type: "GET",
        url: "/PoDetail/Index",
        data: { Id: POID },
        success: function (response) {
            PurchaseDetailId = POID;
            LoadPOInfo(POID)
            BindGridProductItemDetail(POID)
            $('#PurchaseOrderList').hide()
            $('#AddPurchaseOrder').hide()
            $('#AddPurchaseOrderDetail').show()
        },
        failure: function (response) {
            console.error(response.responseText);
        },
        error: function (response) {
            console.error(response.responseText);
        }
    })


}

function EditPoDetail(PoDetailId, item) {
    $(item).parent().parent().children('td').each(function (index) {
        if (index < 3) {

            if (index == 0) {
                let Dropdown = "";
                const dropdown = this;
                $.ajax({
                    type: "GET",
                    url: "/PoDetail/GetProductListDropdown",
                    success: function (response) {
                        console.log(response);

                        Dropdown = response;
                        $(dropdown).html(Dropdown);
                        //$(this).html(Dropdown);
                    },
                    failure: function (response) {
                        console.error(response.responseText);
                    },
                    error: function (response) {
                        console.error(response.responseText);
                    }
                })

              

            } else {
                var html = $(this).text();
                var input = $('<input type="text" />');
                input.val(html);
                $(this).html(input);
            }

 
        } else {
            $(item).parent().find('#btnEditPoDetail').hide();
            $(item).parent().find('#btnDeletePoDetail').hide();
            $(item).parent().find('#btnUpdatePoDetail').show();
            $(item).parent().find('#btnCancelUpdate').show();
        }
    });
}

function UpdatePoDetailValues(thisPoDetailId, item) {

    const ProductId= $(item).parent().parent().find(':input:eq(0)').val();
    const Quantity = $(item).parent().parent().find(':input:eq(1)').val();
    const Price = $(item).parent().parent().find(':input:eq(2)').val();
    const isFormComplete = true;

    if (ProductId === '') {
        $(item).parent().parent().find(':input:eq(0)').addClass("border-danger");
        $(item).parent().parent().find(':input:eq(0)').focus();
        isFormComplete = false;
    } else {
        $(item).parent().parent().find(':input:eq(0)').removeClass("border-danger");
    }

    if (Quantity === '') {
        $(item).parent().parent().find(':input:eq(1)').addClass("border-danger");
        $(item).parent().parent().find(':input:eq(1)').focus();
        isFormComplete = false;
    } else {
        $(item).parent().parent().find(':input:eq(1)').removeClass("border-danger");
    }

    if (Price === '') {
        $(item).parent().parent().find(':input:eq(2)').addClass("border-danger");
        $(item).parent().parent().find(':input:eq(2)').focus();
        isFormComplete = false;
    } else {
        $(item).parent().parent().find(':input:eq(2)').removeClass("border-danger");
    }


    if (isFormComplete == true) {

        $.ajax({
            type: "GET",
            url: "/PoDetail/UpdatePoDetail",
            data: { ProudctDetailId: thisPoDetailId, ProductId: ProductId, Quantity: Quantity, Price: Price },
            success: function (response) {

                console.log("This is sparta",PurchaseDetailId);
                $("#PoItemsList").html("");
                setTimeout(() => {
                    BindGridProductItemDetail(PurchaseDetailId);
                },50)
                


            },
            failure: function (response) {
                console.error(response.responseText);
            },
            error: function (response) {
                console.error(response.responseText);
            }
        })

    }


    console.log(ProductId, Quantity, Price);

    
     
}

function DeletePoDetail(DeleteId) {

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
                url: "/PoDetail/DeletePoDetail",
                data: { DetailId: DeleteId },
                success: function (response) {

                    $("#PoItemsList").html("");
                    setTimeout(() => {
                        BindGridProductItemDetail(PurchaseDetailId);
                    }, 50)



                },
                failure: function (response) {
                    console.error(response.responseText);
                },
                error: function (response) {
                    console.error(response.responseText);
                }
            })
           

        }
    })


  

}


$('#addPurchaseDetail').click(function () {

    $.ajax({
        type: "GET",
        url: "/PoDetail/GetProductListDropdown",
        success: function (response) {
            console.log(response);

            //Dropdown = response;
            //$(dropdown).html(Dropdown);

            $('#GridPoItemsList tr:last').after(
                '<tr class="addNewRow">' +
                `<td>${response}</td>` +
                '<td><input type="text" id="Quantity" /></td>' +
                '<td><input type="text" id="Price" /></td>' + 
                '<td align="center">' +
                '<a class="btn btn-success btn-sm" style="color:white" onclick="InsertNewProductDetail(this)" title="Add"> <i class="fa fa-plus"></i></a>' +
                '&nbsp;<a class="btn btn-danger btn-sm" style="color:white" onclick="DeleteNewContact(this)" title="Cancel"> <i class="fa fa-close"></i></a>' +
                '</td>' +
                '</tr > ');
     

            //$(this).html(Dropdown);
        },
        failure: function (response) {
            console.error(response.responseText);
        },
        error: function (response) {
            console.error(response.responseText);
        }
    })

  

})


function InsertNewProductDetail(item) {

    const ProductId = $(item).parent().parent().find(':input:eq(0)').val();
    const Quantity = $(item).parent().parent().find(':input:eq(1)').val();
    const Price = $(item).parent().parent().find(':input:eq(3)').val();
    bool isFormComplete = true;

    if (ProductId === '') {
        $(item).parent().parent().find(':input:eq(0)').addClass("border-danger");
        $(item).parent().parent().find(':input:eq(0)').focus();
        isFormComplete = false;
    } else {
        $(item).parent().parent().find(':input:eq(0)').removeClass("border-danger");
    }

    if (Quantity === '') {
        $(item).parent().parent().find(':input:eq(1)').addClass("border-danger");
        $(item).parent().parent().find(':input:eq(1)').focus();
        isFormComplete = false;
    } else {
        $(item).parent().parent().find(':input:eq(1)').removeClass("border-danger");
    }

    if (Price === '') {
        $(item).parent().parent().find(':input:eq(2)').addClass("border-danger");
        $(item).parent().parent().find(':input:eq(2)').focus();
        isFormComplete = false;
    } else {
        $(item).parent().parent().find(':input:eq(2)').removeClass("border-danger");
    }


    if (isFormComplete = true) {

    }




}

function CancelUpdate(item) {
    $("#PoItemsList").html("");
    setTimeout(() => {
        BindGridProductItemDetail(PurchaseDetailId);
    }, 50)
}

function BindGridProductItemDetail(POID) {
    console.log("The purchase id number is ", POID)
    var poId = $('#txtPoNumber').val();
    $('#PoItemsList').html("");
    $('#PoItemsList').append('<table id="GridPoItemsList" class="table table-striped dataTable no-footer" width="100%"></table>');
    $('#GridPoItemsList').DataTable({
        sAjaxSource: '/PoDetail/GetPOItemsList?PONumber=' + POID,
        columns: [ 
            { title: "ProductName", data: "ProductName" },
            { title: "Quantity", data: "Quantity" },
            { title: "Price", data: "Price" }, 
            {
                title: "Action",
                data: null,
                render: function (data, type, row) {
                    console.log(data, type, row);
                    btnview = `<a class="btn btn-warning btn-large btn-sm" style="color: white;" id="btnEditPoDetail" onclick="EditPoDetail('${data.PODetailId}',this)" title="Edit;"> <i class="fa fa-edit"></i></a>`;
                    btnview = btnview + '&nbsp;<a class="btn btn-danger btn-sm" style="color: white;" id="btnDeletePoDetail" onclick="DeletePoDetail(' + data.PODetailId + ')" title="Delete Record"> <i class="fa fa-trash"></i></a>';
                    btnview = btnview + '&nbsp;<a class="btn btn-success btn-sm" style="color: white; display:none;" id="btnUpdatePoDetail" onclick="UpdatePoDetailValues(' + data.PODetailId + ',this)" title="Update"> <i class="fa fa-check"></i></a>';
                    btnview = btnview + '&nbsp;<a class="btn btn-danger btn-sm" style="color: white; display:none;" id="btnCancelUpdate" onclick="CancelUpdate(this)" title="Cancel"> <i class="fa fa-close"></i></a>';
                    return btnview;
                },
                width: "200px",
                sortable: false,
                className: "text-center"
            }
        ],
        dom: 'Blfrtip',
        paging: false,
        buttons: [],
        "pageLength": 10,
        initComplete: function () {
            var btns = $('.dt-button');
            btns.addClass('btn btn-success btn-sm');
            btns.css('margin', '2px');
            btns.removeClass('dt-button');

        }
    });

}

function LoadPOInfo(PoId) {
    AjaxCall('/Po/GetPo', JSON.stringify({ "Id": PoId }), GetPOData, null);
}

function GetPOData(data) {
    $("#txtPoNumber").val("");
    $("#txtPODate").val("");
    $("#txtDelAddress").val("");
    $("#txtStatus").val("");
    $("#txtTOP").val("");
    $("#txtDelDate").val("");
    $("#txtVendor").val("");

    $("#txtPoNumber").val(data.PONumber);
    $("#txtPODate").val(parseJsonDateforRemarks(data.Date));
    $("#txtDelAddress").val(data.DeliveryAddress);
    $("#txtStatus").val(data.Status);
    $("#txtTOP").val(data.TermsOfPayment);
    $("#txtDelDate").val(parseJsonDateforRemarks(data.DeliveryDate));
    $("#txtVendor").val(data.Supplier);


}


function BindGridPoNumber() {
    var txtPoNumber = $('#txtPoNumber').val();
    $('#PoItemsList').html("");
    $('#PoItemsList').append('<table id="GridPoItemsList" class="table table-striped dataTable no-footer" width="100%">  </table>');
    $('#GridPoItemsList').DataTable({
        sAjaxSource: '/PoDetail/GetPOItemsList?PONumber=' + txtPoNumber,
        columns: [ 
            { title: "Id", data: "ProductId", visible: true },
            { title: "Product", data: "ProductName" },
            { title: "Quantity", data: "Quantity" },
            { title: "Price", data: "Price" },
            {
                title: "Action",
                data: null,
                render: function (data, type, row) {
                    console.log(data, type, row)
                    btnview = `<a class="btn btn-warning btn-large btn-sm" style="color: white;" id="btnEditPoDetail" onclick="EditPoDetail('${data.PoDetailId}',this)" title="Edit;"> <i class="fa fa-edit"></i></a>`;
                    btnview = btnview + '&nbsp;<a class="btn btn-danger btn-sm" style="color: white;" id="btnDeletePoDetail" onclick="DeletePoDetail(' + data.PoDetailId + ')" title="Delete Record"> <i class="fa fa-trash"></i></a>';
                    btnview = btnview + '&nbsp;<a class="btn btn-success btn-sm" style="color: white; display:none;" id="btnUpdatePoDetail" onclick="UpdatePoDetailValues(' + data.PoDetailId + ',this)" title="Update"> <i class="fa fa-check"></i></a>';
                    btnview = btnview + '&nbsp;<a class="btn btn-danger btn-sm" style="color: white; display:none;" id="btnCancelUpdate" onclick="CancelUpdate(this)" title="Cancel"> <i class="fa fa-close"></i></a>';
                    return btnview;
                },
                width: "200px",
                sortable: false,
                className: "text-center"
            }
        ]
    });

}

function Clear() {

     $('#PurchaseOrderId').val('');
     $('#PoNumber').val('');
     $('#SupplierId').val('');
     $('#Reference').val('');
     $('#Status').val('');
     $('#DeliveryDate').val('');
    $('#TermOfPaymnet').val('');
    $('#Discount').val('');
    $('#Address').val('');
    $('#DeliveryAddress').val('');
    $('#Suburb').val('');
    $('#City').val('');
    $('#Country').val('');

}