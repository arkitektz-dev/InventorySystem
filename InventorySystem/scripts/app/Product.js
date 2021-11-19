 

var RawMaterialList = [];

$(document).ready(function () {
    //BindGridWOption("ProductList", "ProductList", '/Product/GetProductList');
    BindGridProduct();


    var tableRawMaterial = $('#tbl-raw-material').DataTable();

    $('#closeButton').click(function () {
        $('#Val_Name').html("");
        $('#Type').removeClass("show-warning");

        $('#AddProduct').hide()
        $('#ProductLists').show()
    });

    $('#btnAddRaw').click(function () {


        const RawProductCodeId = $("#ProductCodeList").val();
        const RawQuantity = $("#RawQuantity").val();
        const RawProductText = $("#ProductCodeList option:selected").text();
        let isFormComplete = true;
        RawMaterialList.map((item, index) => {
            if (item.ProductId == RawProductCodeId) {
                alert("Product Code already exists");
                isFormComplete = false;
            }
        });

        if (isFormComplete == false) {
            return;
        }

        let row = {
            ProductId: RawProductCodeId,
            Quantity: RawQuantity,
            text: RawProductText
        };

        RawMaterialList.push(row);


        tableRawMaterial.row.add([
            RawProductText,
            RawQuantity,
        ]).draw(false);

    });

    $('#addProduct').click(function () {
        removeValidateForm();
        $('#ProductId').val(0);
        $('#RawMaterial').prop("checked", false);
        $('#btnRawMaterial').show()
        $('#AddRawMaterial').show();
        $('#btnSubmit').hide()
        $('#Description').val('');

        $('#AddRawMaterial').hide();
        $('#AddProduct').show()
        $('#ProductLists').hide()
        $('#hiddenform').text('Add Product');
    });

    $('#RawMaterial').click(function () {
        if ($('#RawMaterial').is(":checked")) {
            $('#btnRawMaterial').hide()
            $('#AddRawMaterial').hide();
            $('#btnSubmit').show()
        }
        else {
            $('#btnRawMaterial').show()
            $('#btnSubmit').hide()
        }
    })

    $('#btnSubmit').click(function () {
        AddProduct();


    })

    $('#btnRawMaterial').click(function () {
        if (validateForm())
            $('#AddRawMaterial').show();
    })

});

