!function(n){
	n.fn.video_c = function(data){
		let n = this.next();
		let switch_b = n.find("#"+data.switch);//控制按钮
		let video_tool = n.find('#'+data.tools);//进度条（父级）
		let time = n.find('#'+data.time)//时间
		let t = this[0];//真正的video
		let video_max = t.duration;
		//按钮状态初始化
		changeSwitch(1);
		switch_b.click(function(){
			changeSwitch();
		});
		
		
		//暂停与播放		
		function changeSwitch(bl){
			if(!bl){
				if(t.paused){
					t.play();
				}else{
					t.pause();
				};
			};
			if(t.paused){
				switch_b.removeClass("play").addClass('paused');
			}else{
				switch_b.removeClass("paused").addClass('play');
			};
		};
		//进度条实现
		videoTool();
		function videoTool(){
			setInterval(function(){
				console.log()
				video_tool.find('*').css({
					'width':t.currentTime/t.duration*100+'%'
				});
			},1);
		};
//		//时间展示
//		showTimeTotal();
//		function showTimeNow(){
//			time.find("#now-time").html(countTime(t.currentTime));
//		};
//		function showTimeTotal(){
//			time.find("#total-time").html(countTime(t.duration));
//		};
//		function countTime(num){
//			let m = parseInt(num/60);
//			m = m.length<=1?'0'+m:'';
//			console.log(num)
//			return m+":"+parseInt(num%60);
//		};
	};
}(jQuery);
