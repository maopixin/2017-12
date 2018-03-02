$('.check-item').click(function(){
	//取消同级元素的class
	$(this).parent().children().removeClass('active');
	$(this).addClass('active');
})