 

 

var RawMaterialList = [];
var isEdit = false;

$(document).ready(function () {
    //BindGridWOption("ProductList", "ProductList", '/Product/GetProductList');
    BindGridProduct();
   


    var tableRawMaterial = $('#tbl-raw-material').DataTable();

    $('#closeButton').click(function () {
        $('#Val_Name').html("");
        $('#Type').removeClass("show-warning");
        $("#btnRawMaterial").prop('disabled', false);
        $('#AddProduct').hide()
        $('#ProductLists').show()
    });

    $('#btnAddRaw').click(function () {


        let isFormComplete = true;
        const RawProductCodeId = $("#ProductCodeList").val();
        const RawQuantity = $("#RawQuantity").val();
        console.log(RawProductCodeId);
        if (RawQuantity == '') {
            $('#Val_RawQuantity').html("Please enter quantity");
            $('#RawQuantity').addClass("is-invalid");
            isFormComplete = false;
        } else {
            $('#Val_RawQuantity').html("");
            $('#RawQuantity').removeClass("is-invalid");
        }

        const RawProductText = $("#ProductCodeList option:selected").text();
        RawMaterialList.map((item, index) => {
            if (item.ProductId == Number(RawProductCodeId)) {
                item.Quantity = parseFloat(item.Quantity) + parseFloat(RawQuantity)
                //$('#tbl-raw-material tr:eq(' + (index + 1) + ') td')[1].innerText = item.Quantity;
                isFormComplete = false;
            }
        });

        var tableRawMaterial = $('#tbl-raw-material').DataTable();
        tableRawMaterial
            .clear()
            .draw();

        RawMaterialList.map((item, index) => {

            tableRawMaterial.row.add([
                item.text,
                item.Quantity,
                `<button class="btn btn-danger btn-sm icon-btn ml-2 mb-2m" onclick="OnItemDelete(this,${item.ProductId})" title="Delete Record"> <i class="fa fa-trash"></i></button>`
            ]).draw(false);

        });


        if (isFormComplete == false) {
            //tableRawMaterial.clear().draw(null, false);
            return false;
        } else {
            let row = {
                ProductId: Number(RawProductCodeId),
                Quantity: Number(RawQuantity),
                text: RawProductText
            };

            RawMaterialList.push(row);
        }

         tableRawMaterial = $('#tbl-raw-material').DataTable();
        tableRawMaterial
            .clear()
            .draw();

        RawMaterialList.map((item, index) => {

            tableRawMaterial.row.add([
                item.text,
                item.Quantity,
                `<button class="btn btn-danger btn-sm icon-btn ml-2 mb-2m" onclick="OnItemDelete(this,${item.ProductId})" title="Delete Record"> <i class="fa fa-trash"></i></button>`
            ]).draw(false);

        });

    });

    $('#addProduct').click(function () {
        removeValidateForm();
        $('#btnSubmit').prop("disabled", false);

        $('#ProductId').val(0);
        $('#Barcode').prop("disabled", false);
        $('#btnRawMaterial').prop("disabled", false);
        $('#RawMaterial').prop("checked", false);
        $('#btnRawMaterial').show()
        $('#AddRawMaterial').show();
        $('#btnSubmit').hide()
        $('#Description').val('');

        $('#AddRawMaterial').hide();
        $('#AddProduct').show()
        $('#ProductLists').hide()
        $('#hiddenform').text('Add Product');

        var tableRawMaterial = $('#tbl-raw-material').DataTable();
        tableRawMaterial
            .clear()
            .draw();
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
        //$('#Val_Name').html("");
        //$('#Type').removeClass("show-warning");
        //BindGridProduct();

        //$('#AddProduct').hide()
        //$('#ProductLists').show()


    })

    $('#btnRawMaterial').click(function () {
        if (validateForm())
            displayRawMaterial();
            $('#AddRawMaterial').show();
    })

    $('#btnAddProductsWithItems').click(function () {
        console.log(RawMaterialList)
        AddProduct();
    })

});

