﻿$(document).ready(function () {
	BindGridWarehouse();

	$('#closeButton').click(function () {
		$('#Val_Name').html("");
		$('#Val_Address').html("");
		$('#WarehouseName').removeClass("show-warning");
		$('#WarehouseAddress').removeClass("show-warning");
		$('#AddWarehouse').css('display', 'none');
		$('#WarehouseLists').css('display', '');

		
		
	});

	$('#addWarehouse').click(function () {
		$('#AddWarehouse').css('display', '');
		$('#WarehouseLists').css('display', 'none');
		$('#hiddenform').text('Add new Warehouse');

		$('#WarehouseId').val(0);
		$('#WarehouseName').val('');
		$('#WarehouseAddress').val('');
		$('#Street').val('');
		$('#Suburb').val('');
		$('#City').val('');
		$('#Country').val('NZ');
		$('#Phone').val('');
		$('#Description').val('');
	});

	$('#btnSubmit').click(function () {
		
		const warehouseId = $('#WarehouseId').val();
		let isFormComplete = true;
		const warehouseName = $('#WarehouseName').val();
		const warehouseAddress = $('#WarehouseAddress').val();
		const street = $('#Street').val();
		const suburb = $('#Suburb').val();
		const city = $('#City').val();
		const country = $('#Country').val();
		const phone = $('#Phone').val();
		const description = $('#Description').val();

		if (warehouseName === '') {
			//toastr.error('Warehouse name is required');
			$('#Val_Name').html("Please enter name");
			$('#WarehouseName').addClass("show-warning");
			isFormComplete = false;
		} else {
			$('#Val_Name').html("");
			$('#WarehouseName').removeClass("show-warning");
		}

		if (warehouseAddress === '') {
			//toastr.error('Address is required');
			$('#Val_Address').html("Please enter address");
			$('#WarehouseAddress').addClass("show-warning");
			isFormComplete = false;
		} else {
			$('#Val_Address').html("");
			$('#WarehouseAddress').removeClass("show-warning");
		}




		if (isFormComplete == false) {
			return;
		}


		 
		const warehouse = {
			warehouseId: warehouseId,
			Name: warehouseName,
			Address: warehouseAddress,
			Street: street,
			Suburb: suburb,
			City: city,
			Country: country,
			PhoneNo: phone,
			Description: description,
			IsDeleted : false
		};

 

		$.ajax({
			type: "POST",
			url: "/Warehouse/SaveWarehouseApi",
			data: { model: warehouse }, 
			success: function (response) {

				

				if (response == "true") {
					toastr.success('Warehouse saved');
					document.getElementById("WarehouseList").innerHTML = "";


					setTimeout(() => {
						$('#AddWarehouse').css('display', 'none');
						$('#WarehouseLists').css('display', '');
						BindGridWarehouse();
					},50)

				
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

function EditWarehouse(Address, City, Country, Description, Name, PhoneNo, Suburb, WarehouseId, Street) {

	$('#WarehouseId').val(WarehouseId);
	$('#WarehouseName').val(Name);
	$('#WarehouseAddress').val(Address);
	$('#Street').val(Street);
	$('#Suburb').val(Suburb);
	$('#City').val(City);
	$('#Country').val(Country);
	$('#Phone').val(PhoneNo);
	$('#Description').val(Description);



	$('#hiddenform').text('Edit Warehouse');
	$('#AddWarehouse').css('display', '');
	$('#WarehouseLists').css('display', 'none');

}

function DeleteWarehouse(warehouseId) {

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
				url: "/Warehouse/WarehouseDelete",
				data: { Id: warehouseId },
				success: function (response) {



					if (response == "true") { 
						Swal.fire(
							'Deleted!',
							'Your record has been deleted.',
							'success'
						)

						setTimeout(() => {
							BindGridWarehouse();
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
		
		}
	})

}

function OnAddNew() {
	
	//var url = "/Warehouse/AddEditWarehouse?Id=" + 0;
	//$("#SubscriptionModelBody").load(url, function () {
	//	$("#ModelSubscription").modal("show");
	//});
}

function OnGridEdit(e) {
	var table = $('#GridWarehouseList').DataTable();
	var data = table.row(e.parentNode).data();
	var url = "/Warehouse/AddEditWarehouse?Id=" + data.WarehouseId;
	$("#SubscriptionModelBody").load(url, function () {
		$("#ModelSubscription").modal("show");
	});
}

function OnGridDelete(e) {
	var data, GetDeleteStatus;
	var table = $('#GridWarehouseList').DataTable();
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
			    AjaxCall('/Warehouse/WarehouseDelete', JSON.stringify({ "Id": data.WarehouseId }), GetDeletedStatus, null);
			}
		});
}
function GetDeletedStatus(data) {
	if (data == "true") {
		BindGridWarehouse();
		showSuccessToast("Warehouse Deleted Successfully.");
	}
	else {
		showErrorToast("Something Went Wrong");
	}
}

function BindGridWarehouse() {
	$('#WarehouseList').html("");
	$('#WarehouseList').append('<table id="GridWarehouseList" class="table table-striped dataTable no-footer" width="100%"></table>');
	$('#GridWarehouseList').DataTable({
		sAjaxSource: '/Warehouse/GetWarehouseList',
		columns: [
			{ title: "Id", data: "WarehouseId", visible: false },
			{ title: "Name", data: "Name" },
			{ title: "City", data: "City" },
			{
				title: "Action",
				data: null,
				render: function (data, type, row) {
					btnview = `<button class="btn btn-warning btn-large btn-sm"  style="color: white;" onclick="EditWarehouse('${data.Address}','${data.City}','${data.Country}','${data.Description}','${data.IsDeleted}','${data.Name}','${data.PhoneNo}','${data.Suburb}',${data.WarehouseId},'${data.Street}' )" title="Edit;"> <i class="fa fa-edit"></i></button>`;
					btnview = btnview + '&nbsp;<button class="btn btn-danger btn-sm icon-btn ml-2 mb-2m" onclick="DeleteWarehouse(' + data.WarehouseId + ')" title="Delete Record"> <i class="fa fa-trash"></i></button>';
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