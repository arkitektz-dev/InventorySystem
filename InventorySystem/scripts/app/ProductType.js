$(document).ready(function () {
	BindGridProductType();

	$('#closeButton').click(function () {
		$('#Val_Name').html("");
		$('#Type').removeClass("show-warning");

		$('#AddType').css('display', 'none');
	});

	$('#addType').click(function () {
		$('#AddType').css('display', '');
		$('#hiddenform').text('Add New Product Type');

		$('#TypeId').val(0);
		$('#Type').val('');
	});

	$('#btnSubmit').click(function () {

		const typeId = $('#TypeId').val();
		let isFormComplete = true;
		const typeName = $('#Type').val();

		if (typeName === '') {
			$('#Val_Name').html("Please enter type");
			$('#Type').addClass("show-warning");
			isFormComplete = false;
		} else {
			$('#Val_Name').html("");
			$('#Type').removeClass("show-warning");
		}

		console.log('all good here')

		if (isFormComplete == false) {
			return;
		}

		const type = {
			typeId: typeId,
			type: typeName
		};

		console.log(type)

		$.ajax({
			type: "POST",
			url: "/Type/SaveTypeApi",
			data: { model: type },
			success: function (response) {


				if (response == "true") {
					toastr.success('Product Type saved');
					document.getElementById("ProductTypeList").innerHTML = "";


					setTimeout(() => {
						$('#AddType').css('display', 'none');
						BindGridProductType();
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
		toastr.success("Product Type Deleted Successfully.");
	}
	else {
		toastr.error("Something Went Wrong");
	}
}


function EditProductType(TypeId, Type) {

	$('#TypeId').val(TypeId);
	$('#Type').val(Type);

	$('#hiddenform').text('Edit Product Type');
	$('#AddType').css('display', '');

}

function DeleteProductType(typeId) {

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
				url: "/Type/TypeDelete",
				data: { Id: typeId },
				success: function (response) {



					if (response == "true") {
						Swal.fire(
							'Deleted!',
							'Your record has been deleted.',
							'success'
						)

						setTimeout(() => {
							BindGridProductType();
						}, 50)


					} else {
						showErrorToast("Please check and delete again");
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

function BindGridProductType() {
	$('#ProductTypeList').html("");
	$('#ProductTypeList').append('<table id="GridProductTypeList" class="table table-striped dataTable no-footer" width="100%"></table>');
	$('#ProductTypeList').append('<table id="GridProductTypeList" class="table table-striped dataTable no-footer" width="100%"></table>');
	$('#GridProductTypeList').DataTable({
		sAjaxSource: '/Type/GetTypeList',
		columns: [
			{ title: "Id", data: "TypeId", visible: false },
			{ title: "Name", data: "Type" },
			{
				title: "Action",
				data: null,
				render: function (data) {
					btnview = `<button class="btn btn-warning btn-large btn-sm"  style="color: white;" onclick="EditProductType(${data.TypeId},'${data.Type}' )" title="Edit;"> <i class="fa fa-edit"></i></button>`;
					btnview = btnview + '&nbsp;<button class="btn btn-danger btn-sm icon-btn ml-2 mb-2m" onclick="DeleteProductType(' + data.TypeId + ')" title="Delete Record"> <i class="fa fa-trash"></i></button>';
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