$(document).ready(function () {
	BindGridSupplier();

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
							BindGridSupplier();
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
					btnview = `<button class="btn btn-warning btn-large btn-sm"  style="color: white;" onclick="EditSupplier('${data.Address}','${data.City}','${data.Country}','${data.Description}','${data.IsDeleted}','${data.Name}','${data.PhoneNo}','${data.Suburb}',${data.SupplierId},'${data.Street}' )" title="Edit;"> <i class="fa fa-edit"></i></button>`;
					btnview = btnview + '&nbsp;<button class="btn btn-danger btn-sm icon-btn ml-2 mb-2m" onclick="DeleteSupplier(' + data.SupplierId + ')" title="Delete Record"> <i class="fa fa-trash"></i></button>';
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