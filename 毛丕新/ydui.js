var ydui = {};
var dialog = {};
var check = {};
var pxui = {};
var doc = window.document,
        $doc = $(doc),
        $body = $(doc.body),
        $mask = $('<div class="mask-black"></div>');

var util = ydui.util = {
    /**
     * 格式化参数
     * @param string
     */
    parseOptions: function (string) {
        if ($.isPlainObject(string)) {
            return string;
        }

        var start = (string ? string.indexOf('{') : -1),
                options = {};

        if (start != -1) {
            try {
                options = (new Function('', 'var json = ' + string.substr(start) + '; return JSON.parse(JSON.stringify(json));'))();
            } catch (e) {
            }
        }
        return options;
    },
    /**
     * 页面滚动方法【移动端】
     * @type {{lock, unlock}}
     * lock：禁止页面滚动, unlock：释放页面滚动
     */
    pageScroll: function () {
        var fn = function (e) {
            e.preventDefault();
            e.stopPropagation();
        };
        var islock = false;

        return {
            lock: function () {
                if (islock)
                    return;
                islock = true;
                doc.addEventListener('touchmove', fn);
            },
            unlock: function () {
                islock = false;
                doc.removeEventListener('touchmove', fn);
            }
        };
    }(),

};

/**
 * Dialog
 */
!function () {
    "use strict";
    dialog = ydui.dialog = {};
    /**
     * 确认提示框
     * @param title 标题String 【可选】
     * @param mes   内容String 【必填】
     * @param opts  按钮们Array 或 “确定按钮”回调函数Function 【必填】
     * @constructor
     */
    dialog.confirm = function (title, mes, opts) {
        var ID = 'YDUI_CONFRIM';

        $('#' + ID).remove();

        var args = arguments.length;
        if (args < 2) {
            console.error('From YDUI\'s confirm: Please set two or three parameters!!!');
            return;
        }

        if (typeof arguments[1] != 'function' && args == 2 && !arguments[1] instanceof Array) {
            console.error('From YDUI\'s confirm: The second parameter must be a function or array!!!');
            return;
        }

        if (args == 2) {
            opts = mes;
            mes = title;
            title = '提示';
        }

        var btnArr = opts;
        if (typeof opts === 'function') {
            btnArr = [{
                    txt: '取消',
                    color: false
                }, {
                    txt: '确定',
                    color: true,
                    callback: function () {
                        opts && opts();
                    }
                }];
        }

        var $dom = $('' +
                '<div class="mask-black-dialog" id="' + ID + '">' +
                '   <div class="m-confirm">' +
                '       <div class="confirm-hd"><strong class="confirm-title">' + title + '</strong></div>' +
                '       <div class="confirm-bd">' + mes + '</div>' +
                '   </div>' +
                '</div>');

        // 遍历按钮数组
        var $btnBox = $('<div class="confirm-ft"></div>');

        $.each(btnArr, function (i, val) {
            var $btn;
            // 指定按钮颜色
            if (typeof val.color == 'boolean') {
                $btn = $('<a href="javascript:;" class="' + 'confirm-btn ' + (val.color ? 'primary' : 'default') + '">' + (val.txt || '') + '</a>');
            } else if (typeof val.color == 'string') {
                $btn = $('<a href="javascript:;" style="color: ' + val.color + '">' + (val.txt || '') + '</a>');
            }

            // 给对应按钮添加点击事件
            (function (p) {
                $btn.on('click', function (e) {
                    e.stopPropagation();

                    // 是否保留弹窗
                    if (!btnArr[p].stay) {
                        // 释放页面滚动
                        ydui.util.pageScroll.unlock();
                        $dom.remove();
                    }
                    btnArr[p].callback && btnArr[p].callback();
                });
            })(i);
            $btnBox.append($btn);
        });

        $dom.find('.m-confirm').append($btnBox);

        // 禁止滚动屏幕【移动端】
        ydui.util.pageScroll.lock();

        $body.append($dom);
    };

    /**
     * 弹出警示框
     * @param mes       提示文字String 【必填】
     * @param callback  回调函数Function 【可选】
     */
    dialog.alert = function (mes, callback) {

        var ID = 'YDUI_ALERT';

        $('#' + ID).remove();

        var $dom = $('' +
                '<div id="' + ID + '">' +
                '   <div class="mask-black-dialog">' +
                '       <div class="m-confirm m-alert">' +
                '           <div class="confirm-bd">' + (mes || 'YDUI Touch') + '</div>' +
                '           <div class="confirm-ft">' +
                '               <a href="javascript:;" class="confirm-btn primary">确定</a>' +
                '           </div>' +
                '       </div>' +
                '   </div>' +
                '</div>');

        ydui.util.pageScroll.lock();

        $body.append($dom);

        $dom.find('a').on('click', function () {
            $dom.remove();
            ydui.util.pageScroll.unlock();
            typeof callback === 'function' && callback();
        });
    };

    /**
     * 弹出提示层
     */
    dialog.toast = function () {
        var timer = null;
        /**
         * @param mes       提示文字String 【必填】
         * @param type      类型String success or error 【必填】
         * @param timeout   多久后消失Number 毫秒 【默认：2000ms】【可选】
         * @param callback  回调函数Function 【可选】
         */
        return function (mes, type, timeout, callback) {

            clearTimeout(timer);

            var ID = 'YDUI_TOAST';

            $('#' + ID).remove();

            var args = arguments.length;
            if (args < 2) {
                console.error('From YDUI\'s toast: Please set two or more parameters!!!');
                return;
            }

            var iconHtml = '';
            if (type == 'success' || type == 'error') {
                iconHtml = '<div class="' + (type == 'error' ? 'toast-error-ico' : 'toast-success-ico') + '"></div>';
            }

            var $dom = $('' +
                    '<div class="mask-white-dialog" id="' + ID + '">' +
                    '    <div class="m-toast ' + (iconHtml == '' ? 'none-icon' : '') + '">' + iconHtml +
                    '        <p class="toast-content">' + (mes || '') + '</p>' +
                    '    </div>' +
                    '</div>');

            ydui.util.pageScroll.lock();

            $body.append($dom);

            if (typeof timeout === 'function' && arguments.length >= 3) {
                callback = timeout;
                timeout = 2000;
            }

            timer = setTimeout(function () {
                clearTimeout(timer);
                ydui.util.pageScroll.unlock();
                $dom.remove();
                typeof callback === 'function' && callback();
            }, (~~timeout || 2000) + 100); //100为动画时间
        };
    }();

    /**
     * 顶部提示层
     */
    dialog.notify = function () {

        var timer = null;

        /**
         * @param mes       提示文字String 【必填】
         * @param timeout   多久后消失Number 毫秒 【默认：2000ms】【可选】
         */
        return function (mes, timeout, callback) {

            clearTimeout(timer);

            var ID = 'YDUI_NOTIFY';

            $('#' + ID).remove();

            var $dom = $('<div id="' + ID + '"><div class="m-notify">' + (mes || '') + '</div></div>');

            $body.append($dom);

            var next = function () {
                $dom.remove();
                typeof callback == 'function' && callback();
            };

            var closeNotify = function () {
                clearTimeout(timer);

                $dom.find('.m-notify').addClass('notify-out');

                $dom.one('webkitTransitionEnd', next).emulateTransitionEnd(150);
            };

            $dom.on('click', closeNotify);

            if (~~timeout > 0) {
                timer = setTimeout(closeNotify, timeout + 200);
            }
        }
    }();

    /**
     * 加载中提示框
     */
    dialog.loading = function () {

        var ID = 'YDUI_LOADING';

        return {
            /**
             * 加载中 - 显示
             * @param text 显示文字String 【可选】
             */
            open: function (text) {
                $('#' + ID).remove();

                var $dom = $('' +
                        '<div class="mask-white-dialog" id="' + ID + '">' +
                        '   <div class="m-loading">' +
                        '       <div class="loading-icon"></div>' +
                        '       <div class="loading-txt">' + (text || '数据加载中') + '</div>' +
                        '   </div>' +
                        '</div>').remove();

                ydui.util.pageScroll.lock();
                $body.append($dom);
            },
            /**
             * 加载中 - 隐藏
             */
            close: function () {
                ydui.util.pageScroll.unlock();
                $('#' + ID).remove();
            }
        };
    }();
}();
/**
 * 
 * 关于表单校验
 * 
 * 
 */
