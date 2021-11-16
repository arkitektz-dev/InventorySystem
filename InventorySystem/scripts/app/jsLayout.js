jQuery(function ($) {
    var isMobile = window.orientation > -1;
    if (isMobile) {
        $('#btnLogOut').attr("href", '/Login/LogoutApp?IsMobile=true');
        localStorage.setItem("isMobile", "true");
    }
    else{
        localStorage.setItem("isMobile", "false");
    }
    IsMobileApp = localStorage.getItem("isMobile");
    var path = window.location.href; // because the 'href' property of the DOM element is the absolute path
    $('ul a').each(function () {
        if (this.href === path) {
            $(this).parent().addClass('active');
            $("li.active").parent().addClass("is-active");
        }
    });
    //getnoti();
    //setInterval(function () {
    //    getnoti();
    //}, 5000);

});

function showSuccessToast(msg) {
    $.toast({
        heading: 'Success',
        text: msg,
        showHideTransition: 'slide',
        icon: 'success',
        loaderBg: '#28e599',
        position: 'top-right'
    })
}
function showErrorToast(msg) {
    $.toast({
        heading: 'Error',
        text: msg,
        showHideTransition: 'slide',
        icon: 'error',
        loaderBg: '#28e599',
        position: 'top-right'
    })
}
if ($('.Bdatepicker').length > 0) {
    $('.Bdatepicker').datepicker({
        autoclose: true,
        format: 'dd-M-yyyy'
    });
}
if ($('.BdatepickerTime').length > 0) {
    $('.BdatepickerTime').datetimepicker({
        pickDate: false
    });
}
function ShowLoading() {
    document.getElementById('load').style.visibility = "visible";
}
function HideLoading() {
    document.getElementById('load').style.visibility = "hidden";
}
//function getnoti() {
//    AjaxCallAsync("/Home/GetNotificationList", null, BindNoti, null);
//}
//function BindNoti(data) {
//    if (data != '') {
//        $(".notcount").html(data.topten.length);
//        var myElement = document.getElementById("notibind");
//        $(".notibind").html('');
//        var dte = data.latestnoti;
//        for (var i = 0; i < dte.length; i++) {
//            customnotify(dte[i].Title, dte[i].Details, dte[i].DetailsURL);
//        }
//        data = data.topten;
//        for (var i = 0; i < data.length; i++) {
//            $(".notibind").append(BindHtml(myElement.innerHTML, data[i], false));
//        }
//    }
//    else {
//    }
//}
//document.addEventListener('DOMContentLoaded', function () {
//    if (Notification.permission !== "granted") {
//        Notification.requestPermission();
//        $('#defaultSwitchOutline_nn').prop('checked', false);
//        //$("#defaultSwitchOutline_nn").is(':checked')
//    }
//    else
//        $('#defaultSwitchOutline_nn').prop('checked', true);
//});
//function customnotify(title, desc, url) {

//    if (Notification.permission !== "granted") {
//        Notification.requestPermission();
//    }
//    else {
//        var notification = new Notification(title, {
//            icon: 'https://quantiu.com/Content/images/favicon.png',
//            body: desc,
//        });

//        /* Remove the notification from Notification Center when clicked.*/
//        notification.onclick = function () {
//            window.open(url);
//        };

//        /* Callback function when the notification is closed. */
//        notification.onclose = function () {
//            console.log('Notification closed');
//        };

//    }
//}  