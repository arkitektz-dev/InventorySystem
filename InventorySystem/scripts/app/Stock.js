$(document).ready(function () {
    BindGridWOption("StockList", "StockList", '/Stock/GetStockList');
});

function OnAddNew() {
	var url = "/Stock/AddEditStock?Id=" + 0;
	$("#SubscriptionModelBody").load(url, function () {
		$("#ModelSubscription").modal("show");
	});
}

function OnGridEdit(e) {
	var table = $('#GridStockList').DataTable();
	var data = table.row(e.parentNode).data();
	var url = "/Stock/AddEditStock?Id=" + data.StockId;
	$("#SubscriptionModelBody").load(url, function () {
		$("#ModelSubscription").modal("show");
	});
}

function OnGridDelete(e) {
	var data, GetDeleteStatus;
	var table = $('#GridStockList').DataTable();
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
				AjaxCall('/Stock/StockDelete', JSON.stringify({ "Id": data.StockId }), GetDeletedStatus, null);
			}
		});
}
function GetDeletedStatus(data) {
	if (data == "true") {
		BindGrid("StockList", "StockList", '/Stock/GetStockList');
		showSuccessToast("Stock Deleted Successfully.");
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

        //fixedColumns: false,
        //"scrollX": true,
        //"autoWidth": false,
    });

}