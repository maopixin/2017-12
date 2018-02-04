$(document).on('click','.menu li a',function(){
	$('.menu li').removeClass('active');
	$(this).parent().addClass('active');
});
show();
$(document).on("mousewheel DOMMouseScroll",show);

function show(){
	$('.content-box').children().each(function(i, e) {
		if(i<1) return true;
		if(e.offsetTop - document.body.scrollTop >= 0 || e.offsetTop + e.offsetHeight - document.body.scrollTop >= 0) {
			let ele = e;
			$('.menu li.active').removeClass('active');
			$('.menu li').each(function(i, e) {
				if($(e).data('type') == $(ele).attr('id').slice(1)) {
					$(e).addClass('active');
				};
			});
			return false;
		};
	});
};
