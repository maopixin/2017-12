!function(n){
    n.fn.drawer = function(){
        var t = this,
            w = this.width(),
            c = this.find('.switch'),
            s = this.find('.switch').width();
        function i(){
            t.css({'transform':'translate3d(0,0,0)','transition':'all 0.3s'});
        };

        function o(){
            if(c.hasClass('open')){t.css({'right':-w+s+'px'});c.removeClass('open').addClass('close');}else{t.css({'right':'0px'});c.removeClass('close').addClass('open');};
        };

        i();
        c.click(o);
    }
}(jQuery);


