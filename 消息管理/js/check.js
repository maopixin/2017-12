// 默认 展示第一列表 第一页  一页5个  总页面默认为1  展示盒子默认为第一个box
let id = 1,
	page=1,
	total=1,
	eId="mes-o";
const pre_page=5;

//标题的选择
$('.check-item').click(function() {
	//取消同级元素的class
	$(this).parent().children().removeClass('active');
	$(this).addClass('active');
	id = $(this).data('type');
	page = 1;
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
showNow()
function showNow() {
	let type = $('.mes-title').find('.active').data('type');
	$('.mes-box').each(function(i) {
		if($(this).data('type') === type) {
			$('.mes-box').hide();
			$(this).show();
			eId = $(this).attr('id');
			showContent();
		};
	});
};

//渲染


function showContent(){
	$.ajax({
	url: config.message,
	type: 'GET',
	data: {
		id: id,
		page: page,
		pre_page: 5
	},
	dataType: 'jsonp',
	success(data) {
		if(data.status.code == 0) {
			let str = "";
			total = data.data.total_page;
			data.data.list.forEach(function(e,i){
				let n = e.info.indexOf('：');
				let c = color(e.type_name);
				str += `<li class="">
							<div class="mes-info">
								<h3><span class="${c}">【${e.type_name}】</span>${e.theme}</h3>
								<time>2018.02.02</time>
								<span class="m-btn look false" data-id="${e.id}">查看</span>
								<span class="m-btn del">删除</span>
							</div>
							<div class="over">
								<div>${e.info.slice(0,n+1)}</div>
								<div>
									${e.info.slice(n+1)}
								</div>
							</div>
						</li>`
			});
			$('#'+eId).html(str);
			// 分页
			pageInfo();
		} else {
			alert('数据请求失败');
		}
	},
	error() {
		alert('数据请求出错');
	}
});
}

// 关于分页
function pageInfo() {
	//生成分页
	let str = '';
	if(total <= 10) {
		for(let i = 0; i < total; i++) {
			str += '<a class="' + (i + 1 == page ? 'active' : '') + '">' + (i + 1) + '</a>'
		};
	} else {
		if(page <= 4) {
			for(let i = 0; i < 5; i++) {
				str += '<a class="' + (i + 1 == page ? 'active' : '') + '">' + (i + 1) + '</a>';
			};
			str += "....<a class=''>" + (total - 1) + "</a><a class=''>" + total + "</a>";
		} else if(page > total - 3) {
			str += "<a class=''>1</a><a class=''>2</a>....";
			for(let i = total - 4; i < total; i++) {
				str += '<a class="' + (i + 1 == page ? 'active' : '') + '">' + (i + 1) + '</a>';
			};
		} else {
			str += "<a class=''>1</a><a class=''>2</a>....";
			for(let i = page - 2; i < page + 1; i++) {
				str += '<a class="' + (i + 1 == page ? 'active' : '') + '">' + (i + 1) + '</a>';
			};
			str += "....<a class=''>" + (total - 1) + "</a><a class=''>" + total + "</a>";
		};
	};
	//每一页
	$('#all-page').html('');
	$('#all-page').html(str);
	$('#all-page a').unbind('click').click(function() {
		page = Number(this.innerHTML);
		showContent();
	});
	//首页
	$('#first-page').unbind('click').click(function() {
		changePage('first');
	});
	//上一页\\
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
		page = 1;
	} else if(type === '-') {
		--page;
		page <= 0 ? page = 1 : '';
	} else if(type === '+') {
		++page;
		page > total ? page = total : '';
	} else if(type === 'last') {
		page = total;
	};
	showContent();
};

function color(str){
	if(str==="优惠券"){
		return 'red';
	}else if(str==="站内通知"){
		return 'blue';
	}else if(str==="粉丝关注"){
		return 'yellow';
	}else{
		return "green";
	};
};
