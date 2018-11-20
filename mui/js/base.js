var url = 'http://10.75.2.5:8080';
//var url = 'http://192.168.137.150:8080';
var dataArray = getCache();
// 手机验证码
var phoneCode = '';
$(function () {
    //登录
    mui('.applyBtn').on('tap','#signIn' ,function(event) {
        var certNo =  $("#certNo").val();
        var password = $("#password").val();
        if(certNo == "" || password == ""){
            mui.toast('请输入账号密码！');
            return false
        }
        $.ajax({
            url :url+"/claim/userController/login.do?user",
            type: "POST",
            async:false,
            dataType : "json",
            data : {certNo:certNo ,password:password},
            success:function (data) {
                console.log(data)
                var userId = data.user_id;
                var userData = userId+','+certNo;
                if(data.success == false){
                    mui.alert('账号或密码错误！');
                }else{
                    mui.toast('登录成功！');
                    setTimeout(function () {
                        setCache(userData);
                        window.location.href= 'index1.html';
                    },1000);
                }
            },
            error: function () {
                mui.toast('请求超时，检查网络！');
            }
        })
    })
    //用户注册
    mui('.applyBtn').on('tap','#userRegistration' ,function(event) {
        var data = {};
        data.username = $("#username").val();
        data.certType = $("#certificateType").val();
        data.certNo = $("#certNo").val();
        data.phone = $("#phone").val();
        data.password = $("#password").val();

        var phone = $("#phone").val();
        var password = $("#password").val();
        var password1 = $("#password1").val();
        var phoneCodeVal = $("#phoneCode").val();  //验证码
        var pattern = /^1[34578]\d{9}$/;   // 验证手机号
        if(!pattern.test(phone)){
            mui.toast('请正确填写手机号！');
            return false;
        }
        if(phoneCodeVal != phoneCode){
            mui.toast('验证码有误，请重新输入！');
            return false;
        }
        if(password != password1){
            mui.alert('密码不一致，请重新输入', function() {
                $("#password1").val("");
            });
        }
        if(password.length < 6 ){
            mui.alert('密码长度不能小于6位', function() {
                $("#password").val("");
                $("#password1").val("");
            });
        }
        $.ajax({
            type : "POST",
            url: url+"/claim/userController/createUser.do?",
            dataType:"json",
            data: data,
            success:function (data) {
                //console.log(data)
                if(data.success == false){
                    mui.alert('手机号已注册，请重新输入！');
                    $("#phone").val();
                }else{
                    mui.toast('注册成功，请登录！');
                    setTimeout(function () {
                        phoneCode ="";
                        window.location.href= 'login.html';
                    },1000);
                }
            },
            error: function () {
                mui.toast('请求超时，检查网络！');
            }
        })
    })
    //忘记密码
    mui('.applyBtn').on('tap','#forgetPassword' ,function(event) {
        var certNo = $("#certNo").val();
        var phone = $("#phone").val();
        var password = $("#password").val();
        var password1 = $("#password1").val();
        var phoneCodeVal = $("#phoneCode").val();  //验证码
        if(certNo == "" || phone =="" || password ==""){
            mui.toast('证件号码，手机号，新密码不能为空！');
        }
        if(phoneCodeVal != phoneCode){
            mui.toast('验证码有误，请重新输入！');
            return false;
        }
        if(password != password1){
            mui.alert('确认密码不一致，请重新输入', function() {
                $("#password1").val("");
            });
        }
        $.ajax({
            url : url+"/claim/userController/updateUser.do?",
            type : 'POST',
            dataType : "json",
            data: {certNo:certNo, phone:phone, password:password},
            success:function (data) {
                if(data.success == false){
                    mui.alert('手机号有误，请重新输入！');
                    $("#phone").val();
                }else {
                    mui.toast('修改成功，请登录！');
                    setTimeout(function () {
                        window.location.href= 'login.html';
                    },1000);
                }
            },
            error: function () {
                mui.toast('请求超时，检查网络！');
            }
        })
    })

    //身份信息
    mui('.applyBtn').on('tap','#identityUser' ,function(event) {
        var data= {};
        data.username = $("#username").val();
        data.certType = $("#certificateType").val();
        data.certNo = $("#certNo").val();
        data.phone = dataArray[1];
        $.ajax({
            url: url +'/claim/userController/updateUserByPhone.do?',
            type: "POST",
            dataType :"json",
            data : data,
            success:function (data) {
                if(data.success == false){
                    mui.toast('请检查网络！');
                }else{
                    mui.toast('修改成功');
                    setTimeout(function () {
                        window.location.href= 'index1.html';
                    },1000);
                }
            },
            error: function () {
                mui.toast('请求超时，检查网络！');
            }
        })
    })

    //获取手机验证码
    mui(".registerUl").on('tap',".getCode",function () {
        $(this).addClass("getCodeBac");
        var phone = $("#phone").val();
        if(phone == ""){
            mui.toast('请输入手机号！');
            return false;
        }
        var id = $(this).attr("id");
        if(id == "getRegCoed"){
            $.ajax({
                url : url +'/claim/userController/verification.do?phone='+phone,
                type:"POST",
                dataType: "json",
                success:function (data) {
                    if(data.success == true){
                        phoneCode = data.data;
                        getCode();
                    }else {
                        mui.toast('手机号已注册，请登录！');
                        setTimeout(function () {
                            window.location.href= 'login.html';
                        },1000);
                        /*$(".getCode").val("获取验证码");
                        $(".getCode").removeClass("getCodeBac");
                        $(".getCode").attr("disabled",false);*/
                    }
                },
                error: function () {
                    mui.toast('请求超时，检查网络！');
                }
            })
        }
        if(id == "getPassCoed"){
            $.ajax({
                url : url +'/claim/userController/updateVerification.do?phone='+phone,
                type:"POST",
                dataType: "json",
                success:function (data) {
                    if(data.success == true){
                        phoneCode = data.data;
                        getCode();
                    }else {
                        mui.toast('手机号未注册，请注册！');
                        $(".getCode").val("获取验证码");
                        $(".getCode").removeClass("getCodeBac");
                        $(".getCode").attr("disabled",false);
                    }
                },
                error: function () {
                    mui.toast('请求超时，检查网络！');
                }
            })
        }
    })
})

