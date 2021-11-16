$(document).ready(function () {
	BindGrid("SupplierList", "SupplierList", '/Supplier/GetSupplierList');

	$('#closeButton').click(function () {
		$('#AddSupplier').css('display', 'none');
		$('#listVendor').css('display', '');
	});


});

function OnAddNew() {
	//var url = "/Supplier/AddEditSupplier?Id=" + 0;
	//$("#SubscriptionModelBody").load(url, function () {
	//	$("#ModelSubscription").modal("show");
	//});

	$('#AddSupplier').css('display', '');
	$('#listVendor').css('display', 'none');
}

function OnGridEdit(e) {
	var table = $('#GridSupplierList').DataTable();
	var data = table.row(e.parentNode).data();
	var url = "/Supplier/AddEditSupplier?Id=" + data.SupplierId;
	$("#SubscriptionModelBody").load(url, function () {
		$("#ModelSubscription").modal("show");
	});
}

function OnGridDelete(e) {
	var data, GetDeleteStatus;
	var table = $('#GridSupplierList').DataTable();
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
				AjaxCall('/Supplier/SupplierDelete', JSON.stringify({ "Id": data.SupplierId }), GetDeletedStatus, null);
			}
		});
}
function GetDeletedStatus(data) {
	if (data == "true") {
		BindGrid("SupplierList", "SupplierList", '/Supplier/GetSupplierList');
		showSuccessToast("Supplier Deleted Successfully.");
	}
	else {
		showErrorToast("Something Went Wrong");
	}
}
