var num = Number(location.hash.slice(1).split("=")[1]) || 1;
let total = 1;
//showPage(num);
pageInfo(1)
//标题的选择
$('.check-item').click(function() {
	//取消同级元素的class
	$(this).parent().children().removeClass('active');
	$(this).addClass('active');
	showNow();
})
//点击查看按钮
$(document).on("click", ".mes-box .look", function() {
	if($(this).parent().parent().hasClass('act')) {
		$(this).parent().parent().parent().find('li').removeClass('act');
		return;
	}
	$(this).parent().parent().parent().find('li').removeClass('act');
	$(this).parent().parent().addClass('act');
});

//显示当前区域
showNow();

function showNow() {
	let type = $('.mes-title').find('.active').data('type');
	$('.mes-box').each(function(i) {
		if($(this).data('type') === type) {
			$('.mes-box').hide();
			$(this).show();
		};
	});
};

//关于分页
function pageInfo(total) {
	//生成分页
	let str = '';
	if(total <= 10) {
		for(let i = 0; i < total; i++) {
			str += '<a class="' + (i + 1 == num ? 'active' : '') + '">' + (i + 1) + '</a>'
		};
	} else {
		if(num <= 4) {
			for(let i = 0; i < 5; i++) {
				str += '<a class="' + (i + 1 == num ? 'active' : '') + '">' + (i + 1) + '</a>';
			};
			str += "....<a class=''>" + (total - 1) + "</a><a class=''>" + total + "</a>";
		} else if(num > total - 3) {
			str += "<a class=''>1</a><a class=''>2</a>....";
			for(let i = total - 4; i < total; i++) {
				str += '<a class="' + (i + 1 == num ? 'active' : '') + '">' + (i + 1) + '</a>';
			};
		} else {
			str += "<a class=''>1</a><a class=''>2</a>....";
			for(let i = num - 2; i < num + 1; i++) {
				str += '<a class="' + (i + 1 == num ? 'active' : '') + '">' + (i + 1) + '</a>';
			};
			str += "....<a class=''>" + (total - 1) + "</a><a class=''>" + total + "</a>";
		};
	};
	//每一页
	$('#all-page').html('');
	$('#all-page').html(str);
	$('#all-page a').unbind('click').click(function() {
		num = Number(this.innerHTML);
		window.location.hash = 'page=' + num;
		showPage(num);
	});
	//首页
	$('#first-page').unbind('click').click(function() {
		changePage('first');
	});
	//上一页
	$('#pre-page').unbind('click').click(function() {
		changePage('-');
	});
	$("#next-page").unbind('click').click(function() {
		changePage('+');
	});
	$('#last-page').unbind('click').click(function() {
		changePage('last');
	});
};

function changePage(type) {
	if(type === "first") {
		num = 1;
	} else if(type === '-') {
		--num;
		num <= 0 ? num = 1 : '';
	} else if(type === '+') {
		++num;
		num > total ? num = total : '';
	} else if(type === 'last') {
		num = total;
	};
	window.location.hash = "#page=" + num + "";
	showPage(num);
};