// 检测元素的val是否为空 msg可选填 fn可选填
// 主动校验单个 需要调用函数
check.vacancy = function (id, msg, fn) {
    msg = msg ? msg : "";
    if ($("#" + id).val().trim() === "") {
        dialog.toast(msg + '内容不能为空', 'none', 1000);
        fn && fn();
        return false;
    };
};
// 校验所有不能为空的
check.allVacancy = function (str) {
	str = str?str:"";
    var onoff = true;
    $( str + '.check_vacancy').each(function (i, e) {
        if ($(this).val().trim() === "") {
            var _this = this;
            dialog.toast('必填项内容不能为空哦', 'none', function () {
                $(_this).focus();
            });
            onoff = false;
            return false;
        }
    });
    return onoff;
};
//校验日期选择框
check.dateSelect = function(str){
	str = str?str:"";
	var onoff = true;
	 $( str +' '+ ' .dateCheck').each(function (i, e) {
        if ($(this).val().trim() === "") {
            var _this = this;
            dialog.toast('必填项内容不能为空哦', 'none', function () {
                $(_this).focus();
            });
            onoff = false;
            return false;
        }
    });
    return onoff;
}
// 失焦校验(空白)
$(document).on('blur', ".check_vacancy", function () {
    if ($(this).val().trim() === "") {
        dialog.toast('必填项内容不能为空哦', 'none', 1000);
    }
    ;
});

// 失焦校验（手机号码）
$(document).on('blur', ".check_mobile", function () {
    if (!/^[1][3,4,5,7,8][0-9]{9}$/.test($(this).val().trim())) {
        dialog.toast('请输入11位有效的手机号码', 'none', 1000);
    }
    ;
});
// 主动校验（手机号码）
check.allMobile = function (str) {
	str = str?str:"";
    var onoff = true;
    $(str+'.check_mobile').each(function (i, e) {
        if (!/^[1][3,4,5,7,8][0-9]{9}$/.test($(this).val().trim())) {
            var _this = this;
            dialog.toast('请输入11位有效的手机号码', 'none', function () {
                $(_this).focus();
            });
            onoff = false;
        }
    });
    return onoff;
};
// 失焦校验（邮箱格式）
$(document).on('blur', ".check_email", function () {
    if (!new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$").test($(this).val().trim())) {
        dialog.toast('请输入正确的邮箱格式', 'none', 1000);
    }
    ;
});
// 主动校验（邮箱格式） 
check.allEmail = function (str) {
	str = str?str:"";
    var onoff = true;
    $(str + '.check_email').each(function (i, e) {
        if (!new RegExp("^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$").test($(this).val().trim())) {
            var _this = this;
            dialog.toast('请输入正确的邮箱格式', 'none', function () {
                $(_this).focus();
            });
            onoff = false;
        }
    });
    return onoff;
};
// 校验所有选择框
check.allSelect = function () {
    var onoff = true;
    $('.check_select').each(function (i, e) {
        if (!$(this).data('id')) {
            dialog.toast('存在未选择的选项哦', 'none');
            onoff = false;
        }
        ;
    });
    return onoff;
};

// 校验所有数字格式
check.allNumber = function () {
    var onoff = true;
    $('.check_number').each(function (i, e) {
        if (isNaN(Number($(this).val()))) {
            var _this = this;
            dialog.toast('填写数字的地方只能填写数字哦', 'none', function () {
                $(_this).focus();
            });
            onoff = false;
        }
        ;
    });
    return onoff;
};

// 文件上传
pxui.getPicFile = function (id) {
    if ($('#' + id).__uploading) {
        return false;
    }
    ;
    $('#' + id).__uploading = true;
    var data = new FormData();
    data.append('file', $('#' + id)[0].files[0]);
    $('#' + id).val("");
    $('#' + id).outerHTML = $('#' + id).outerHTML;
    return data;
};

// 倒计时
pxui.countDownStart = function (id) {
    var _this = $("#" + id);
    var str = _this.html();
    var time = window.localStorage.getItem("countDownTime") || 60;
    var speed = 1;
    var timer = 0;
    timer = setInterval(function () {
        _this.html("重新获取" + time + "秒");
        window.localStorage.setItem("countDownTime", time);
        time -= 1;
        if (time <= 0) {
            clearInterval(timer);
            window.localStorage.removeItem("countDownTime");
            _this.html(str);
            $('#' + id).click(function (id) {
                pxui.countDownStart('id');
            });
        }
        ;
    }, 1000);
};
pxui.countDown = function (id, fn) {
    if (window.localStorage.getItem("countDownTime")) {
        $('#' + id).removeAttr('onclick');
        pxui.countDownStart(id);
    }
    ;
};

pxui.checkAll = function () {
    if (check.allVacancy() && check.allSelect() && check.allMobile() && check.allEmail() && check.allNumber()) {
        return true;
    }
    ;
    return false;
};

/*!
 * 
 * Time
 */
