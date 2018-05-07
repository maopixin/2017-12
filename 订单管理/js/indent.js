//渲染
var id = 1,
	page=1,
	total=1,
	eId="indent-list";
function showContent(){
	$.ajax({
	url: config.indent,
	type: 'GET',
	data: {
		page: page,
		pre: 3
	},
	dataType: 'jsonp',
	success(data) {
		if(data.status.code == 0) {
			var str = "";
			total = data.data.total_page;
			data.data.list.forEach(function(e,i){
				
				var time = getLocalTime(e.ctime);
				str += `<li class="indent-item">
                            <ul class="indent-title-list">
                                <li class="company">单位</li>
                                <li class="card_num">购卡数</li>
                                <li class="total_money">总额</li>
                                <li class="time">申请时间</li>
                                <li class="proposer">申请人</li>
                            </ul>
                            <ul class="indent-info-list">
                                <li class="company">${e.mechanism_name}</li>
                                <li class="card_num">${e.card_number}</li>
                                <li class="total_money">${e.money}</li>
                                <li class="time">${time}</li>
                                <li class="proposer">${e.proposer}</li>
                            </ul>
                        </li>`;
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
showContent();
// 关于分页
function pageInfo() {
	//生成分页
	var str = '';
	if(total <= 10) {
		for(var i = 0; i < total; i++) {
			str += '<a class="' + (i + 1 == page ? 'active' : '') + '">' + (i + 1) + '</a>'
		};
	} else {
		if(page <= 4) {
			for(var i = 0; i < 5; i++) {
				str += '<a class="' + (i + 1 == page ? 'active' : '') + '">' + (i + 1) + '</a>';
			};
			str += "....<a class=''>" + (total - 1) + "</a><a class=''>" + total + "</a>";
		} else if(page > total - 3) {
			str += "<a class=''>1</a><a class=''>2</a>....";
			for(var i = total - 4; i < total; i++) {
				str += '<a class="' + (i + 1 == page ? 'active' : '') + '">' + (i + 1) + '</a>';
			};
		} else {
			str += "<a class=''>1</a><a class=''>2</a>....";
			for(var i = page - 2; i < page + 1; i++) {
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

function getLocalTime(nS) {
	let t = new Date().getTime();
	var time=new Date(parseInt(nS)*1000).toLocaleString();
	return time.match(/^[^\s]*/)[0];
};