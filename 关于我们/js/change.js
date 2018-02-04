$('.menu .click a').click(function() {
	document.body.scrollTop = document.documentElement.scrollTop = 0;
	show($(this).parent().data('type'));
})

function show(type) {
	let arr = window.location.hash.slice(1).split('=');
	arr[1] = type || arr[1] || 1;
	if(arr[1] <= 0 || arr[1] >= 12) {
		arr[1]=1;
	};
	$('.menu .active').removeClass('active');
	$('.content-box').children().each(function(i) {
		$(this).addClass('hidd');
		if($(this).data('type') == arr[1]) {
			$(this).removeClass('hidd');
			$($('.menu .click').children()[i]).addClass('active');
		};
	});
};