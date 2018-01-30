// 移动函数
function move(data){
	this.child = $('#'+data.f+' li');
	this.num = this.child.length-data.n+1;
	this.now = 0;
	this.long = data.l;
	this.next_b = $('#'+data.right);
	this.pre_b = $('#'+data.left);
	this._this = $('#'+data.f);
};
move.prototype.next = function(){
	if(this.now+1>=this.num) return;
	this._this.css({
		'transform':'translate3d(-'+(++this.now)*this.long+'px,0,0)'
	});
};
move.prototype.pre = function(){
	if(this.now-1<0) return;
	this._this.css({
		'transform':'translate3d(-'+(--this.now)*this.long+'px,0,0)'
	});
};
move.prototype.play = function(){
	this._this.css({
		'transition':'all 0.5s'
	});
};
move.prototype.stop = function(){
	setTimeout(function(){
		this._this.css({
			'transition':'0s'
		});
	},700);
};
move.prototype.init = function(){
	this._this.css({
		'transform':'translate3d(0,0,0)'
	});
	this.play();
	let _this = this;
	console.log(this.next)
	this.next_b.click(function(){
		_this.next();
		_this.pre_b.css({
			'cursor':'pointer'
		});
		if(_this.now+1>=_this.num){
			$(this).css({
				'cursor':'not-allowed'
			});
		}else{
			$(this).css({
				'cursor':'pointer'
			});
		};
	});
	this.next_b.mouseover(function(){
		
		if(_this.now+1>=_this.num){
			$(this).css({
				'cursor':'not-allowed'
			});
		}else{
			$(this).css({
				'cursor':'pointer'
			});
		};
	});
	this.pre_b.click(function(){
		_this.pre();
		_this.next_b.css({
			'cursor':'pointer'
		});
		if(_this.now-1<0){
			$(this).css({
				'cursor':'not-allowed'
			});
		}else{
			$(this).css({
				'cursor':'pointer'
			});
		};
	});
	this.pre_b.mouseover(function(){
		if(_this.now-1<0){
			$(this).css({
				'cursor':'not-allowed'
			});
		}else{
			$(this).css({
				'cursor':'pointer'
			});
		};
	});

};
// 底部初始化
let month_fn = new move({
	n:4,
	l:282,
	left:'pre',
	right:'next',
	f:'month-box'
});
month_fn.init();
// 比赛日期初始化
let flow_fn = new move({
	n:3,
	l:213,
	left:'f-l',
	right:'f-r',
	f:'flow-box'
});
flow_fn.init();