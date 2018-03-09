function deletePerson(id){
    var _this = this;
    $.ajax({
        url:"",
        data:{
            id:id
        },
        type:"GET",
        success(data){
            data = JSON.parse(data);
            if(data.status.code===0){
                showTipStr("删除成功");
                $(_this).parent().parent().remove();
            }else{
                showTipStr("删除过程中出现了一些问题，请稍候重试");
            }
        },
        error(){
            showTipStr("删除过程中出现了一些问题，请稍候重试");
        }
    });
};

function showTipStr(str){
    type=type?type:0;
	var div = document.createElement('div');
	div.id = "jump-box-s";
	div.style = "display:flex;position:fixed;z-index:99999;top:0;left:0;right:0;bottom:0;background-color:rgba(0, 0, 0, 0.5)";
	div.innerHTML = `<div class="jump-content" style="margin:auto;width:400px;background-color:#fff;border-radius:6px">
			            <h4 style="margin:0;padding:0 0 0 24px;line-height:48px;border-bottom:1px solid #dcdcdc">温馨提示</h4>
			            <div class="tip-mes" style="padding:16px 40px;font-size:14px;line-height:26px;word-break: break-all;">
			            	${str}
                        </div>
                        <div class="btn-box" style="padding:10px 30px 14px;height:27px;font-size: 14px;">
			                <a id="enter" class="btn active" style="background-color:#3399ff;color:#fff;width:55px;height:27px;line-height:27px;text-align:center;border-radius:6px;cursor:pointer;margin-left:10px;float: right;">确定</a>
			            </div>
			        </div>`;
    document.body.appendChild(div);
    document.body.onclick = function(){
        reMoveMexBox();
    };
};
function reMoveMexBox(){
    document.getElementById("jump-box-s").remove();
    document.body.onclick = null;
};
