$(document).ready(function () {
    //BindGrid("PoItemsList", "PoItemsList", '/PoDetail/GetPOItemsList/' + getUrlVars()["Id"]);
    LoadPOInfo(getUrlVars()["Id"]);

});

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

function OnAddNew() {
	var url = "/PoDetail/AddEditPoItem?Id=" + 0;
	$("#SubscriptionModelBody").load(url, function () {
		$("#ModelSubscription").modal("show");
	});
}
function OnBack() {
    var url = "/Po/Index";
    window.location.replace(url);
}
function OnGridEdit(e) {
	var table = $('#GridPoItemsList').DataTable();
	var data = table.row(e.parentNode).data();
	var url = "/PoDetail/AddEditPoItem?Id=" + data.PODetailId;
	$("#SubscriptionModelBody").load(url, function () {
		$("#ModelSubscription").modal("show");
	});
}

function OnGridDelete(e) {
	var data, GetDeleteStatus;
	var table = $('#GridPoItemsList').DataTable();
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
				AjaxCall('/PoDetail/PoItemDelete', JSON.stringify({ "Id": data.PODetailId }), GetDeletedStatus, null);
			}
		});
}
function GetDeletedStatus(data) {
	if (data == "true") {
		BindGrid("PoItemsList", "PoItemsList", '/PoDetail/GetPOItemsList/' + getUrlVars()["Id"]);
		showSuccessToast("PO Item Order Deleted Successfully.");
	}
	else {
		showErrorToast("Something Went Wrong");
	}
}

function getUrlVars() {
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for (var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars;
}
