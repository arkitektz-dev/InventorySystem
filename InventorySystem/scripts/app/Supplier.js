$(document).ready(function () {
	BindGridSupplier();

	$('#closeButton').click(function () {
		$('#Val_Name').html("");
		$('#Val_Address').html("");
		$('#SupplierName').removeClass("show-warning");
		$('#Address').removeClass("show-warning");
		$('#AddSupplier').css('display', 'none');
		$('#SupplierLists').css('display', '');



	});

	$('#addSupplier').click(function () {
		clearForm();
	});

	$('#btnSubmit').click(function () {

		const supplierId = $('#SupplierId').val();
		let isFormComplete = true;
		const supplierName = $('#SupplierName').val();
		const supplierAddress = $('#Address').val();
		const street = $('#Street').val();
		const city = $('#City').val();
		const state = $('#State').val();
		const postalCode = $('#PostalCode').val();
		const country = $('#Country').val();
		const phone = $('#Phone').val();
		const termOfPayment = $('#TermOfPayment').val();

		if (supplierName === '') {
			$('#Val_Name').html("Please enter name");
			$('#SupplierName').addClass("show-warning");
			isFormComplete = false;
		} else {
			$('#Val_Name').html("");
			$('#SupplierName').removeClass("show-warning");
		}

		if (supplierAddress === '') {
			//toastr.error('Address is required');
			$('#Val_Address').html("Please enter address");
			$('#Address').addClass("show-warning");
			isFormComplete = false;
		} else {
			$('#Val_Address').html("");
			$('#Address').removeClass("show-warning");
		}




		if (isFormComplete == false) {
			return;
		}



		const supplier = {
			supplierId: supplierId,
			Name: supplierName,
			Address: supplierAddress,
			Street: street,
			City: city,
			State: state,
			PostalCode: postalCode,
			Country: country,
			PhoneNo: phone,
			TermOfPayment: termOfPayment,
			IsDeleted: false
		};



		$.ajax({
			type: "POST",
			url: "/Supplier/SaveSupplierApi",
			data: { model: supplier },
			success: function (response) {



				if (response == "true") {
					toastr.success('Vendor saved');
					document.getElementById("SupplierList").innerHTML = "";


					setTimeout(() => {
						$('#AddSupplier').css('display', 'none');
						$('#SupplierLists').css('display', '');
						BindGridSupplier();
					}, 50)


				}
			},
			failure: function (response) {
				console.error(response.responseText);
			},
			error: function (response) {
				console.error(response.responseText);
			}
		});

	})
});

function clearForm() {
	$('#AddSupplier').css('display', '');
	$('#SupplierLists').css('display', 'none');
	$('#hiddenform').text('Add new Vendor');

	$('#SupplierId').val(0);
	$('#SupplierName').val('');
	$('#Address').val('');
	$('#Street').val('');
	$('#State').val('');
	$('#PostalCode').val('');
	$('#City').val('');
	$('#Country').val('NZ');
	$('#Phone').val('');
	$('#Description').val('');
}

function EditSupplier(Address, City, Country, TermOfPayment, IsDeleted, Name, PhoneNo, State, PostalCode, SupplierId, Street) {
	clearForm();
	if (SupplierId !== "null")
		$('#SupplierId').val(SupplierId);
	if (Name !== "null")
		$('#SupplierName').val(Name);
	if (Address !== "null")
		$('#Address').val(Address);
	if (Street !== "null")
		$('#Street').val(Street);
	if (City !== "null")
		$('#City').val(City);
	if (State !== "null")
		$('#State').val(State);
	if (PostalCode !== "null")
		$('#PostalCode').val(PostalCode);
	if (Country !== "null")
		$('#Country').val(Country);
	if (PhoneNo !== "null")
		$('#Phone').val(PhoneNo);
	if (TermOfPayment !== "null")
		$('#TermOfPayment').val(TermOfPayment);



	$('#hiddenform').text('Edit Vendor');
	$('#AddSupplier').css('display', '');
	$('#SupplierLists').css('display', 'none');

}

function DeleteSupplier(supplierId) {

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
				url: "/Supplier/SupplierDelete",
				data: { Id: supplierId },
				success: function (response) {



					if (response == "true") {
						Swal.fire(
							'Deleted!',
							'Your record has been deleted.',
							'success'
						)

						setTimeout(() => {
							BindGridSupplier();
						}, 2000)


					} else {
						showErrorToast("please check and delete again");
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

function OnAddNew() {

	//var url = "/Supplier/AddEditSupplier?Id=" + 0;
	//$("#SubscriptionModelBody").load(url, function () {
	//	$("#ModelSubscription").modal("show");
	//});
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
		BindGridSupplier();
		showSuccessToast("Vendor Deleted Successfully.");
	}
	else {
		showErrorToast("Something Went Wrong");
	}
}

function BindGridSupplier() {
	$('#SupplierList').html("");
	$('#SupplierList').append('<table id="GridSupplierList" class="table table-striped dataTable no-footer" width="100%"></table>');
	$('#GridSupplierList').DataTable({
		sAjaxSource: '/Supplier/GetSupplierList',
		columns: [
			{ title: "Id", data: "SupplierId", visible: false },
			{ title: "Name", data: "Name" },
			{ title: "City", data: "City" },
			{
				title: "Action",
				data: null,
				render: function (data, type, row) {
					btnview = `<button class="btn btn-warning btn-large btn-sm"  style="color: white;" onclick="EditSupplier('${data.Address}','${data.City}','${data.Country}','${data.TermOfPayment}','${data.IsDeleted}','${data.Name}','${data.PhoneNo}','${data.State}','${data.PostalCode}',${data.SupplierId},'${data.Street}' )" title="Edit;"> <i class="fa fa-edit"></i></button>`;
					btnview = btnview + '&nbsp;<button class="btn btn-danger btn-sm icon-btn ml-2 mb-2m" onclick="DeleteSupplier(' + data.SupplierId + ')" title="Delete Record"> <i class="fa fa-trash"></i></button>';
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