(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // CommonJS
        factory(require('jquery'));
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    'use strict';

    var d = new Date(),
            doc = window.document,
            nowYear = d.getFullYear(),
            nowMonth = d.getMonth() + 1,
            domDate,
            createDate,
            time,
            body = $('body'),
            emptyStr = "<li></li>",
            isTouch = "ontouchend" in doc,
            tstart = isTouch ? "touchstart" : "mousedown",
            tmove = isTouch ? "touchmove" : "mousemove",
            tend = isTouch ? "touchend" : "mouseup",
            tcancel = isTouch ? "touchcancel" : "mouseleave",
            isEnglish = (navigator.language || navigator.browserLanguage).toLowerCase().indexOf('zh') == -1,
            //基于40px的高度滑动,自适应就改动这或者dpr
            h = 40,
            dpr = $('html').attr('data-dpr') || 1,
            resH = h * dpr,
            //支持的时间格式展示
            dateFormat = [
                //年月日 时分秒
                ['YYYY-MM-DD hh:mm:ss', 'YY-MM-DD hh:mm:ss', 'YYYY/MM/DD hh:mm:ss', 'YY/MM/DD hh:mm:ss'],
                //年月日 时分
                ['YYYY-MM-DD hh:mm', 'YY-MM-DD hh:mm', 'YYYY/MM/DD hh:mm', 'YY/MM/DD hh:mm'],
                //年月日
                ['YYYY-MM-DD', 'YY-MM-DD', 'YYYY/MM/DD', 'YY/MM/DD'],
                //年月
                ['YYYY-MM', 'YY-MM', 'YYYY/MM', 'YY/MM']
            ],
            opts = {
                beginYear: 2018,
                endYear: 2088, //可不填，结束年份不会小于当前年份           
                type: 'YYYY-MM-DD',
                limitTime: false //限制选择时间 today 今天之前的时间不可选 tomorrow 明天之前的不可选
            };
    //dom渲染
    domDate = '<div id="date-wrapper" style="font-size:0.266667rem;"><h3>选择日期</h3><div id="d-content"><div id="d-tit"><div class="t1">年</div><div class="t2">月</div><div class="t3">日</div><div class="t4">时</div><div class="t5">分</div><div class="t6">秒</div></div><div id="d-bg"><ol id="d-year"></ol><ol id="d-month"></ol><ol id="d-day"></ol><ol id="d-hours"></ol><ol id="d-minutes"></ol><ol id="d-seconds"></ol></div></div><a id="d-cancel" href="javascript:">取消</a><a id="d-confirm" href="javascript:">确定</a></div><div id="d-mask"></div>';
    var css = '<style type="text/css">a{text-decoration:none;}ol,li{margin:0;padding:0}li{list-style-type:none}#date-wrapper{position:fixed;top:50%;left:50%;width:90%;margin: -139px 0 0 -45%;z-index:56;text-align:center;background:#fff;border-radius:3px;padding-bottom:15px;display:none}#d-mask{position:fixed;width:100%;height:100%;top:0;left:0;background:#000;filter:alpha(Opacity=50);-moz-opacity:.5;opacity:.5;z-index:55;display:none}#date-wrapper h3{line-height:50px;background:#1b9fe2;color:#fff;font-size:20px;margin:0;border-radius:3px 3px 0 0}#date-wrapper ol,#d-tit>div{width:16.6666666%;float:left;position:relative}#d-content{padding:10px}#d-content #d-bg{background:#f8f8f8;border:1px solid #e0e0e0;border-radius:0 0 5px 5px;height:120px;overflow:hidden;margin-bottom:10px;position:relative}#d-cancel,#d-confirm{border-radius:3px;float:left;width:40%;line-height:30px;font-size:16px;background:#dcdddd;color:#666;margin:0 5%}#d-confirm{background:#1b9fe2;color:#fff}#date-wrapper li{line-height:40px;height:40px;cursor:pointer;position:relative}#d-tit{background:#f8f8f8;overflow:hidden;border-radius:5px 5px 0 0;line-height:30px;border:1px solid #e0e0e0;margin-bottom:-1px}#date-wrapper ol{-webkit-overflow-scrolling:touch;position:absolute;top:0;left:0}#date-wrapper ol:nth-child(2){left:16.6666666%}#date-wrapper ol:nth-child(3){left:33.3333332%}#date-wrapper ol:nth-child(4){left:49.9999998%}#date-wrapper ol:nth-child(5){left:66.6666664%}#date-wrapper ol:nth-child(6){left:83.333333%}#d-content #d-bg:after{content:\'\';height:40px;background:#ddd;position:absolute;top:40px;left:0;width:100%;z-index:1}#date-wrapper li span{position:absolute;width:100%;z-index:99;height:100%;left:0;top:0}#date-wrapper.two ol,.two #d-tit>div{width:50%}#date-wrapper.two ol:nth-child(2){left:50%}#date-wrapper.three ol,.three #d-tit>div{width:33.333333%}#date-wrapper.three ol:nth-child(2){left:33.333333%}#date-wrapper.three ol:nth-child(3){left:66.666666%}#date-wrapper.four ol,.four #d-tit>div{width:25%}#date-wrapper.four ol:nth-child(2){left:25%}#date-wrapper.four ol:nth-child(3){left:50%}#date-wrapper.four ol:nth-child(4){left:75%}#date-wrapper.five ol,.five #d-tit>div{width:20%}#date-wrapper.five ol:nth-child(2){left:20%}#date-wrapper.five ol:nth-child(3){left:40%}#date-wrapper.five ol:nth-child(4){left:60%}#date-wrapper.five ol:nth-child(5){left:80%}</style>';

    if (isEnglish) {
        domDate = domDate.replace('选择日期', 'DatePicker').replace('取消', 'cancel').replace('确定', 'confirm');
        css = css.replace('</style>', '#date-wrapper #d-tit{display:none;}</style>');
    }
    if (h != 40) {
        css = css.replace('40px', h + 'px');
    }
    if (dpr != 1) {
        css = css.replace(/(\d+)px/g, function (i) {
            return i.replace(/\D/g, '') * dpr + 'px';
        });
    }
    body.append(css).append(domDate);

    createDate = {
        y: function (begin, end) {
            var domYear = '',
                    end = end <= nowYear ? (end + 10) : end;

            for (var i = begin; i <= end; i++) {
                domYear += '<li><span>' + i + '</span></li>';
            }
            $('#d-year').html(emptyStr + domYear + emptyStr);
        },
        m: function () {
            var domMonth = '';
            for (var j = 1; j <= 12; j++) {
                j = j < 10 ? '0' + j : j;
                domMonth += '<li><span>' + j + '</span></li>';
            }
            $('#d-month').html(emptyStr + domMonth + emptyStr);
        },
        d: function (end, active) {
            var end = end || createDate.bissextile(nowYear, nowMonth),
                    domDay = '';
            for (var k = 1; k <= end; k++) {
                k = k < 10 ? '0' + k : k;
                if (active && active == k) {
                    domDay += '<li class="active"><span>' + k + '</span></li>';
                } else {
                    domDay += '<li><span>' + k + '</span></li>';
                }
            }
            $('#d-day').html(emptyStr + domDay + emptyStr);
        },
        hm: function () {
            var domHours = '',
                    domMinutes = '';

            for (var i = 0; i <= 23; i++) {
                i = i < 10 ? '0' + i : i;
                domHours += '<li><span>' + i + '</span></li>';
            }
            $('#d-hours').html(emptyStr + domHours + emptyStr);

            for (var j = 0; j <= 59; j++) {
                j = j < 10 ? '0' + j : j;
                domMinutes += '<li><span>' + j + '</span></li>';
            }
            $('#d-minutes').html(emptyStr + domMinutes + emptyStr);

        },
        s: function () {
            var domSeconds = '';

            for (var i = 0; i <= 59; i++) {
                i = i < 10 ? '0' + i : i;
                domSeconds += '<li><span>' + i + '</span></li>';
            }
            $('#d-seconds').html(emptyStr + domSeconds + emptyStr);
        },
        bissextile: function (year, month) {
            var day;
            if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
                day = 31
            } else if (month == 4 || month == 6 || month == 11 || month == 9) {
                day = 30
            } else if (month == 2) {
                if (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0)) { //闰年
                    day = 29
                } else {
                    day = 28
                }

            }
            return day;
        },
        slide: function (el) {
            //滑动
            var T, mT, isPress = false;
            $(doc).on(tstart, '#date-wrapper ol', function (e) {
                var e = e.originalEvent;
                e.stopPropagation();
                e.preventDefault();
                T = e.pageY || e.touches[0].pageY;
                if (!isTouch) {
                    isPress = true;
                }
            })
            $(doc).on(tmove, '#date-wrapper ol', function (e) {
                var e = e.originalEvent,
                        that = $(this);
                e.stopPropagation();
                e.preventDefault();
                if (!isTouch && !isPress) {
                    return false
                }
                ;
                mT = e.pageY || e.touches[0].pageY;
                that.css('top', that.position().top + (mT - T) + 'px');
                T = mT;
                if (that.position().top > 0)
                    that.css('top', '0');
                if (that.position().top < -(that.height() - (3 * resH)))
                    that.css('top', '-' + (that.height() - (3 * resH)) + 'px');
            })
            $(doc).on(tend, '#date-wrapper ol', function (e) {
                var e = e.originalEvent,
                        that = $(this);
                e.stopPropagation();
                e.preventDefault();
                isPress = false;
                dragEnd(that);
            })
            $(doc).on(tcancel, '#date-wrapper ol', function (e) {
                var e = e.originalEvent,
                        that = $(this);
                e.stopPropagation();
                e.preventDefault();
                isPress = false;
                // 解决一个pc端莫名触发问题
                if (!isTouch && +new Date() > time + 600) {
                    dragEnd(that);
                }
            })

            function dragEnd(that) {
                //滚动调整
                var t = that.position().top;
                that.css('top', Math.round(t / resH) * resH + 'px');
                //定位active
                t = Math.round(Math.abs($(that).position().top));
                var li = that.children('li').get(t / resH + 1);
                $(li).addClass('active').siblings().removeClass('active');
                //修正日期
                var id = that.attr('id');
                if (id == 'd-month' || id == 'd-year') {
                    var elDay = $('#d-day');
                    if (elDay.length == 0) {
                        return false;
                    }
                    var end = createDate.bissextile($('#d-year .active').text(), $('#d-month .active').text());
                    if (end != (elDay.children().length - 2)) {
                        var active = elDay.children('.active').text();

                        active > end && (active = end);
                        createDate.d(end, active);
                        if (Math.abs(elDay.position().top) > elDay.height() - 3 * resH)
                            elDay.css('top', '-' + (elDay.height() - 3 * resH) + 'px');
                    }
                }
            }
        },
        show: function (isShow) {
            var domMain = $('#date-wrapper'),
                    domMask = $('#d-mask');
            if (isShow) {
                domMain.show();
                domMask.show();
                time = +new Date();
                body.css('overflow', 'hidden');
            } else {
                domMain.hide();
                domMask.hide();
                body.css('overflow', 'auto');
            }
        },
        resetActive: function () {
            var d = new Date();
            if (opt.limitTime == 'tomorrow') {
                d.setDate(d.getDate() + 1);
            }
            $('#date-wrapper ol').each(function () {
                var e = $(this),
                        eId = e.attr('id');
                e.children('li').each(function () {
                    var li = $(this),
                            liText = Number(li.text() == '' ? 'false' : li.text());
                    if (eId == 'd-year' && liText === d.getFullYear()) {
                        li.addClass('active').siblings().removeClass('active');
                        return false;
                    } else if (eId == 'd-month' && liText === (d.getMonth() + 1)) {
                        li.addClass('active').siblings().removeClass('active');
                        return false;
                    } else if (eId == 'd-day' && liText === d.getDate()) {
                        li.addClass('active').siblings().removeClass('active');
                        return false;
                    } else if (eId == 'd-hours' && liText === d.getHours()) {
                        li.addClass('active').siblings().removeClass('active');
                        return false;
                    } else if (eId == 'd-minutes' && liText === d.getMinutes()) {
                        li.addClass('active').siblings().removeClass('active');
                        return false;
                    } else if (eId == 'd-seconds' && liText === d.getSeconds()) {
                        li.addClass('active').siblings().removeClass('active');
                        return false;
                    }
                })
            })
        },
        toNow: function (refresh) {
            if (!refresh) {
                $('#date-wrapper ol').each(function () {
                    var that = $(this);
                    var liTop = -(that.children('.active').position().top - resH);
                    that.animate({
                        top: liTop
                    },
                            600);
                })
            } else {
                $('#date-wrapper ol').each(function () {
                    $(this).animate({
                        top: 0
                    },
                            0);
                })
            }
        },
        clear: function () {
            createDate.toNow(true);
            createDate.show(false);
        }
    }
    createDate.m();
    createDate.d();
    createDate.hm();
    createDate.s();
    createDate.slide();

    var opt,
            userOption,
            el = $('#date-wrapper'),
            elTit = $('#d-tit'),
            elBg = $('#d-bg'),
            prevY = '';

    function DateTool(obj) {
        var that = $(obj);
        that.bind('click', function () {
            if (that.get(0).tagName == 'INPUT') {
                that.blur();
            }
            userOption = that.data('options');
            if (typeof (userOption) == 'string') {
                userOption = JSON.parse(userOption.replace(/'/g, '"'));
            }
            if (!el.is(':visible')) {
                opt = null;
                opt = $.extend({}, opts, userOption || {});
                var y = '' + opt.beginYear + opt.endYear;
                if (prevY != y) {
                    createDate.y(opt.beginYear, opt.endYear);
                    prevY = y;
                }
                if (dateFormat[0].indexOf(opt.type) != -1) { //年月日 时分秒
                    elTit.children().show();
                    elBg.children().show();
                    el.attr('class', '');
                } else if (dateFormat[1].indexOf(opt.type) != -1) { //年月日 时分
                    elTit.children().show().end().children(':gt(4)').hide();
                    elBg.children().show().end().children(':gt(4)').hide();
                    el.attr('class', 'five');
                } else if (dateFormat[2].indexOf(opt.type) != -1) { //年月日
                    elTit.children().show().end().children(':gt(2)').hide();
                    elBg.children().show().end().children(':gt(2)').hide();
                    el.attr('class', 'three');
                } else if (dateFormat[3].indexOf(opt.type) != -1) { //年月
                    elTit.children().show().end().children(':gt(1)').hide();
                    elBg.children().show().end().children(':gt(1)').hide();
                    el.attr('class', 'two');
                }
                createDate.resetActive();
                createDate.show(true);
                createDate.toNow(false);
                $('#d-confirm').attr('d-id', obj);
            }
        });
    }
    $.date = function (obj) {
        DateTool(obj);
    }
    //取消
    $('#d-cancel,#d-mask').bind('click', function () {
        createDate.clear();
    })
    //确定
    $('#d-confirm').bind('click', function () {
        var y = $('#d-year .active').text(),
                m = $('#d-month .active').text(),
                d = $('#d-day .active').text(),
                h = $('#d-hours .active').text(),
                min = $('#d-minutes .active').text(),
                s = $('#d-seconds .active').text(),
                str,
                that = $($(this).attr('d-id')),
                index = dateFormat[0].indexOf(opt.type),
                index1 = dateFormat[1].indexOf(opt.type),
                index2 = dateFormat[2].indexOf(opt.type),
                index3 = dateFormat[3].indexOf(opt.type);

        if (index != -1) { //年月日 时分秒
            switch (index) {
                case 0:
                    str = y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + s;
                    break;
                case 1:
                    str = y.substring(2) + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + s;
                    break;
                case 2:
                    str = y + '/' + m + '/' + d + ' ' + h + ':' + min + ':' + s;
                    break;
                case 3:
                    str = y.substring(2) + '/' + m + '/' + d + ' ' + h + ':' + min + ':' + s;
                    break;
            }
        } else if (index1 != -1) { //年月日 时分
            switch (index1) {
                case 0:
                    str = y + '-' + m + '-' + d + ' ' + h + ':' + min;
                    break;
                case 1:
                    str = y.substring(2) + '-' + m + '-' + d + ' ' + h + ':' + min;
                    break;
                case 2:
                    str = y + '/' + m + '/' + d + ' ' + h + ':' + min;
                    break;
                case 3:
                    str = y.substring(2) + '/' + m + '/' + d + ' ' + h + ':' + min;
                    break;
            }
        } else if (index2 != -1) { //年月日
            switch (index2) {
                case 0:
                    str = y + '-' + m + '-' + d;
                    break;
                case 1:
                    str = y.substring(2) + '-' + m + '-' + d;
                    break;
                case 2:
                    str = y + '/' + m + '/' + d;
                    break;
                case 3:
                    str = y.substring(2) + '/' + m + '/' + d;
                    break;
            }
        } else if (index3 != -1) { //年月
            switch (index3) {
                case 0:
                    str = y + '-' + m;
                    break;
                case 1:
                    str = y.substring(2) + '-' + m;
                    break;
                case 2:
                    str = y + '/' + m;
                    break;
                case 3:
                    str = y.substring(2) + '/' + m;
                    break;
            }
        }
        if (opt.limitTime == 'today') {
            var d = new Date(),
                    error = !isEnglish ? '不能选择过去的时间' : 'You can\'t choose the past time';
            //当前日期
            var day = String(d.getFullYear()) + '-' + String(d.getMonth() + 1) + '-' + String(d.getDate());
            var d1 = new Date(str.replace(/\-/g, "\/"));
            var d2 = new Date(day.replace(/\-/g, "\/"));
            if (d1 < d2) {
                alert(error);
                return false;
            }
        } else if (opt.limitTime == 'tomorrow') {
            var d = new Date(),
                    error = !isEnglish ? '时间最少选择明天' : 'Choose tomorrow at least';
            //当前日期+1
            var day = String(d.getFullYear()) + '-' + String(d.getMonth() + 1) + '-' + String(d.getDate() + 1);
            var d1 = new Date(str.replace(/\-/g, "\/"));
            var d2 = new Date(day.replace(/\-/g, "\/"));
            if (d1 < d2) {
                alert(error);
                return false;
            }
        }
        //赋值
        if (that.get(0).tagName == 'INPUT') {
            that.val(str);
        } else {
            that.text(str);
        }

        createDate.show(false);
        createDate.toNow(true);
    })
}))

