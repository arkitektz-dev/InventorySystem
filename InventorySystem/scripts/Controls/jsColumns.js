/// <reference path="jsColumns.js" />
function GetCol(tbl) {
    switch (tbl) {
        case "SupplierList":
            return [
                { title: "Id", data: "SupplierId", visible: false },
                { title: "Name", data: "Name" },
                { title: "Address", data: "Address" },
                { title: "Street", data: "Street" },
                { title: "Suburb", data: "Suburb" },
                { title: "City", data: "City" },
                { title: "Country", data: "Country" },
                { title: "PhoneNo", data: "PhoneNo" },
                { title: "TermOfPayment", data: "TermOfPayment" },
                {
                    title: "Action",
                    data: null,
                    render: function (data, type, row) {
                        btnview = `<button class="btn btn-warning btn-large btn-sm"  style="color: white;" onclick="EditSupplier('${data.Address}','${data.City}','${data.Country}','${data.Description}','${data.IsDeleted}','${data.Name}','${data.PhoneNo}','${data.Suburb}',${data.SupplierId},'${data.Street}' )" title="Edit;"> <i class="fa fa-edit"></i></button>`;
                        btnview = btnview + '&nbsp;<button class="btn btn-danger btn-sm icon-btn ml-2 mb-2m" onclick="DeleteSupplier(' + data.SupplierId + ')" title="Delete Record"> <i class="fa fa-trash"></i></button>';
                        return btnview;
                    },
                    width: "200px",
                    sortable: false,
                    className: "text-center"
                }
            ];
        case "PoItemsList":
            return [
                { title: "Id", data: "PODetailId", visible: false },
                { title: "Barcode", data: "Barcode" },
                { title: "Product", data: "ProductName" },
                { title: "Quantity", data: "Quantity" },
                { title: "Price", data: "Price" },
                { title: "Discount", data: "Discount" },
                { title: "Total", data: "Total" },
                {
                    title: "Action",
                    data: null,
                    render: function (data, type, row) {
                        btnview = '<button class="btn btn-warning btn-large btn-sm"  style="color: white;" onclick="OnGridEdit(this)" title="Edit;"> <i class="fa fa-edit"></i></button>';
                        btnview = btnview + '&nbsp;<button class="btn btn-danger btn-sm icon-btn ml-2 mb-2m" onclick="OnGridDelete(this)" title="Delete Record"> <i class="fa fa-trash"></i></button>';
                        return btnview;
                    },
                    width: "200px",
                    sortable: false,
                    className: "text-center"
                }
            ];
        case "PoList":
            return [
                { title: "Id", data: "POId", visible: false },
                { title: "PO #", data: "PONumber" },
                { title: "Supplier", data: "Supplier" },
                { title: "Status", data: "Status" },
                { title: "Created On", data: "Date", render: function (value) { return parseJsonDateforRemarks(value); } },
                { title: "Delivery", data: "DeliveryDate", render: function (value) { return parseJsonDateforRemarks(value); } },
                {
                    title: "",
                    data: null,
                    render: function (data, type, row) {
                        btnview = '<button class="btn btn-warning btn-large btn-sm"  style="color: white;" onclick="OnGridView(this)" title="PO Items;"> Items </i></button>';
                        return btnview;
                    },
                    width: "200px",
                    sortable: false,
                    className: "text-center"
                },
                {
                    title: "Action",
                    data: null,
                    render: function (data, type, row) {
                        btnview = '<button class="btn btn-warning btn-large btn-sm"  style="color: white;" onclick="OnGridEdit(this)" title="Edit;"> <i class="fa fa-edit"></i></button>';
                        btnview = btnview + '&nbsp;<button class="btn btn-danger btn-sm icon-btn ml-2 mb-2m" onclick="OnGridDelete(this)" title="Delete Record"> <i class="fa fa-trash"></i></button>';
                        return btnview;
                    },
                    width: "200px",
                    sortable: false,
                    className: "text-center"
                }
            ];
        case "WarehouseList":
            return [
                { title: "Id", data: "WarehouseId", visible: false },
                { title: "Name", data: "Name" },
                { title: "City", data: "City" },
                {
                    title: "Action",
                    data: null,
                    render: function (data, type, row) {
                        btnview = `<button class="btn btn-warning btn-large btn-sm"  style="color: white;" onclick="EditWarehouse('${data.Address}','${data.City}','${data.Country}','${data.Description}','${data.IsDeleted}','${data.Name}','${data.PhoneNo}','${data.Suburb}',${data.WarehouseId},'${data.Street}' )" title="Edit;"> <i class="fa fa-edit"></i></button>`;
                        btnview = btnview + '&nbsp;<button class="btn btn-danger btn-sm icon-btn ml-2 mb-2m" onclick="DeleteWarehouse(' + data.WarehouseId +')" title="Delete Record"> <i class="fa fa-trash"></i></button>';
                        return btnview;
                    },
                    width: "200px",
                    sortable: false,
                    className: "text-center"
                }
            ];
        case "StockList":
            return [
                { title: "Id", data: "StockId", visible: false },
                { title: "Product Name", data: "ProductName" },
                { title: "Warehouse", data: "Warehouse" },
                { title: "Location", data: "Location" },
                { title: "Qty Receiving", data: "QuantityReceiving" },
                { title: "Qty On Hand", data: "QuantityOnHand" },
                {
                    title: "Action",
                    data: null,
                    render: function (data, type, row) {
                        btnview = '<button class="btn btn-warning btn-large btn-sm"  style="color: white;" onclick="OnGridEdit(this)" title="Edit;"> <i class="fa fa-edit"></i></button>';
                        btnview = btnview + '&nbsp;<button class="btn btn-danger btn-sm icon-btn ml-2 mb-2m" onclick="OnGridDelete(this)" title="Delete Record"> <i class="fa fa-trash"></i></button>';
                        return btnview;
                    },
                    width: "200px",
                    sortable: false,
                    className: "text-center"
                }
            ];
        case "ProductTypeList":
            return [
                { title: "Id", data: "TypeId", visible: false },
                { title: "Type", data: "Type" },
                {
                    title: "Action",
                    data: null,
                    render: function (data, type, row) {
                        btnview = '<button class="btn btn-warning btn-large btn-sm"  style="color: white;" onclick="OnGridEdit(this)" title="Edit;"> <i class="fa fa-edit"></i></button>';
                        btnview = btnview + '&nbsp;<button class="btn btn-danger btn-sm icon-btn ml-2 mb-2m" onclick="OnGridDelete(this)" title="Delete Record"> <i class="fa fa-trash"></i></button>';
                        return btnview;
                    },
                    width: "200px",
                    sortable: false,
                    className: "text-center"
                }
            ];

        case "ProductList":
            return [
                { title: "ProductIdId", data: "ProductId", visible: false },
                /* { title: "S.No", data: "SNo" },*/
                { title: "Code", data: "ProductCode" },
                { title: "Name", data: "ProductName" },
                { title: "Type", data: "Type" },
                { title: "Unit Of Measure", data: "UnitOfMeasure" },
                { title: "QTY on Hand", data: "QOH" },
                {
                    title: "Action",
                    data: null,
                    render: function (data, type, row) {
                        btnview = '<button class="btn btn-warning btn-large btn-sm"  style="color: white;" onclick="OnGridEdit(this)" title="Edit;"> <i class="fa fa-edit"></i></button>';
                        btnview = btnview + '&nbsp;<button class="btn btn-danger btn-sm icon-btn ml-2 mb-2m" onclick="OnGridDelete(this)" title="Delete Record"> <i class="fa fa-trash"></i></button>';
                        return btnview;
                    },
                    width: "200px",
                    sortable: false,
                    className: "text-center"
                }
            ];
        case "RealTimeList":
            return [
                { title: "Id", data: "ProductId", visible: false },
                { title: "Product", data: "ProductName" },
                { title: "Qty Purchase", data: "Qty_Purchased" },
                { title: "Qty Receiving", data: "Qty_Receiving" },
                { title: "Qty Sales", data: "Qty_Sales" },
                { title: "Qty Shipment", data: "Qty_Shipment" },
                { title: "QTY on Hand", data: "Qty_On_Hand" }
            ];
        case "MList":
            return [
                { title: "Id", data: "MId", visible: false },
                { title: "Code", data: "Code" },
                { title: "Quantity", data: "Quantity" },
                {
                    title: "Action",
                    data: null,
                    render: function (data, type, row) {
                        btnview = '&nbsp;<button class="btn btn-danger btn-sm icon-btn ml-2 mb-2m" onclick="OnGridDelete(this)" title="Delete Record"> <i class="fa fa-trash"></i></button>';
                        return btnview;
                    },
                    width: "200px",
                    sortable: false,
                    className: "text-center"
                }
            ];
        default:
            return [];

    }
}