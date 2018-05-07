$('.check-box-item').click(function () {
	//取消同级元素的class
	$(this).parent().children().removeClass('active');
	$(this).addClass('active');
	$(this).parent().find(".select_txt").text('更多∨');
});

//传入父级 #id 或者子集的.类名  为了保证切换的唯一性 建议传入父级id
function changeActiveBtn(str, fn) {
	var code = str.slice(0, 1) === "#";
	if (code) { //id
		$(str).children().click(function () {
			$(this).addClass("active").siblings().removeClass("active");
			fn && fn(this);
		});
	} else {
		$(str).click(function () {
			$(this).addClass("active").siblings().removeClass("active");
			fn && fn(this);
		})
	};
};

//自动切换学校类型
function changeActiveBtnAuto(num) {
	$(".school-type-box").children().removeClass("active");
	$($(".school-type-box").children()[num]).addClass("active");
	$(".school-type-info").addClass("hidden");
	$($(".school-type-info")[num]).removeClass("hidden");
};


