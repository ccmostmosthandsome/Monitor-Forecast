(function (global) {
    $(function () {
        global.pfun.autoSize();
        global.pfun.switchLng();
        global.pweather.loadClock();
        global.pweather.loadCurDay();
        global.mkpi.getjjtime();
        global.pcanvas.init();
        global.zzcg.init();
        global.ggaq.init();
        global.zzhb.init();
        global.zzjt.init();
        global.zhsw.init();
        global.zhzw.init();
        global.zlwin.init();
        // global.disastertype.init();
        emergency.initMapSwitch();
        // pmap.init();
    });
    global.pfun = {
        scale: 1, originX: 0, originY: 0, autoSize: function () {
            var pwidth = document.documentElement.clientWidth, pheight = document.documentElement.clientHeight;
            pwidth = 1920;
            pheight = 1080;
            $("body").width(pwidth).height(pheight);
            if (window.screen.width != pwidth || window.screen.height != pheight) {
                var scaleX = parseFloat(parseFloat(window.screen.width / pwidth).toFixed(3));
                var scaleY = parseFloat(parseFloat(window.screen.height / pheight).toFixed(3));
                var scale = (scaleX < scaleY) ? scaleX : scaleY;
                var scaleWidth = parseInt((pwidth * scale).toFixed(0), 10);
                var scaleHeight = parseInt((pheight * scale).toFixed(0), 10);
                var originX = window.screen.width - scaleWidth > 0 ? parseFloat((window.screen.width - scaleWidth) / 2) : 0;
                var originY = window.screen.height - scaleHeight > 0 ? parseFloat((window.screen.height - scaleHeight) / 2) : 0;
                var nX = originX === 0 ? 0 : parseFloat((originX / scale).toFixed(1));
                var nY = originY === 0 ? 0 : parseFloat((originY / scale).toFixed(1));
                console.log('sW: ' + window.screen.width + '，scW: ' + scaleWidth + '，sH: ' + window.screen.height + '，scH: ' + scaleHeight);
                console.log('originX: ' + originX + '，originY: ' + originY);
                console.log('nX: ' + nX + '，nX: ' + nY);
                console.log('scale: ' + scale);
                $("body").css({
                    'transform': 'scale(' + scale + ') translate(' + (nX) + 'px, ' + (nY) + 'px)',
                    'transform-origin': '0 0'
                });
                global.pfun.scale = scale;
                global.pfun.originX = originX;
                global.pfun.originY = originY;
            }
        }, switchLng: function () {
            $(".logo").attr("lng", language);
            $(".logo").bind("click", function () {
                var url = window.location.href;
                var idx = url.indexOf('l=');
                if (idx == -1) {
                    if (language === 'en-au') {
                        if (url.indexOf('?') >= 0) {
                            url += '&l=zh-cn';
                        }
                        else {
                            url += '?l=zh-cn';
                        }
                    }
                    else {
                        if (url.indexOf('?') >= 0) {
                            url += '&l=en-au';
                        }
                        else {
                            url += '?l=en-au';
                        }
                    }
                }
                else {
                    if (language === 'en-au') {
                        url = url.replace('en-au', 'zh-cn');
                    }
                    else {
                        url = url.replace('zh-cn', 'en-au');
                    }
                }
                window.location.href = url;
            });
        }, setNumEffect: function (id, start, end, decimals, duration) {
            var options = {useEasing: true, useGrouping: false, separator: '', decimal: '.', prefix: '', suffix: ''};
            var countUp = new CountUp(id, start, end, decimals, duration, options);
            countUp.start();
            return countUp;
        }
    };
    global.pweather = {
        num: 0, loadCurDay: function () {
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var week = date.getDay();
            month = month > 9 ? month.toString() : '0' + month;
            day = day > 9 ? day.toString() : '0' + day;
            switch (week) {
                case 0:
                    week = dlang.time_sun;
                    break;
                case 1:
                    week = dlang.time_mon;
                    break;
                case 2:
                    week = dlang.time_tues;
                    break;
                case 3:
                    week = dlang.time_wed;
                    break;
                case 4:
                    week = dlang.time_thurs;
                    break;
                case 5:
                    week = dlang.time_fri;
                    break;
                case 6:
                    week = dlang.time_satur;
                    break;
            }
            $("#day").html(year + "-" + month + "-" + day + "&nbsp;&nbsp;&nbsp;&nbsp;" + week);
        }, loadWeather: function () {
            var citytq = "武汉";
            var url = "http://php.weather.sina.com.cn/iframe/index/w_cl.php?code=js&city=" + citytq + "&day=0";
            $.ajax({
                url: url, dataType: "script", scriptCharset: "gbk", success: function (data) {
                    var _w = window.SWther.w[citytq][0];
                    var _f = _w.f1 + "_0.png";
                    if (new Date().getHours() > 17) {
                        _f = _w.f2 + "_1.png";
                    }
                    $("#weatherIcon").attr("src", "http://php.weather.sina.com.cn/images/yb3/180_180/" + _f);
                }
            });
        }, loadClock: function () {
            var hour = new Date().getHours(), minute = new Date().getMinutes();
            if (hour < 10) {
                hour = "0" + hour;
            }
            if (minute < 10) {
                minute = "0" + minute;
            }
            $("#lblCHours").text(hour);
            $("#lblCMinute").text(minute);
            if (minute == "00") {
                if (pweather.num == 0) {
                    global.zzjt.loadSpeedLine();
                    pweather.num = 1;
                }
            } else {
                pweather.num = 0;
            }
            window.setTimeout("pweather.loadClock()", 1000);
        }
    };
    global.mkpi = {
        getjjtime: function () {
            var date1 = new Date(2010, 4, 14, 7, 49, 0); //开始时间
            var date2 = new Date(); //结束时间
            var date3 = date2.getTime() - date1.getTime(); //时间差的毫秒数


            var days = Math.floor(date3 / (24 * 3600 * 1000));//计算出相差天数
            var leave1 = date3 % (24 * 3600 * 1000);
            var hours = Math.floor(leave1 / (3600 * 1000)); //计算天数后剩余的毫秒数
            var leave2 = leave1 % (3600 * 1000);
            var minutes = Math.floor(leave2 / (60 * 1000));//计算小时数后剩余的毫秒数
            var leave3 = leave2 % (60 * 1000);
            var seconds = Math.round(leave3 / 1000); //计算分钟数后剩余的毫秒数
            var outtime;

            if (days > 0)
                outtime = days + "d " + hours + "h";
            else if (hours > 0)
                outtime = hours + "h " + minutes + "m";
            else
                outtime = minutes + "m " + seconds + "s";
            $("#jjtime").text(outtime);
            // console.log(outtime);
            window.setTimeout("mkpi.getjjtime()", 1000);
        }
    };
    global.zzcg = {
        num_zs: null, num_today: null, num_per: null, timer: null, init: function () {
            zzcg.loadNum();
        }, loadNum: function () {
            //zzcg.num_zs = pfun.setNumEffect("cg_blzs", 0, 36438, 0, 4);
            //zzcg.num_today = pfun.setNumEffect("cg_bls", 0, 213, 0, 3);
            //zzcg.num_per = pfun.setNumEffect("cg_bzl", 0, 96.5, 1, 3);
            zzcg.getRandomNum();
        }, getRandomNum: function () {
            var num = parseInt(Math.random() * 20);
            var speed = parseInt(Math.random() * 5 + 5);
            zzcg.timer = setTimeout(function () {
                zzcg.setNumAdd(num);
            }, speed * 60 * 1000);
        }, setNumAdd: function (num) {
            //zzcg.num_zs.update(parseInt($("#cg_blzs").text()) + num);
            //zzcg.num_today.update(parseInt($("#cg_bls").text()) + num);
            zzcg.getRandomNum();
        }, destory: function () {
            if (zzcg.timer != null) {
                window.clearTimeout(zzcg.timer);
                zzcg.timer = null;
            }
        }
    };
    global.ggaq = {
        startnum: 1, telChart: null, init: function () {
            ggaq.telChart = global.ggaq.loadSourceType();
            //global.ggaq.loadZdcsPie("ggaq_sw", 0.35);
            //global.ggaq.loadZdcsPie("ggaq_sf", 0.65);
        }, loadSourceType: function () {
            var data = [{value: 2698, name: dlang.cal_ynrs}, {value: 270, name: dlang.cal_sz}, {
                value: 12135,
                name: dlang.cal_ss
            }];
            var _fontFamily = 'microsoft yahei', _fontSize = 16;
            if (language === 'en-au') {
                _fontFamily = 'AgencyFBBold';
                _fontSize = 20;
            }
            var option = {
                title: {
                    text: dlang.situation_casual,
                    subtext: '15103',
                    x: 'center',
                    y: '30%',
                    textStyle: {color: '#fff', fontFamily: _fontFamily, fontSize: _fontSize},
                    subtextStyle: {color: '#fff', fontFamily: "AgencyFBBold", fontSize: 20}
                },
                tooltip: {show: true},
                legend: {show: false},
                animation: false,
                series: [{
                    type: 'pie',
                    selectedMode: 'single',
                    radius: ['65%', '95%'],
                    color: ['#1b70a8', '#26baff', '#8ce2ff', '#2f8fb4'],
                    label: {normal: {show: false}},
                    data: data
                }]
            };
            var chart = echarts.init($("#ggaq_pie")[0]);
            chart.setOption(option);
            return chart;
        }, loadZdcsPie: function (id, percent) {
            function getData() {
                return [{
                    value: percent,
                    itemStyle: {normal: {color: '#f2c967', shadowBlur: 10, shadowColor: '#f2c967'}}
                }, {value: 1 - percent, itemStyle: {normal: {color: 'transparent'}}}];
            }

            var option = {
                title: {
                    text: (percent * 100) + '%',
                    x: 'center',
                    y: 'center',
                    textStyle: {color: '#ffffff', fontFamily: "AgencyFBBold", fontSize: 20}
                },
                animation: false,
                series: [{
                    type: 'pie',
                    radius: ['68%', '75%'],
                    silent: true,
                    label: {normal: {show: false,}},
                    data: [{itemStyle: {normal: {color: '#3da1ee', shadowBlur: 2, shadowColor: '#3da1ee'}}}]
                }, {name: 'main', type: 'pie', radius: ['82%', '90%'], label: {normal: {show: false}}, data: getData()}]
            };
            var chart = echarts.init($("#" + id)[0]);
            chart.setOption(option);
        }, load_data: function () {
            $(".ggaq-zdcs-wxlist > .ggaq-list-box").eq(0).removeClass("animated bounceOut").addClass("animated bounceOut").one('webkitAnimationEnd', function () {
                $(this).remove();
                $(".ggaq-zdcs-wxlist > .ggaq-list-box").eq(0).removeClass("animated slideInUp").addClass("animated slideInUp").one('webkitAnimationEnd', function () {
                    $(this).removeClass("animated slideInUp");
                    var len = ggaq_ysrq.length;
                    if (ggaq.startnum > len) {
                        ggaq.startnum = 1;
                    }
                    var idx = ggaq.startnum - 1;
                    if ($(".ggaq-zdcs-wxlist > .ggaq-list-box").length > 1) {
                        console.log("疑似人群：多余2个子项.");
                        $(".ggaq-zdcs-wxlist > .ggaq-list-box").eq(0).siblings().remove();
                    }
                    var htmls = '';
                    htmls += '<div class="ggaq-list-box animated bounceIn">';
                    htmls += '<div class="ggaq-li-head">';
                    htmls += '<img src="img/ysry-default.png" height="70" width="54"/>';
                    htmls += '</div>';
                    htmls += '<div class="ggaq-li-info">';
                    htmls += '<div class="ggaq-info-list info-list-overflow">';
                    htmls += ggaq_ysrq[idx].address
                    htmls += '</div>';
                    htmls += '<div class="ggaq-info-list">';
                    htmls += '<span>' + ggaq_ysrq[idx].rtype + '</span>';
                    htmls += '<span style="float: right;">' + ggaq_ysrq[idx].name + '</span>';
                    htmls += '</div>';
                    /*htmls += '<div class="ggaq-info-list">';
                    htmls += '<span>' + ggaq_ysrq[idx].name + '</span>';
                    htmls += '<span>' + ggaq_ysrq[idx].sex + '</span>';
                    htmls += '<span>' + ggaq_ysrq[idx].old + '</span>';
                    htmls += '</div>';
                    htmls += '<div class="ggaq-info-list">' + ggaq_ysrq[idx].address + '</div>';
                    htmls += '<div class="ggaq-info-list">';
                    htmls += '<span>' + ggaq_ysrq[idx].city + '</span>';
                    htmls += '<span style="float: right;">' + ggaq_ysrq[idx].rtype + '</span>';
                    htmls += '</div>';*/
                    htmls += '</div>';
                    htmls += '</div>';
                    $(".ggaq-zdcs-wxlist").append(htmls);
                    ggaq.startnum++;
                    $(".ggaq-zdcs-wxlist > .ggaq-list-box.bounceIn").one('webkitAnimationEnd', function () {
                        $(this).removeClass("animated bounceIn");
                    });
                });
            });
        }
    };
    global.zzhb = {
        curnum: 4, startnum: 1, speed: 1000 * 12, timer: null, init: function () {
            global.zzhb.loadRadar();
            global.zzhb.load_data();
        }, loadRadar: function () {
            var option = {
                tooltip: {show: true},
                legend: {show: false},
                radar: {
                    splitNumber: 5,
                    splitLine: {lineStyle: {color: '#2b70ab', width: 2}},
                    splitArea: {show: true, areaStyle: {color: '#f2c967', opacity: 0.1}},
                    name: {textStyle: {color: "#ffffff", fontWeight: 'bold', fontFamily: "AgencyFBBold", fontSize: 14}},
                    nameGap: 5,
                    indicator: [{name: dlang.communication_sate, max: 500}, {
                        name: dlang.communication_pos,
                        max: 4000
                    }, {
                        name: dlang.communication_uav,
                        max: 600
                    }, {name: dlang.communication_mob, max: 800}, {name: dlang.communication_mesh, max: 150}]
                },
                series: [{
                    type: 'radar',
                    lineStyle: {normal: {color: '#f2c967'}},
                    areaStyle: {normal: {color: '#f2c967'}},
                    data: [{
                        value: [251, 1254, 427, 521, 100, 876],
                        symbolSize: 0,
                        label: {normal: {show: true, textStyle: {color: '#f2c967', fontWeight: 'bold', fontSize: 10},}}
                    }]
                }]
            };
            var chart = echarts.init($("#hb_radar")[0]);
            chart.setOption(option);
        }, load_data: function () {
            var len = hb_hupodata.length;
            if (((zzhb.startnum - 1) + zzhb.curnum) > len) {
                zzhb.startnum = 1;
            }
            var idx = zzhb.startnum - 1;
            var htmls = '';
            htmls += '<li>';
            htmls += '<span>' + dlang.communication_name + '</span>';
            htmls += '<span>' + dlang.communication_data + '</span>';
            htmls += '<span>' + dlang.communication_speed + '</span>';
            htmls += '<span>' + dlang.communication_status + '</span>';
            htmls += '</li>';
            for (var i = 0; i < 4; i++) {
                htmls += '<li class="animated flipInX">';
                htmls += '<span>' + hb_hupodata[idx].name + '</span>';
                htmls += '<span>' + hb_hupodata[idx].class + '</span>';
                htmls += '<span>' + hb_hupodata[idx].speed + '</span>';
                htmls += '<span>' + hb_hupodata[idx].status + '</span>';
                htmls += '</li>';
                idx++;
            }
            $(".smart-hb-water").html(htmls);
            zzhb.startnum += zzhb.curnum;
            zzhb.timer = window.setTimeout("zzhb.load_data()", zzhb.speed);
        }, destory: function () {
            if (zzhb.timer != null) {
                window.clearTimeout(zzhb.timer);
                zzhb.timer = null;
            }
        }
    };
    global.zzjt = {
        curnum: 3, startnum: 1, speed: 1000 * 15, timer: null, init: function () {
            global.zzjt.loadSpeedLine();
            global.zzjt.loadAreaList();
        }, getColor: function (data) {
            if (data < 2.0) {
                return "#66ff66";
            } else if (data > 4.0) {
                return "#ff6666";
            } else {
                return "#ff9966";
            }
        }, setInnerCircle: function (data) {
            var val = parseFloat(data);
            var color = global.zzjt.getColor(val);
            var maxZs = 3;
            var r = 50;
            var progress = parseFloat(val / maxZs);
            var degrees = progress * 360;
            var rad = degrees * (Math.PI / 180);
            var x = (Math.sin(rad) * r).toFixed(2);
            var y = -(Math.cos(rad) * r).toFixed(2);
            var lenghty = window.Number(degrees > 180);
            var descriptions = ['M', 0, -r, 'A', r, r, 0, lenghty, 1, x, y];
            $("#jt_cir").attr({"d": descriptions.join(' '), "stroke": color});
        }, loadSpeedLine: function () {
            var hours = parseInt($("#lblCHours").text());
            var zsval = zhjt.ydKpi[hours];
            $("#jt_ydzs").text(zsval);
            zzjt.setInnerCircle(zsval);
            var xAxisTime = [];
            for (var i = 0; i < 8; i++) {
                // xAxisTime.push((hours - i).toString().length == 1 ? "0" + (hours - i) + ":00" : (hours - i) + ":00");
                xAxisTime.push((0.5 * i) + "h");
            }
            var seriesData = zhjt.processingNumber;
            var option = {
                tooltip: {trigger: 'axis'},
                grid: {left: 10, right: 45, bottom: 5, top: 15, containLabel: true},
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    data: xAxisTime,
                    axisLine: {lineStyle: {color: '#535a69', width: 2}},
                    axisTick: {show: false},
                    axisLabel: {interval: 0, textStyle: {color: '#fff', fontFamily: "AgencyFBBold", fontSize: 14}}
                }],
                yAxis: [{
                    type: 'value',
                    min: 0,
                    max: 30,
                    interval: 5,
                    axisLine: {lineStyle: {color: '#535a69', width: 2}},
                    axisTick: {show: false},
                    axisLabel: {textStyle: {color: '#fff', fontFamily: "AgencyFBBold", fontSize: 16}},
                    splitLine: {lineStyle: {color: '#535a69', opacity: 0.6}}
                }],
                series: [{
                    name: '处理数',
                    type: 'line',
                    symbol: 'circle',
                    symbolSize: 6,
                    itemStyle: {normal: {color: '#f9bd2e'}},
                    lineStyle: {
                        normal: {
                            color: '#efbd56',
                            width: 4,
                            opacity: 0.8,
                            shadowBlur: 10,
                            shadowColor: '#efbd56'
                        }
                    },
                    areaStyle: {normal: {color: '#efbd56', opacity: 0.25}},
                    data: seriesData
                }]
            };
            var chart = echarts.init($("#jt_poly")[0]);
            chart.setOption(option);
        }, loadAreaList: function () {
            var len = zhjt.ydrank.length;
            if (((zzjt.startnum - 1) + zzjt.curnum) > len) {
                zzjt.startnum = 1;
            }
            var idx = zzjt.startnum - 1;
            var htmls = '';
            var color = ''
            for (var i = 0; i < 3; i++) {
                htmls += '<li class="animated flipInX">';
                htmls += '<div class="jt-ydzs-name">';
                htmls += '<span>' + zhjt.ydrank[idx].name + '</span><span>' + zhjt.ydrank[idx].dir + '</span></div>';
                color = zzjt.getColor(parseFloat(zhjt.ydrank[idx].index));
                htmls += '<div class="jt-ydzs-num yczs"><span class="jt-ydzs-color" style="background-color:' + color + '"></span>';
                htmls += '<span>' + zhjt.ydrank[idx].state + '</span></div> <span class="jt-ydzs-num">' + zhjt.ydrank[idx].speed + 'min</span>';
                htmls += '</li>';
                idx++;
            }
            $("#jt_ydzs_list").html(htmls);
            zzjt.startnum += zzjt.curnum;
            zzjt.timer = window.setTimeout("zzjt.loadAreaList()", zzjt.speed);
        }, destory: function () {
            if (zzjt.timer != null) {
                window.clearTimeout(zzjt.timer);
                zzjt.timer = null;
            }
        }
    };
    CanvasRenderingContext2D.prototype.sector = function (x, y, radius, sDeg, eDeg) {
        this.save();
        this.translate(x, y);
        this.beginPath();
        this.arc(0, 0, radius, sDeg, eDeg);
        this.save();
        this.rotate(eDeg);
        this.moveTo(radius, 0);
        this.lineTo(0, 0);
        this.restore();
        this.rotate(sDeg);
        this.lineTo(radius, 0);
        this.closePath();
        this.restore();
        return this;
    };
    // global.zlwin = {
    //     init: function () {
    //         $(".mtab-box > li").bind("click", function () {
    //             if (!$(this).hasClass("selected")) {
    //                 $(this).addClass("selected").siblings().removeClass("selected");
    //                 var idx = $(".mtab-box > li").index(this);
    //                 switch (idx) {
    //                     case 0:
    //                         emergency.destory();
    //                         break;
    //                     case 1:
    //                         emergency.clearZlTimer();
    //                         global.zlwin.hide();
    //                         break;
    //                 }
    //             }
    //         });
    //     }, hide: function () {
    //         $(".mkpi-box").addClass("zoomOutUp animated").one('webkitAnimationEnd', function () {
    //             $(this).removeClass("zoomOutUp animated").hide();
    //         });
    //         window.setTimeout(function () {
    //             $(".smart-cg-box").addClass("fadeOutLeft animated").one('webkitAnimationEnd', function () {
    //                 $(this).removeClass("fadeOutLeft animated").hide();
    //             });
    //         }, 300);
    //         window.setTimeout(function () {
    //             $(".smart-ggaq-box").addClass("fadeOutLeft animated").one('webkitAnimationEnd', function () {
    //                 $(this).removeClass("fadeOutLeft animated").hide();
    //             });
    //         }, 400);
    //         window.setTimeout(function () {
    //             $(".smart-zw-box").addClass("fadeOutRight animated").one('webkitAnimationEnd', function () {
    //                 $(this).removeClass("fadeOutRight animated").hide();
    //             });
    //         }, 350);
    //         window.setTimeout(function () {
    //             $(".smart-sw-box").addClass("fadeOutRight animated").one('webkitAnimationEnd', function () {
    //                 $(this).removeClass("fadeOutRight animated").hide();
    //             });
    //         }, 450);
    //         window.setTimeout(function () {
    //             $(".smart-hb-box").addClass("fadeOutDown animated").one('webkitAnimationEnd', function () {
    //                 $(this).removeClass("fadeOutDown animated").hide();
    //             });
    //         }, 320);
    //         window.setTimeout(function () {
    //             $(".smart-jt-box").addClass("fadeOutDown animated").one('webkitAnimationEnd', function () {
    //                 $(this).removeClass("fadeOutDown animated").hide();
    //                 emergency.init();
    //             });
    //         }, 460);
    //     }, show: function () {
    //         $("#windIcon").fadeOut(500, function () {
    //             $("#weatherIcon").fadeIn(500);
    //         });
    //         $(".fengliBox").fadeOut(500, function () {
    //             $(".wenduBox").fadeIn(500);
    //         });
    //         $(".mkpi-box").show().addClass("zoomInUp animated").one('webkitAnimationEnd', function () {
    //             $(this).removeClass("zoomInUp animated");
    //         });
    //         window.setTimeout(function () {
    //             $(".smart-cg-box").show().addClass("fadeInLeft animated").one('webkitAnimationEnd', function () {
    //                 $(this).removeClass("fadeInLeft animated");
    //             });
    //         }, 300);
    //         window.setTimeout(function () {
    //             $(".smart-ggaq-box").show().addClass("fadeInLeft animated").one('webkitAnimationEnd', function () {
    //                 $(this).removeClass("fadeInLeft animated");
    //             });
    //         }, 400);
    //         window.setTimeout(function () {
    //             $(".smart-zw-box").show().addClass("fadeInRight animated").one('webkitAnimationEnd', function () {
    //                 $(this).removeClass("fadeInRight animated");
    //             });
    //         }, 350);
    //         window.setTimeout(function () {
    //             $(".smart-sw-box").show().addClass("fadeInRight animated").one('webkitAnimationEnd', function () {
    //                 $(this).removeClass("fadeInRight animated");
    //             });
    //         }, 450);
    //         window.setTimeout(function () {
    //             $(".smart-hb-box").show().addClass("fadeInUp animated").one('webkitAnimationEnd', function () {
    //                 $(this).removeClass("fadeInUp animated");
    //             });
    //         }, 320);
    //         window.setTimeout(function () {
    //             $(".smart-jt-box").show().addClass("fadeInUp animated").one('webkitAnimationEnd', function () {
    //                 $(this).removeClass("fadeInUp animated");
    //                 emergency.reloadZlTimer();
    //             });
    //         }, 460);
    //     }
    // };
    global.pcanvas = {
        init: function () {
            pcanvas.drawZwPie();
            pcanvas.drawSwZzt1();
            pcanvas.drawSwZzt2();
            pcanvas.drawSwZzt3();
        }, drawZwPie: function () {
            // var ctx = document.getElementById('smt-zw-cvs').getContext('2d');
            // var img = new Image();
            // img.src = "img/zw-pie-2.png";
            // img.onload = function () {
            //     var woodfill = ctx.createPattern(img, "no-repeat");
            //     ctx.fillStyle = woodfill;
            //     var deg = Math.PI / 180;
            //     ctx.sector(70, 70, 70, -90 * deg, -30 * deg).fill();
            // }
        }, drawSwZzt1: function () {
            var ctx = document.getElementById('smt-sw-cvs-1').getContext('2d');
            var deg = Math.PI / 180;
            var img = new Image();
            img.src = "img/ybp-h-2.png";
            img.onload = function () {
                var woodfill = ctx.createPattern(img, "no-repeat");
                ctx.fillStyle = woodfill;
                ctx.sector(46.5, 46.5, 46.5, -180 * deg, -28 * deg).fill();
            };
            var img1 = new Image();
            img1.src = "img/ybp-n-2.png";
            img1.onload = function () {
                var woodfill1 = ctx.createPattern(img1, "no-repeat");
                ctx.fillStyle = woodfill1;
                ctx.sector(46.5, 46.5, 46.5, -180 * deg, -30 * deg).fill();
            };
        }, drawSwZzt2: function () {
            var ctx = document.getElementById('smt-sw-cvs-2').getContext('2d');
            var deg = Math.PI / 180;
            var img = new Image();
            img.src = "img/ybp-h-2.png";
            img.onload = function () {
                var woodfill = ctx.createPattern(img, "no-repeat");
                ctx.fillStyle = woodfill;
                ctx.sector(46.5, 46.5, 46.5, -180 * deg, -46 * deg).fill();
            };
            var img1 = new Image();
            img1.src = "img/ybp-n-2.png";
            img1.onload = function () {
                var woodfill1 = ctx.createPattern(img1, "no-repeat");
                ctx.fillStyle = woodfill1;
                ctx.sector(46.5, 46.5, 46.5, -180 * deg, -50 * deg).fill();
            };
        }, drawSwZzt3: function () {
            var ctx = document.getElementById('smt-sw-cvs-3').getContext('2d');
            var deg = Math.PI / 180;
            var img = new Image();
            img.src = "img/ybp-h-2.png";
            img.onload = function () {
                var woodfill = ctx.createPattern(img, "no-repeat");
                ctx.fillStyle = woodfill;
                ctx.sector(46.5, 46.5, 46.5, -180 * deg, -62 * deg).fill();
            };
            var img1 = new Image();
            img1.src = "img/ybp-n-2.png";
            img1.onload = function () {
                var woodfill1 = ctx.createPattern(img1, "no-repeat");
                ctx.fillStyle = woodfill1;
                ctx.sector(46.5, 46.5, 46.5, -180 * deg, -60 * deg).fill();
            };
        }
    };
    global.zhsw = {
        init: function () {
            global.zhsw.loadLineArea();
        }, loadLineArea: function () {
            var _fontFamily = 'microsoft yahei', _fontSize = 14;
            if (language === 'en-au') {
                _fontFamily = 'AgencyFBBold';
                _fontSize = 16;
            }
            /*var option = {
                tooltip: {trigger: 'axis'},
                grid: {left: 15, right: 25, bottom: 5, top: 10, containLabel: true},
                xAxis: [{
                    type: 'category',
                    boundaryGap: false,
                    data: [dlang.zhsw_hs, dlang.zhsw_wc, dlang.zhsw_jh, dlang.zhsw_ja, dlang.zhsw_hy, dlang.zhsw_qk, dlang.zhsw_qs],
                    axisLine: {lineStyle: {color: '#535a69', width: 2}},
                    axisTick: {show: false},
                    axisLabel: {textStyle: {color: '#fff', fontFamily: _fontFamily, fontSize: _fontSize}}
                }],
                yAxis: [{
                    type: 'value',
                    min: 0.1,
                    max: 0.5,
                    axisLine: {lineStyle: {color: '#535a69', width: 2}},
                    axisTick: {show: false},
                    axisLabel: {textStyle: {color: '#fff', fontFamily: "AgencyFBBold", fontSize: 16}},
                    splitLine: {lineStyle: {color: '#535a69', opacity: 0.6}}
                }],
                series: [{
                    name: 'MPA',
                    type: 'line',
                    symbol: 'circle',
                    symbolSize: 6,
                    itemStyle: {normal: {color: '#f9bd2e'}},
                    lineStyle: {
                        normal: {
                            color: '#efbd56',
                            width: 4,
                            opacity: 0.8,
                            shadowBlur: 10,
                            shadowColor: '#efbd56'
                        }
                    },
                    areaStyle: {normal: {color: '#efbd56', opacity: 0.25}},
                    data: [0.26, 0.32, 0.28, 0.39, 0.34, 0.33, 0.41]
                }]
            };*/
            var option = {
                tooltip: {trigger: 'axis'},
                grid: {left: 15, right: 25, bottom: 5, top: 10, containLabel: true},
                yAxis: {
                    type: 'value',
                    axisLabel: {textStyle: {color: '#fff', fontFamily: "AgencyFBBold", fontSize: 16}},
                },
                xAxis: {
                    type: 'category',
                    data: [dlang.rescue_staff, dlang.rescue_team, dlang.rescue_volun, dlang.rescue_equip, dlang.rescue_tent, dlang.rescue_water, dlang.rescue_drug],
                    axisLabel: {textStyle: {color: '#fff', fontFamily: _fontFamily, fontSize: _fontSize}}
                },
                series: [
                    {
                        name: dlang.rescue_exist,
                        type: 'bar',
                        stack: dlang.rescue_total,
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: [120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: dlang.rescue_demand,
                        type: 'bar',
                        stack: dlang.rescue_total,
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: [320, 302, 301, 334, 390, 330, 320]
                    }
                ]
            };
            var chart = echarts.init($("#smt-sw-mpaarea")[0]);
            chart.setOption(option);
        }
    };
    global.zhzw = {
        curnum: 3, startnum: 1, speed: 1000 * 10, timer: null, init: function () {
            global.zhzw.load_data();
        }, load_data: function () {
            var len = zwdata.length;
            if (((zhzw.startnum - 1) + zhzw.curnum) > len) {
                zhzw.startnum = 1;
            }
            var idx = zhzw.startnum - 1;
            var htmls = '';
            for (var i = 0; i < 3; i++) {
                htmls += '<tr class="animated flipInX">';
                htmls += '<td>' + zwdata[idx].name + '</td>';
                htmls += '<td>' + zwdata[idx].dept + '</td>';
                htmls += '<td>' + zwdata[idx].time + '</td>';
                htmls += '</tr>';
                idx++;
            }
            $(".smt-zw-table tbody").html(htmls);
            zhzw.startnum += zhzw.curnum;
            zhzw.timer = window.setTimeout("zhzw.load_data()", zhzw.speed);
        }, destory: function () {
            if (zhzw.timer != null) {
                window.clearTimeout(zhzw.timer);
                zhzw.timer = null;
            }
        }
    };
    global.zlwin = {
        init: function () {
            /*$(".mtab-box > li").bind("click", function () {
                if (!$(this).hasClass("selected")) {
                    $(this).addClass("selected").siblings().removeClass("selected");
                    var idx = $(".mtab-box > li").index(this);
                    switch (idx) {
                        case 0:
                            emergency.destory();
                            break;
                        case 1:
                            emergency.clearZlTimer();
                            global.zlwin.hide();
                            break;
                    }
                }
            });*/
        }, hide: function () {
            $(".mkpi-box").addClass("zoomOutUp animated").one('webkitAnimationEnd', function () {
                $(this).removeClass("zoomOutUp animated").hide();
            });
            window.setTimeout(function () {
                $(".smart-cg-box").addClass("fadeOutLeft animated").one('webkitAnimationEnd', function () {
                    $(this).removeClass("fadeOutLeft animated").hide();
                });
            }, 300);
            window.setTimeout(function () {
                $(".smart-ggaq-box").addClass("fadeOutLeft animated").one('webkitAnimationEnd', function () {
                    $(this).removeClass("fadeOutLeft animated").hide();
                });
            }, 400);
            window.setTimeout(function () {
                $(".smart-zw-box").addClass("fadeOutRight animated").one('webkitAnimationEnd', function () {
                    $(this).removeClass("fadeOutRight animated").hide();
                });
            }, 350);
            window.setTimeout(function () {
                $(".smart-sw-box").addClass("fadeOutRight animated").one('webkitAnimationEnd', function () {
                    $(this).removeClass("fadeOutRight animated").hide();
                });
            }, 450);
            window.setTimeout(function () {
                $(".smart-hb-box").addClass("fadeOutDown animated").one('webkitAnimationEnd', function () {
                    $(this).removeClass("fadeOutDown animated").hide();
                });
            }, 320);
            window.setTimeout(function () {
                $(".smart-jt-box").addClass("fadeOutDown animated").one('webkitAnimationEnd', function () {
                    $(this).removeClass("fadeOutDown animated").hide();
                    emergency.init();
                });
            }, 460);
        }, show: function () {
            $("#windIcon").fadeOut(500, function () {
                $("#weatherIcon").fadeIn(500);
            });
            $(".fengliBox").fadeOut(500, function () {
                $(".wenduBox").fadeIn(500);
            });
            $(".mkpi-box").show().addClass("zoomInUp animated").one('webkitAnimationEnd', function () {
                $(this).removeClass("zoomInUp animated");
            });
            window.setTimeout(function () {
                $(".smart-cg-box").show().addClass("fadeInLeft animated").one('webkitAnimationEnd', function () {
                    $(this).removeClass("fadeInLeft animated");
                });
            }, 300);
            window.setTimeout(function () {
                $(".smart-ggaq-box").show().addClass("fadeInLeft animated").one('webkitAnimationEnd', function () {
                    $(this).removeClass("fadeInLeft animated");
                });
            }, 400);
            window.setTimeout(function () {
                $(".smart-zw-box").show().addClass("fadeInRight animated").one('webkitAnimationEnd', function () {
                    $(this).removeClass("fadeInRight animated");
                });
            }, 350);
            window.setTimeout(function () {
                $(".smart-sw-box").show().addClass("fadeInRight animated").one('webkitAnimationEnd', function () {
                    $(this).removeClass("fadeInRight animated");
                });
            }, 450);
            window.setTimeout(function () {
                $(".smart-hb-box").show().addClass("fadeInUp animated").one('webkitAnimationEnd', function () {
                    $(this).removeClass("fadeInUp animated");
                });
            }, 320);
            window.setTimeout(function () {
                $(".smart-jt-box").show().addClass("fadeInUp animated").one('webkitAnimationEnd', function () {
                    $(this).removeClass("fadeInUp animated");
                    emergency.reloadZlTimer();
                });
            }, 460);
        }
    };
    // global.disastertype = {
    //     init: function () {
    //         var myChart = echarts.init(document.getElementById('kind'));
    //         option1 = {
    //
    //             tooltip: {
    //                 trigger: 'item',
    //                 formatter: "{a} <br/>{b} : {c} ({d}%)"
    //             },
    //             series: [
    //                 {
    //                     name: dlang.distype_type,
    //                     type: 'pie',
    //                     radius: '55%',
    //                     center: ['50%', '60%'],
    //                     data: [
    //                         {value: 1131, name: dlang.distype_flood, itemStyle: {color: '#FFD700'}},
    //                         {value: 181, name: dlang.distype_flow, itemStyle: {color: '#FAFAD2'}},
    //                         {value: 330, name: dlang.distype_earthquake, itemStyle: {color: '#F0FFF0'}},
    //                         {value: 94, name: dlang.distype_drought, itemStyle: {color: '#9AFF9A'}},
    //                         {value: 131, name: dlang.distype_fire},
    //                         {value: 345, name: dlang.distype_other}
    //
    //                     ],
    //                     itemStyle: {
    //                         emphasis: {
    //                             shadowBlur: 10,
    //                             shadowOffsetX: 0,
    //                             shadowColor: 'rgba(0, 0, 0, 0.5)'
    //                         }
    //                     },
    //                     radius: '80%',
    //                     center: ['50%', '50%']
    //                 }
    //             ],
    //
    //         };
    //         myChart.setOption(option1);
    //     }
    // };
})(window);


