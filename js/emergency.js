(function () {
    window.emergency = {
        init: function () {
            emergency.zygis.loadFireEvent();
            window.setTimeout(function () {
                emergency.xf.loadZbjlChart();
                emergency.yl.loadRedChart();
                emergency.zdqy.init();
                emergency.zygis.init();
                emergency.event.init();
                emergency.fhtbuild.init();
                emergency.tfwin.show();
            }, 800);
        }, destory: function () {
            $("ul.tfj-gis-yxlx > li").removeClass("selected");
            pmap.remove_jtlt_layer();
            pmap.remove_sdqyxfw_layer();
            pmap.remove_czbk_layer();
            $(".czbf-tbox-icon").removeClass("hide");
            pmap.remove_hzqyfsx_layer();
            pmap.remove_lujinggh_layer();
            $(".czbf-main-btn").removeClass("selected");
            pmap.remove_fire();
            $("#czlcjl_list").empty();
            pmap.switchBaseMap("vector");
            pmap.resetMap();
            $("#25d-mapbox").empty();
            if (pmap.map25d != null) {
                pmap.map25d = null;
            }
            $("#street-mapbox").empty();
            $("#tfwin-fwrk-infbox").remove();
            $(".tfsj-fht-box").hide();
            emergency.tfwin.hide();
        }, clearZlTimer: function () {
            zhzw.destory();
            zzjt.destory();
            zzhb.destory();
            pmap.destory();
        }, reloadZlTimer: function () {
            zhzw.load_data();
            zzjt.loadAreaList();
            zzhb.load_data();
            pmap.reload();
        }, initMapSwitch: function () {
            $("ul.mapgis-box > li").bind("click", function () {
                if (!$(this).hasClass("selected")) {
                    $(this).addClass("selected").siblings().removeClass("selected");
                    var xtype = $(this).attr("xtype");
                    switch (xtype) {
                        case"mvec":
                            pmap.switchBaseMap("vector");
                            break;
                        case"mimg":
                            pmap.switchBaseMap("image");
                            break;
                    }
                }
            });
        }
    };
    emergency.tfwin = {
        show: function () {
            $("#weatherIcon").fadeOut(500, function () {
                $("#windIcon").fadeIn(500);
            });
            $(".wenduBox").fadeOut(500, function () {
                $(".fengliBox").fadeIn(500);
            });
            window.setTimeout(function () {
                $("ul.mapgis-box").show().addClass("fadeIn animated").one('webkitAnimationEnd', function () {
                    $(this).removeClass("fadeIn animated");
                });
                $(".tfsj-czlcjl-box").show().addClass("fadeInUp animated").one('webkitAnimationEnd', function () {
                    $(this).removeClass("fadeInUp animated");
                });
            }, 200);
            window.setTimeout(function () {
                $(".tfsj-gis-box").show().addClass("fadeInLeft animated").one('webkitAnimationEnd', function () {
                    $(this).removeClass("fadeInLeft animated");
                });
            }, 300);
            window.setTimeout(function () {
                $(".tfsj-czbf-box").show().addClass("fadeInRight animated").one('webkitAnimationEnd', function () {
                    $(this).removeClass("fadeInRight animated");
                    window.setTimeout(function () {
                        emergency.sjcl.loadProcess(dlang.sjczlcjl_zhzxbjss);
                    }, 1000 * 3);
                });
            }, 350);
        }, hide: function () {
            window.setTimeout(function () {
                $("ul.mapgis-box").addClass("fadeOut animated").one('webkitAnimationEnd', function () {
                    $(this).removeClass("fadeOut animated").hide();
                });
                $(".tfsj-czlcjl-box").addClass("fadeOutDown animated").one('webkitAnimationEnd', function () {
                    $(this).removeClass("fadeOutDown animated").hide();
                });
            }, 200);
            window.setTimeout(function () {
                $(".tfsj-gis-box").addClass("fadeOutLeft animated").one('webkitAnimationEnd', function () {
                    $(this).removeClass("fadeOutLeft animated").hide();
                });
            }, 300);
            window.setTimeout(function () {
                $(".tfsj-czbf-box").addClass("fadeOutRight animated").one('webkitAnimationEnd', function () {
                    $(this).removeClass("fadeOutRight animated").hide();
                    zlwin.show();
                });
            }, 350);
        }, infowin: function (opts) {
            if ($("#" + opts.id).length <= 0) {
                var html = '';
                html += '<div id="' + opts.id + '" class="infwin-box" xtype="' + opts.xtype + '">';
                html += '<div class="infwin-ctbox">';
                html += '<div class="infwin-border-lt"></div>';
                html += '<div class="infwin-border-rt"></div>';
                html += '<div class="infwin-border-lb"></div>';
                html += '<div class="infwin-border-rb"></div>';
                html += '<div class="infwin-line"></div>';
                html += '<div class="infwin-content">';
                html += '<div class="infwin-ctitle"><span>' + opts.title + '</span>';
                html += '<div class="infwin-ctitle-close" onclick="' + opts.close + '"></div></div>';
                html += '<div class="infwin-contbox">' + opts.content + '</div>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
                $("body").append(html);
            }
            else {
                $("#" + opts.id).hide();
                $("#" + opts.id).attr("xtype", opts.xtype);
                $("#" + opts.id).find(".infwin-ctitle > span").html(opts.title);
                $("#" + opts.id).find(".infwin-contbox").html(opts.content);
            }
            var width = $("#" + opts.id).outerWidth(), height = $("#" + opts.id).outerHeight();
            var scale = window.pfun.scale || 1;
            var originX = window.pfun.originX || 0;
            var originY = window.pfun.originY || 0;
            $("#" + opts.id).css({
                left: ((opts.left + 80 * scale) / scale - originX / scale) + "px",
                top: ((opts.top - height - 72 * scale) / scale - originY / scale) + "px"
            }).fadeIn(500);
        }
    };
    emergency.zygis = {
        init: function () {
            emergency.zygis.loadStreetMap();
            emergency.zygis.load25dMap();
            emergency.zygis.bindFweiToEvent();
        }, loadStreetMap: function () {
            var isChrome = /webkit/.test(navigator.userAgent.toLowerCase());
            if (isChrome) {
                var flash_state;
                try {
                    var swf = navigator.plugins["Shockwave Flash"];
                    if (swf.filename == "pepflashplayer.dll" || swf.filename.indexOf('pepflashplayer') >= 0) {
                        flash_state = 1;
                    }
                    else {
                        flash_state = 2;
                    }
                    console.log(swf);
                }
                catch (e) {
                    flash_state = -1;
                }
                if (flash_state === 1) {
                    pmap.loadBaiduStreet();
                }
                else {
                    var html = '<div class="tfj_mapboxs-falsh-msg">';
                    if (language === 'zh-cn') {
                        html += 'Flash在Chrome浏览器下未安装或版本过低，请下载离线安装包！<br/>';
                        html += '<a href="https://fpdownload.macromedia.com/pub/flashplayer/latest/help/install_flash_player_ppapi.exe">>>单击链接下载<<</a>';
                    }
                    else {
                        html += 'Flash is not installed in Chrome browser or version is too low.<br/>';
                        html += '<a href="https://fpdownload.macromedia.com/pub/flashplayer/latest/help/install_flash_player_ppapi.exe">>>Download<<</a>';
                    }
                    html += '</div>';
                    $(".tfj-mapstreet-box").append(html);
                }
            }
            else {
                pmap.loadBaiduStreet();
            }
        }, load25dMap: function () {
            pmap.loadChuTian25d();
        }, loadFireEvent: function () {
            pmap.loadFireEvent();
            emergency.sjcl.loadProcess(dlang.sjczlcjl_hzbj);
        }, bindFweiToEvent: function () {
            $("ul.tfj-gis-yxlx > li").unbind("click").bind("click", function () {
                if ($(this).attr("xtype") != "jt") {
                    if (!$(this).hasClass("selected")) {
                        $(this).addClass("selected").siblings("[xtype!='jt']").removeClass("selected");
                        var xhtml = null;
                        switch ($(this).attr("xtype")) {
                            case"rq":
                                xhtml = emergency.zygis.load_rqyxfw_win();
                                emergency.sjcl.loadProcess(dlang.sjczlcjl_tqzbrqyxfw);
                                break;
                            case"gs":
                                xhtml = emergency.zygis.load_gsyxfw_win();
                                emergency.sjcl.loadProcess(dlang.sjczlcjl_tqzbgsyxfw);
                                break;
                            case"dl":
                                xhtml = emergency.zygis.load_dlyxfw_win();
                                emergency.sjcl.loadProcess(dlang.sjczlcjl_tqzbdlyxfw);
                                break;
                        }
                        pmap.load_sdqyxfw_layer($(this).attr("xtype"), xhtml);
                    }
                    else {
                        pmap.remove_sdqyxfw_layer();
                        $(this).removeClass("selected");
                        switch ($(this).attr("xtype")) {
                            case"rq":
                                emergency.sjcl.loadProcess(dlang.sjczlcjl_gbrqyxfw);
                                break;
                            case"gs":
                                emergency.sjcl.loadProcess(dlang.sjczlcjl_gbgsyxfw);
                                break;
                            case"dl":
                                emergency.sjcl.loadProcess(dlang.sjczlcjl_gbdlyxfw);
                                break;
                        }
                    }
                }
                else {
                    $(this).toggleClass("selected");
                    if ($(this).hasClass("selected")) {
                        pmap.load_jtlt_layer();
                        emergency.sjcl.loadProcess(dlang.sjczlcjl_tqssjtlk);
                    }
                    else {
                        pmap.remove_jtlt_layer();
                        emergency.sjcl.loadProcess(dlang.sjczlcjl_gbssjtlk);
                    }
                }
            });
        }, load_rqyxfw_win: function () {
            var html = '';
            html += '<div class="infwin-box" style="display: inherit;">';
            html += '<div class="infwin-ctbox">';
            html += '<div class="infwin-border-lt"></div>';
            html += '<div class="infwin-border-rt"></div>';
            html += '<div class="infwin-border-lb"></div>';
            html += '<div class="infwin-border-rb"></div>';
            html += '<div class="infwin-line"></div>';
            html += '<div class="infwin-content">';
            html += '<div class="infwin-ctitle"><span>' + dlang.map_rq_rqyxfw + '</span>';
            html += '<div class="infwin-ctitle-close" onclick="pmap.close_uimarker_yxinfo();"></div></div>';
            html += '<div class="infwin-contbox">';
            html += '<div class="yxfwei-cbox">';
            html += '<span>' + dlang.map_rq_yjsj + '：<label>6h</label></span>';
            html += '<span>' + dlang.map_rq_syxdl + '：<label>' + dlang.map_rq_dl_znl + '&nbsp;&nbsp;' + dlang.map_rq_dl_zn2l + '</label></span>';
            html += '<span>' + dlang.map_rq_syxsq + '：<label>' + dlang.map_rq_xxjwsq + '&nbsp;&nbsp;' + dlang.map_rq_jstsq + '</label></span>';
            html += '<span>' + dlang.map_rq_yxjms + '：<label>576</label></span>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            return html;
        }, load_gsyxfw_win: function () {
            var html = '';
            html += '<div class="infwin-box" style="display: inherit;">';
            html += '<div class="infwin-ctbox">';
            html += '<div class="infwin-border-lt"></div>';
            html += '<div class="infwin-border-rt"></div>';
            html += '<div class="infwin-border-lb"></div>';
            html += '<div class="infwin-border-rb"></div>';
            html += '<div class="infwin-line"></div>';
            html += '<div class="infwin-content">';
            html += '<div class="infwin-ctitle"><span>' + dlang.map_gs_gsyxfw + '</span>';
            html += '<div class="infwin-ctitle-close" onclick="pmap.close_uimarker_yxinfo();"></div></div>';
            html += '<div class="infwin-contbox">';
            html += '<div class="yxfwei-cbox">';
            html += '<span>' + dlang.map_rq_yjsj + '：<label>8h</label></span>';
            html += '<span>' + dlang.map_rq_syxdl + '：<label>' + dlang.map_rq_dl_znl + '</label></span>';
            html += '<span>' + dlang.map_rq_syxsq + '：<label>' + dlang.map_rq_jstsq + '</label></span>';
            html += '<span>' + dlang.map_rq_yxjms + '：<label>673</label></span>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            return html;
        }, load_dlyxfw_win: function () {
            var html = '';
            html += '<div class="infwin-box" style="display: inherit;">';
            html += '<div class="infwin-ctbox">';
            html += '<div class="infwin-border-lt"></div>';
            html += '<div class="infwin-border-rt"></div>';
            html += '<div class="infwin-border-lb"></div>';
            html += '<div class="infwin-border-rb"></div>';
            html += '<div class="infwin-line"></div>';
            html += '<div class="infwin-content">';
            html += '<div class="infwin-ctitle"><span>' + dlang.map_dl_dlyxfw + '</span>';
            html += '<div class="infwin-ctitle-close" onclick="pmap.close_uimarker_yxinfo();"></div></div>';
            html += '<div class="infwin-contbox">';
            html += '<div class="yxfwei-cbox">';
            html += '<span>' + dlang.map_rq_yjsj + '：<label>4h</label></span>';
            html += '<span>' + dlang.map_rq_syxdl + '：<label>' + dlang.map_rq_dl_znl + '&nbsp;&nbsp;' + dlang.map_rq_dl_zn2l + '&nbsp;&nbsp;' + dlang.map_rq_dl_lsl + '</label></span>';
            html += '<span>' + dlang.map_rq_syxsq + '：<label>' + dlang.map_rq_xxjwsq + '&nbsp;&nbsp;' + dlang.map_rq_jstsq + '</label></span>';
            html += '<span>' + dlang.map_rq_yxjms + '：<label>1025</label></span>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            return html;
        }
    };
    emergency.fhtbuild = {
        init: function () {
            emergency.fhtbuild.load_rkpie();
            emergency.fhtbuild.load_shpie();
        }, load_rkpie: function () {
            var option = {
                tooltip: {trigger: 'item', formatter: "{a} <br/>{b}: {c} ({d}%)"},
                series: [{
                    name: dlang.ldfht_lnzzhs,
                    type: 'pie',
                    radius: ['50%', '82%'],
                    selectedOffset: 0.5,
                    avoidLabelOverlap: false,
                    label: {normal: {show: false, position: 'center'}},
                    data: [{
                        value: 7,
                        name: dlang.ldfht_ert,
                        selected: true,
                        itemStyle: {normal: {color: '#6ba9dd'}}
                    }, {
                        value: 16,
                        name: dlang.ldfht_cjr,
                        selected: true,
                        itemStyle: {normal: {color: '#bfdff9'}}
                    }, {value: 20, name: dlang.ldfht_laor, selected: true, itemStyle: {normal: {color: '#3b9fed'}}}]
                }]
            };
            var chart = echarts.init($("#tfj-bldpie-rk")[0]);
            chart.setOption(option);
        }, load_shpie: function () {
            var option = {
                tooltip: {trigger: 'item', formatter: "{a} <br/>{b}: {c} ({d}%)"},
                series: [{
                    name: dlang.ldfht_lnshs,
                    type: 'pie',
                    radius: ['50%', '82%'],
                    selectedOffset: 0.5,
                    avoidLabelOverlap: false,
                    label: {normal: {show: false, position: 'center'}},
                    data: [{
                        value: 28,
                        name: dlang.ldfht_qiye,
                        selected: true,
                        itemStyle: {normal: {color: '#6ba9dd'}}
                    }, {
                        value: 6,
                        name: dlang.ldfht_cku,
                        selected: true,
                        itemStyle: {normal: {color: '#bfdff9'}}
                    }, {value: 75, name: dlang.ldfht_spu, selected: true, itemStyle: {normal: {color: '#3b9fed'}}}]
                }]
            };
            var chart = echarts.init($("#tfj-bldpie-sh")[0]);
            chart.setOption(option);
        }, showBuildWin: function () {
            $("ul.tfj-fht-lpb ul > li").unbind("click").bind("click", function () {
                var fid = "tfwin-fwrk-infbox";
                var old_rnum = null;
                var rnum = $(this).text();
                if ($("#" + fid).length > 0) {
                    old_rnum = $("#" + fid).attr("xtype");
                }
                if (old_rnum != rnum) {
                    var offset = $(this).get(0).getBoundingClientRect();
                    console.log($(this).get(0).getBoundingClientRect());
                    var tfwin = emergency.tfwin.infowin({
                        id: fid,
                        xtype: rnum,
                        title: dlang.ldfht_jsdsd + rnum + dlang.ldfht_roomxq,
                        left: (offset.left + (offset.width / 2)),
                        top: (offset.top + (offset.height / 2)),
                        content: emergency.fhtbuild.load_fwrk_context(rnum),
                        close: "emergency.fhtbuild.close_fwrk_cwin()"
                    });
                }
                else {
                    $("#" + fid).remove();
                }
            });
            if ($(".tfsj-fht-box").css("display") != "none" && $("#tfwin-fwrk-infbox").length > 0) {
                $("#tfwin-fwrk-infbox").remove();
                emergency.sjcl.loadProcess(dlang.sjczlcjl_gbshlcfht);
            }
            else {
                emergency.sjcl.loadProcess(dlang.sjczlcjl_tqshlcfht);
            }
            $(".tfsj-fht-box").fadeToggle(500);
        }, load_fwrk_context: function (roomnum) {
            var rdata = fht_fwrk_data['r' + roomnum];
            var html = '';
            html += '<div class="fwrk-infobox">';
            html += '<div class="fwrk-trbox">';
            html += '<span>[' + dlang.ldfht_roominfo + ']</span>';
            html += '<div class="fwrk-xxitem">';
            html += '<span>' + dlang.ldfht_fwyt + '：<label>' + rdata.fjyt + '</label></span>';
            html += '<span>' + dlang.ldfht_fjxz + '：<label>' + rdata.fjxz + '</label></span>';
            html += '<span>' + dlang.ldfht_cqxz + '：<label>' + rdata.cqxz + '</label></span>';
            html += '</div>';
            html += '<div class="fwrk-xxitem">';
            html += '<span>' + dlang.ldfht_cqxx + '：<label>' + rdata.cqrxx + '</label><label class="margin-left-20">' + rdata.cqrid + '</label></span>';
            html += '</div>';
            html += '</div>';
            html += '<div class="fwrk-trbox margin-top-10">';
            html += '<span>[' + dlang.ldfht_rkinfo + ']</span>';
            html += '<ul class="fwrk-thu-items">';
            for (var i = 0, len = rdata.thcy.length; i < len; i++) {
                html += '<li>';
                html += '<div class="fwrk-thu-bsgx">' + rdata.thcy[i].jtgx + '</div>';
                html += '<div class="fwrk-thu-ryxx">';
                html += '<span>' + rdata.thcy[i].rkname + '</span>';
                html += '<span>' + rdata.thcy[i].sex + '</span>';
                html += '<span><label>' + rdata.thcy[i].idcard + '</label></span>';
                html += '<span class="clear-both">' + rdata.thcy[i].gj + '</span>';
                html += '<span>' + rdata.thcy[i].rstyle + '</span>';
                html += '<span>' + rdata.thcy[i].hyzk + '</span>';
                if (language === 'en-au') {
                    html += '<span><label>' + rdata.thcy[i].tel + '</label></span>';
                }
                else {
                    html += '<span>' + dlang.ldfht_lxfs + '：<label>' + rdata.thcy[i].tel + '</label></span>';
                }
                html += '</div>';
                html += '</li>';
            }
            html += '</ul>';
            html += '</div>';
            html += '</div>';
            return html;
        }, close_fwrk_cwin: function () {
            $("#tfwin-fwrk-infbox").remove();
        }
    };
    emergency.xf = {
        loadZbjlChart: function () {
            var dataStyle = {normal: {label: {show: false}, labelLine: {show: false}}};
            var placeHolderStyle = {
                normal: {color: 'rgba(0,0,0,0)', label: {show: false}, labelLine: {show: false}},
                emphasis: {color: 'rgba(0,0,0,0)'}
            };
            var option = {
                color: ['#e96565', '#3da1ee', '#f2c967'],
                tooltip: {show: false, formatter: "{a} <br/>{b} : {c}"},
                series: [{
                    name: dlang.czbk_zbjl,
                    type: 'pie',
                    clockWise: false,
                    center: ['55%', '50%'],
                    radius: [36, 44],
                    itemStyle: dataStyle,
                    hoverAnimation: false,
                    data: [{value: 8, name: dlang.czbk_zbjl_xj}, {value: 18, name: '', itemStyle: placeHolderStyle}]
                }, {
                    name: dlang.czbk_zbjl,
                    type: 'pie',
                    clockWise: false,
                    center: ['55%', '50%'],
                    radius: [28, 35],
                    itemStyle: dataStyle,
                    hoverAnimation: false,
                    data: [{value: 16, name: dlang.czbk_zbjl_jj}, {value: 18, name: '', itemStyle: placeHolderStyle}]
                }, {
                    name: dlang.czbk_zbjl,
                    type: 'pie',
                    clockWise: false,
                    hoverAnimation: false,
                    center: ['55%', '50%'],
                    radius: [20, 27],
                    itemStyle: dataStyle,
                    data: [{value: 14, name: dlang.czbk_zbjl_mj}, {value: 6, name: '', itemStyle: placeHolderStyle}]
                }]
            };
            var chart = echarts.init($("#zbjl_chart")[0]);
            chart.setOption(option);
        }
    };
    emergency.zdqy = {
        init: function () {
            emergency.zdqy.loadZdqyChart();
            emergency.zdqy.load_tfhz_fsandlj();
        }, loadZdqyChart: function () {
            var colors = ['#5793f3', '#f2c967'];
            var _fontFamily = 'microsoft yahei', _fontSize = 14;
            if (language === 'en-au') {
                _fontFamily = 'AgencyFBBold';
                _fontSize = 16;
            }
            var option = {
                color: colors,
                tooltip: {
                    trigger: 'axis', formatter: function (params) {
                        return params[0].data.name + "<br/>" + params[0].seriesName + ":" + params[0].value
                            + "<br/>" + params[1].seriesName + ":" + params[1].value
                    }
                },
                grid: {left: 0, right: 10, bottom: 5, top: 25, containLabel: true},
                legend: {show: false},
                xAxis: [{
                    type: 'category',
                    axisTick: {alignWithLabel: true},
                    axisLine: {lineStyle: {color: '#fff'}},
                    axisLabel: {textStyle: {color: '#fff', fontFamily: _fontFamily, fontSize: _fontSize}},
                    data: ['A', 'B', 'C', 'D', 'E', 'F', 'G']
                }],
                yAxis: [{type: 'value', name: dlang.czbk_zdqy_zlrs, min: 0, max: 800, show: false}, {
                    type: 'value',
                    name: dlang.czbk_zdqy_jlsfdms,
                    min: 0,
                    max: 300,
                    show: false
                }],
                series: [{
                    name: dlang.czbk_zdqy_zlrs,
                    type: 'bar',
                    barWidth: '40%',
                    data: [{name: dlang.czbk_zdqy_kn_znldtz, value: 1032}, {
                        name: dlang.czbk_zdqy_kn_csbjjd,
                        value: 520
                    }, {name: dlang.czbk_zdqy_kn_zsbh, value: 220}, {
                        name: dlang.czbk_zdqy_kn_ssyyesfxx,
                        value: 260
                    }, {name: dlang.czbk_zdqy_kn_jyds, value: 290}, {
                        name: dlang.czbk_zdqy_kn_nsejd,
                        value: 120
                    }, {name: dlang.czbk_zdqy_kn_sjzkxyjsjy, value: 320}]
                }, {name: dlang.czbk_zdqy_jlsfdms, type: 'line', yAxisIndex: 1, data: [50, 70, 160, 260, 150, 89, 139]}]
            };
            var chart = echarts.init($("#czbf_zdqy_chart")[0]);
            chart.setOption(option);
            chart.on("click", function (parmas) {
                console.log(parmas.data.name);
                console.log(parmas.name);
            });
        }, load_tfhz_fsandlj: function () {
            $(".czbf-main-btn").unbind("click").bind("click", function () {
                if (!$(this).hasClass("selected")) {
                    $(this).addClass("selected");
                    switch ($(this).attr("xtype")) {
                        case"ljgh":
                            pmap.load_lujinggh_layer();
                            emergency.sjcl.loadProcess(dlang.sjczlcjl_tqzjghlj);
                            break;
                        case"fsx":
                            var xhtml = '';
                            xhtml += '<div class="infwin-box" style="display: inherit;">';
                            xhtml += '<div class="infwin-ctbox">';
                            xhtml += '<div class="infwin-border-lt"></div>';
                            xhtml += '<div class="infwin-border-rt"></div>';
                            xhtml += '<div class="infwin-border-lb"></div>';
                            xhtml += '<div class="infwin-border-rb"></div>';
                            xhtml += '<div class="infwin-line fax-xb"></div>';
                            xhtml += '<div class="infwin-content">';
                            xhtml += '<div class="infwin-ctitle"><span>' + dlang.czbk_fsqy_name + '</span>';
                            xhtml += '<div class="infwin-ctitle-close" onclick="pmap.close_uimarker_fsxinfo();"></div></div>';
                            xhtml += '<div class="infwin-contbox">';
                            xhtml += '<div class="yxfwei-cbox" style="width: 310px;">';
                            xhtml += '<span>' + dlang.czbk_fsqy_fsfw + '：<label>' + dlang.czbk_fsqy_dtzto500 + '&nbsp;&nbsp;' + dlang.czbk_fsqy_zneljhk + '</label></span>';
                            xhtml += '<span>' + dlang.czbk_fsqy_jl + '：<label>50m</label>&nbsp;&nbsp;&nbsp;&nbsp;' + dlang.czbk_fsqy_fssj + '：<label>4h</label></span>';
                            xhtml += '<span>' + dlang.czbk_fsqy_czyh + '：<label>' + dlang.czbk_fsqy_dtcontent + '</label></span>';
                            xhtml += '</div>';
                            xhtml += '</div>';
                            xhtml += '</div>';
                            xhtml += '</div>';
                            xhtml += '</div>';
                            pmap.load_hzqyfsx_layer(xhtml);
                            emergency.sjcl.loadProcess(dlang.sjczlcjl_tqtfsjfsx);
                            break;
                    }
                }
                else {
                    switch ($(this).attr("xtype")) {
                        case"ljgh":
                            pmap.remove_lujinggh_layer();
                            emergency.sjcl.loadProcess(dlang.sjczlcjl_gbzjghlj);
                            break;
                        case"fsx":
                            pmap.remove_hzqyfsx_layer();
                            emergency.sjcl.loadProcess(dlang.sjczlcjl_gbtfsjfsx);
                            break;
                    }
                    $(this).removeClass("selected");
                }
            });
        }
    };
    emergency.yl = {
        loadRedChart: function () {
            var _fontFamily = 'microsoft yahei', _fontSize = 14, _fontSizeMin = 14;
            if (language === 'en-au') {
                _fontFamily = 'AgencyFBBold';
                _fontSize = 16;
                _fontSizeMin = 12;
            }
            var option = {
                title: {
                    text: dlang.czbk_yl_zjyy + '：' + dlang.czbk_yl_d7yy,
                    left: 30,
                    textStyle: {color: "#ffffff", fontSize: _fontSize, fontWeight: 'normal', fontFamily: _fontFamily}
                },
                tooltip: {trigger: 'axis'},
                grid: {left: 0, right: 10, bottom: 5, top: 25, containLabel: true},
                xAxis: [{
                    type: 'category',
                    data: [dlang.czbk_yl_hxk, dlang.czbk_yl_ssk, dlang.czbk_yl_gsk, dlang.czbk_yl_wk, dlang.czbk_yl_jiz, dlang.czbk_yl_zzheng],
                    axisTick: {alignWithLabel: true},
                    axisLabel: {interval: 0, textStyle: {fontFamily: _fontFamily, fontSize: _fontSizeMin}},
                    axisLine: {lineStyle: {color: '#fff'}}
                }],
                yAxis: [{
                    type: 'value',
                    name: dlang.czbk_yl_cwei,
                    nameLocation: 'middle',
                    nameTextStyle: {color: '#fff', fontFamily: _fontFamily, fontSize: _fontSize},
                    nameGap: 5,
                    axisTick: {show: false},
                    splitLine: {show: false},
                    axisLine: {lineStyle: {color: '#fff'}},
                    axisLabel: {show: false}
                }],
                series: [{
                    name: dlang.czbk_yl_cwei,
                    type: 'bar',
                    barWidth: '40%',
                    itemStyle: {
                        normal: {
                            color: function (params) {
                                if (params.dataIndex % 2 === 0) {
                                    return "#3da1ee"
                                } else {
                                    return "#f2c967"
                                }
                            }
                        }
                    },
                    data: [50, 32, 40, 34, 35, 33]
                }]
            };
            echarts.init($("#czbf_yl_chart")[0]).setOption(option);
        }
    };
    emergency.event = {
        init: function () {
            emergency.event.loadEyeEvent();
        }, loadEyeEvent: function () {
            $(".czbf-tbox-icon").unbind("click").bind("click", function () {
                var obj = $(this);
                var xtype = obj.attr("type");
                var toggle = obj.hasClass("hide");
                if (toggle) {
                    obj.removeClass("hide");
                } else {
                    obj.addClass("hide");
                }
                switch (xtype) {
                    case"xf":
                        if (toggle) {
                            emergency.sjcl.loadProcess(dlang.sjczlcjl_gbxffb);
                            pmap.hideCzbkPos("xf");
                        } else {
                            emergency.sjcl.loadProcess(dlang.sjczlcjl_tqxffb);
                            pmap.loadCzbkPos("xf", 17);
                        }
                        break;
                    case"zbjl":
                        if (toggle) {
                            emergency.sjcl.loadProcess(dlang.sjczlcjl_gbzbjlfb);
                            pmap.hideCzbkPos("zbjl");
                        } else {
                            emergency.sjcl.loadProcess(dlang.sjczlcjl_tqzbjlfb);
                            pmap.loadCzbkPos("zbjl", 17);
                        }
                        break;
                    case"zdqy":
                        if (toggle) {
                            emergency.sjcl.loadProcess(dlang.sjczlcjl_gbzdqyfb);
                            pmap.hideCzbkPos("zdqy");
                        } else {
                            emergency.sjcl.loadProcess(dlang.sjczlcjl_tqzdqyfb);
                            pmap.loadCzbkPos("zdqy", 17);
                        }
                        break;
                    case"yl":
                        if (toggle) {
                            emergency.sjcl.loadProcess(dlang.sjczlcjl_gbylfb);
                            pmap.hideCzbkPos("yl");
                        } else {
                            emergency.sjcl.loadProcess(dlang.sjczlcjl_tqylfb);
                            pmap.loadCzbkPos("yl", 17);
                        }
                        break;
                    case"znbm":
                        if (toggle) {
                            emergency.sjcl.loadProcess(dlang.sjczlcjl_gbznbmfb);
                            pmap.hideCzbkPos("rq,sw,dl");
                        } else {
                            emergency.sjcl.loadProcess(dlang.sjczlcjl_tqznbmfb);
                            pmap.loadCzbkPos("rq,sw,dl", 17);
                        }
                        break;
                }
            });
        }
    };
    emergency.sjcl = {
        loadProcess: function (message) {
            var hour = new Date().getHours(), minute = new Date().getMinutes(), second = new Date().getSeconds();
            var time = hour + ":" + minute + ":" + second;
            var html = '<div class="czlcjl-list-item animated fadeIn">'
                + '<div class="list-time-icon"></div>'
                + '<div class="list-event">'
                + '<div class="list-event-time">' + time + '</div>'
                + '<div class="list-event-text">' + message + '</div>'
                + '</div> </div>';
            $("#czlcjl_list").append(html).animate({scrollTop: $("#czlcjl_list")[0].scrollHeight}, 200);
        }
    }
})();