var box = $('.video-list');
box.click(function(event){
	var ev = event ||window.event;
	var ele = ev.target;
	var videoUrl = $(ele).data('url') || $(ele).parent().data('url');
	if($(ele)[0].tagName==='LI' || $(ele).parent()[0].tagName=='LI'){
		$('body').append(`<section class="video-play-box">
											<div class="video-play-box-head">
												<div class="cancel">返回</div>
												<div>这是标题</div>
											</div>
											<div class="video-play-box-content">
												${videoUrl}
											</div>
										</section>`);
										
		$('.cancel').click(function(){
			$('.video-play-box').remove();
		});
	};
});

