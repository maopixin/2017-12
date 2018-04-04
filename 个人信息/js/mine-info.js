var phone = '18364076997';

function showTips(str,fn){
	let div = document.createElement('div');
	div.id = "jump-box";
	div.style = "display:flex;position:fixed;top:0;left:0;right:0;bottom:0;background-color:rgba(0, 0, 0, 0.5)";
	div.innerHTML = `<div class="jump-content" style="margin:auto;width:400px;background-color:#fff;border-radius:6px">
			            <h4 style="margin:0;padding:0 0 0 24px;line-height:48px;border-bottom:1px solid #dcdcdc">温馨提示</h4>
			            <div class="tip-mes" style="padding:16px 40px;font-size:14px;line-height:26px;word-break: break-all;">
			            	${str}
			            </div>
			            <div class="btn-box" style="padding:10px 30px 14px;height:27px;font-size: 14px;">
			                <a id="enter" class="btn active" style="background-color:#3399ff;color:#fff;width:55px;height:27px;line-height:27px;text-align:center;border-radius:6px;cursor:pointer;margin-left:10px;float: right;">确认</a>
			                <a id="cancel" class="btn" style="width:55px;height:27px;line-height:27px;text-align:center;border-radius:6px;cursor:pointer;margin-left:10px;float: right;color:black;">取消</a>
			            </div>
			        </div>`;
	document.body.appendChild(div);
	//取消按钮
	document.getElementById("cancel").onclick = function(){
		reMoveMexBox();
	};
	//确认按钮
	document.getElementById('enter').onclick = fn || function(){
		reMoveMexBox();
	};
};
function reMoveMexBox(){
	document.getElementById("jump-box").remove();
}

//解除绑定按钮点击时
$('.reset-btn').click(function(){
	var str = `<div>手机：1xxxxxxxxxxx</div>
	            			<div style="display: flex;padding-top: 20px;">
	            				<span id="get_mes" style="padding: 0 14px;line-height: 30px;text-align: center;border: 2px solid #C5C2C2;cursor: pointer;">
	            					获取短信验证码
	            				</span>
	            				<input type="text"  style="outline: none;margin-left: 20px;" id="code_num"/>
	            			</div>`
	showTips(str,function(){
		reMoveMexBox();
		
		//这里做校验 验证失败则return；
		var value = $('code_num').val().trim();
		
		showTips('确定要接触绑定吗' , function(){
			//这里写解绑
		});
	});
});

//短信验证码
$(document).on('click','#get_mes',function(){
	$.ajax({
		url:'http://meet.dljy.com/conference/Api/send_msg',
		data:{
			phone:phone
		},
		type:"POST",
		success:function(){
			$('#get_mes').html('重新获取验证码');
		}
	})
})
