!function(n){
    n.fn.newsgd = function(){
        var T = this,
            H = this.height(),
            N = this.find('.news-item').length,
            t,
            n = 1,
            S = H/N;
        T.css({
            'transform':'translate3d(0,0,0)',
            'transition':'all '+300+'ms',
        });
        setTimeout(a,3000);
        function a(){
            T.css('transition','all '+300+'ms');
            T.css('transform','translateY('+(-n*S)+'px)');
            setTimeout(function(){
                if(++n>=N){
                    n=1;
                    T.css('transition','none');
                    T.css('transform','translateY(0)');
                };
            },500);
            setTimeout(a,3000);
        };
    };
}(jQuery);