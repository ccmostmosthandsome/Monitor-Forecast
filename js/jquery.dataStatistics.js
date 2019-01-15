$.fn.dataStatistics = function (options) {
    options = $.extend({
        start: 100,
        end: 150,
        time: 60000,
        len: 6
    }, options || {});

    var u=this;
    return this.each(function (i,elements) {
        //解决this指向问题
        var ths =$(elements);
        //初始化---------------------------------------start
        var el = ths.find('.set_last');
        var html = '<div class="digit">' +
            '  <div class="digit_top">' +
            '    <span class="digit_wrap"></span>' +
            '  </div>' +
            '  <div class="shadow_top"></div>' +
            '  <div class="digit_bottom">' +
            '    <span class="digit_wrap"></span>' +
            '  </div>' +
            '  <div class="shadow_bottom"></div>' +
            '</div>';
        //初始化值
        var nowNums = zfill(options.start, options.len).toString().split("");

        //补0
        function zfill(num, size) {
            var s = "000000000" + num;
            return s.substr(s.length - size);
        }

        ths.find('.digit_set').each(function () {
            for (i = 0; i <= 9; i++) {
                $(this).append(html);
                currentDigit = $(this).find('.digit')[i];
                $(currentDigit).find('.digit_wrap').append(i);
            }
        });

        //根据最大值最小值初始化数值填入
        if(options.start<=options.end) {
            $.each(nowNums, function (index, val) {
                var set = ths.find('.digit_set').eq(index);
                var i = parseInt(val)
                set.find('.digit').eq(i).addClass('active');
                set.find('.digit').eq(i + 1).addClass('previous');
            });
        }else{
            $.each(nowNums, function (index, val) {
                var set = ths.find('.digit_set').eq(index);
                var i = parseInt(val)
                set.find('.digit').eq(i).addClass('active');
                set.find('.digit').eq(i - 1).addClass('previous');
            });
        }
        //初始化---------------------------------------end


        //执行
        function run() {
            //要执行动画的次数
            var difference =Math.abs(options.end - options.start);
            //每次要执行动画的时间
            var t = options.time / difference;
            //后一位数
            function increase() {
                //执行次数为0时,停止执行
                if (difference < 1) {
                    clearInterval(timer1);
                    return false;
                }
                difference--;
                //翻页动画
                var current = el.find('.active'),
                    previous = el.find('.previous');
                previous.removeClass('previous');
                current.removeClass('active').addClass('previous');

                if (current.next().length == 0) {
                    el.find('.digit:first-child').addClass('active');
                    var prev = el.prev();
                    prevAddNumber(prev);
                } else {
                    current.next().addClass('active');
                }
            }
            //前一位数
            function befcrease() {
                //执行次数为0时,停止执行
                if (difference < 1) {
                    clearInterval(timer1);
                    return false;
                }
                difference--;
                //翻页动画
                var current = el.find('.active'),
                    previous = el.find('.previous');
                previous.removeClass('previous');
                current.removeClass('active').addClass('previous');

                if (current.prev().length == 0) {
                    el.find('.digit:last-child').addClass('active');
                    var prev = el.prev();
                    preMinNumber(prev);
                } else {
                    current.prev().addClass('active');
                }
            }

            if(options.end>options.start){
                var timer1 = setInterval(function () {
                    increase();
                }, t);
            }else {
                var timer1 = setInterval(function () {
                    befcrease();
                }, t);
            }
        }

        //当数字翻到9的时候，前一位数执行一次动画
        function prevAddNumber(ths) {
            var current = ths.find('.active'),
                previous = ths.find('.previous');
            previous.removeClass('previous');
            current.removeClass('active').addClass('previous');

            if (current.next().length == 0) {
                ths.find('.digit:first-child').addClass('active');
                var prev = ths.prev();
                if (prev.length > 0) {
                    prevAddNumber(prev);
                }
            } else {
                current.next().addClass('active');
            }
        }
        //当数字翻到0的时候，前N位数执行一次动画
        function preMinNumber(ths) {
            var current = ths.find('.active'),
                previous = ths.find('.previous');
            previous.removeClass('previous');
            current.removeClass('active').addClass('previous');
            if (current.prev().length == 0) {
                ths.find('.digit:last-child').addClass('active');
                var prev = ths.prev();
                if (prev.length > 0) {
                    preMinNumber(prev);
                }
            } else {
                current.prev().addClass('active');
            }
        }
        run();
        //新增Update方法
        u.Update=function (a) {
            options.start=options.end;
            options.end+=a;
            run();
        }
    })
};