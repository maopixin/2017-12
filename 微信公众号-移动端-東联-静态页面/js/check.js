$('.check-box-item').click(function(){
	//取消同级元素的class
	$(this).parent().children().removeClass('active');
	$(this).addClass('active');
	$(this).parent().find(".select_txt").text('更多∨');
});

//传入父级 #id 或者子集的.类名  为了保证切换的唯一性 建议传入父级id
function changeActiveBtn(str){
	var code = str.slice(0,1) === "#";
	if(code){//id
		$(str).children().click(function(){
			$(this).addClass("active").siblings().removeClass("active");
		});
	}else{
		$(str).click(function(){
			$(this).addClass("active").siblings().removeClass("active");
		})
	};
};
