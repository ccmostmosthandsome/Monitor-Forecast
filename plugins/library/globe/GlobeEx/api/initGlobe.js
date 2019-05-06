var eGlobe = eGlobe || {};

(function (win) {
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    }

    function getRootPath() {
        var b, nodes, i, src, match, index;
        var srcPattern = /^(.*)library\/(.*)\/GlobeEx\/api\/initGlobe([\.\-].*)js(\?.*)?$/;
        var doc = win.document;
        nodes = (doc && doc.getElementsByTagName('script')) || [];
        for (i = 0; i < nodes.length; i++) {
            src = nodes[i].src;
            if (src) {
                match = src.match(srcPattern);
                b = match && match[1];
                if (b) return b;
            }
        }
    }

    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) {
                return pair[1];
            }
        }
        return (false);
    }

    eGlobe.global = eGlobe.global || {};
    eGlobe.global.debug = Boolean(getUrlParam('debug'));
    //eGlobe.global.debug = true;  //add by ysp
    eGlobe.global.rootURL = getRootPath();




    eGlobe.global.serverURL = "http://202.114.118.61:8099/DESP/queryDataConfig?did="+getQueryVariable("did");
    if (getUrlParam("geocode")) {
        eGlobe.global.geocode = eval("(" + getUrlParam("geocode") + ")");
    }
    if (getUrlParam("toolbar")) {
        eGlobe.global.toolbar = eval("(" + getUrlParam("toolbar") + ")");
    }
    if (getUrlParam("navi")) {
        eGlobe.global.navi = eval("(" + getUrlParam("navi") + ")");
    }
    if (getUrlParam("switchbar")) {
        eGlobe.global.switchbar = eval("(" + getUrlParam("switchbar") + ")");
    }
    eGlobe.global.msgPrefix = getUrlParam("msgPrefix") || "Globe";
    eGlobe.global.parentScene = getUrlParam("parentScene") || "GlobeMap";
    eGlobe.global.humanID = getUrlParam("humanID") || 23;
    eGlobe.global.mapID = getUrlParam("globeID") || 1;
    //TODO 临时默认配置信息
    eGlobe.global.config = getUrlParam("config") || "sysconfig.json";
    eGlobe.global.proxyURL = getUrlParam("proxyURL");
    eGlobe.global.container = getUrlParam("globeContainer") || "cesiumContainer";
    eGlobe.context = window.context || {};

    var bust = "";
    if (eGlobe.global.debug) {
        //bust = "?bust=" + (new Date()).getTime();
    }

    var sdkURL = eGlobe.global.rootURL + "library/globe/GlobeEx";

    /** 为了保证bootstrap加载成功后再添加程序入口代码 **/
    var styleList = [
        "/css/globe_min.css"
    ];
    if (eGlobe.global.debug) {
        styleList = ["/css/globe.css"];
    }
    for (var i in styleList) {
        var styleScript = document.createElement("link");
        styleScript.setAttribute("type", "text/css");
        styleScript.setAttribute("rel", "stylesheet");
        styleScript.setAttribute("href", sdkURL + styleList[i] + bust);
        document.getElementsByTagName("head").item(0).appendChild(styleScript);
    }

    var mainScript = document.createElement("script");
    mainScript.setAttribute("type", "text/javascript");
    if (eGlobe.global.debug) {
        mainScript.setAttribute("data-main", sdkURL + "/bootstrap.js" + bust);
    } else {
        mainScript.setAttribute("data-main", sdkURL + "/eGlobeSdk.js");
    }
    mainScript.setAttribute("src", eGlobe.global.rootURL + "/library/3rdparty/require/require-2.1.11.js" + bust);
    document.getElementsByTagName("head").item(0).appendChild(mainScript);
})(this);