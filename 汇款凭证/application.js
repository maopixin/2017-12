// 姓名输入
let addressList = {
    areas : [],
    cities : [],
    provinces : []
};

$.ajax({
    url:map.address,
    dataType:'jsonp',
    success(data){
        if(data.status.code==0){
            addressList = data.data;
            show1();
            show2();
            show3();
        }else{
            tipBox("选择地址出错，请联系管理员",0);
        }
    },
    error(){
        tipBox("网络连接错误",0);
    }
})

$('.person-box input').bind('input propertychange', function() {
    let _this = this;
     $.ajax({
         url:map.name,
         data:{
             name:this.value
         },
         dataType:'jsonp',
         type:'GET',
         success(data){
             if(data.status.code===0){
                 let str = "";
                 data.data.list.forEach(function(e,i){
                     str += `<li data-duties="${e.duties}" data-mobile="${e.mobile}" data-email="${e.email}">${e.name}</li>`;
                 });
                 $(_this).next().html(str);
             };
         }
     });
});

// 单位名称 联想
$('#d-name').bind('input propertychange', function() {
    let _this = this;
    $.ajax({
        url:map.d_name,
        data:{
            name:this.value
        },
        dataType:'jsonp',
        type:'GET',
        success(data){
            if(data.status.code===0){
                let str = "";
                data.data.list.forEach(function(e,i){
                    str += `<li>${e.name}</li>`;
                });
                $(_this).next().html(str);
            };
        }
    });
})

// document 点击时清除列表信息
$(document).click(function(){
    $('.person-box .person-list').html('');
    $('.d-name-list li').html('');
});
// 事件委托  li点击时 自动填写内容
$(document).on('click',".person-box .person-list li",function(){
    $('#name').val($(this).html());
    $('#duties').val($(this).data('duties'));
    $('#mobile').val($(this).data('mobile'));
    $('#email').val($(this).data('email'));
});
// 事件委托  li点击时 自动填写内容
$(document).on('click',".d-name-list li",function(){
    $('#d-name').val($(this).html());
});
// 选择
$('.check-item').click(function(){
	//取消同级元素的class
	$(this).parent().children().removeClass('active');
	$(this).addClass('active');
});

// 检测

$('#up-btn').click(function(){
    let data = {
        company : {},
        applicant : {},
        card_number : 0  
    };
    if($('#name').val().trim()===''){
		tipBox('未填写申请人姓名',0);
		return false;
	}else{
		data.applicant.name = $('#name').val().trim();
    };
    if($('#mobile').val().trim()===''){
		tipBox('未填写申请人电话',0);
		return false;
    };
    if(isPoneAvailable($('#mobile').val().trim())){
        data.applicant.mobile = $('#mobile').val().trim();
    }else{
		tipBox('请填写正确的手机号码',0);
		return false;
    };
    if($('#email').val().trim()===''){
		tipBox('未填写申请人邮箱',0);
		return false;
	}else{
		data.applicant.email = $('#email').val().trim();
    };
    if($('#d-name').val().trim()===''){
		tipBox('未填写单位名称',0);
		return false;
	}else{
		data.company.name = $('#d-name').val().trim();
    };
    data.company.type_code = getSex();
    if($('#stud').val().trim()===''){
		tipBox('未填写学生数量',0);
		return false;
	}else{
        if($('#stud').val().trim()<=0){
            tipBox('学生数量错误',0);
		    return false;
        }
		data.company.student_number = parseInt($('#stud').val().trim());
    };
    if($('#teac').val().trim()===''){
		tipBox('未填写教师数量',0);
		return false;
	}else{
		data.company.teacher_number = parseInt($('#teac').val().trim());
    };
    if($('#address').val().trim()===''){
		tipBox('未填写详细地址',0);
		return false;
	}else{
		data.company.specific_address = $('#address').val().trim();
    };
    if($('#num').val().trim()===''){
		tipBox('未填写购卡数量',0);
		return false;
	}else{
		data.card_number = parseInt($('#num').val().trim());
    };
    // 拿到地址id
    if($('#county option:selected').data("id")!=""){
        data.company.address_code = parseInt($('#county option:selected').data("id"));
    }else{
        tipBox('未选择地区',0);
    };
    data.applicant.duties = $('#duties').val().trim();
    // 发起请求
    $.ajax({
        url:map.purchase,
        type: "POST",
        data:data,
        success(data){
            data = JSON.parse(data);
            if(data.status.code==0){
                tipBox('提交成功',1);
            }else{
                tipBox(data.data.error,0);
            }
        },
        error(){
            tipBox("提交失败，请联系管理员",0);
        }
    });
});



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

function getSex(){
    return $('.active').data('type');
};


    
function show1(){
    // 展示省
    let str = "";
    addressList.provinces.forEach(function(e){
        str += `<option data-id="${e.provinceid}">${e.province}</option>`
    });
    $('#provinces').html(str);
};

function show2(){
    // 展示市
    let str = "";
    addressList.cities.forEach(function(e){
        if(e.provinceid==$('#provinces option:selected').data('id')){
            str += `<option data-id="${e.cityid}">${e.city}</option>`
        };
    });
    $('#city').html(str);
};
function show3(){
    // 展示x
    let str = "";
    addressList.areas.forEach(function(e){
        if(e.cityid==$('#city option:selected').data('id')){
            str += `<option data-id="${e.areaid}">${e.area}</option>`
        };
    });
    $('#county').html(str);
};

$('#provinces').change(function(){
    show2();
    show3();
});

$('#city').change(show3);