function OnItemDelete(item, productId) {


    console.log("Before")
    console.log(RawMaterialList)

    

    RawMaterialList = RawMaterialList.filter((item, index) => {
        if (item.ProductId != productId) {
            return item;
        }

    });

    console.log("After")
    console.log(RawMaterialList)


    if (RawMaterialList.length == 0 ) {
        console.log("This is") 
        var tableRawMaterial = $('#tbl-raw-material').DataTable();
        tableRawMaterial
            .clear()
            .draw();
        return;
    }

    var tableRawMaterial = $('#tbl-raw-material').DataTable();

    var tableRawMaterial = $('#tbl-raw-material').DataTable();
    tableRawMaterial
        .clear()
        .draw();

    RawMaterialList.map((item, index) => {

        tableRawMaterial.row.add([
            item.text,
            item.Quantity,
            `<button class="btn btn-danger btn-sm icon-btn ml-2 mb-2m" onclick="OnItemDelete(this,${item.ProductId})" title="Delete Record"> <i class="fa fa-trash"></i></button>`
        ]).draw(false);

    });




  

  

    
}

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
        description: description,
        isActive : true
    };



    if (isEdit == true) {
        $.ajax({
            type: "POST",
            url: "/Product/SaveProductApi",
            dataType: "json",
            data: { model: product, frm: RawMaterialList },
            success: function (response) {

                if (response == "true") {
                    toastr.success('Changes saved');
                    document.getElementById("ProductList").innerHTML = "";

                    setTimeout(() => {
                        $('#AddProduct').css('display', 'none');
                        $('#ProductLists').css('display', '');
                        RawMaterialList = [];
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

        return;
    }

    if (!rawMaterial) {
        console.log('product with items');


        $.ajax({
            type: "POST",
            url: "/Product/SaveProductApi",
            dataType: "json",
            data: { model: product, frm: RawMaterialList},
            success: function (response) {
                if (response == "true") {
                    toastr.success('Product saved');
                    document.getElementById("ProductList").innerHTML = "";

                    setTimeout(() => {
                        $('#AddProduct').css('display', 'none');
                        $('#ProductLists').css('display', '');
                        RawMaterialList = [];
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
        return;
    }


    

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

function EditProduct(pid, bcode, pname, pcode, uom, wid, ptid, p, sm, sp, rm, d) {
    RawMaterialList = [];
    removeValidateForm();
    displayRawMaterial();
    $("#Barcode").prop('disabled', true);

    console.log("This is ", typeof(rm))
    isEdit = true;
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
    if (rm == "true") {
        $('#RawMaterial').prop("checked", true);
        $('#btnRawMaterial').hide()
        $('#AddRawMaterial').hide();
        $('#btnSubmit').show()
        $('#btnSubmit').prop("disabled", false);
    } else {

        $('#RawMaterial').prop("checked", false);
        $('#btnSubmit').prop("disabled", true);
        $('#btnRawMaterial').prop("disabled", true);
        var tableRawMaterial = $('#tbl-raw-material').DataTable(); 
        tableRawMaterial
            .clear()
            .draw();

        $.ajax({
            type: "POST",
            url: "/Product/GetRawMaterialByProductId",
            data: { ProductId: pid },
            success: function (response) {
                RawMaterialList = [];
                response.map((item, index) => {
                    console.log(item);


                    let row = {
                        ProductId: Number(item.ProductId),
                        Quantity: Number(item.Quantity),
                        text: item.text
                    };

                    RawMaterialList.push(row);

                    tableRawMaterial.row.add([
                        item.text,
                        item.Quantity,
                        `<button class="btn btn-danger btn-sm icon-btn ml-2 mb-2m" onclick="OnItemDelete(this,${item.ProductId})" title="Delete Record"> <i class="fa fa-trash"></i></button>`
                    ]).draw(false);
                });

            },
            failure: function (response) {
                console.error(response.responseText);
            },
            error: function (response) {
                console.error(response.responseText);
            }
        });


        $('#AddRawMaterial').show();


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
                    btnview = btnview + '&nbsp;<button class="btn btn-danger btn-sm icon-btn ml-2 mb-2m" onclick="DeleteProduct(' + data.ProductId + ')" title="Delete Record"> <i class="fa fa-trash"></i></button>';
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

function calculateSalesPrice() {
    var price = $('#Price').val();
    var salesMargin = $('#SalesMargin').val();

    if (price !== '' && salesMargin !== '') {
        var salesPrice = parseFloat(price) + (parseFloat(salesMargin) * ((parseFloat(price) / 100)));
        $('#SalesPrice').val(salesPrice.toFixed(2));
    }
}

function calculateSalesMargin() {
    var price = $('#Price').val();
    var salesPrice = $('#SalesPrice').val();

    if (price !== '') {
        if (salesPrice < price) {
            //$('#Val_SalesPrice').html("Sales price cannot be less than the actual price");
            //$('#SalesPrice').addClass("is-invalid");
        } else {
            //$('#Val_SalesPrice').html("");
            //$('#SalesPrice').removeClass("is-invalid");
        }
        let salesMargin = ((parseFloat(salesPrice) - parseFloat(price)) * 100) / parseFloat(price);
        $('#SalesMargin').val(salesMargin.toFixed(2));
    }
}


function displayRawMaterial() {

    $.ajax({
        type: "POST",
        url: "/Product/GetRawMaterialDropdown",
        success: function (response) {

            $("#AddRawMaterialActionControl").html(response);
        },
        failure: function (response) {
            console.error(response.responseText);
        },
        error: function (response) {
            console.error(response.responseText);
        }
    });
}

function DeleteProduct(ProductId) {
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
                url: "/Product/DeleteProductById",
                data: { ProductId: ProductId },
                success: function (response) {


                    console.log(response);
                    if (response == "true") {
                        Swal.fire(
                            'Deleted!',
                            'Your record has been deleted.',
                            'success'
                        )

                        setTimeout(() => {
                            BindGridProduct();
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