$(document).ready(function () {
	BindGrid("ProductTypeList", "ProductTypeList", '/Type/GetTypeList');
});

function OnAddNew() {
	var url = "/Type/AddEditType?Id=" + 0;
	$("#SubscriptionModelBody").load(url, function () {
		$("#ModelSubscription").modal("show");
	});
}

function OnGridEdit(e) {
	var table = $('#GridProductTypeList').DataTable();
	var data = table.row(e.parentNode).data();
	var url = "/Type/AddEditType?Id=" + data.TypeId;
	$("#SubscriptionModelBody").load(url, function () {
		$("#ModelSubscription").modal("show");
	});
}

function OnGridDelete(e) {
	var data, GetDeleteStatus;
	var table = $('#GridProductTypeList').DataTable();
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
			    AjaxCall('/Type/TypeDelete', JSON.stringify({ "Id": data.TypeId }), GetDeletedStatus, null);
			}
		});
}
function GetDeletedStatus(data) {
	if (data == "true") {
		BindGrid("ProductTypeList", "ProductTypeList", '/Type/GetTypeList');
		showSuccessToast("Product Type Deleted Successfully.");
	}
	else {
		showErrorToast("Something Went Wrong");
	}
}
