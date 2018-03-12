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
//phone.onblur
$("input[name='phone']").blur(function(){
    var str = $("input[name='phone']").val();
    if(str.trim() === ""){
        //输入不能为空
        layer.tips("手机号不能为空", "input[name='phone']",{tips: [2, '#1b9fe2'] });
        return false;
    };
});
// id-card .onblur
$("input[name='id-card']").blur(function(){
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    var str = $("input[name='id-card']").val();
    if(str.trim() !== "" && reg.test(str)==false ){
        //不为空 并且格式不正确
        layer.tips("身份证格式错误", "input[name='id-card']",{tips: [2, '#1b9fe2'] });
        return false;
    };
});