// 判断开始和结束时间是否合理
pxui.checkTwoTime = function (startEleId, endEleId) {
    var e1 = startEleId,
            e2 = endEleId,
            e1Str = $("#" + e1).val().trim().split("-"),
            e2Str = $("#" + e2).val().trim().split("-"),
            onoff = true;
    e1Str.forEach(function (e, i) {
        if (!(e2Str[i] >= e)) {
            onoff = false;
            dialog.toast('结束时间应晚于开始时间', 'none', 1000);
        }
        ;
    });
    if (e1Str.length < 2) {
        onoff = false;
        dialog.toast('时间格式错误', 'error', 1000);
    }
    ;
    return onoff;
};

/**
 * CitySelect Plugin
 */
function searchAdress(str){
	var pid = str.slice(0,2)+'0000';
	var cid = str.slice(0,4)+'00';
	var aid = str;
	var returnStr = '';
	YDUI_CITYS.forEach(function(e,i){
		if(e.pid===pid){
			returnStr += e.n + ' ';
			e.c.forEach(function(e2,i2){
				if(e2.cid===cid){
					returnStr += e2.n + ' ';
					e2.a.forEach(function(e3,i3){
						if(e3.aid===aid){
							returnStr += e3.n + ' ';
							return false;
						};
					});
					return false;
				};
			});
			return false;
		};
	});
	return returnStr;
};


