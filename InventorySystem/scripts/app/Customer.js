$(document).ready(function () {
	BindGridCustomer();
	// Basic example
	var example1 = new BSTable("table1");
	example1.init();

	 
	$('#closeButton').click(function () {
		$('#Val_Name').html("");
		$('#Val_Address').html("");
		$('#CustomerName').removeClass("show-warning");
		$('#Address').removeClass("show-warning");
		$('#AddCustomer').css('display', 'none');
		$('#CustomerLists').css('display', '');



	});

	$('#addCustomer').click(function () {
		$('#AddCustomer').css('display', '');
		$('#CustomerLists').css('display', 'none');
		$('#hiddenform').text('Add new customer');

		clearForm();

		//$('#nav-contact-tab').addClass('disabled');
		$('#nav-home-tab').addClass('active show');
		$('#nav-customer').addClass('active show');
		$('#nav-profile-tab').removeClass('active show');
		$('#nav-contact-tab').removeClass('active show');
		$('#nav-address').removeClass('active show');
		$('#nav-contact').removeClass('active show');
		
	});

	$('#btnSubmit').click(function () {

		const CustomerId = $('#CustomerId').val();
		const Code = $('#Code').val();
		let isFormComplete = true;
		let isFirstTab = false;
		const CustomerName = $('#Name').val();
		const UserId = $('#UserId').val();
		const AccountEmail = $('#AccountEmail').val();
		const CustomerGroup = $('#CustomerGroup').val();
		const PaymentTerms = $('#PaymentTerms').val();
		const CreditLimit = $('#CreditLimit').val();
		const BusinessSize = $('#BusinessSize').val();
		const Discount = $('#Discount').val();
		const StopCredit = $('#StopCredit').val();

		const CustomerAddress = $('#Address').val();
		const street = $('#Street').val();
		const city = $('#City').val();
		const state = $('#State').val();
		const postalCode = $('#PostalCode').val();
		const country = $('#Country').val();

		if (CustomerName === '') {
			$('#Val_Name').html("Please enter customer name");
			$('#Name').addClass("show-warning");
			isFormComplete = false;
			isFirstTab = true;

			$('#nav-home-tab').addClass('active show');
			$('#nav-customer').addClass('active show');
			$('#nav-profile-tab').removeClass('active show');
			$('#nav-contact-tab').removeClass('active show');
			$('#nav-address').removeClass('active show');
			$('#nav-contact').removeClass('active show');
		} else {
			$('#Val_Name').html("");
			$('#Name').removeClass("show-warning");
		}

		if (AccountEmail === '') {
			$('#Val_Email').html("Please enter customer email");
			$('#AccountEmail').addClass("show-warning");
			isFormComplete = false;
			isFirstTab = true;
		} else {
			$('#Val_Email').html("");
			$('#AccountEmail').removeClass("show-warning");
		}

		if (isFirstTab && !isFormComplete) {

			$('#nav-home-tab').addClass('active show');
			$('#nav-customer').addClass('active show');
			$('#nav-profile-tab').removeClass('active show');
			$('#nav-contact-tab').removeClass('active show');
			$('#nav-address').removeClass('active show');
			$('#nav-contact').removeClass('active show');

			return;

        }

		const Customer = {
			CustomerId: CustomerId,
			Code: Code,
			Name: CustomerName,
			UserId: UserId,
			AccountEmail: AccountEmail,
			CustomerGroup: CustomerGroup,
			PaymentTerms: PaymentTerms,
			CreditLimit: CreditLimit,
			BusinessSize: BusinessSize,
			Discount: Discount,
			StopCredit: StopCredit,
			Address: CustomerAddress,
			Street: street,
			City: city,
			State: state,
			PostalCode: postalCode,
			Country: country,
		};
		console.log(Customer)


		$.ajax({
			type: "POST",
			url: "/Customer/SaveCustomerApi",
			data: { model: Customer },
			success: function (response) {



				if (response == "true") {
					toastr.success('Customer saved');
					document.getElementById("CustomerList").innerHTML = "";


					setTimeout(() => {
						$('#AddCustomer').css('display', 'none');
						$('#CustomerLists').css('display', '');
						BindGridCustomer();
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
	$('#CustomerId').val(0);
	$('#Name').val('');
	$('#AccountEmail').val('');
	$('#CustomerGroup').val('');
	$('#PaymentTerms').val('');
	$('#CreditLimit').val('');
	$('#BusinessSize').val('');
	$('#StopCredit').val('');
	$('#Address').val('');
	$('#Street').val('');
	$('#State').val('');
	$('#PostalCode').val('');
	$('#City').val('');
	$('#Country').val('NZ');
	$('#Phone').val('');
	$('#Description').val('');
}

function EditCustomer(Code, UserId, AccountEmail, CustomerGroup, PaymentTerms, CreditLimit, BusinessSize, Discount, StopCredit, Address, City, Country, TermOfPayment, Name, PhoneNo, State, PostalCode, CustomerId, Street) {
	clearForm();
	//$('#nav-contact-tab').removeClass('disabled');
	$('#nav-home-tab').addClass('active show');
	$('#nav-customer').addClass('active show');
	$('#nav-profile-tab').removeClass('active show');
	$('#nav-contact-tab').removeClass('active show');
	$('#nav-address').removeClass('active show');
	$('#nav-contact').removeClass('active show');

	if (CustomerId !== "null")
		$('#CustomerId').val(CustomerId);
	if (Code !== "null")
		$('#Code').val(Code);
	if (UserId !== "null")
		$('#UserId').val(UserId);
	if (AccountEmail !== "null")
		$('#AccountEmail').val(AccountEmail);
	if (CustomerGroup !== "null")
		$('#CustomerGroup').val(CustomerGroup);
	if (PaymentTerms !== "null")
		$('#PaymentTerms').val(PaymentTerms);
	if (CreditLimit !== "null")
		$('#CreditLimit').val(CreditLimit);
	if (BusinessSize !== "null")
		$('#BusinessSize').val(BusinessSize);
	if (Discount !== "null")
		$('#Discount').val(Discount);
	if (StopCredit !== "null")
		$('#StopCredit').val(StopCredit);
	if (Name !== "null")
		$('#Name').val(Name);
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



	$('#hiddenform').text('Edit Customer');
	$('#AddCustomer').css('display', '');
	$('#CustomerLists').css('display', 'none');

}

function DeleteCustomer(CustomerId) {

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
				url: "/Customer/CustomerDelete",
				data: { Id: CustomerId },
				success: function (response) {



					if (response == "true") {
						Swal.fire(
							'Deleted!',
							'Your record has been deleted.',
							'success'
						)

						setTimeout(() => {
							BindGridCustomer();
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

	//var url = "/Customer/AddEditCustomer?Id=" + 0;
	//$("#SubscriptionModelBody").load(url, function () {
	//	$("#ModelSubscription").modal("show");
	//});
}

function OnGridEdit(e) {
	var table = $('#GridCustomerList').DataTable();
	var data = table.row(e.parentNode).data();
	var url = "/Customer/AddEditCustomer?Id=" + data.CustomerId;
	$("#SubscriptionModelBody").load(url, function () {
		$("#ModelSubscription").modal("show");
	});
}

function OnGridDelete(e) {
	var data, GetDeleteStatus;
	var table = $('#GridCustomerList').DataTable();
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
				AjaxCall('/Customer/CustomerDelete', JSON.stringify({ "Id": data.CustomerId }), GetDeletedStatus, null);
			}
		});
}
function GetDeletedStatus(data) {
	if (data == "true") {
		BindGridCustomer();
		showSuccessToast("Customer Deleted Successfully.");
	}
	else {
		showErrorToast("Something Went Wrong");
	}
}

function BindGridCustomer() {
	$('#CustomerList').html("");
	$('#CustomerList').append('<table id="GridCustomerList" class="table table-striped dataTable no-footer" width="100%"></table>');
	$('#GridCustomerList').DataTable({
		sAjaxSource: '/Customer/GetCustomerList',
		columns: [
			{ title: "Id", data: "CustomerId", visible: false },
			{ title: "Customer Code", data: "Code" },
			{ title: "Name", data: "Name" },
			{ title: "City", data: "City" },
			{
				title: "Action",
				data: null,
				render: function (data, type, row) {
					btnview = `<button class="btn btn-warning btn-large btn-sm"  style="color: white;" onclick="EditCustomer('${data.Code}','${data.UserId}','${data.AccountEmail}','${data.CustomerGroup}','${data.PaymentTerms}','${data.CreditLimit}','${data.BusinessSize}','${data.Discount}','${data.StopCredit}','${data.Address}','${data.City}','${data.Country}','${data.TermOfPayment}','${data.Name}','${data.PhoneNo}','${data.State}','${data.PostalCode}',${data.CustomerId},'${data.Street}' )" title="Edit;"> <i class="fa fa-edit"></i></button>`;
					btnview = btnview + '&nbsp;<button class="btn btn-danger btn-sm icon-btn ml-2 mb-2m" onclick="DeleteCustomer(' + data.CustomerId + ')" title="Delete Record"> <i class="fa fa-trash"></i></button>';
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