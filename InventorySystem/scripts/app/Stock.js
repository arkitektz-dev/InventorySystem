

$(document).ready(function () {
	BindGridStock();


	$('#addStock').click(function () {
		$('#AddStock').css('display', '');
		$('#StockLists').css('display', 'none');

		$("#StockId").val('');
		$("#Barcode").val('');
		$("#ProductName").val('');
		$("#Location").val('');
		$("#WarehouseId").val('');
		$("#QuantityOnHand").val('');
		$("#QuantityOnReceiving").val('');
	});

	$('#btnSubmit').click(function () { 

		let isFormComplete = true;
		const StockId = $("#StockId").val();
		const Barcode = $("#Barcode").val();
		const ProductName = $("#ProductName").val();
		const Location = $("#Location").val();
		const WarehouseId = $("#WarehouseId").val();
		const QuantityOnHand = $("#QuantityOnHand").val();
		const QuantityOnReceiving = $("#QuantityOnReceiving").val();

	


		if (QuantityOnReceiving == '') {
			$('#Val_QuantityOnReceiving').html("Please enter Quantity on receiving");
			$('#QuantityOnReceiving').addClass("is-invalid");
			isFormComplete = false;
		} else {
			$('#Val_QuantityOnReceiving').html("");
			$('#QuantityOnReceiving').removeClass("is-invalid");
		}


		if (QuantityOnHand == '') {
			$('#Val_QuantityOnHand').html("Please enter Quantity on hand");
			$('#QuantityOnHand').addClass("is-invalid");
			isFormComplete = false;
		} else {
			$('#Val_QuantityOnHand').html("");
			$('#QuantityOnHand').removeClass("is-invalid");
		}

		if (WarehouseId == '') {
			$('#Val_Warehouse').html("Please enter Warehouse");
			$('#WarehouseId').addClass("is-invalid");
			isFormComplete = false;
		} else {
			$('#Val_Warehouse').html("");
			$('#WarehouseId').removeClass("is-invalid");
		}

		if (Barcode == '') {
			$('#Val_Barcode').html("Please enter Barcode");
			$('#Barcode').addClass("is-invalid");
			isFormComplete = false;
		} else {
			$('#Val_Barcode').html("");
			$('#Barcode').removeClass("is-invalid");
		}


		if (ProductName == '') {
			$('#Val_ProductName').html("Please enter ProductName");
			$('#ProductName').addClass("is-invalid");
			isFormComplete = false;
		} else {
			$('#Val_ProductName').html("");
			$('#ProductName').removeClass("is-invalid");
		}


		if (Location == '') {
			$('#Val_Location').html("Please enter Location");
			$('#Location').addClass("is-invalid");
			isFormComplete = false;
		} else {
			$('#Val_Location').html("");
			$('#Location').removeClass("is-invalid");
		}

		if (isFormComplete == false) {
			return;
		}

		var row = {
			StockId,
			Barcode,
			ProductName,
			Location,
			WarehouseId,
			QuantityOnHand,
			QuantityOnReceiving
		}


		$.ajax({
			type: "POST",
			url: "/Stock/SaveStock",
			dataType: "json",
			data: { model: row },
			success: function (response) {

				if (response == "true") {
					setTimeout(() => {
						BindGridStock();
						$('#AddStock').css('display', 'none');
						$('#StockLists').css('display', '');

					},1000)
				}
			

			},
			failure: function (response) {
				console.error(response.responseText);
			},
			error: function (response) {
				console.error(response.responseText);
			}
		});

	});


	$('#closeButton').click(function () {
		$('#AddStock').css('display', 'none');
		$('#StockLists').css('display', '');

		 $("#StockId").val('');
		 $("#Barcode").val('');
		 $("#ProductName").val('');
		 $("#Location").val('');
		 $("#WarehouseId").val('');
		 $("#QuantityOnHand").val('');
		 $("#QuantityOnReceiving").val('');

		 



	});

});

function GetProductDetail() {
	const Barcode = $("#Barcode").val();

	$.ajax({
		type: "POST",
		url: "/Stock/GetStockByBarcode",
		data: { Barcode },
		success: function (response) {
			console.log(response);

			if (response != "false") {
				$("#ProductName").val(response.obj.ProductName);
				$("#WarehouseId").val(response.obj.Name);
			}
			else {
				$("#ProductName").val('');
				$("#WarehouseId").val('');
				toastr.error('Please enter valid barcode');
			}



		}, error: function (response) {
			console.log(response)
		}
	});

}

function EditStock(StockId,WarehouseId,ProductCode,ProductName,Location,QuantityReceiving,QuantityOnHand, Barcode,warehouseName) {
	$("#Barcode").val(Barcode);
	$("#ProductName").val(ProductName);
	$("#Location").val(Location);
	$("#WarehouseId").val(warehouseName);
	$("#QuantityOnHand").val(QuantityOnHand);
	$("#QuantityOnReceiving").val(QuantityReceiving);
	$("#StockId").val(StockId);

	$('#AddStock').css('display', '');
	$('#StockLists').css('display', 'none');
}


function DeleteStockById(StockId) {

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
				url: "/Stock/DeleteStockById",
				data: { StockId: StockId },
				success: function (response) {



					if (response == "true") {
						Swal.fire(
							'Deleted!',
							'Your record has been deleted.',
							'success'
						)

						setTimeout(() => {
							BindGridStock();
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


function BindGridStock() {
	$('#StockList').html("");
	$('#StockList').append('<table id="GridStockList" class="table table-striped dataTable no-footer" width="100%"></table>');
	$('#StockList').append('<table id="GridStockList" class="table table-striped dataTable no-footer" width="100%"></table>');
	$('#GridStockList').DataTable({
		sAjaxSource: '/Stock/GetStockList',
		columns: [
			{ title: "Code", data: "ProductCode"},
			{ title: "Name", data: "ProductName" },
			{ title: "Location", data: "Location" },
			{ title: "Qty Reciveing", data: "QuantityReceiving" },
			{ title: "Qty on Hand", data: "QuantityOnHand" },
			{
				title: "Action",
				data: null,
				render: function (data, type, row) {
					//console.log(data);
					btnview = `<button class="btn btn-warning btn-large btn-sm"  style="color: white;" onclick="EditStock(${data.StockId}, ${data.WarehouseId} , '${data.ProductCode}', '${data.ProductName}', '${data.Location}', ${data.QuantityReceiving}, ${data.QuantityOnHand}, '${data.Barcode}', '${data.Name}')" title="Edit;"> <i class="fa fa-edit"></i></button>`;
					btnview = btnview + `&nbsp;<button class="btn btn-danger btn-sm icon-btn ml-2 mb-2m" onclick="DeleteStockById(${data.StockId})" title="Delete Record"> <i class="fa fa-trash"></i></button>`;
					return btnview;
				},
				width: "200px",
				sortable: false,
				className: "text-center"
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