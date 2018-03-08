var arr = ['信息提交成功，请至您的邮箱点击激活码确认。','输入不能为空。','请输入正确的邮箱地址。',"新密码格式设置错误。","两次输入的密码不相同，请检查。","请输入新密码，再进行提交"]

$('#updata').click(function(){
    check();
})

// 倒计时然后跳转
function outUrlStart(){
    var timer = 0;
    timer = setInterval(function(){
        console.log($('#time').html())
        $('#time').html(Number($('#time').html())-1);
        if(Number($('#time').html())===0){
            // 这里是要跳转的页面
            window.location.href='http://www.dljy.com';
        }
    },1000);
};

// 验证邮箱
function check(){
    var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); //正则表达式
    var obj = document.getElementById("use-name"); //要验证的对象
    if(obj.value === ""){
        //输入不能为空
        showTips(1)
        return false;
    }else if(!reg.test(obj.value)){
        //验证不通过
        showTips(2)
        return false;
    }else{
        //通过
        showTips(3)
        return true;
    };
};

// 弹窗

function showTips(num,type){
    type=type?type:0;
	var div = document.createElement('div');
	div.id = "jump-box";
	div.style = "display:flex;position:fixed;z-index:99999;top:0;left:0;right:0;bottom:0;background-color:rgba(0, 0, 0, 0.5)";
	div.innerHTML = `<div class="jump-content" style="margin:auto;width:400px;background-color:#fff;border-radius:6px">
			            <h4 style="margin:0;padding:0 0 0 24px;line-height:48px;border-bottom:1px solid #dcdcdc">温馨提示</h4>
			            <div class="tip-mes" style="padding:16px 40px;font-size:14px;line-height:26px;word-break: break-all;">
			            	${arr[num]}
                        </div>
                        <div class="btn-box" style="padding:10px 30px 14px;height:27px;font-size: 14px;">
			                <a id="enter" class="btn active" style="background-color:#3399ff;color:#fff;width:55px;height:27px;line-height:27px;text-align:center;border-radius:6px;cursor:pointer;margin-left:10px;float: right;">确定</a>
			            </div>
			        </div>`;
    document.body.appendChild(div);
    document.onclick = function(){
        reMoveMexBox(type);
    };
};
function reMoveMexBox(type){
    document.getElementById("jump-box").remove();
    document.onclick = null;
    if(type===1){
        $('#password').focus();
    }else if(type===2){
        $('#repassword').focus();
    }
};

// 密码是否合法
function testPassword(id){
    var regex = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,16}$/;
    return regex.test($('#'+id).val());
}

$('#resetpassword').click(function(){
    if(testPassword("password")){
        // 合法
        if($('#password').val()===$('#repassword').val()){
            // 审核相同，可以提交
            
        }else{
            // 审核失败，密码不同
            showTips(4,2);
            return false;
        }
    }else{
        // 不合法
        showTips(3,1);
        return false;
    };
});
