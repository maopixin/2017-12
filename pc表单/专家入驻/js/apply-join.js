let uploading = false;
let upDatas = {
    honor:[]
};
// 头像上传
$('#head-pic').change(function(){
    let _this = this;
    upPic('head-pic',function(data){
        if(data.status.code===0){
            $(_this).parent().prev().hide();
            $(_this).parent().parent().find('img').show();
            $(_this).parent().parent().find('img').attr('src',data.data);
            upDatas.head_portrait = data.data;
        }else{
            tipBox('文件上传失败',0);
        };
        _this.uploading = false;
    },this);
});

// 荣誉上传
$('.winbox .winbox-item input').change(function(){
    let _this = this;
    let father = $(this).parent();
    let id = $(this).attr('id');
    upPic(id,function(data){
        if(data.status.code===0){
            father.find('.sprite-form').hide();
            father.find('img').attr('src',data.data).show();
            upDatas.honor[$(_this).data('type')] = {
                name:father.find('.win-pic-info').html(),
                url:data.data
            };
        }else{
            tipBox('文件上传失败',0);
        };
        _this.uploading = false;
    },this);
});

function upPic(id,fn,_this) {
	if(_this.uploading) {
		tipBox("文件正在上传中，请稍候",0);
		return false;
	}
	let data = new FormData();
    data.append('file', $('#'+id)[0].files[0]);
	$.ajax({
		url: 'http://meet.jspxedu.uqidi.cn/public/File/upload',
		type: 'POST',
		cache: false,
		upDatas,
		processData: false,
		contentType: false,
		dataType: "json",
		success: fn,
		error() {
            tipBox("文件上传失败",0);
            _this.uploading = false;
		}
    });
    _this.uploading = true;
};

// 表单提交
$('#updata-btn').click(function(){
    if($('#name').val().trim()===""){
        tipBox('未填写姓名',0);
        return false;
    }else{
        upDatas.name = $('#name').val().trim();
    };
    if($('#age').val().trim()===""){
        tipBox('未填写年龄',0);
        return false;
    }else{
        upDatas.age = $('#age').val().trim();
    };
    if(!upDatas.head_portrait){
        tipBox('未上传头像',0);
        return false;
    }
    if($('#company_name').val().trim()===""){
        tipBox('未填写单位名称',0);
        return false;
    }else{
        upDatas.company_name = $('#company_name').val().trim();
    };
    //	电话
	if($('#contact_number').val().trim()===''){
		tipBox('未填写手机号码',0);
		return false;
	}else if(isPoneAvailable($('#contact_number').val().trim())){
		upDatas.contact_number = $('#contact_number').val().trim();
	}else{
		tipBox('请填写正确的手机号码',0);
		return false;
    };
    if($('#lecture_topics').val().trim()===""){
        tipBox('未填写讲课主题',0);
        return false;
    }else{
        upDatas.lecture_topics = $('#lecture_topics').val().trim();
    };
    if($('#research_field').val().trim()===""){
        tipBox('未填写研究领域',0);
        return false;
    }else{
        upDatas.research_field = $('#research_field').val().trim();
    };
    if($('#personal_profile').val().trim()==="" || $('#personal_profile').val().trim()==="必填"){
        tipBox('未填写个人简介',0);
        return false;
    }else{
        upDatas.personal_profile = $('#personal_profile').val().trim();
    };
    if(upDatas.honor.length<=2){
        tipBox('请上传三张荣耀图片');
        return false;
    }else{
        upDatas.honor.forEach(function(e){
            if(!e){
                tipBox('请上传三张荣耀图片');
                return false;
            }
        });
    };
    // 提交
    $.ajax({
        url : map.expert,
        data : upDatas,
        type : 'POST',
        success(data){
            if(data.status.code===0){
                // 提交成功
                tipBox('提交成功',1);
            }else{
                // 提交失败 
                tipBox('提交失败 '+data.data.error,0);
            }
        },
        error(){
            // ajax出错
            tipBox('提交出错，请联系管理员',0);
        }
    });
});

// 提示框
var timer;
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
    $('#tip-box').css({'margin-left':-parseInt($('#tip-box').css('width'))/2});    
	$('#tip-box').removeClass('hidd');
	timer = setTimeout(function(){
		$('#tip-box').addClass('hidd');
	},2000);
};


function isPoneAvailable(str) {  
    var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;  
  if (!myreg.test(str)) {  
      return false;  
  } else {  
      return true;  
  }  ;
};