//理赔申请
function formDataAjax(status) {
    var data = {};
    if(status == "1"){
        data.status = 1;
    }
    if(status == "0"){
        data.status = 0;
    }
    data.userId = dataArray[0];
    data.name = $("#name").val();
    data.sex = $("#sex").val();
    data.relation = $("#relation").val();
    data.certNo = $("#certNo").val();
    data.phone = $("#phone").val();
    data.mail = $("#mail").val();
    data.cause = $("#cause").val();
    //身份证
    data.certImg1 = $("#input_cert_img1").val();
    data.certImg2 = $("#input_cert_img2").val();
    data.certImg3 = $("#input_cert_img3").val();
    //病例
    data.caseImg1 = $("#input_case_img1").val();
    data.caseImg2 = $("#input_case_img2").val();
    //诊断书
    data.diagnosisImg1 = $("#input_diagnosis_img1").val();
    data.diagnosisImg2 = $("#input_diagnosis_img2").val();
    //发票收据
    data.invoiceImg1 = $("#input_invoice_img1").val();
    data.invoiceImg2 = $("#input_invoice_img2").val();
    data.invoiceImg3 = $("#input_invoice_img3").val();
    data.invoiceImg4 = $("#input_invoice_img4").val();
    data.invoiceImg5 = $("#input_invoice_img5").val();
    data.invoiceImg6 = $("#input_invoice_img6").val();
    data.invoiceImg7 = $("#input_invoice_img7").val();
    data.invoiceImg8 = $("#input_invoice_img8").val();
    data.invoiceImg9 = $("#input_invoice_img9").val();
    data.invoiceImg10 = $("#input_invoice_img10").val();
    //其他
    data.othersImg1 = $("#input_others_img1").val();
    data.othersImg2 = $("#input_others_img2").val();
    data.othersImg3 = $("#input_others_img3").val();
    data.othersImg4 = $("#input_others_img4").val();
    data.othersImg5 = $("#input_others_img5").val();
    // 修改判断
    var inputUpdate = $("#inputUpdate").val();
    var urlText = window.location.href;
    var textId = urlText.split("=");

    if(inputUpdate == "update"){
        $.ajax({
            url : url +'/claim/applyController/updateApply.do?id='+textId[1],
            type: 'POST',
            data : data,
            dataType : 'json',
            success:function (data) {
                if(data.success == true){
                    mui.toast('修改成功！');
                    setTimeout(function () {
                        if(status == "1"){
                            window.location.href= 'apply3.html';
                        }
                        if (status == "0") {
                            window.location.href= 'list.html';
                        }
                    },1000);
                }
            },
            error: function () {
                mui.toast('请求超时，检查网络！');
            }
        })
    }else{
        $.ajax({
            url : url +'/claim/applyController/applyClaim.do?',
            type: 'POST',
            data : data,
            dataType : 'json',
            success:function (data) {
                if(data.success == true){
                    mui.toast('添加成功！');
                    setTimeout(function () {
                        if(status == "1"){
                            window.location.href= 'apply3.html';
                        }
                        if (status == "0") {
                            window.location.href= 'list.html';
                        }
                    },1000);
                }
            },
            error: function () {
                mui.toast('请求超时，检查网络！');
            }
        })
    }
}

//设置缓存数据
function setCache(cache) {
    localStorage.setItem("name",cache);
}
//获取缓存数据
function getCache() {
    var  userId = localStorage.getItem("name");
    if(userId == null){
        return false
    }
    var dataSplit = userId.split(",");
    return dataSplit
}
//删除缓存数据
function removeCache() {
    localStorage.removeItem("name")
}
// 获取手机验证码
var countdownTime = 60;
function getCode() {
    if(countdownTime==0){
        $(".getCode").attr("disabled",false);
        $(".getCode").val("获取验证码");
        $(".getCode").removeClass("getCodeBac");
        countdownTime=60;
        return false;
    }
    else{
        $(".getCode").attr("disabled",true);
        $(".getCode").val(countdownTime+"s");
        $(".getCode").addClass("getCodeBac");
        countdownTime--;
    }
    setTimeout(function(){
        getCode();
    },1000);
}
// 验证身份证
function isCardNo(card) {
    var pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return pattern.test(card);
}
// 判断身份证性别
function cardSex(UUserCard) {
    if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
        $("#sex").val("男");
    } else {
        $("#sex").val("女");
    }
}