var myChart2 = echarts.init(document.getElementById('kind1'));
option2 = {
    xAxis: {
        type: 'category',
        data: ['1990', '1994', '1998', '2002', '2006', '2010'],
        axisLabel: {
            show: true,
            textStyle: {
                color: '#fff'
            }
        },
        axisLine: {
            lineStyle: {
                color: '#FFFFFF',
                width: 3,//这里是为了突出显示加上的
            }
        }
    },
    yAxis: {
        type: 'value',
        axisLine: {
            lineStyle: {
                color: '#FFFFFF',
                width: 3,//这里是为了突出显示加上的
            }
        }
    },
    series: [{
        data: [80, 120, 140, 220, 160, 230],
        type: 'line',
        lineStyle: {
            color: '#FFFFFF',
            width: 9
        },
    }],
    axisLabel: {
        formatter: '{value}',
        textStyle: {
            color: '#fff'
        }
    },
    grid: {left: 2, right: 25, bottom: 8, top: 15, containLabel: true}
};
myChart2.setOption(option2);

var myChart3 = echarts.init(document.getElementById('kind3'));
option3 = {
    xAxis: {
        type: 'category',
        data: ['2004', '2005', '2006', '2007', '2008', '2009', '2010'],
        axisLabel: {
            formatter: '{value}',
            textStyle: {
                color: '#fff'
            }
        }
    },
    yAxis: {
        type: 'value',
        axisLabel: {
            formatter: '{value}',
            textStyle: {
                color: '#fff'
            }
        }
    },
    series: [{
        data: [120, 200, 150, 80, 70, 110, 130],
        type: 'bar'
    }],
    grid: {left: 22, right: 35, bottom: 12, top: 75, containLabel: true}
};
myChart3.setOption(option3);
