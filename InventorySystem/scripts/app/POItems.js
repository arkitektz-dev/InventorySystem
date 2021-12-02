$(document).ready(function () {
    //BindGrid("PoItemsList", "PoItemsList", '/PoDetail/GetPOItemsList/' + getUrlVars()["Id"]);
    LoadPOInfo(getUrlVars()["Id"]);

});

function LoadPOInfo(PoId) {
    AjaxCall('/Po/GetPo', JSON.stringify({ "Id": PoId }), GetPOData, null);
}

function GetPOData(data) {
    console.log(data);
    $("#txtPoNumber").val("");
    $("#txtPODate").val("");
    $("#txtDelAddress").val("");
    $("#txtStatus").val("");
    $("#txtTOP").val("");
    $("#txtDelDate").val("");
    $("#txtVendor").val("");

    $("#txtPoNumber").val(data.PONumber);
    $("#txtPODate").val(GetFormattedDate(data.Date));
    $("#txtDelAddress").val(data.DeliveryAddress);
    $("#txtStatus").val(data.Status);
    $("#txtTOP").val(data.TermsOfPayment);
    $("#txtDelDate").val(GetFormattedDate(data.DeliveryDate));
    $("#txtVendor").val(data.Supplier);


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

 