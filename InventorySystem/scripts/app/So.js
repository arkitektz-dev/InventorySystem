


$(document).ready(function () {

  
    $("#SalesUserId").change(function () {
        let selectSalesUser = $("#SalesUserId").val();

        $.ajax({
            type: "GET",
            url: "/SalesOrder/GetAssignedSalesCustomer?SalesPersonId=" + selectSalesUser,
            success: function (response) {
                if (response != "[]"){

                    let result = response; 

                    response.map((item, index) => {

                        let rowTemp = `<option value="${item.CustomerId}">${item.Code}</option>`;

                        document.getElementById("CustomerCodeId").innerHTML += rowTemp;
                    });
                    console.log(result);

                }
            },
            failure: function (response) {
                console.error(response.responseText);
            },
            error: function (response) {
                console.error(response.responseText);
            }
        })


    });


    $("#CustomerCodeId").change(function () {
        let selectSalesUser = $("#CustomerCodeId").val();
        console.log(selectSalesUser);
        $.ajax({
            type: "GET",
            url: "/SalesOrder/GetCustomerContact?CustomerId=" + selectSalesUser,
            success: function (response) {
                if (response != "[]") {

                    let result = response;

                    response.map((item, index) => {

                        let rowTemp = `<option value="${item.ContactId}">${item.FirstName} ${item.LastName}</option>`;

                        document.getElementById("ContactId").innerHTML += rowTemp;
                    });
                    console.log(result);

                }
            },
            failure: function (response) {
                console.error(response.responseText);
            },
            error: function (response) {
                console.error(response.responseText);
            }
        })


    });


});
