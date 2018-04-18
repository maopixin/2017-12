var arr = ['信息提交成功，请至您的邮箱点击激活码确认。', '输入不能为空。', '请输入正确的邮箱地址。', "新密码格式设置错误。", "两次输入的密码不相同，请检查。", "请输入新密码，再进行提交", "提交过程中出现了一些问题，请您稍后重试。"]

// 验证邮箱按钮提交时
$('#updata').click(function () {
    var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); //正则表达式
    var obj = document.getElementById("use-name"); //要验证的对象
    if (obj.value === "") {
        //输入不能为空
        dialog.toast('输入不能为空', 'error', 100000,function(){
        		$(obj).focus();
        });
        return false;
    } else if (!reg.test(obj.value)) {
        //验证不通过
        dialog.toast('请输入正确的邮箱地址', 'error', 1000,function(){
        		$(obj).focus();
        });
        return false;
    } else {
        //通过
        $.ajax({
            url: "http://account.dljy.com/user/login/go_email_send",
            data: {
                email: $('#use-name').val().trim()
            },
            type: "POST",
            success(result) {
                var data = JSON.parse(result);
                if (data.status.code === 0) {
                    dialog.toast('信息提交成功，请至您的邮箱点击激活码确认', 'success', 1000,function(){
			        		
			        });
                } else {
                    dialog.toast(data.data, 'error', 1000,function(){
			        		$(obj).focus();
			        });
                }
            },
            error() {
                dialog.toast('提交过程中出现了一些问题，请您稍后重试', 'error', 1000);
            }
        });
    }
    ;
})

// 修改密码 按钮提交时
$('#resetpassword').click(function () {
    if (testPassword("password")) {
        // 合法
        if ($('#password').val() === $('#repassword').val()) {
            var _this = this;
            $(_this).val("提交中");
            $.ajax({
                url: "http://account.dljy.com/user/login/go_set_up_password",
                type: "POST",
                data: {
                    email: $('#email').val().trim(),
                    password: $('#password').val().trim(),
                    confirm_password: $('#repassword').val().trim()
                },
                success(result) {
                    var data = JSON.parse(result);
                    if (data.status.code === 0) {//success  登录 然后跳转 第三步  ， 第三部自动跳转
                        location.href = "http://account.dljy.com/user/login/complete";
                    } else {
                        dialog.toast(data.data, 'error', 1000);
                        $(_this).val("提交");
                    }
                },
                error() {
                    dialog.toast('提交过程中出现了一些问题，请您稍后重试', 'error', 1000);
                    $(_this).val("提交");
                }
            });
        } else {
            // 审核失败，密码不同
            dialog.toast('两次输入的密码不相同，请检查','error',1000);
            return false;
        }
    } else {
        // 不合法新密码格式设置错误
        dialog.toast('新密码格式设置错误', 'error', 1000,function(){
        		$('#password').focus();
        });
        return false;
    }
    ;
});


// 密码是否合法
function testPassword(id) {
    var regex = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,16}$/;
    return regex.test($('#' + id).val());
}
;
