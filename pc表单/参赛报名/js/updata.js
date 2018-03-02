
//	contest_id:3,
//  realname: $('#name').val(),
//  head_portrait: $('#porsen-head-pic-box').attr('src'),
//  sex: getSex(),
//  mobile: $('tel').val(),
//  school: $('#school').val(),
//  address: getPlace(),
//  synopsis: '',
//  work_theme: $('#work_theme').val(),
//  work_address: getWork(),
//  work_synopsis: $('#work_synopsis').val()


let data = {};
let timer = 1;

$('.btn_tj').click(function(){
	//	头像
	if(getUrl('porsen-head-pic-box')===null){
		tipBox('未上传头像',0);
		return false;
	}else{
		data.head_portrait = getUrl('porsen-head-pic-box');
	};
	//	学校
	if($('#school').val().trim()===''){
		tipBox('未填写学校名称',0);
		return false;
	}else{
		data.school = $('#school').val().trim();
	};
	//	地区
	if(getPlace()===null){
		tipBox('未选择地区',0);
		return false;
	}else{
		data.address = getPlace();
	};
	//	姓名
	if($('#name').val().trim()===''){
		tipBox('未填写姓名',0);
		return false;
	}else{
		data.realname = $('#name').val().trim();
	};
	//	电话
	if($('#tel').val().trim()===''){
		tipBox('未填写电话',0);
		return false;
	}else if(isPoneAvailable($('#tel').val().trim())){
		data.mobile = $('#tel').val().trim();
	}else{
		tipBox('请填写正确的手机号码',0);
		return false;
	}
	//	性别
	if(getSex()===null){
		tipBox('未选择性别',0);
		return false;
	}else{
		data.sex = getSex();
	};
	//	作品简介
	data.work_synopsis = $('#work_synopsis').val().trim();
	//	作品名称
	if($('#work_theme').val().trim()===''){
		tipBox('未填写作品名称',0);
		return false;
	}else{
		data.work_theme = $('#work_theme').val().trim();
	};
	//	作品地址
	if(getUrl('form-tip')===null){
		tipBox('未上传作品',0);
		return false;
	}else{
		data.work_address = getUrl('form-tip');
	};
	//补充数据
	data.contest_id = 3;
	data.synopsis = '';
	console.log(data);
	//开始上传
	$.ajax({
		type:"post",
		url:Map.updata,
		data:data,
		success(data){
			console.log(data);
		},
		error(){
			console.log(false);
		}
	});
});



//获取性别
//男1  女0  未选择返回 null
function getSex(){
	for (let i = 0; i < $('.check-item').length; i++) {
		if($($('.check-item')[i]).hasClass('active')){
			if($($('.check-item')[i]).next().html()==='男'){
				return 1;
			}else if($($('.check-item')[i]).next().html()==='女'){
				return 0;
			}else{
				return null;
			}
		};
	};
};
//获取地址码
function getPlace(){
	if(typeof($('#not-scroll').find('.layui-select-tips').attr("pr_id"))=="undefined"){
		return null;
	}else{
		return Number($('#not-scroll').find('.layui-select-tips').attr("pr_id"));
	};
};

//获取地址
function getUrl(id){
	if(typeof($('#'+id).attr("data_url"))=="undefined"){
		return null;
	}else{
		return $('#'+id).attr("data_url");
	};
};
function tipBox(tip,type){
	clearTimeout(timer);
	if(type==0){
		$('#tip-box').find('i').css('color','red');
		$('#tip-box').find('i').html('&#xe69c;');
	}else if(type==1){
		$('#tip-box').find('i').css('color','green');
		$('#tip-box').find('i').html('&#x1005;');
	};
	$('#tip-box').find('span').html(tip);
	$('#tip-box').removeClass('hidd');
	timer = setTimeout(function(){
		$('#tip-box').addClass('hidd');
	},2000);
}
function isPoneAvailable(str) {  
  	var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;  
	if (!myreg.test(str)) {  
	    return false;  
	} else {  
	    return true;  
	}  
}