$(document).ready(function () {
	BindGridWOption("SupplierList", "SupplierList", '/Supplier/GetSupplierList');

	$('#closeButton').click(function () {
		$('#Val_Name').html("");
		$('#Val_Address').html("");
		$('#SupplierName').removeClass("show-warning");
		$('#SupplierAddress').removeClass("show-warning");
		$('#AddSupplier').css('display', 'none');
		$('#SupplierLists').css('display', '');



	});

	$('#addSupplier').click(function () {
		$('#AddSupplier').css('display', '');
		$('#SupplierLists').css('display', 'none');
		$('#hiddenform').text('Add new Vendor');

		$('#SupplierId').val(0);
		$('#SupplierName').val('');
		$('#SupplierAddress').val('');
		$('#Street').val('');
		$('#Suburb').val('');
		$('#City').val('');
		$('#Country').val('NZ');
		$('#Phone').val('');
		$('#Description').val('');
	});

	$('#btnSubmit').click(function () {

		console.log('test test');
		const supplierId = $('#SupplierId').val();
		let isFormComplete = true;
		const supplierName = $('#SupplierName').val();
		const supplierAddress = $('#SupplierAddress').val();
		const street = $('#Street').val();
		const suburb = $('#Suburb').val();
		const city = $('#City').val();
		const country = $('#Country').val();
		const phone = $('#Phone').val();
		const description = $('#Description').val();

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
			$('#SupplierAddress').addClass("show-warning");
			isFormComplete = false;
		} else {
			$('#Val_Address').html("");
			$('#SupplierAddress').removeClass("show-warning");
		}




		if (isFormComplete == false) {
			return;
		}



		const supplier = {
			supplierId: supplierId,
			Name: supplierName,
			Address: supplierAddress,
			Street: street,
			Suburb: suburb,
			City: city,
			Country: country,
			PhoneNo: phone,
			Description: description,
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
						BindGrid("SupplierList", "SupplierList", '/Supplier/GetSupplierList');
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

function EditSupplier(Address, City, Country, Description, IsDeleted, Name, PhoneNo, Suburb, SupplierId, Street) {

	console.log(Street)

	$('#SupplierId').val(SupplierId);
	$('#SupplierName').val(Name);
	$('#SupplierAddress').val(Address);
	$('#Street').val(Street);
	$('#Suburb').val(Suburb);
	$('#City').val(City);
	$('#Country').val(Country);
	$('#Phone').val(PhoneNo);
	$('#Description').val(Description);



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
							BindGrid("SupplierList", "SupplierList", '/Supplier/GetSupplierList');
						}, 2000)


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
		BindGrid("SupplierList", "SupplierList", '/Supplier/GetSupplierList');
		showSuccessToast("Vendor Deleted Successfully.");
	}
	else {
		showErrorToast("Something Went Wrong");
	}
}
