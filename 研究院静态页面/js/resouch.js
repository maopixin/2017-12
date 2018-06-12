!function(n){
    n.fn.newsgd = function(obj){
        var obj2 = {
            num:0,
            time:3000,
            s:300
        };
        var T = this,
            H = this.height(),
            N = this.find('li').length,
            t,
            ti = obj.time || obj2.time,
            s = obj.s || obj2.s,
            n = 1,
            num = (obj.num || obj2.num);
            S = H/N;
        this.find('li').each(function(i,e){
            if(i<=num-1){
                T.append($(e).clone());
            }
        })
        T.css({
            'transform':'translate3d(0,0,0)',
            'transition':'all '+s+'ms',
        });
        setTimeout(a,ti);
        function a(){
            T.css('transition','all '+s+'ms');
            T.css('transform','translateY('+(-n*S)+'px)');
            setTimeout(function(){
                if(n++>= N ){
                    n = 1;
                    T.css('transition','none');
                    T.css('transform','translateY(0)');
                };
            },500);
            setTimeout(a,ti);
        };
    };
}(jQuery);