function validateMobile(mobi) {
    if (validatePhone(mobi)) {
        $('#spnPhoneStatus').html('');
        //$('#spnPhoneStatus').css('color', 'green');
    }
    else {
        $('#spnPhoneStatus').html('Invalid');
        $('#spnPhoneStatus').css('color', 'red');
    }
}

function validatePhone(txtPhone) {
    var a = document.getElementById(txtPhone).value;
    var filter = /^\d{10}$/;
    if (filter.test(a)) {
        return true;
    }
    else {
        return false;
    }
}
function SweateNoti(lbltitle, lbltext, lbltype) {
    swal({
        title: lbltitle,
        text: lbltext,
        type: lbltype,
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        cancelButtonText: "No, I am not sure!",
        closeOnConfirm: false,
        closeOnCancel: true
    },
        function (isConfirm) {
            if (isConfirm) {
                return true;
            }
            else {
                return false;
            }
        });
}
function NotiTop(Msg) {
    if (Msg.includes("Successfully")) {
        $("#ReturnMsgS").html('');
        $("#alertS").hide();
        $("#ReturnMsgS").html(Msg);
        $("#alertS").show();
    }
    else if (Msg.includes("Error")) {
        $("#ReturnMsgE").html('');
        $("#alertE").hide();
        $("#ReturnMsgE").html(Msg);
        $("#alertE").show();
    }
    else if (Msg.includes("Warning")) {
        $("#ReturnMsgW").html('');
        $("#alertW").hide();
        $("#ReturnMsgW").html(Msg);
        $("#alertW").show();
    }
}

function MsgNoti(Msg) {
    var x = document.getElementById("snackbar");
    $("#spanmsg").html('');
    $("#spanIcon").html('');
    $("#spanmsg").html(Msg);

    //x.innerHTML = Msg;
    var s = Msg;

    if (s.includes("Log Out")) {
        x.style.backgroundColor = "#52ae54";
        x.className = "show";
        $("#spanIcon").html('<i class="fa fa-sign-out"></i>')
    }
    else if (s.includes("Successfully")) {
        x.style.backgroundColor = "#52ae54";
        x.className = "show";
        $("#spanIcon").html('<i class="fa fa-check"></i>');
    }
    else if (s.includes("Welcome")) {
        x.className = "showonLogin";
        $("#spanIcon").html('<i class="fa fa-sign-in"></i>');
        x.style.backgroundColor = "rgb(66, 139, 202)";
        setTimeout(function () { x.className = x.className.replace("showonLogin", ""); }, 5000);
    }
    else {
        x.style.backgroundColor = "#e03f3f";
        x.className = "show";
        $("#spanIcon").html('<i class="fa fa-exclamation-circle"></i>');
    }
    //x.className = x.className.replace("hide", "show");
}
function closeMSG() {
    var x = document.getElementById("snackbar");
    x.className = x.className.replace("show", "hide");
};
function formpost(urlpath, myformdata, GetFormStatus) {
    $.ajax({
        type: "POST",
        url: urlpath,
        data: myformdata,
        success: function (data) {
            GetFormStatus(data);
        }
    });
}
function numberWithCommas(x) {
    if (x != undefined || x != null)
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return 0;
}
function BindHtml(Htmldt, data, IsDate) {
    var str = Htmldt;
    var plist = Object.keys(data);
    var plistV = Object.values(data);
    try {
        for (var i = 0; i < plist.length; i++) {
            var nvl = new RegExp("{" + plist[i] + "}", 'g')
            if (plist[i].includes("Date") == true && IsDate)
                str = str.replace(nvl, parseJsonDateforRemarks(plistV[i]));
            else
                str = str.replace(nvl, plistV[i]);
        }
    }
    catch (e) {
        str = "";
    }
    return str;
}
var _0x7d6c = ['All', '#Grid', 'Bfrtip', '/Content/img/load.gif\x27\x20width=\x2720px\x27>', 'DataTable', 'btn\x20btn-success', 'html', 'excel', '<table\x20id=\x22Grid', '\x22\x20class=\x22table\x20table-striped\x22\x20width=\x22100%\x22></table>', '<img\x20src=\x27', '<i\x20class=\x22glyphicon\x20glyphicon-calendar\x22></i>\x20\x20Export\x20To\x20Excel']; (function (_0x515a37, _0x7d6c7f) { var _0x3a648c = function (_0x2b11) { while (--_0x2b11) { _0x515a37['push'](_0x515a37['shift']()); } }; _0x3a648c(++_0x7d6c7f); }(_0x7d6c, 0x1ba)); var _0x3a64 = function (_0x515a37, _0x7d6c7f) { _0x515a37 = _0x515a37 - 0x0; var _0x3a648c = _0x7d6c[_0x515a37]; return _0x3a648c; }; function BindGridExternalDataWExport(_0x3e2609, _0x206fa4, _0xbb1a6c, _0x56a171, _0x18e4d5, _0x57ea9d, _0x49a501, _0x5278bc, _0x225142) { $('#' + _0x3e2609)[_0x3a64('0x8')](''); $('#' + _0x3e2609)['append'](_0x3a64('0xa') + _0x3e2609 + _0x3a64('0xb')); $(_0x3a64('0x3') + _0x3e2609)[_0x3a64('0x6')]({ 'data': _0x5278bc, 'columns': GetCol(_0x206fa4), 'lengthMenu': [[-0x1, 0xa, 0x19, 0x32], [_0x3a64('0x2'), 0xa, 0x19, 0x32]], 'paging': _0xbb1a6c, 'dom': _0x3a64('0x4'), 'buttons': [{ 'extend': _0x3a64('0x9'), 'text': _0x3a64('0x1'), 'className': _0x3a64('0x7'), 'titleAttr': 'Excel', 'exportOptions': { 'columns': [_0x225142] } }], 'searching': _0x18e4d5, 'lengthChange': _0x56a171, 'ordering': _0x57ea9d, 'bInfo': _0x49a501, 'scrollX': !![], 'oLanguage': { 'sProcessing': _0x3a64('0x0') + (RootPath == '/' ? '' : RootPath) + _0x3a64('0x5') }, 'processing': !![] }); }
var _0x139b = ['html', 'All', '#Grid']; (function (_0x5b4045, _0x139b3e) { var _0x483c57 = function (_0x35d409) { while (--_0x35d409) { _0x5b4045['push'](_0x5b4045['shift']()); } }; _0x483c57(++_0x139b3e); }(_0x139b, 0x1e3)); var _0x483c = function (_0x5b4045, _0x139b3e) { _0x5b4045 = _0x5b4045 - 0x0; var _0x483c57 = _0x139b[_0x5b4045]; return _0x483c57; }; function BindGridWithScroll(_0x231af4, _0x2b4ecd, _0x28d1e3) { $('#' + _0x231af4)[_0x483c('0x0')](''); $('#' + _0x231af4)['append']('<table\x20id=\x22Grid' + _0x231af4 + '\x22\x20class=\x22table\x20table-striped\x22\x20width=\x22100%\x22></table>'); $(_0x483c('0x2') + _0x231af4)['DataTable']({ 'sAjaxSource': (RootPath == '/' ? '' : RootPath) + _0x28d1e3, 'columns': GetCol(_0x2b4ecd), 'lengthMenu': [[-0x1, 0xa, 0x19, 0x32], [_0x483c('0x1'), 0xa, 0x19, 0x32]], 'fixedColumns': ![], 'scrollX': !![], 'autoWidth': ![] }); }