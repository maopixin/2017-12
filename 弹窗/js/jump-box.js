let mesBox = ["预报名信息提交成功，客服会在一周内，与您确认信息，请保持电话畅通。","报名信息已确定，请尽快于三天内上传汇款凭证，领取您的电子入场券。","汇款凭证提交成功，待客服审核通过后，会将会议电子入场券发送至每一位参会人员邮箱，请注意查收。"];

//0 预报名     ，1  确认信息 ， 2 凭证

function showTips(num){
	let div = document.createElement('div');
	div.id = "jump-box";
	div.style = "display:flex;position:fixed;top:0;left:0;right:0;bottom:0;background-color:rgba(0, 0, 0, 0.5)";
	div.innerHTML = `<div class="jump-content" style="margin:auto;width:400px;background-color:#fff;border-radius:6px">
			            <h4 style="margin:0;padding:0 0 0 24px;line-height:48px;border-bottom:1px solid #dcdcdc">温馨提示</h4>
			            <div class="tip-mes" style="padding:16px 40px;font-size:14px;line-height:26px;word-break: break-all;">
			            	${mesBox[num]}
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
	document.getElementById('enter').onclick = function(){
		
	};
};
function reMoveMexBox(){
	document.getElementById("jump-box").remove();
}