!function (window) {
    "use strict";

    var $body = $(window.document.body);

    function CitySelect(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, CitySelect.DEFAULTS, options || {});
        this.init();
    }

    CitySelect.DEFAULTS = {
        provance: '',
        city: '',
        area: ''
    };

    CitySelect.prototype.init = function () {
        var _this = this,
                options = _this.options;

        if (typeof YDUI_CITYS == 'undefined') {
            console.error('请在ydui.js前引入ydui.citys.js。下载地址：http://cityselect.ydui.org');
            return;
        }

        _this.citys = YDUI_CITYS;

        _this.createDOM();

        _this.defaultSet = {
            provance: options.provance,
            city: options.city,
            area: options.area
        };
    };

    CitySelect.prototype.open = function () {
        var _this = this;

        $body.append(_this.$mask);

        // 防止火狐浏览器文本框丑丑的一坨小水滴
        // YDUI.device.isMozilla && _this.$element.blur();

        _this.$mask.on('click.ydui.cityselect.mask', function () {
            _this.close();
        });

        var $cityElement = _this.$cityElement,
                defaultSet = _this.defaultSet;

        $cityElement.find('.cityselect-content').removeClass('cityselect-move-animate cityselect-next cityselect-prev');

        _this.loadProvance();

        if (defaultSet.provance) {
            _this.setNavTxt(0, defaultSet.provance);
        } else {
            $cityElement.find('.cityselect-nav a').eq(0).addClass('crt').html('请选择');
        }

        if (defaultSet.city) {
            _this.loadCity();
            _this.setNavTxt(1, defaultSet.city)
        }

        if (defaultSet.area) {
            _this.loadArea();
            _this.ForwardView(false);
            _this.setNavTxt(2, defaultSet.area);
        }

        $cityElement.addClass('brouce-in');
    };

    CitySelect.prototype.close = function () {
        var _this = this;

        _this.$mask.remove();
        _this.$cityElement.removeClass('brouce-in').find('.cityselect-nav a').removeClass('crt').html('');
        _this.$itemBox.html('');
    };

    CitySelect.prototype.createDOM = function () {
        var _this = this;

        _this.$mask = $('<div class="mask-black"></div>');

        _this.$cityElement = $('' +
                '<div class="m-cityselect">' +
                '    <div class="cityselect-header">' +
                '        <p class="cityselect-title">所在地区</p>' +
                '        <div class="cityselect-nav">' +
                '            <a href="javascript:;" ></a>' +
                '            <a href="javascript:;"></a>' +
                '            <a href="javascript:;"></a>' +
                '        </div>' +
                '    </div>' +
                '    <ul class="cityselect-content">' +
                '        <li class="cityselect-item">' +
                '            <div class="cityselect-item-box"></div>' +
                '        </li>' +
                '        <li class="cityselect-item">' +
                '            <div class="cityselect-item-box"></div>' +
                '        </li>' +
                '        <li class="cityselect-item">' +
                '            <div class="cityselect-item-box"></div>' +
                '        </li>' +
                '    </ul>' +
                '</div>');

        $body.append(_this.$cityElement);

        _this.$itemBox = _this.$cityElement.find('.cityselect-item-box');

        _this.$cityElement.on('click.ydui.cityselect', '.cityselect-nav a', function () {
            var $this = $(this);

            $this.addClass('crt').siblings().removeClass('crt');

            $this.index() < 2 ? _this.backOffView() : _this.ForwardView(true);
        });
    };

    CitySelect.prototype.setNavTxt = function (index, txt) {

        var $nav = this.$cityElement.find('.cityselect-nav a');

        index < 2 && $nav.removeClass('crt');

        $nav.eq(index).html(txt);
        $nav.eq(index + 1).addClass('crt').html('请选择');
        $nav.eq(index + 2).removeClass('crt').html('');
    };

    CitySelect.prototype.backOffView = function () {
        this.$cityElement.find('.cityselect-content').removeClass('cityselect-next')
                .addClass('cityselect-move-animate cityselect-prev');
    };

    CitySelect.prototype.ForwardView = function (animate) {
        this.$cityElement.find('.cityselect-content').removeClass('cityselect-move-animate cityselect-prev')
                .addClass((animate ? 'cityselect-move-animate' : '') + ' cityselect-next');
    };

    CitySelect.prototype.bindItemEvent = function () {
        var _this = this,
                $cityElement = _this.$cityElement;

        $cityElement.on('click.ydui.cityselect', '.cityselect-item-box a', function () {
            var $this = $(this);

            if ($this.hasClass('crt'))
                return;
            $this.addClass('crt').siblings().removeClass('crt');
            $('#city_select').attr('data-code', $this.data('code'));
            var tag = $this.data('tag');

            _this.setNavTxt(tag, $this.text());

            var $nav = $cityElement.find('.cityselect-nav a'),
                    defaultSet = _this.defaultSet;

            if (tag == 0) {

                _this.loadCity();
                $cityElement.find('.cityselect-item-box').eq(1).find('a').removeClass('crt');

            } else if (tag == 1) {

                _this.loadArea();
                _this.ForwardView(true);
                $cityElement.find('.cityselect-item-box').eq(2).find('a').removeClass('crt');

            } else {

                defaultSet.provance = $nav.eq(0).html();
                defaultSet.city = $nav.eq(1).html();
                defaultSet.area = $nav.eq(2).html();

                _this.returnValue();
            }
        });
    };

    CitySelect.prototype.returnValue = function () {
        var _this = this,
                defaultSet = _this.defaultSet;

        _this.$element.trigger($.Event('done.ydui.cityselect', {
            provance: defaultSet.provance,
            city: defaultSet.city,
            area: defaultSet.area
        }));

        _this.close();
    };

    CitySelect.prototype.scrollPosition = function (index) {

        var _this = this,
                $itemBox = _this.$itemBox.eq(index),
                itemHeight = $itemBox.find('a.crt').height(),
                itemBoxHeight = $itemBox.parent().height();

        $itemBox.parent().animate({
            scrollTop: $itemBox.find('a.crt').index() * itemHeight - itemBoxHeight / 3
        }, 0, function () {
            _this.bindItemEvent();
        });
    };

    CitySelect.prototype.fillItems = function (index, arr) {
        var _this = this;

        _this.$itemBox.eq(index).html(arr).parent().animate({
            scrollTop: 0
        }, 10);

        _this.scrollPosition(index);
    };

    CitySelect.prototype.loadProvance = function () {
        var _this = this;

        var arr = [];
        $.each(_this.citys, function (k, v) {
            arr.push($('<a class="' + (v.n == _this.defaultSet.provance ? 'crt' : '') + '" href="javascript:;"><span>' + v.n + '</span></a>').data({
                citys: v.c,
                tag: 0
            }));
        });
        _this.fillItems(0, arr);
    };

    CitySelect.prototype.loadCity = function () {
        var _this = this;

        var cityData = _this.$itemBox.eq(0).find('a.crt').data('citys');

        var arr = [];
        $.each(cityData, function (k, v) {
            arr.push($('<a class="' + (v.n == _this.defaultSet.city ? 'crt' : '') + '" href="javascript:;"><span>' + v.n + '</span></a>').data({
                citys: v.a,
                tag: 1
            }));
        });
        _this.fillItems(1, arr);
    };

    CitySelect.prototype.loadArea = function () {
        var _this = this;

        var areaData = _this.$itemBox.eq(1).find('a.crt').data('citys');

        var arr = [];
        $.each(areaData, function (k, v) {
            arr.push($('<a class="' + (v.n == _this.defaultSet.area ? 'crt' : '') + '" href="javascript:;" data-code="' + v.aid + '"><span>' + v.n + '</span></a>').data({
                tag: 2
            }));
        });

        if (arr.length <= 0) {
            arr.push($('<a href="javascript:;"><span>全区</span></a>').data({
                tag: 2
            }));
        }
        _this.fillItems(2, arr);
    };

    function Plugin(option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $this = $(this),
                    citySelect = $this.data('ydui.cityselect');

            if (!citySelect) {
                $this.data('ydui.cityselect', (citySelect = new CitySelect(this, option)));
            }

            if (typeof option == 'string') {
                citySelect[option] && citySelect[option].apply(citySelect, args);
            }
        });
    }

    $.fn.citySelect = Plugin;

}(window);

/**
 * SendCode Plugin
 */
!function () {
    "use strict";

    function SendCode(element, options) {
        this.$btn = $(element);
        this.options = $.extend({}, SendCode.DEFAULTS, options || {});
    }

    SendCode.DEFAULTS = {
        run: false, // 是否自动倒计时
        secs: 60, // 倒计时时长（秒）
        disClass: 'no-get-mes', // 禁用按钮样式
        runStr: '{%s}秒后重新获取', // 倒计时显示文本
        resetStr: '重新获取验证码' // 倒计时结束后按钮显示文本
    };

    SendCode.timer = null;

    /**
     * 开始倒计时
     */
    SendCode.prototype.start = function () {
        var _this = this,
                options = _this.options,
                secs = options.secs;

        _this.$btn.html(_this.getStr(secs)).css('pointer-events', 'none').addClass(options.disClass);

        _this.timer = setInterval(function () {
            secs--;
            _this.$btn.html(_this.getStr(secs));
            if (secs <= 0) {
                _this.resetBtn();
                clearInterval(_this.timer);
            }
        }, 1000);
    };

    /**
     * 获取倒计时显示文本
     * @param secs
     * @returns {string}
     */
    SendCode.prototype.getStr = function (secs) {
        return this.options.runStr.replace(/\{([^{]*?)%s(.*?)\}/g, secs);
    };

    /**
     * 重置按钮
     */
    SendCode.prototype.resetBtn = function () {
        var _this = this,
                options = _this.options;

        _this.$btn.html(options.resetStr).css('pointer-events', 'auto').removeClass(options.disClass);
    };

    function Plugin(option) {
        var args = Array.prototype.slice.call(arguments, 1);

        return this.each(function () {
            var $this = $(this),
                    sendcode = $this.data('ydui.sendcode');

            if (!sendcode) {
                $this.data('ydui.sendcode', (sendcode = new SendCode(this, option)));
                if (typeof option == 'object' && option.run) {
                    sendcode.start();
                }
            }
            if (typeof option == 'string') {
                sendcode[option] && sendcode[option].apply(sendcode, args);
            }
        });
    }

    $.fn.sendCode = Plugin;
}();

// jq获取query参数
(function ($) {
    $.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return unescape(r[2]);
        return null;
    }
})(jQuery);

/**
 * InfiniteScroll Plugin
 */
