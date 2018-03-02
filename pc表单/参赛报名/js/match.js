//简介点击，清除点击两字
$(".text-block").one("click", function() {
	this.value = "";
});

//上传文件
var uploading = false;
//头像上传
$("#porsen-head-pic").on("change", function() {
	upData('porsen-head-pic',function(data) {
		if(data.status.code == 0) {
			$('#porsen-head-pic-box').attr("src", data.data);
			//新增 属性
			$('#porsen-head-pic-box').attr("data_url", data.data);
		}else{
			alert('上传失败');
		};
		uploading = false;
	})
});
//作品上传
$('#work-upbox').on('change',function(){
	upData('work-upbox',function(data){
		if(data.status.code == 0) {
			$('#form-tip').html("上传成功");
			$('#form-tip').attr('data_url',data.data);
		}else{
			alert('上传失败');
		};
		uploading = false;
	});
});

function upData(id,fn) {
	if(uploading) {
		alert("文件正在上传中，请稍候");
		return false;
	}
	let data = new FormData();
	data.append('file', $('#'+id)[0].files[0])
	$.ajax({
		url: 'http://meet.jspxedu.uqidi.cn/public/File/upload',
		type: 'POST',
		cache: false,
		data,
		processData: false,
		contentType: false,
		dataType: "json",
		beforeSend: function() {
			uploading = true;
		},
		success: fn,
		error() {
			alert("文件上传失败");
		}
	});
};

//切换
