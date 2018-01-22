$(document).ready(function() {
	$(".select_box").click(function(event) {
		event.stopPropagation();
		$(this).find(".option").toggle();
		$(this).nextAll().find('.option').hide();
		$(this).prevAll().find('.option').hide();
	});
	$(document).click(function(event) {
		var eo = $(event.target);
		if($(".select_box").is(":visible") && eo.attr("class") != "option" && !eo.parent(".option").length)
			$('.option').hide();
	});
	/*赋值给文本框*/
	$(".option a").click(function() {
		var value = $(this).text();
		$(this).parent().siblings(".select_txt").text(value);
		$("#select_value").val(value);
	})
	$(".select .option a").click(function() {
		$(this).parent().parent().parent().children().removeClass('active');
		$(this).parent().parent().addClass('active');
	})
	$(".small-select .option a").click(function() {
		$(this).parent().parent().find(".select_txt").text($(this).parent().parent().find(".select_txt").text()+'∨')
	})
})