!function (window) {
    "use strict";

    var util = window.ydui.util;

    function InfiniteScroll(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, InfiniteScroll.DEFAULTS, options || {});
        this.init();
    }

    /**
     * 默认参数
     */
    InfiniteScroll.DEFAULTS = {
        binder: window, // 绑定浏览器滚动事件DOM
        initLoad: true, // 是否初始化加载第一屏数据
        pageSize: 0, // 每页请求的数据量
        loadingHtml: '加载中...', // 加载中提示，支持HTML
        doneTxt: '没有更多数据了', // 加载完毕提示
        backposition: false, // 是否从详情页返回列表页重新定位之前位置
        jumpLink: '', // 跳转详情页链接元素
        loadListFn: null, // 加载数据方法
        loadStorageListFn: null // 加载SesstionStorage数据方法
    };

    /**
     * 初始化
     */
    InfiniteScroll.prototype.init = function () {
        var _this = this,
                options = _this.options,
                _location = window.location;

        if (~~options.pageSize <= 0) {
            console.error('[YDUI warn]: 需指定pageSize参数【即每页请求数据的长度】');
            return;
        }

        // 获取页面唯一键，防止多个页面调用数据错乱
        var primaryKey = _location.pathname.toUpperCase().replace(/\/?\.?/g, '');
        if (!primaryKey) {
            primaryKey = 'YDUI_' + _location.host.toUpperCase().replace(/\/?\.?:?/g, '');
        }

        // 保存返回页面定位所需参数的键名
        _this.backParamsKey = primaryKey + '_BACKPARAMS';
        // 保存列表数据的键名
        _this.backParamsListKey = primaryKey + '_LIST_';

        // 在列表底部添加一个标记，用其判断是否滚动至底部
        _this.$element.append(_this.$tag = $('<div class="J_InfiniteScrollTag"></div>'));

        // 初始化赋值列表距离顶部的距离(比如去除导航的高度距离)，用以返回列表定位准确位置
        _this.listOffsetTop = _this.$element.offset().top;

        _this.initLoadingTip();

        // 是否初始化就需要加载第一屏数据
        if (options.initLoad) {
            if (!options.backposition) {
                _this.loadList();
            } else {
                // !util.localStorage.get(_this.backParamsKey) && _this.loadList();
                !util.sessionStorage.get(_this.backParamsKey) && _this.loadList();
            }
        }

        _this.bindScrollEvent();

        if (options.backposition) {
            _this.loadListFromStorage();

            _this.bindLinkEvent();
        }
    };

    /**
     * 初始化加载中提示
     */
    InfiniteScroll.prototype.initLoadingTip = function () {
        var _this = this;

        _this.$element.append(_this.$loading = $('<div class="list-loading">' + _this.options.loadingHtml + '</div>'));
    };

    /**
     * 滚动页面至SesstionStorage储存的坐标
     */
    InfiniteScroll.prototype.scrollPosition = function () {
        var _this = this,
                options = _this.options,
                $binder = $(options.binder);

        var backParams = util.sessionStorage.get(_this.backParamsKey);

        // 滚动页面
        backParams && $binder.stop().animate({
            scrollTop: backParams.offsetTop
        }, 0, function () {
            _this.scrolling = false;
        });

        options.backposition && _this.bindLinkEvent();

        // 释放页面滚动权限
        util.pageScroll.unlock();

        // 删除保存坐标页码的存储
        util.sessionStorage.remove(_this.backParamsKey);
    };

    /**
     * 给浏览器绑定滚动事件
     */
    InfiniteScroll.prototype.bindScrollEvent = function () {
        var _this = this,
                $binder = $(_this.options.binder),
                isWindow = $binder.get(0) === window,
                contentHeight = isWindow ? $(window).height() : $binder.height();

        $binder.on('scroll.ydui.infinitescroll', function () {

            if (_this.loading || _this.isDone)
                return;

            var contentTop = isWindow ? $(window).scrollTop() : $binder.offset().top;

            // 当浏览器滚动到底部时，此时 _this.$tag.offset().top 等于 contentTop + contentHeight
            if (_this.$tag.offset().top <= contentTop + contentHeight + contentHeight / 10) {
                _this.loadList();
            }
        });
    };

    /**
     * 跳转详情页前处理操作
     * description: 点击跳转前储存当前位置以及页面，之后再跳转
     */
    InfiniteScroll.prototype.bindLinkEvent = function () {
        var _this = this,
                options = _this.options;

        if (!options.jumpLink) {
            console.error('[YDUI warn]: 需指定跳转详情页链接元素');
            return;
        }

        $(_this.options.binder).on('click.ydui.infinitescroll', _this.options.jumpLink, function (e) {
            e.preventDefault();

            var $this = $(this),
                    page = $this.data('page');

            if (!page) {
                console.error('[YDUI warn]: 跳转链接元素需添加属性[data-page="其所在页码"]');
                return;
            }

            // 储存top[距离顶部的距离]与page[页码]
            util.sessionStorage.set(_this.backParamsKey, {
                offsetTop: $(_this.options.binder).scrollTop() + $this.offset().top - _this.listOffsetTop,
                page: page
            });

            location.href = $this.attr('href');
        });
    };

    /**
     * 加载数据
     */
    InfiniteScroll.prototype.loadList = function () {
        var _this = this,
                options = _this.options;

        _this.loading = true;
        _this.$loading.html(_this.loadingHtml).show();

        if (typeof options.loadListFn == 'function') {

            // 监听外部获取数据方法，以便获取数据
            options.loadListFn().done(function (listArr, page) {
                var len = listArr.length;

                if (~~len < 0) {
                    console.error('[YDUI warn]: 需在 resolve() 方法里回传本次获取记录集合');
                    return;
                }

                // 当请求的数据小于pageSize[每页请求数据数]，则认为数据加载完毕，提示相应信息
                if (len < options.pageSize) {
                    _this.$element.append('<div class="list-donetip">' + options.doneTxt + '</div>');
                    _this.isDone = true;
                }
                _this.$loading.hide();
                _this.loading = false;

                // 将请求到的数据存入SessionStorage
                if (options.backposition) {
                    util.sessionStorage.set(_this.backParamsListKey + page, listArr);
                }
            });
        }
    };

    /**
     * 从SessionStorage取出数据
     */
    InfiniteScroll.prototype.loadListFromStorage = function () {
        var _this = this,
                storage = util.sessionStorage.get(_this.backParamsKey);

        if (!storage)
            return;

        // 锁定页面禁止滚动
        util.pageScroll.lock();

        // 总需滚动的页码数
        var pageTotal = storage.page;

        var listArr = [];

        // 根据页码从Storage获取数据所需数据
        for (var i = 1; i <= pageTotal; i++) {
            var _list = util.sessionStorage.get(_this.backParamsListKey + i);

            listArr.push({
                page: i,
                list: _list
            });

            // 判断跳转前数据是否加载完毕
            if (i == pageTotal && _list.length < _this.options.pageSize) {
                _this.$element.append('<div class="list-donetip">' + _this.options.doneTxt + '</div>');
                _this.$loading.hide();
                _this.loading = false;
                _this.isDone = true;
            }
        }

        // 将数据传出外部方法，直至其通知已插入页面后滚动至相应位置
        _this.options.loadStorageListFn(listArr, pageTotal + 1).done(function () {
            _this.scrollPosition();
        });
    };

    function Plugin(option) {
        return this.each(function () {
            new InfiniteScroll(this, option);
        });
    }

    $.fn.infiniteScroll = Plugin;

}(window);

/**
 * ydui main
 */
!function (window) {
    "use strict";

    /**
     * 判断css3动画是否执行完毕
     * @git http://blog.alexmaccaw.com/css-transitions
     * @param duration
     */
    $.fn.emulateTransitionEnd = function (duration) {
        var called = false,
                $el = this;

        $(this).one('webkitTransitionEnd', function () {
            called = true;
        });

        var callback = function () {
            if (!called)
                $($el).trigger('webkitTransitionEnd');
        };

        setTimeout(callback, duration);
    };

    if (typeof define === 'function') {
        define(ydui);
    } else {
        window.YDUI = ydui;
    }

}(window);

