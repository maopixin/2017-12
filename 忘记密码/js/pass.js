var arr = ['信息提交成功，请至您的邮箱点击激活码确认。','输入不能为空。','请输入正确的邮箱地址。',"新密码格式设置错误。","两次输入的密码不相同，请检查。","请输入新密码，再进行提交","提交过程中出现了一些问题，请您稍后重试。"]

// 验证邮箱按钮提交时
$('#updata').click(function(){
    var reg = new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$"); //正则表达式
    var obj = document.getElementById("use-name"); //要验证的对象
    if(obj.value === ""){
        //输入不能为空
        showTips(1);
        return false;
    }else if(!reg.test(obj.value)){
        //验证不通过
        showTips(2);
        return false;
    }else{
        //通过
        $.ajax({
            url:"http://account.dljy.com/user/login/email_send",
            data:{
                email:$('#use-name').val().trim()
            },
            type:"POST",
            success(data){
                if(data.status.code===0){
                    // 提交成功
                    showTips(3);
                }else{
                    showTips(6);
                }  
            },
            error(){
                showTips(6);
            }
        });
    };
})

// 修改密码 按钮提交时
$('#resetpassword').click(function(){
    if(testPassword("password")){
        // 合法
        if($('#password').val()===$('#repassword').val()){
            // 审核相同，可以提交
            // 拿到隐藏得邮箱地址
            var email_url = $('#eamil').html();
            $.ajax({
                url:"",
                data:{

                },
                success(data){
                    if(data.status.code===0){//success  登录 然后跳转 第三步  ， 第三部自动跳转
                        
                    }else{
                        showTips(6);
                    }
                },
                error(){
                    showTips(6);
                }
            })
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

// 弹窗

function showTips(num,type){
    type=type?type:0;
    console.log(type)
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
    document.body.onclick = function(){
        console.log(1)
        reMoveMexBox(type);
    };
};
function reMoveMexBox(type){
    document.getElementById("jump-box").remove();
    document.body.onclick = null;
    if(type===1){
        $('#password').focus();
    }else if(type===2){
        $('#repassword').focus();
    };
};

// 密码是否合法
function testPassword(id){
    var regex = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,16}$/;
    return regex.test($('#'+id).val());
};

