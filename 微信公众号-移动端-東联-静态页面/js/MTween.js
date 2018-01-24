var Tween = {
	linear: function(t, b, c, d) { //匀速
		return c * t / d + b;
	},
	easeIn: function(t, b, c, d) { //加速曲线
		return c * (t /= d) * t + b;
	},
	easeOut: function(t, b, c, d) { //减速曲线
		return -c * (t /= d) * (t - 2) + b;
	},
	easeBoth: function(t, b, c, d) { //加速减速曲线
		if((t /= d / 2) < 1) {
			return c / 2 * t * t + b;
		}
		return -c / 2 * ((--t) * (t - 2) - 1) + b;
	},
	easeInStrong: function(t, b, c, d) { //加加速曲线
		return c * (t /= d) * t * t * t + b;
	},
	easeOutStrong: function(t, b, c, d) { //减减速曲线
		return -c * ((t = t / d - 1) * t * t * t - 1) + b;
	},
	easeBothStrong: function(t, b, c, d) { //加加速减减速曲线
		if((t /= d / 2) < 1) {
			return c / 2 * t * t * t * t + b;
		}
		return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
	},
	elasticIn: function(t, b, c, d, a, p) { //正弦衰减曲线（弹动渐入）
		if(t === 0) {
			return b;
		}
		if((t /= d) == 1) {
			return b + c;
		}
		if(!p) {
			p = d * 0.3;
		}
		if(!a || a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else {
			var s = p / (2 * Math.PI) * Math.asin(c / a);
		}
		return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
	},
	elasticOut: function(t, b, c, d, a, p) { //*正弦增强曲线（弹动渐出）
		if(t === 0) {
			return b;
		}
		if((t /= d) == 1) {
			return b + c;
		}
		if(!p) {
			p = d * 0.3;
		}
		if(!a || a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else {
			var s = p / (2 * Math.PI) * Math.asin(c / a);
		}
		return a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b;
	},
	elasticBoth: function(t, b, c, d, a, p) {
		if(t === 0) {
			return b;
		}
		if((t /= d / 2) == 2) {
			return b + c;
		}
		if(!p) {
			p = d * (0.3 * 1.5);
		}
		if(!a || a < Math.abs(c)) {
			a = c;
			var s = p / 4;
		} else {
			var s = p / (2 * Math.PI) * Math.asin(c / a);
		}
		if(t < 1) {
			return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) *
				Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
		}
		return a * Math.pow(2, -10 * (t -= 1)) *
			Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
	},
	backIn: function(t, b, c, d, s) { //回退加速（回退渐入）
		if(typeof s == 'undefined') {
			s = 1.70158;
		}
		return c * (t /= d) * t * ((s + 1) * t - s) + b;
	},
	backOut: function(t, b, c, d, s) {
		if(typeof s == 'undefined') {
			s = 3.70158; //回缩的距离
		}
		return c * ((t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
	},
	backBoth: function(t, b, c, d, s) {
		if(typeof s == 'undefined') {
			s = 1.70158;
		}
		if((t /= d / 2) < 1) {
			return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
		}
		return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
	},
	bounceIn: function(t, b, c, d) { //弹球减振（弹球渐出）
		return c - Tween['bounceOut'](d - t, 0, c, d) + b;
	},
	bounceOut: function(t, b, c, d) { //*
		if((t /= d) < (1 / 2.75)) {
			return c * (7.5625 * t * t) + b;
		} else if(t < (2 / 2.75)) {
			return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
		} else if(t < (2.5 / 2.75)) {
			return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
		}
		return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
	},
	bounceBoth: function(t, b, c, d) {
		if(t < d / 2) {
			return Tween['bounceIn'](t * 2, 0, c, d) * 0.5 + b;
		}
		return Tween['bounceOut'](t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
	}
};

/*
 * obj  ：  要运动的元素
 * count:  运动的总路程
 * duration: 运动的总时间
 * attr ： 变化的属性
 * fx: 运动的模式
 * fn：运动结束后要做的事情 （回调函数）
 *
 * */

function MTween(obj, count, duration, attr, fx, fn) {
	//清除定时器
	clearInterval(obj.timer);

	var startTime = new Date().getTime(); //运动前的时间
	var begin = getCss(obj, attr); //运动前的位置

	obj.timer = setInterval(function() {
		//计算已经运动过的时间
		//由于定时器执行间隔时间不稳定，受到其他程序影响，所以间隔时间要通过计算来获取
		var t = new Date().getTime() - startTime;
		if(t >= duration) {
			t = duration;
			clearInterval(obj.timer);
		};
		obj.style[attr] = Tween[fx](t, begin, count, duration) + 'px';
		if(t >= duration && fn) fn();

	}, 30);
}

//取随机数 
/**
 * 参数
 * 参数一(number)  要随机的个数 必填
 * 参数二(number)  开始的位置 默认为0
 * 参数三(number)  结束的位置	必填
 * 
 */
function random(num, start, end) {
	!start ? start = -1 : start = start - 1;
	var arr = [];
	for(var i = 0; i < num; i++) {
		arr.push(Math.ceil(Math.random() * (end - start)) + (start));
	}
	return arr;
}
//取随机数 end

/**
 * getBinarySystem(num)
 * 取二进制数
 * 参数为number
 */
function getBinarySystem(num) {
	if(typeof num !== 'number') {
		return false;
	}
	var arr = [];
	getSurplus(num)

	function getSurplus(num) {
		arr.push(num % 2);
		if(parseInt(num / 2) == 0) {
			return
		} else {
			getSurplus(parseInt(num / 2));
		}
	}
	arr.reverse();
	return arr.join('');

}
//获取元素属性
function getCss(obj, attr) {
	return parseFloat(getComputedStyle(obj)[attr]);
}
/**
 * 把location.search的string转换为json;
 * 参数 str
 * 
 * 返回值 是一个json对象
 */
function searchToJson(str) {
	//去问号
	var getStr = str.slice(1);
	//从&符号分割
	var arr = getStr.split('&');
	var json = {}; //声明json
	//在数组的每一项中 以 = 分割
	for(var num in arr) {
		//把当前项以等号分割
		arr[num] = arr[num].split('=');
		//把分割后的数组 的第一项作为key 第二项作为value 存起来
		json[arr[num][0]] = arr[num][1];
	};
	return json;
};

/**
 * 参数1  被点击的定位元素
 * 参数2 鼠标点击位置的x（e.clientX）
 * 参数3 鼠标点击位置的y
 * 
 * 此函数判断点击位置在被点击元素的什么方向上，并且移动要移动的li
 * 
 */

function place(obj, x, y) {
	//获取宽高
	var width = obj.offsetWidth;
	var height = obj.offsetHeight;
	//定义比例
	var a = (height / 2) / (width / 2);

	//判断位置    x轴 正方向 为右边 所以不需要取反
	x = x - obj.offsetLeft - width / 2;
	y = -(y - obj.offsetTop - height / 2);

	//判断象限
	//第一象限（x 和  y都大于0）
	if(x > 0 && y > 0) {
		if(a * x < y) {
			return 'top';
		} else {
			return 'right';
		}
	}
	//第二象限
	if(x <= 0 && y > 0) {
		if(-1 * a * x < y) {
			return 'top';
		} else {
			return 'left';
		}
	}
	//第三象限
	if(x <= 0 && y <= 0) {
		if(a * x < y) {
			return 'left';
		} else {
			return 'bottom';
		}
	}
	//第四象限
	if(x > 0 && y <= 0) {
		if(-1 * a * x < y) {
			return 'right';
		} else {
			return 'bottom';
		}
	}
}
/**
 * 滚轮滚动
 * @param {Object} obj
 * @param {Object} upFn
 * @param {Object} downFn
 */
function wheel(obj, upFn, downFn) {
	obj.onmousewheel = function(e) {
		//向下
		if(e.wheelDelta < 0) {
			downFn && downFn(e);
		} else if(e.wheelDelta > 0) {
			upFn && upFn(e);
		};
	};
	obj.addEventListener('DOMMouseScroll', function(e) {
		if(e.detail > 0) {
			downFn && downFn(e);
		} else if(e.detail < 0) {
			upFn && upFn(e);
		};
	}, false);
};



/**
 * 
 * 拖拽函数
 * 
 * 
 */
function Drag(obj){
	obj.addEventListener('mousedown',down,false);
	function down(ev){
		var e = ev || event ||window.event;
		var downX = e.clientX - obj.offsetLeft;
		var downY = e.clientY - obj.offsetTop;
		document.addEventListener('mousemove',move,false);
		document.addEventListener('mouseup',up,false);
		function move(ev){
			var e = ev || event ||window.event;
			obj.style.left = e.clientX - downX + 'px';
			obj.style.top = e.clientY - downY + 'px';
		}
		function up(){
			document.removeEventListener('mousemove',move,false);
			document.removeEventListener('mouseup',up,false);
		}
	}
}