function AddProduct() {
    var productId = $('#ProductId').val();
    var barcode = $('#Barcode').val();
    var productName = $('#ProductName').val();
    var productCode = $('#ProductCode').val();
    var unitOfMeasure = $('#UnitOfMeasure').val();
    var warehouseId = $('#WarehouseId').val();
    var productTypeId = $('#ProductTypeId').val();
    var price = $('#Price').val();
    var salesMargin = $('#SalesMargin').val();
    var salesPrice = $('#SalesPrice').val();
    var rawMaterial = $('#RawMaterial').is(":checked");
    var description = $('#Description').val();

    if (!validateForm()) {
        return;
    }

    const product = {
        productId: productId,
        barcode: barcode,
        productName: productName,
        productCode: productCode,
        unitOfMeasure: unitOfMeasure,
        warehouseId: warehouseId,
        productTypeId: productTypeId,
        price: price,
        salesMargin: salesMargin,
        salesPrice: salesPrice,
        rawMaterial: rawMaterial,
        description: description
    };

    $.ajax({
        type: "POST",
        url: "/Product/SaveProductApi",
        data: { model: product },
        success: function (response) {
            if (response == "true") {
                toastr.success('Product saved');
                document.getElementById("ProductList").innerHTML = "";

                setTimeout(() => {
                    $('#AddProduct').css('display', 'none');
                    $('#ProductLists').css('display', '');
                    BindGridProduct();
                }, 50)
            }
            else {
                var responses = response.split(",");
                responses.forEach(function (value, index) {
                    if (value == "BarcodeExists") {
                        $('#Val_Barcode').html("Another item with same barcode exists, please create another.");
                        $('#Barcode').addClass("is-invalid");
                        $('#Barcode').focus();
                    }
                    if (value == "CodeExists") {
                        $('#Val_ProductCode').html("Another item with same product code exists, please create another.");
                        $('#ProductCode').addClass("is-invalid");
                        $('#ProductCode').focus();
                    }
                    if (value == "AlreadyExists") {
                        $('#Val_ProductName').html("There is already a product with the same name, please create another.");
                        $('#ProductName').addClass("is-invalid");
                        $('#ProductName').focus();
                    }
                })
            }
            if (response.split(",") == "AlreadyExists") {
                $('#Val_ProductName').html("There is already a product with the same name, please create another.");
                $('#ProductName').addClass("is-invalid");
                $('#ProductName').focus();
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

function validateForm() {
    var barcode = $('#Barcode').val();
    var productName = $('#ProductName').val();
    var productCode = $('#ProductCode').val();
    var unitOfMeasure = $('#UnitOfMeasure').val();
    var warehouseId = $('#WarehouseId').val();
    var productTypeId = $('#ProductTypeId').val();
    var price = $('#Price').val();
    var salesMargin = $('#SalesMargin').val();
    var salesPrice = $('#SalesPrice').val();
    let isFormComplete = true;
    if (barcode === '') {
        $('#Val_Barcode').html("Please enter barcode");
        $('#Barcode').addClass("is-invalid");
        isFormComplete = false;
    } else {
        $('#Val_Barcode').html("");
        $('#Barcode').removeClass("is-invalid");
    }

    if (productName === '') {
        $('#Val_ProductName').html("Please enter product name");
        $('#ProductName').addClass("is-invalid");
        isFormComplete = false;
    } else {
        $('#Val_ProductName').html("");
        $('#ProductName').removeClass("is-invalid");
    }

    if (productCode === '') {
        $('#Val_ProductCode').html("Please enter product code");
        $('#ProductCode').addClass("is-invalid");
        isFormComplete = false;
    } else {
        $('#Val_ProductCode').html("");
        $('#ProductCode').removeClass("is-invalid");
    }

    if (unitOfMeasure === '') {
        $('#Val_UnitOfMeasure').html("Please select unit of measure");
        $('#UnitOfMeasure').addClass("is-invalid");
        isFormComplete = false;
    } else {
        $('#Val_UnitOfMeasure').html("");
        $('#UnitOfMeasure').removeClass("is-invalid");
    }

    if (warehouseId === '') {
        $('#Val_Warehouse').html("Please select warehouse");
        $('#WarehouseId').addClass("is-invalid");
        isFormComplete = false;
    } else {
        $('#Val_Warehouse').html("");
        $('#WarehouseId').removeClass("is-invalid");
    }

    if (productTypeId === '') {
        $('#Val_ProductType').html("Please select type of product");
        $('#ProductTypeId').addClass("is-invalid");
        isFormComplete = false;
    } else {
        $('#Val_ProductType').html("");
        $('#ProductTypeId').removeClass("is-invalid");
    }

    if (price === '') {
        $('#Val_Price').html("Please enter cost");
        $('#Price').addClass("is-invalid");
        isFormComplete = false;
    } else {
        $('#Val_Price').html("");
        $('#Price').removeClass("is-invalid");
    }

    if (salesMargin === '') {
        $('#Val_SalesMargin').html("Please enter sales margin");
        $('#SalesMargin').addClass("is-invalid");
        isFormComplete = false;
    } else {
        $('#Val_SalesMargin').html("");
        $('#SalesMargin').removeClass("is-invalid");
    }

    if (salesPrice === '') {
        $('#Val_SalesPrice').html("Please enter sales price");
        $('#SalesPrice').addClass("is-invalid");
        isFormComplete = false;
    } else {
        $('#Val_SalesPrice').html("");
        $('#SalesPrice').removeClass("is-invalid");
    }

    return isFormComplete;
}

function removeValidateForm() {
    $('#ProductId').val(0);
    $('#ProductId').val('');
    $('#Barcode').val('');
    $('#ProductName').val('');
    $('#ProductCode').val('');
    $('#UnitOfMeasure').val('');
    $('#WarehouseId').val('');
    $('#ProductTypeId').val('');
    $('#Price').val('');
    $('#SalesMargin').val('');
    $('#SalesPrice').val('');
    $('#Description').val('');


    $('#Val_Barcode').html("");
    $('#Barcode').removeClass("is-invalid");



    $('#Val_ProductName').html("");
    $('#ProductName').removeClass("is-invalid");



    $('#Val_ProductCode').html("");
    $('#ProductCode').removeClass("is-invalid");



    $('#Val_UnitOfMeasure').html("");
    $('#UnitOfMeasure').removeClass("is-invalid");

    $('#Val_Warehouse').html("");
    $('#WarehouseId').removeClass("is-invalid");

    $('#Val_ProductType').html("");
    $('#ProductTypeId').removeClass("is-invalid");

    $('#Val_Price').html("");
    $('#Price').removeClass("is-invalid");

    $('#Val_SalesMargin').html("");
    $('#SalesMargin').removeClass("is-invalid");

    $('#Val_SalesPrice').html("");
    $('#SalesPrice').removeClass("is-invalid");

}

function OnAddNew() {
    var url = "/Product/AddEditProduct?Id=" + 0;
    $("#SubscriptionModelBody").load(url, function () {
        //$("#ModelSubscription").modal("show");
    });
}

function OnGridEdit(e) {
    var table = $('#GridProductList').DataTable();
    var data = table.row(e.parentNode).data();
    var url = "/Product/AddEditProduct?Id=" + data.ProductId;
    $("#SubscriptionModelBody").load(url, function () {
        $("#ModelSubscription").modal("show");
    });
}

function OnGridDelete(e) {
    var data, GetDeleteStatus;
    var table = $('#GridProductList').DataTable();
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
                AjaxCall('/Product/ProductDelete', JSON.stringify({ "Id": data.ProductId }), GetDeletedStatus, null);
            }
        });
}

function GetDeletedStatus(data) {
    if (data == "true") {
        BindGrid("ProductList", "ProductList", '/Product/GetProductList');
        showSuccessToast("Product Deleted Successfully.");
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
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        dom: 'Blfrtip',
        buttons: [
            {
                extend: 'csvHtml5',
                exportOptions: {
                    columns: [1, 2, 3, 4, 5]
                }
            },
            {
                extend: 'excelHtml5',
                exportOptions: {
                    columns: [1, 2, 3, 4, 5]
                }
            },
            {
                extend: 'pdfHtml5',
                exportOptions: {
                    columns: [1, 2, 3, 4, 5]
                }
            }
        ],
        initComplete: function () {
            var btns = $('.dt-button');
            btns.addClass('btn btn-success btn-sm');
            btns.css('margin', '2px');
            btns.removeClass('dt-button');

        }

    });

}

function EditProduct(pid, bcode, pname, pcode, uom, wid, ptid, p, sm, sp, rm, d) {
    removeValidateForm();

    $('#ProductId').val(pid);
    $('#Barcode').val(bcode);
    $('#ProductName').val(pname);
    $('#ProductCode').val(pcode);
    $('#UnitOfMeasure').val(uom);
    $('#WarehouseId').val(wid);
    $('#ProductTypeId').val(ptid);
    $('#Price').val(p);
    $('#SalesMargin').val(sm);
    $('#SalesPrice').val(sp);
    if (rm) {
        $('#RawMaterial').prop("checked", true);
        $('#btnRawMaterial').hide()
        $('#AddRawMaterial').hide();
        $('#btnSubmit').show()
    }
    $('#Description').val();


    $('#hiddenform').text('Edit Warehouse');
    $('#AddProduct').css('display', '');
    $('#ProductLists').css('display', 'none');

}

function BindGridProduct() {
    $('#ProductList').html("");
    $('#ProductList').append('<table id="GridProductList" class="table table-striped dataTable no-footer" width="100%"></table>');
    $('#ProductList').append('<table id="GridProductList" class="table table-striped dataTable no-footer" width="100%"></table>');
    $('#GridProductList').DataTable({
        sAjaxSource: '/Product/GetProductList',
        columns: [
            { title: "Id", data: "ProductId", visible: false },
            { title: "Product Code", data: "ProductCode" },
            { title: "Product Name", data: "ProductName" },
            { title: "Quantity In hand", data: "QtyInHand" },
            {
                title: "Action",
                data: null,
                render: function (data, type, row) {
                    btnview = `<button class="btn btn-warning btn-large btn-sm"  style="color: white;" onclick="EditProduct('${data.ProductId}','${data.Barcode}','${data.ProductName}','${data.ProductCode}','${data.UnitOfMeasure}','${data.WarehouseId}','${data.ProductTypeId}','${data.Price}','${data.SalesMargin}','${data.SalesPrice}','${data.RawMaterial}','${data.Description}')" title="Edit;"> <i class="fa fa-edit"></i></button>`;
                    btnview = btnview + '&nbsp;<button class="btn btn-danger btn-sm icon-btn ml-2 mb-2m" onclick="DeleteProduct(' + data.WarehouseId + ')" title="Delete Record"> <i class="fa fa-trash"></i></button>';
                    return btnview;
                },
                width: "200px",
                sortable: false,
                className: "text-center"
            }
        ],
        dom: 'Blfrtip',
        buttons: [
            {
                extend: 'excelHtml5',
                exportOptions: {
                    columns: [0, 1]
                }
            },
            {
                extend: 'pdfHtml5',
                exportOptions: {
                    columns: [0, 1]
                }
            }
        ],
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