!function (window) {
    "use strict";

    function Slider(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Slider.DEFAULTS, options || {});
        this.init();
    }

    Slider.DEFAULTS = {
        speed: 300, // 移动速度
        autoplay: 3000, // 循环时间
        lazyLoad: false, // 是否延迟加载图片 data-src=""
        pagination: '.slider-pagination',
        wrapperClass: 'slider-wrapper',
        slideClass: 'slider-item',
        bulletClass: 'slider-pagination-item',
        bulletActiveClass: 'slider-pagination-item-active'
    };

    /**
     * 初始化
     */
    Slider.prototype.init = function () {
        var _this = this,
                options = _this.options,
                $element = _this.$element;

        _this.index = 1;
        _this.autoPlayTimer = null;
        _this.$pagination = $element.find(options.pagination);
        _this.$wrapper = $element.find('.' + options.wrapperClass);
        _this.itemNums = _this.$wrapper.find('.' + options.slideClass).length;

        options.lazyLoad && _this.loadImage(0);

        _this.createBullet();

        _this.cloneItem().bindEvent();
    };

    /**
     * 绑定事件
     */
    Slider.prototype.bindEvent = function () {
        var _this = this,
                touchEvents = _this.touchEvents();

        _this.$wrapper.find('.' + _this.options.slideClass)
                .on(touchEvents.start, function (e) {
                    _this.onTouchStart(e);
                }).on(touchEvents.move, function (e) {
            _this.onTouchMove(e);
        }).on(touchEvents.end, function (e) {
            _this.onTouchEnd(e);
        });

        $(window).on('resize.ydui.slider', function () {
            _this.setSlidesSize();
        });

        ~~_this.options.autoplay > 0 && _this.autoPlay();

        _this.$wrapper.on('click.ydui.slider', function (e) {
            if (!_this.touches.allowClick) {
                e.preventDefault();
            }
        });
    };

    /**
     * 复制第一个和最后一个item
     * @returns {Slider}
     */
    Slider.prototype.cloneItem = function () {
        var _this = this,
                $wrapper = _this.$wrapper,
                $sliderItem = _this.$wrapper.find('.' + _this.options.slideClass),
                $firstChild = $sliderItem.filter(':first-child').clone(),
                $lastChild = $sliderItem.filter(':last-child').clone();

        $wrapper.prepend($lastChild);
        $wrapper.append($firstChild);

        _this.setSlidesSize();

        return _this;
    };

    /**
     * 创建点点点
     */
    Slider.prototype.createBullet = function () {

        var _this = this;

        if (!_this.$pagination[0])
            return;

        var initActive = '<span class="' + (_this.options.bulletClass + ' ' + _this.options.bulletActiveClass) + '"></span>';

        _this.$pagination.append(initActive + new Array(_this.itemNums).join('<span class="' + _this.options.bulletClass + '"></span>'));
    };

    /**
     * 当前页码标识加高亮
     */
    Slider.prototype.activeBullet = function () {
        var _this = this;

        if (!_this.$pagination[0])
            return;

        var itemNums = _this.itemNums,
                index = _this.index % itemNums >= itemNums ? 0 : _this.index % itemNums - 1,
                bulletActiveClass = _this.options.bulletActiveClass;

        !!_this.$pagination[0] && _this.$pagination.find('.' + _this.options.bulletClass)
                .removeClass(bulletActiveClass)
                .eq(index).addClass(bulletActiveClass);
    };

    /**
     * 设置item宽度
     */
    Slider.prototype.setSlidesSize = function () {
        var _this = this,
                _width = _this.$wrapper.width();

        _this.$wrapper.css('transform', 'translate3d(-' + _width + 'px,0,0)');
        _this.$wrapper.find('.' + _this.options.slideClass).css({
            width: _width
        });
    };

    /**
     * 自动播放
     */
    Slider.prototype.autoPlay = function () {
        var _this = this;

        _this.autoPlayTimer = setInterval(function () {

            if (_this.index > _this.itemNums) {
                _this.index = 1;
                _this.setTranslate(0, -_this.$wrapper.width());
            }

            _this.setTranslate(_this.options.speed, -(++_this.index * _this.$wrapper.width()));

        }, _this.options.autoplay);
    };

    /**
     * 停止播放
     * @returns {Slider}
     */
    Slider.prototype.stopAutoplay = function () {
        var _this = this;
        clearInterval(_this.autoPlayTimer);
        return _this;
    };

    /**
     * 延迟加载图片
     * @param index 索引
     */
    Slider.prototype.loadImage = function (index) {
        var _this = this,
                $img = _this.$wrapper.find('.' + _this.options.slideClass).eq(index).find('img'),
                imgsrc = $img.data('src');

        $img.data('load') != 1 && !!imgsrc && $img.attr('src', imgsrc).data('load', 1);
    };

    /**
     * 左右滑动Slider
     * @param speed 移动速度 0：当前是偷偷摸摸的移动啦，生怕给你看见
     * @param x 横向移动宽度
     */
    Slider.prototype.setTranslate = function (speed, x) {
        var _this = this;

        _this.options.lazyLoad && _this.loadImage(_this.index);

        _this.activeBullet();

        _this.$wrapper.css({
            'transitionDuration': speed + 'ms',
            'transform': 'translate3d(' + x + 'px,0,0)'
        });
    };

    /**
     * 处理滑动一些标识
     */
    Slider.prototype.touches = {
        moveTag: 0, // 移动状态(start,move,end)标记
        startClientX: 0, // 起始拖动坐标
        moveOffset: 0, // 移动偏移量（左右拖动宽度）
        touchStartTime: 0, // 开始触摸的时间点
        isTouchEvent: false, // 是否触摸事件
        allowClick: false // 用于判断事件为点击还是拖动
    };

    /**
     * 开始滑动
     * @param event
     */
    Slider.prototype.onTouchStart = function (event) {
        if (event.originalEvent.touches)
            event = event.originalEvent.touches[0];

        var _this = this,
                touches = _this.touches;

        touches.allowClick = true;

        touches.isTouchEvent = event.type === 'touchstart';

        // 鼠标右键
        if (!touches.isTouchEvent && 'which' in event && event.which === 3)
            return;

        if (touches.moveTag == 0) {
            touches.moveTag = 1;

            // 记录鼠标起始拖动位置
            touches.startClientX = event.clientX;
            // 记录开始触摸时间
            touches.touchStartTime = Date.now();

            var itemNums = _this.itemNums;

            if (_this.index == 0) {
                _this.index = itemNums;
                _this.setTranslate(0, -itemNums * _this.$wrapper.width());
                return;
            }

            if (_this.index > itemNums) {
                _this.index = 1;
                _this.setTranslate(0, -_this.$wrapper.width());
            }
        }
    };

    /**
     * 滑动中
     * @param event
     */
    Slider.prototype.onTouchMove = function (event) {
        event.preventDefault();

        if (event.originalEvent.touches)
            event = event.originalEvent.touches[0];

        var _this = this,
                touches = _this.touches;

        touches.allowClick = false;

        if (touches.isTouchEvent && event.type === 'mousemove')
            return;

        // 拖动偏移量
        var deltaSlide = touches.moveOffset = event.clientX - touches.startClientX;

        if (deltaSlide != 0 && touches.moveTag != 0) {

            if (touches.moveTag == 1) {
                _this.stopAutoplay();
                touches.moveTag = 2;
            }
            if (touches.moveTag == 2) {
                _this.setTranslate(0, -_this.index * _this.$wrapper.width() + deltaSlide);
            }
        }
    };

    /**
     * 滑动后
     */
    Slider.prototype.onTouchEnd = function () {
        var _this = this,
                speed = _this.options.speed,
                _width = _this.$wrapper.width(),
                touches = _this.touches,
                moveOffset = touches.moveOffset;

        // 释放a链接点击跳转
        setTimeout(function () {
            touches.allowClick = true;
        }, 0);

        // 短暂点击并未拖动
        if (touches.moveTag == 1) {
            touches.moveTag = 0;
        }

        if (touches.moveTag == 2) {
            touches.moveTag = 0;

            // 计算开始触摸到结束触摸时间，用以计算是否需要滑至下一页
            var timeDiff = Date.now() - touches.touchStartTime;

            // 拖动时间超过300毫秒或者未拖动超过内容一半
            if (timeDiff > 300 && Math.abs(moveOffset) <= _this.$wrapper.width() * .5) {
                // 弹回去
                _this.setTranslate(speed, -_this.index * _this.$wrapper.width());
            } else {
                // --为左移，++为右移
                _this.setTranslate(speed, -((moveOffset > 0 ? --_this.index : ++_this.index) * _width));
            }
            _this.autoPlay();
        }
    };

    /**
     * 当前设备支持的事件
     * @type {{start, move, end}}
     */
    Slider.prototype.touchEvents = function () {
        var supportTouch = (window.Modernizr && !!window.Modernizr.touch) || (function () {
            return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
        })();

        return {
            start: supportTouch ? 'touchstart.ydui.slider' : 'mousedown.ydui.slider',
            move: supportTouch ? 'touchmove.ydui.slider' : 'mousemove.ydui.slider',
            end: supportTouch ? 'touchend.ydui.slider' : 'mouseup.ydui.slider'
        };
    };

    function Plugin(option) {
        return this.each(function () {

            var $this = $(this),
                    slider = $this.data('ydui.slider');

            if (!slider) {
                $this.data('ydui.slider', new Slider(this, option));
            }
        });
    }

    $(window).on('load.ydui.slider', function () {
        $('[data-ydui-slider]').each(function () {
            var $this = $(this);
            $this.slider(ydui.util.parseOptions($this.data('ydui-slider')));
        });
    });

    $.fn.slider = Plugin;

}(window);

/**
 * 调用方法 initSelectEvent(select); 必须是input
 */

