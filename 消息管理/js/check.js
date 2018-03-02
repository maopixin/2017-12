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


// 阅读
$(document).on('click','.mes-box .look',function(){
	if($(this).data('read')==0){
		$.ajax({
			url:map.read,
			type : "GET",
			dataType:"jsonp",
			data : {
				id:$(this).data('id')
			},
			success(data){
				if(data.status.code==0){
					let num = Number($($('.mes-title li em')[id-1]).html())-1;
					if(num<=0 || isNaN(num)){
						$($('.mes-title li em')[id-1]).hide();
					}else{
						$($('.mes-title li em')[id-1]).html(num);
					};
					let num2 = Number($('#totalMesNum em').html())-1;
					if(num2<=0 || isNaN(num2)){
						$('#totalMesNum em').hide();
					}else{
						$('#totalMesNum em').html(num2);
					};
				};
			}
		});
	};
});

// 删除
$(document).on('click','.mes-box .del',function(){
	let on = false;
	if($(this).data('read')==0) on = true;
	$.ajax({
		url:map.del,
		type : "GET",
		dataType:"jsonp",
		data : {
			id:$(this).data('id')
		},
		success(data){
			if(data.status.code==0){
				// 如果消息未读 ， 那么删除以后  数字需要减一
				if(on){
					let num = Number($($('.mes-title li em')[id-1]).html())-1;
					if(num<=0 || isNaN(num)){
						$($('.mes-title li em')[id-1]).hide();
					}else{
						$($('.mes-title li em')[id-1]).html(num);
					};
					let num2 = Number($('#totalMesNum em').html())-1;
					if(num2<=0 || isNaN(num2)){
						$('#totalMesNum em').hide();
					}else{
						$('#totalMesNum em').html(num2);
					};
				}
				showContent();
			};
		}
	})
})


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
				let time = getLocalTime(e.ctime);
				str += `<li class="">
							<div class="mes-info">
								<h3><span class="${c}">【${e.type_name}】</span>${e.theme}</h3>
								<time>${time}</time>
								<span class="m-btn look false" data-read="${e.is_read}" data-id="${e.id}">查看</span>
								<span class="m-btn del" data-read="${e.is_read}" data-id="${e.id}">删除</span>
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

function getLocalTime(nS) {
	let t = new Date().getTime();
	var time=new Date(parseInt(nS)*1000).toLocaleString();
	return time.match(/^[^\s]*/)[0];
}


// 展示未读数量
showNum();
function showNum(){
	$.ajax({
		url:map.mesNum,
		type:'GET',
		dataType:'jsonp',
		success(data){
			if(data.status.code===0){
				$('.mes-title li').each(function(i,e){
					if(data.data[$(this).data('type')]){
						$(this).find('em').html(data.data[$(this).data('type')].num);
						if($(this).find('em').html()<=0){
							$(this).find('em').hide();
						}else{
							$(this).find('em').show();
						};
					}else{
						$(this).find('em').html('0');
						$(this).find('em').hide();
					}
				});
			};
		},
		error(){

		}
	});
};