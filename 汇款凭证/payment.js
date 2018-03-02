let id = 2;
let uploading = false;

laydate.render({
    elem: '#txtBeginDate' //指定元素
  });

$.ajax({
    url:map.get_purchase,
    dataType:"jsonp",
    data:{
        id:id
    },
    type:'GET',
    success(data){
        if(data.status.code==0){
            $('#i1').val(data.data.info.invoice_company);
            $('#i2').val(data.data.info.card_number);
        }else{
            tipBox('信息加载失败,请稍后重试',0);
        }
    },
    error(){
        tipBox('信息加载失败,请稍后重试',0);
    }
});
// 上传凭证
$('#porsen-head-pic').change(function(){
    upData();
})


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

// 提交表单
$('.btns').click(function(){
    let data = {
        id:id
    };
    if($('#txtBeginDate').val().trim()==""){
		tipBox('未选择日期',0);
		return false;
	}else{
		data.tranfer_date = $('#txtBeginDate').val().trim();
    };
    if($('#pic-box-m').attr('src').trim()==""){
        tipBox('未上传凭证',0);
        return false;
    }else{
        data.voucher = $('#pic-box-m').attr('src');
    };
    if($('#invoice_company').val().trim()===''){
		tipBox('未填写发票抬头',0);
		return false;
	}else{
		data.invoice_company = $('#invoice_company').val().trim();
    };
    if($('#invoice_code').val().trim()===''){
		tipBox('未填写纳税人识别号或统一社会信用代码',0);
		return false;
	}else{
		data.invoice_code = $('#invoice_code').val().trim();
    };
    console.log(data);
    $.ajax({
        url: map.purchase_voucher,
        type : 'POST',
        data:data,
        success(data){
           
            data = JSON.parse(data);
            console.log(data);
            if(data.status.code===0){
                tipBox('提交成功',1);
            }else{
                console.log(data)
                tipBox(data.data.error,0);
            }
        },
        error(){
            tipBox('提交失败',0);
        }
    })
})

function upData() {
	if(uploading) {
		alert("文件正在上传中，请稍候");
		return false;
	}
	let data = new FormData();
	data.append('file', $('#porsen-head-pic')[0].files[0])
	$.ajax({
		url: map.upload,
		type: 'POST',
		cache: false,
		data,
		processData: false,
		contentType: false,
		dataType: "json",
		beforeSend: function() {
			uploading = true;
		},
		success: function(data){
            if(data.status.code==0){
                $('#pic-box-m').attr('src',data.data);
            }else{
                tipBox('上传失败',0);
            };
            uploading = false;
        },
		error() {
            tipBox('上传失败',0);
            uploading = false;
            alert()
		}
	});
};