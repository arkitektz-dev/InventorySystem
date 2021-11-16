$(document).ready(function () {
    BindGridWOption("PoList", "PoList", '/Po/GetPoList');
});

function OnAddNew() {
    var url = "/Po/AddEditPo?Id=" + 0;
    $("#SubscriptionModelBody").load(url, function () {
        $("#ModelSubscription").modal("show");
    });
}
function OnGridEdit(e) {
    var table = $('#GridPoList').DataTable();
    var data = table.row(e.parentNode).data();
    var url = "/Po/AddEditPo?Id=" + data.POId;
    $("#SubscriptionModelBody").load(url, function () {
        $("#ModelSubscription").modal("show");
    });
}
function OnGridView(e) {
    var table = $('#GridPoList').DataTable();
    var data = table.row(e.parentNode).data();
    var url = "/PoDetail/Index?Id=" + data.POId;
    window.location.replace(url);
}
function OnGridDelete(e) {
    var data, GetDeleteStatus;
    var table = $('#GridPoList').DataTable();
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
                AjaxCall('/Po/PoDelete', JSON.stringify({ "Id": data.POId }), GetDeletedStatus, null);
            }
        });
}
function GetDeletedStatus(data) {
    if (data == "true") {
        BindGrid("PoList", "PoList", '/Po/GetPoList');
        showSuccessToast("Purchase Order Deleted Successfully.");
    }
    else {
        showErrorToast("Something Went Wrong");
    }
}

function BindGridWOption(divid, tbl, url) {
    $('#' + divid).html("");
    $('#' + divid).append('<table id="Grid' + divid + '" class="table table-striped dataTable no-footer" width="100%"></table>');
    $('#Grid' + divid).DataTable({
        sAjaxSource: (RootPath == '/' ? '' : RootPath) + url,
        columns: GetCol(tbl),
        dom: 'Blfrtip',
        //buttons: ['excelHtml5', 'csvHtml5', 'pdfHtml5'],
        buttons: [
            {
                extend: 'csvHtml5',
                exportOptions: {
                    columns: [0,1,2,3,4,5,6,7]
                }
            },
            {
                extend: 'excelHtml5',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6, 7]
                }
            },
            {
                extend: 'pdfHtml5',
                exportOptions: {
                    columns: [0, 1, 2, 3, 4, 5, 6, 7]
                }
            }
        ],
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "pageLength": 50,
        initComplete: function () {
            var btns = $('.dt-button');
            btns.addClass('btn btn-success btn-sm');
            btns.css('margin', '2px');
            btns.removeClass('dt-button');

        }

        //fixedColumns: false,
        //"scrollX": true,
        //"autoWidth": false,
    });

}
