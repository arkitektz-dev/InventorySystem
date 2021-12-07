var CurrentSaleOrder = 0;



BindGridSo();

$(document).ready(function () {


    $("#SalesUserId").change(function () {
        let selectSalesUser = $("#SalesUserId").val();

        GetAssignedSalesCustomer(selectSalesUser, 0);


    });


    $("#CustomerCodeId").change(function () {
        let selectSalesUser = $("#CustomerCodeId").val();
        console.log(selectSalesUser);
        GetCustomerContact(selectSalesUser, 0);


    });

    $("#closeButton").on('click', function () {
        Clear();
        GetNewSONUmber()
        $("#AddSaleOrder").hide();
        $("#SaleOrderViewList").show();
    });

    $("#btnCreateSalesOrder").on('click', function () {



        let isFormComplete = true;
        const SaleOrderId = $('#SaleOrderId').val();
        const SONumber = $('#SONumber').val();
        const SODate = $('#SODate').val();
        const EstimatedDateOfDespatch = $('#EstimatedDateOfDespatch').val();
        const DeliveryDate = $('#DeliveryDate').val();
        const SalesUserId = $('#SalesUserId').val();
        const CustomerCodeId = $('#CustomerCodeId').val();
        const ContactId = $('#ContactId').val();
        const CustomerReference = $('#CustomerReference').val();
        const BillCustomerCodeId = $('#BillCustomerCodeId').val();
        const SoStatus = $('#SoStatus').val();
        const Address = $('#Address').val();
        const Street = $('#Street').val();
        const State = $('#State').val();
        const City = $('#City').val();
        const PostalCode = $('#PostalCode').val();
        const Country = $('#Country').val();
        const Discount = $('#Discount').val();
        const Description = $('#Description').val();




        isFormComplete = textFieldValidion(SONumber, "SONumber", "Val_SONumber", "Please enter sales order number");
        isFormComplete = textFieldValidion(SODate, "SODate", "Val_SODate", "Please enter sales order date");
        isFormComplete = textFieldValidion(EstimatedDateOfDespatch, "EstimatedDateOfDespatch", "Val_EstimatedDateOfDespatch", "Please enter estimate date of despatch");
        isFormComplete = textFieldValidion(DeliveryDate, "DeliveryDate", "Val_DeliveryDate", "Please enter delivery date");
        isFormComplete = textFieldValidion(SalesUserId, "SalesUserId", "Val_SalesUserId", "Please select sales user id");
        isFormComplete = textFieldValidion(CustomerCodeId, "CustomerCodeId", "Val_CustomerCodeId", "Please select customer code");
        isFormComplete = textFieldValidion(ContactId, "ContactId", "Val_ContactId", "Please select a contact person");
        isFormComplete = textFieldValidion(CustomerReference, "CustomerReference", "Val_CustomerReference", "Please select a customer reference");
        isFormComplete = textFieldValidion(BillCustomerCodeId, "BillCustomerCodeId", "Val_BillCustomerCodeId", "Please select a customer bill customer code");
        isFormComplete = textFieldValidion(SoStatus, "SoStatus", "Val_SoStatus", "Please select a so status");
        isFormComplete = textFieldValidion(Address, "Address", "Val_Address", "Please enter a address");
        isFormComplete = textFieldValidion(Street, "Street", "Val_Street", "Please enter a Street");
        isFormComplete = textFieldValidion(State, "State", "Val_State", "Please enter a Suburb");
        isFormComplete = textFieldValidion(City, "City", "Val_City", "Please enter a city");
        isFormComplete = textFieldValidion(PostalCode, "PostalCode", "Val_PostalCode", "Please enter a PostalCode");




        if (isFormComplete == false) {
            return;
        }


        var model = {
            Id: SaleOrderId,
            SoNumber: SONumber,
            SoDate: SODate,
            EstimatedDateofDispatch: EstimatedDateOfDespatch,
            DeliveryDate: DeliveryDate,
            SalesPersonId: SalesUserId,
            CustomerCodeId: CustomerCodeId,
            ContactPersonId: ContactId,
            CustomerReference: CustomerReference,
            BillCustomerCodeId: Number(BillCustomerCodeId),
            SoStatus: SoStatus,
            DeliveryAddress: Address,
            Street: Street,
            Suburb: State,
            City: City,
            PostalCode: PostalCode,
            Country: Country,
            Discount: Discount,
            Description: Description
        };

        $.ajax({
            type: "POST",
            url: "/SalesOrder/AddSalesOrder",
            data: { param: model },
            success: function (response) {
                if (response == "true") {
                    BindGridSo();
                    $("#AddSaleOrder").hide();
                    $("#SaleOrderViewList").show();

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

    $("#addSaleOrder").on('click', function () {
        GetNewSONUmber()
        $("#AddSaleOrder").show();
        $("#SaleOrderViewList").hide();
    });


    $('#addSalesOrderDetail').click(function () {

        $.ajax({
            type: "GET",
            url: "/PoDetail/GetProductListDropdown",
            success: function (response) {
                console.log(response);
                $('#GridSOItemList tr:last').after(
                    '<tr class="addNewRow">' +
                    `<td>${response}</td>` +
                    '<td><input type="number" class="form-control" type="text" id="Quantity" placeholder="Quantity" /></td>' +
                    '<td><input class="form-control" disabled type="text" id="Price" /></td>' +
                    '<td align="center">' +
                    '<a class="btn btn-success btn-sm" style="color:white" onclick="InsertNewProductDetail(this)" title="Add"> <i class="fa fa-plus"></i></a>' +
                    '&nbsp;<a class="btn btn-danger btn-sm" style="color:white" onclick="DeleteNewProductDetail(this)" title="Cancel"> <i class="fa fa-close"></i></a>' +
                    '</td>' +
                    '</tr > ');

                $('#ProductNameList').trigger('change');


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

    $('#printSalesOrder').click(function () {
        let SoName = $("#txtSoNumber").val()
        let urlitem = `/Export/GetSalesOrderPrint?SoNumber=${SoName}`;
        window.open(urlitem, '_blank');
    })

});

function InsertNewProductDetail(item) {


    const ProductId = $(item).parent().parent().find(':input:eq(0)').val();
    const Quantity = $(item).parent().parent().find(':input:eq(1)').val();
    const Price = $(item).parent().parent().find(':input:eq(2)').val();
    let isFormComplete = true;

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

    var SONumber = $("#txtSoNumber").val();

    if (isFormComplete == true) {

        $.ajax({
            type: "GET",
            url: "/SalesOrder/InsertNewProductDetail",
            data: { SONumber: SONumber, ProductId: ProductId, Quantity: Quantity, Price: Price },
            success: function (response) {

                if (response == "true") {
                    $("#SOItemList").html("");
                    setTimeout(() => {
                        BindGridSalesItemDetail();
                    }, 50)

                }
                else if (response == "ItemAlreadyExist") {
                    toastr.error('Product is associated with another record');
                    return false;
                }



            },
            failure: function (response) {
                console.error(response.responseText);
            },
            error: function (response) {
                console.error(response.responseText);
            }
        })

    }




}

function DeleteNewProductDetail(item) {
    $(item).parent().parent().remove();
}

function EditSODetail(PoDetailId, item) {
    $(item).parent().parent().children('td').each(function (index) {
        if (index < 3) {

            if (index == 0) {
                let Dropdown = "";
                const dropdown = this;
                $.ajax({
                    type: "GET",
                    url: "/PoDetail/GetProductListDropdown",
                    success: function (response) {

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

                if (index == 1) {
                    var html = $(this).text();
                    var input = $('<input type="text" class="form-control" />');
                    input.val(html);
                    $(this).html(input);
                }

                if (index == 2) {
                    var html = $(this).text();
                    var input = $('<input type="text" class="form-control" id="Price" disabled />');
                    input.val(html);
                    $(this).html(input);
                }


            }


        } else {
            $(item).parent().find('#btnEditSoDetail').hide();
            $(item).parent().find('#btnDeleteSoDetail').hide();
            $(item).parent().find('#btnUpdatePoDetail').show();
            $(item).parent().find('#btnCancelUpdate').show();
        }
    });
}

function UpdateSODetailValues(thisPoDetailId, item) {

    const ProductId = $(item).parent().parent().find(':input:eq(0)').val();
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
            url: "/SalesOrder/UpdateSoDetail",
            data: { ProductDetailId: thisPoDetailId, ProductId: ProductId, Quantity: Quantity, Price: Price },
            success: function (response) {

                if (response == "true") {
                    $("#SOItemList").html("");
                    setTimeout(() => {
                        BindGridSalesItemDetail();
                    }, 50)


                }
                else if (response == "ItemAlreadyExist") {
                    toastr.error('Product is associated with another record');
                    return false;
                }


               


            },
            failure: function (response) {
                console.error(response.responseText);
            },
            error: function (response) {
                console.error(response.responseText);
            }
        })

    }





}

function CancelUpdate(item) {
    $("#SOItemList").html("");
    setTimeout(() => {
        BindGridSalesItemDetail();
    }, 50)
}


function DeleteSoDetail(DeleteId) {

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
                url: "/SalesOrder/DeleteSalesDetail",
                data: { DetailId: DeleteId },
                success: function (response) {

                    $("#SOItemList").html("");
                    setTimeout(() => {
                        BindGridSalesItemDetail();
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



function getProductPrice(obj) {

    console.log('ss')
    $.ajax({
        type: "GET",
        url: "/PoDetail/GetProductPrice?id=" + $(obj).val(),
        success: function (response) {
            $(obj).parent().parent().children().find('#Price').val(response)
        },
        failure: function (response) {
            console.error(response.responseText);
        },
        error: function (response) {
            console.error(response.responseText);
        }
    });
}

function GetAssignedSalesCustomer(selectSalesUser, selectedCustomerCode) {
    $.ajax({
        type: "GET",
        url: "/SalesOrder/GetAssignedSalesCustomer?SalesPersonId=" + selectSalesUser,
        success: function (response) {
            if (response != "[]") {


                let result = response;

                response.map((item, index) => {

                    let rowTemp = `<option value="${item.CustomerId}">${item.Code}</option>`;

                    document.getElementById("CustomerCodeId").innerHTML += rowTemp;
                });

                if (selectedCustomerCode != 0) {
                    $('#CustomerCodeId').val(selectedCustomerCode);

                    console.log("This is a GetAssignedSalesCustomer " + selectedCustomerCode)

                }

                console.log(result);

            }
        },
        failure: function (response) {
            console.error(response.responseText);
        },
        error: function (response) {
            console.error(response.responseText);
        }
    })
}

function GetCustomerContact(selectSalesUser, selectContactPersonId) {
    $.ajax({
        type: "GET",
        url: "/SalesOrder/GetCustomerContact?CustomerId=" + selectSalesUser,
        success: function (response) {
            if (response != "[]") {

                let result = response;

                response.map((item, index) => {

                    let rowTemp = `<option value="${item.ContactId}">${item.FirstName} ${item.LastName}</option>`;

                    document.getElementById("ContactId").innerHTML += rowTemp;
                });
                console.log(result);

                if (selectContactPersonId != 0) {
                    $("#ContactId").val(selectContactPersonId);

                    console.log("This is a GetCustomerContact " + selectContactPersonId)
                }

            }
        },
        failure: function (response) {
            console.error(response.responseText);
        },
        error: function (response) {
            console.error(response.responseText);
        }
    })
}


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

function EditSalesOrder(SalesOrderId) {


    Clear();

    $.ajax({
        type: "GET",
        url: "/SalesOrder/GetSalesDetail",
        data: { Id: SalesOrderId },
        success: function (response) {

            console.log(response);

            $('#SaleOrderId').val(response.Id);
            $('#SONumber').val(response.SoNumber);
            $('#SODate').val(CustomerFormatedDate(response.SoDate));
            $('#EstimatedDateOfDespatch').val(CustomerFormatedDate(response.EstimatedDateofDispatch));
            $('#DeliveryDate').val(CustomerFormatedDate(response.DeliveryDate));
            $('#SalesUserId').val(response.SalesPersonId);

            let selectSalesUser = $("#SalesUserId").val();
            GetAssignedSalesCustomer(selectSalesUser, response.CustomerCodeId);


            GetCustomerContact(response.CustomerCodeId, response.ContactPersonId);


            $('#CustomerReference').val(response.CustomerReference);
            $('#BillCustomerCodeId').val(response.BillCustomerCodeId);
            $('#SoStatus').val(response.SoStatus);
            $('#Address').val(response.DeliveryAddress);
            $('#Street').val(response.Street);
            $('#State').val(response.Suburb);
            $('#City').val(response.City);
            $('#PostalCode').val(response.PostalCode);
            $('#Country').val(response.Country);
            $('#Discount').val(response.Discount);
            $('#Description').val(response.Description);


            $("#AddSaleOrder").show();
            $("#SaleOrderViewList").hide();
        },
        failure: function (response) {
            console.error(response.responseText);
        },
        error: function (response) {
            console.error(response.responseText);
        }
    })


}

function BindGridSo() {
    $('#SaleOrderList').html("");
    $('#SaleOrderList').append('<table id="GridSaleOrderList" class="table table-striped dataTable no-footer" width="100%"></table>');
    $('#GridSaleOrderList').DataTable({
        sAjaxSource: '/SalesOrder/GetSOList',
        columns: [
            { title: "Id", data: "Id", visible: false },
            { title: "So Number", data: "SoNumber" },
            { title: "Customer Name", data: "CustomerCodeId", width: "100px" },
            { title: "Status", data: "SoStatus" },
            { title: "Customer Reference", data: "CustomerReference" },
            {
                title: "",
                data: null,
                render: function (data, type, row) {
                    //btnview = `<button class="btn btn-warning btn-large btn-sm"  style="color: white;" onclick="OnGridView(this)" title="PO Items;"> Items </i></button>`;
                    btnview = `<button class="btn btn-warning btn-large btn-sm"  style="color: white;" onclick="SalesItemDetailView(${data.Id})" title="So Items;"> Items </i></button>`;
                    return btnview;
                },
                width: "80px",
                sortable: false,
                className: "text-center"
            },
            {
                title: "Action",
                data: null,
                render: function (data, type, row) {
                    console.log("inside the grid");

                    btnview = `<button class="btn btn-warning btn-large btn-sm"  style="color: white;" title="Edit;" onclick="EditSalesOrder(${data.Id})" > <i class="fa fa-edit"></i></button>`;
                    btnview = btnview + `&nbsp;<button class="btn btn-danger btn-sm icon-btn ml-2 mb-2m" onclick="DeleteSalesOrder(${data.Id})" title="Delete Record"> <i class="fa fa-trash"></i></button>`;

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



function GetNewSONUmber() {

    $.ajax({
        type: "GET",
        url: "/SalesOrder/NewSaleOrderNumberApi",
        success: function (response) {
            $('#SONumber').val(response);
        },
        failure: function (response) {
            console.error(response.responseText);
        },
        error: function (response) {
            console.error(response.responseText);
        }
    })


}

function DeleteSalesOrder(SalesOrderId) {
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
                url: "/SalesOrder/DeleteSalesOrder",
                data: { Id: SalesOrderId },
                success: function (response) {


                    if (response == "true") {
                        Swal.fire(
                            'Deleted!',
                            'Your record has been deleted.',
                            'success'
                        )

                        setTimeout(() => {
                            //BindGrid("PoList", "PoList", '/Po/GetPoList');
                            BindGridSo();
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


function Clear() {
    $('#SaleOrderId').val('');
    $('#SONumber').val('');
    $('#SODate').val('');
    $('#EstimatedDateOfDespatch').val('');
    $('#DeliveryDate').val('');
    $('#SalesUserId').val('');
    $('#CustomerCodeId').val('');
    $('#ContactId').val('');
    $('#CustomerReference').val('');
    $('#BillCustomerCodeId').val('');
    $('#SoStatus').val('');
    $('#Address').val('');
    $('#Street').val('');
    $('#State').val('');
    $('#City').val('');
    $('#PostalCode').val('');
    $('#Country').val('');
    $('#Discount').val('');
    $('#Description').val('');
    $('.show-warning').removeClass('show-warning');
    $('.text-danger').text('');


}

function SalesItemDetailView(Id) {

    $.ajax({
        type: "GET",
        url: "/SalesOrder/GetSalesDetail",
        data: { Id: Id },
        success: function (response) {
            console.log(response);
            Clear();
            GetNewSONUmber()
            $("#AddSaleOrder").hide();
            $("#SaleOrderViewList").hide();
            $("#AddSaleOrderDetail").show();

            //Fill Values
            $("#txtSoNumber").val(response.SoNumber);
            $("#txtSoDate").val(GetFormattedDate(`${response.SoDate}`));
            $("#txtDeliveryDate").val(GetFormattedDate(`${response.DeliveryDate}`));
            $("#txtCustomerName").val(response.CustomerName);
            $("#txtSoStatuses").val(response.SoStatus);
            $("#txtSaleCustomerName").val(response.CustomerName);
            BindGridSalesItemDetail();
             
        },
        failure: function (response) {
            console.error(response.responseText);
        },
        error: function (response) {
            console.error(response.responseText);
        }
    })
}

function BindGridSalesItemDetail() {
    var SoNumber = $('#txtSoNumber').val();
    $('#SOItemList').html("");
    $('#SOItemList').append('<table id="GridSOItemList" class="table table-striped dataTable no-footer" width="100%"></table>');
    $('#GridSOItemList').DataTable({
        sAjaxSource: '/SalesOrder/GetSOItemsList?SONumber=' + SoNumber,
        columns: [
            { title: "ProductName", data: "ProductName" },
            { title: "Quantity", data: "Quantity" },
            { title: "Price", data: "Price" },
            {
                title: "Action",
                data: null,
                render: function (data, type, row) {
                    btnview = '';
                    if ($('#txtStatus').val() !== "Completed")
                        btnview = btnview + `<a class="btn btn-warning btn-large btn-sm btnEdit" style="color: white;" id="btnEditSoDetail" onclick="EditSODetail('${data.SODetailId}',this)" title="Edit;"> <i class="fa fa-edit"></i></a>`;
                    btnview = btnview + '&nbsp;<a class="btn btn-danger btn-sm" style="color: white;" id="btnDeleteSoDetail" onclick="DeleteSoDetail(' + data.SODetailId + ')" title="Delete Record"> <i class="fa fa-trash"></i></a>';
                    btnview = btnview + '&nbsp;<a class="btn btn-success btn-sm" style="color: white; display:none;" id="btnUpdatePoDetail" onclick="UpdateSODetailValues(' + data.SODetailId + ',this)" title="Update"> <i class="fa fa-check"></i></a>';
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


function OnBack() {

    $("#AddSaleOrder").hide();
    $("#AddSaleOrderDetail").hide();
    $("#SaleOrderViewList").show();
    BindGridSo();
}

