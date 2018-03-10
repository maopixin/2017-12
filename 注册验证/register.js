// email.onblur
$("input[name='email']").blur(function(){
	var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); //正则表达式
    var str = $("input[name='email']").val();
    if(str.trim() === ""){
        //输入不能为空
        layer.tips("邮箱不能为空", "input[name='email']",{tips: [2, '#1b9fe2'] });
        return false;
    }else if(!reg.test(str)){
        //验证不通过
        layer.tips("邮箱格式错误", "input[name='email']",{tips: [2, '#1b9fe2'] });
        return false;
    }else{
        //通过
        $.ajax({
			url:"http://account.dljy.com/user/login/go_check_email",
			data:{
				email:$("input[name='email']").val()
			},
			type:"POST",
			success(data){
				data = JSON.parse(data);
				if(data.status.code!==0){
					data.data?layer.tips(data.data, "input[name='email']",{tips: [2, '#1b9fe2'] }):layer.tips(data.status.msg, "input[name='email']",{tips: [2, '#1b9fe2'] });
				}
			}
		});
    };
});
//usename.onblur
$("input[name='nickname']").blur(function(){
    var str = $("input[name='nickname']").val();
    if(str.trim() === ""){
        //输入不能为空
        layer.tips("用户名不能为空", "input[name='nickname']",{tips: [2, '#1b9fe2'] });
        return false;
    }else{
        //通过
        $.ajax({
			url:"http://account.dljy.com/user/login/go_check_username",
			data:{
				username:$("input[name='nickname']").val()
			},
			type:"POST",
			success(data){
				data = JSON.parse(data);
				if(data.status.code!==0){
					data.data?layer.tips(data.data, "input[name='nickname']",{tips: [2, '#1b9fe2'] }):layer.tips(data.status.msg, "input[name='nickname']",{tips: [2, '#1b9fe2'] });
				}
			}
		});
    };
});

$("button[data-type='register']").click(function () {
    var email = $("input[name=email]").val();
    var nickname = $("input[name=nickname]").val();
    var password = $("input[name=password]").val();
    var code = $("input[name=captcha_code]").val();
    if (email === "") {
        alert("请输入邮箱");
        return false;
    }
    if (nickname === "") {
        alert("请输入用户名称");
        return false;
    }
    if (password === "") {
        alert("请输入密码");
        return false;
    }
    if (code === "") {
        alert("请输入验证码");
        return false;
    }
    $.ajax({
        url: $("input[name=captcha_code]").data("url"),
        type: 'POST',
        data: {code: $("input[name=captcha_code]").val()},
        dataType: 'json',
        timeout: 1000,
        success: function (data) {
            if (data.status.code === 0) {
                $.ajax({
                    url: $("form").attr("action"),
                    type: 'POST',
                    data: {email: email, nickname: nickname, password: password, code: $("input[name=captcha_code]").val()},
                    dataType: 'json',
                    timeout: 1000,
                    success: function (data) {
                        if (data.status.code === 0) {
                            alert("注册成功");
                            location.href = $("input[name=goto]").val();
                        } else {
                            alert(data.status.msg);
                        }
                    },
                    fail: function (err) {
                        console.log(err);
                    }
                });
            } else {
                alert(data.status.msg);
            }
        },
        fail: function (err) {
            console.log(err);
        }
    });

});
$("#getcode_num").click(function () {
    $(this).attr("src", $(this).attr("src").split('?')[0] + "?" + Math.floor(Math.random() * 10));
});