(function ($) {
    var mydate = new Date();
    var targetEle = null;
    var showDateArr = [];
    var json = {
        startDate: '2018-3-10',
        endDate: '2018-12-15',
        dateJson: []
    }

    function selectDate() {
        this.wrapperDIV = null;
        this.settings = {
            startDate: mydate.getFullYear() + "-" + (mydate.getMonth + 1) + "-" + mydate.getDate(),
            endDate: mydate.getFullYear() + "-" + (mydate.getMonth + 4) + "-" + mydate.getDate(),
            data: json.dateJson
        }
    }
    selectDate.prototype.init = function (obj, opt) {
        extend(this.settings, opt);
        this.wrapperDIV = document.getElementById(obj);
        this.getDate();
        itemClick('#X_selectDate');
    }
    selectDate.prototype.getDate = function () {
        let allDate = getAll(this.settings.startDate, this.settings.endDate);
        allDate.splice(allDate.length - 1, 1);
        let str = '';
        let className = '';
        allDate.forEach((item, index) => {
            let yearMonth = item.year + '-' + item.month;
            let yearMonthDay = item.year + '-' + item.month + '-' + item.day;
            switch (compareDate(this.settings.startDate, this.settings.endDate, yearMonthDay)) {
                case 'day':
                    className = 'day';
                    break;
                case 'future':
                    className = 'future';
                    break;
                case 'pass':
                    className = 'pass';
                    break;
            }
            ;
            let tag = this.pushTag(yearMonthDay);
            let dateLi1 = '<div class="date-title">' + item.year + '年' + item.month + '月</div><ul date=' + yearMonth + '>' + getNbsp(item.week) + '<li class=' + className + ' date=' + yearMonthDay + '>' + item.day + tag + '</li>';
            let dateLi2 = '<li class=' + className + ' date=' + yearMonthDay + '>' + item.day + tag + '</li>';
            let dateLi3 = '</ul><div class="date-title">' + item.year + '年' + item.month + '月</div><ul date=' + yearMonth + '>' + getNbsp(item.week) + '<li class=' + className + ' date=' + yearMonthDay + '>' + item.day + tag + '</li>';
            if (index > 0) {
                item.month === allDate[index - 1].month ? str += dateLi2 : str += dateLi3;
            } else {
                str += dateLi1;
            }
        });
        str += '</ul>';
        this.wrapperDIV.innerHTML = str;
        return str;
    }
    selectDate.prototype.pushTag = function (yearMonthDay) {
        let tag = '';
        for (let i = 0; i < this.settings.data.length; i++) {
            if (yearMonthDay === this.settings.data[i].date) {
                for (let key in this.settings.data[i]) {
                    key === 'price' ? tag += '<i class=' + key + '>￥' + this.settings.data[i][key] + '</i>' : tag += '<i class=' + key + '>' + this.settings.data[i][key] + '</i>';
                }
                break;
            }
        }
        return tag;
    }

    function compareDate(date1, date2, now) {
        let d1 = new Date(date1);
        let d2 = new Date(date2);
        let n = new Date(now);
        if (date1 !== '' && now !== '' && d1 > n) {
            return 'pass';
        }
        if (date2 !== '' && now !== '' && n > d2) {
            return 'future';
        }
        return 'day';
    }

    function getNbsp(week) { // 根据每个月1号是周几来补全前面的空格
        let str = '';
        for (let i = 0; i < week; i++) {
            str += '<li>&nbsp</li>';
        }
        return str;
    }

    function getFirstAndLastMonthDay(year, month) { // 获取当前月的最后一天
        let day = new Date(year, month, 0);
        let lastdate = year + '-' + month + '-' + day.getDate(); // 获取当月最后一天日期
        return lastdate;
    }

    function DateFormat(obj) {
        let mouth = (obj.getMonth() + 1) >= 10 ? (obj.getMonth() + 1) : ((obj.getMonth() + 1));
        let day = obj.getDate() >= 10 ? obj.getDate() : (obj.getDate());
        let week = new Date(obj.getFullYear() + '/' + mouth + '/' + day).getDay()
        return({
            year: obj.getFullYear(),
            month: (mouth < 10 ? '0' + mouth : mouth),
            day: (day < 10 ? "0" + day : day),
            week: week
        }); // 返回日期。
    }

    function getAll(begin, end) { // 获取两个日期间的所有日期
        let myBegin = begin.split('-')[0] + '-' + begin.split('-')[1] + '-' + 1;
        let myEnd = getFirstAndLastMonthDay(end.split('-')[0], end.split('-')[1]);
        let dateArr = [];
        let ab = myBegin.split('-');
        let ae = myEnd.split('-');
        let db = new Date();
        db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
        let de = new Date();
        de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
        let unixDb = db.getTime();
        let unixDe = de.getTime();
        for (let k = unixDb; k <= unixDe; ) {
            dateArr.push(DateFormat(new Date(parseInt(k))));
            k = k + 24 * 60 * 60 * 1000;
        }
        return dateArr;
    }

    function extend(set, opt) {
        for (var property in opt) {
            set[property] = opt[property];
        }
        return set;
    }
    // 初始化每一项的点击事件
    function itemClick(select) {
        var $this = $(select);
        $this.on('click', '.future', function () {
            dialog.toast('未来还很远，活好当下', 'none', 1000);
        });
        $this.on('click', '.pass	', function () {
            dialog.toast('往事不要再提', 'none', 1000);
        });
        $this.on('click', '.day', function () {

            if (targetEle.data('stype')) {
                showDateArr = [];
                $('.active').removeClass('active');
                showDateArr.push($(this).attr('date'));
                $(this).addClass('active');
                close();
                targetEle.val(showDateArr[0]);
                return false;
            }
            if (showDateArr.length) { //有数据
                if (showDateArr.length >= 2) { //数据大于2条  先清理  再添加起点
                    showDateArr = [];
                    $('.active').removeClass('active');
                    $('.path').removeClass('path');
                    $('.day_num').remove();
                    showDateArr.push($(this).attr('date'));
                    $(this).addClass('active');
                } else { //一条数据 ， 添加结束
                    showDateArr.push($(this).attr('date'));
                    $(this).addClass('active');
                    // 这里可以给值

                    if (showDateArr[0] === showDateArr[1]) {
                        $($('.active')).append(`<span class="day_num">1天</span>`);
                        setTimeout(function () {
                            close();
                            targetEle.val(writeGoTarget(showDateArr));
                        }, 800);
                        return false;
                    }
                    ;
                    var onoff = false;
                    $('.day').each(function () {
                        if ($(this).hasClass('active')) {
                            onoff = !onoff;
                        }
                        ;
                        if (onoff) {
                            $(this).addClass('path');
                        }
                    });
                    // 显示信息
                    $($('.active')[1]).append(`<span class="day_num">${$('.path').length + 1}天</span>`);
                    setTimeout(function () {
                        close();
                        targetEle.val(writeGoTarget(showDateArr));
                    }, 800);
                }
            } else { //无数据添加起点
                showDateArr.push($(this).attr('date'));
                $(this).addClass('active');
            }
        });
    }
    ;

    function show(bl) {
        // 回显
        $('.active').removeClass('active');
        $('.path').removeClass('path');
        $('.day_num').remove();
        $.each(showDateArr, function (i, e) {
            $('.day').each(function (i2, e2) {
                if ($(e2).attr('date') === e) {
                    $(e2).addClass('active');
                    return false;
                }
                ;
            });
        });
        //描画路径
        if (bl) {
            if (showDateArr[0] === showDateArr[1]) {
                $($('.active')).append(`<span class="day_num">1天</span>`);
            }
            ;
            var onoff = false;
            $('.day').each(function () {
                if ($(this).hasClass('active')) {
                    onoff = !onoff;
                }
                if (onoff) {
                    $(this).addClass('path');
                }
            });
            $($('.active')[1]).append(`<span class="day_num">${$('.path').length + 1}天</span>`);
        }

        //
        $('#X_selectDate').css({
            height: "80%",
            overfolw: 'visible'
        });
        if (showDateArr.length >= 1) {
            $('#date').scrollTop($('.active')[0].offsetTop);
        } else {
            $('#date').scrollTop(0);
        }
        setTimeout(function () {
            $(document.body).append("<div class='black_bg'></div>");
        }, 500);
    }
    ;

    function close() {
        $('#X_selectDate').css({
            height: "0",
            overfolw: 'hidden'
        });
        $('.black_bg').remove();
    }
    ;

    pxui.initSelectEvent = function () {
        $(document.body).append(`<div class="select-date-box" id="X_selectDate">
															<div class="select-head">
																<span class="head-l" id="close_btn">取消</span>
																<div class="head-c">选择日期</div>
															</div>
															<div class="week-box">
																<span class="color">日</span>
																<span>一</span>
																<span>二</span>
																<span>三</span>
																<span>四</span>
																<span>五</span>
																<span class="color">六</span>
															</div>
															<div id="date" class="select-date">
																
															</div>
														</div>`);

        //初始化
        var s1 = new selectDate();

        s1.init('date', {
            startDate: mydate.getFullYear() + "-" + (mydate.getMonth() + 1) + "-" + mydate.getDate(),
            endDate: mydate.getFullYear() + "-" + (mydate.getMonth() + 5) + "-" + mydate.getDate(),
            data: []
        });

        $(document).on("click", ".pxui_select_date", function () {
            $(this).attr('readonly', 'true');
            var arr = $(this).val().split('~');
            $.each(arr, function(i,item){
                arr[i] = item.trim();
            });
            if (arr.length >= 2) {
                showDateArr = arr;
                show(true);
            } else if (arr.length >= 1) {
                if (arr[0] == '') {
                    showDateArr = [];
                    show();
                } else {
                    showDateArr = arr;
                    show();
                }
            }
            targetEle = $(this);
        });
        $(document).on("click", '#close_btn', function () {
            close();
        });
    };

    function writeGoTarget(arr) {
        var T1 = arr[0].split('-');
        var T2 = arr[1].split('-');
        var surname = false;
        $.each(T1, function (i, e) {
            if (Number(e) < Number(T2[i])) {
                surname = true;
                return false;
            } else if (Number(e) > Number(T2[i])) {
                surname = false;
                return false;
            }
        });
        var str = '';

        //输出字符串
        if (surname) {
            str = arr[0] + " ~ " + arr[1];
        } else {
            str = arr[1] + " ~ " + arr[0];
        }
        ;
        return str;
    }
    ;
})(jQuery);