// JavaScript Document
// AnyChat for Web SDK

/********************************************
 *                业务逻辑控制                *
 *******************************************/

var mDefaultServerAddr = "127.0.0.1";		// 默认服务器地址
var mDefaultServerPort = 8906;					// 默认服务器端口号
var mSelfUserId = -1; 							// 本地用户ID
var mTargetUserId = 0;							// 目标用户ID（请求了对方的音视频）
var mRefreshVolumeTimer = -1; 					// 实时音量大小定时器
var mRefreshPluginTimer = -1;					// 检查插件是否安装完成定时器

// 日志记录类型，在日志信息栏内显示不同的颜色
var LOG_TYPE_NORMAL = 0;
var LOG_TYPE_API = 1;
var LOG_TYPE_EVENT = 2;
var LOG_TYPE_ERROR = 3;

// 通知类型，在文字消息栏内显示不同的颜色
var NOTIFY_TYPE_NORMAL = 0;
var NOTIFY_TYPE_SYSTEM = 1;

var humanID, humanName, otherID, otherName, serverAddr, serverPort, appGuid;
var isCalled = false;
window.isShow = false;
var tryCall = 1;
var loginCount = 0;
var callWaitTimeout = -1;
var clearCallTimeout = -1;

function LogicInit() {
    setTimeout(function () {
        if (navigator.plugins && navigator.plugins.length) {
            window.navigator.plugins.refresh(false);
        }
        //检查是否安装了插件	
        var NEED_ANYCHAT_APILEVEL = "0"; 						// 定义业务层需要的AnyChat API Level
        var errorcode = BRAC_InitSDK(NEED_ANYCHAT_APILEVEL); 	// 初始化插件
        AddLog("BRAC_InitSDK(" + NEED_ANYCHAT_APILEVEL + ")=" + errorcode, LOG_TYPE_API);
        if (errorcode == GV_ERR_SUCCESS) {
            if (mRefreshPluginTimer != -1)
                clearInterval(mRefreshPluginTimer); 			// 清除插件安装检测定时器
            //ShowLoginDiv(true);
            AddLog("AnyChat Plugin Version:" + BRAC_GetVersion(0), LOG_TYPE_NORMAL);
            AddLog("AnyChat SDK Version:" + BRAC_GetVersion(1), LOG_TYPE_NORMAL);
            AddLog("Build Time:" + BRAC_GetSDKOptionString(BRAC_SO_CORESDK_BUILDTIME), LOG_TYPE_NORMAL);

            GetID("prompt_div").style.display = "none"; 		// 隐藏插件安装提示界面
            BRAC_SetSDKOption(BRAC_SO_VIDEOBKIMAGE, "./images/anychatbk.jpg");
            // 初始化界面元素
            //InitInterfaceUI();
            BRAC_SetSDKOption(BRAC_SO_CORESDK_SCREENCAMERACTRL, 1);
            setTimeout(autoLogon, 100);
        } else { 						// 没有安装插件，或是插件版本太旧，显示插件下载界面
            GetID("prompt_div").style.display = "block";
            SetDivTop("prompt_div", 300);
            if (errorcode == GV_ERR_PLUGINNOINSTALL)
                GetID("prompt_div_line1").innerHTML = "首次进入需要安装插件，请点击下载按钮进行安装！";
            else if (errorcode == GV_ERR_PLUGINOLDVERSION)
                GetID("prompt_div_line1").innerHTML = "检测到当前插件的版本过低，请下载安装最新版本！";

            if (mRefreshPluginTimer == -1) {
                mRefreshPluginTimer = setInterval(function () {
                    LogicInit();
                }, 1000);
            }
        }
    }, 500);
}
$(function () {
    var ua = window.navigator.userAgent.toLowerCase();
    var info = {
        edge: /edge/.test(ua)
    };
    if (info.edge) {
        $("#loginDiv").hide();
        $("#prompt_div").hide();
        $('.showBox').hide();
        $('body').append('<iframe src="./html/needie.html?reason=3" style="width: 100%; height: 800px;" scrolling = "no"  frameborder="0"></iframe>');
        $('body').css('backgroundColor', '#fff');
    } else {
        LogicInit(); // 初始化sdk
    }
});

//设置AnyChat参数，需要在收到登录成功回调之后调用
function ConfigAnyChatParameter() {

}

function autoLogon() {
    var url = location.search; //获取url中"?"符后的字串
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            if (strs[i].split("=")[0] == "humanID") {
                humanID = strs[i].split("=")[1];
            } else if (strs[i].split("=")[0] == "humanName") {
                humanName = decodeURI(strs[i].split("=")[1]);
            } else if (strs[i].split("=")[0] == "otherID") {
                otherID = decodeURI(strs[i].split("=")[1]);
            } else if (strs[i].split("=")[0] == "otherName") {
                otherName = decodeURI(strs[i].split("=")[1]);
            } else if (strs[i].split("=")[0] == "ip") {
                serverAddr = strs[i].split("=")[1] || getCookie("serverAddr");
            } else if (strs[i].split("=")[0] == "port") {
                serverPort = strs[i].split("=")[1] || getCookie("serverPort");
            }
        }
    }
    serverAddr = (serverAddr != "") ? serverAddr : mDefaultServerAddr;
    serverPort = (serverPort != "") ? serverPort : mDefaultServerPort;
    appGuid = getCookie("appGuid");
    var loginType = getCookie("loginType");
    if (humanName != "") {
        DisplayLoadingDiv(true);
        var errorcode = BRAC_Connect(serverAddr, serverPort); //连接服务器
        AddLog("BRAC_Connect(" + serverAddr + "," + serverPort + ")=" + errorcode, LOG_TYPE_API);
        errorcode = BRAC_Login(humanName, '', 0);
        AddLog("BRAC_Login(" + humanName + ")=" + errorcode, LOG_TYPE_API);
        if (errorcode > 0) {
            location.reload();
        }
    }
    else {
        AddLog("The user name can not be empty!", LOG_TYPE_ERROR);
    }
}


// 初始化界面元素
function InitInterfaceUI() {
    //设置按钮
    // GetID("setting").onclick = function () {
    //     if (GetID("setting_div").style.display == "block")
    //         GetID("setting_div").style.display = "none";
    //     else
    //         GetID("setting_div").style.display = "block";
    // }
    //
    // //登录按钮
    // GetID("loginbtn").onclick = function () {
    // 	var signTimestamp = 0;
    // 	var signStr = "";
    //	
    // if(GetID("password").value == "密码可为空")
    // 	GetID("password").value = "";
    //     if (GetID("username").value != "") {
    //         DisplayLoadingDiv(true);
    //         setLoginInfo();
    //        
    // 	/* AnyChat可以连接自主部署的服务器、也可以连接AnyChat视频云平台；
    //          * 连接自主部署服务器的地址为自设的服务器IP地址或域名、端口；
    //          * 连接AnyChat视频云平台的服务器地址为：cloud.anychat.cn；端口为：8906
    //          */
    //         var errorcode = BRAC_Connect(GetID("ServerAddr").value, parseInt(GetID("ServerPort").value)); //连接服务器
    //         AddLog("BRAC_Connect(" + GetID("ServerAddr").value + "," + GetID("ServerPort").value + ")=" + errorcode, LOG_TYPE_API);
    //
    // 	/*
    //          * AnyChat支持多种用户身份验证方式，包括更安全的签名登录，
    //          * 详情请参考：http://bbs.anychat.cn/forum.php?mod=viewthread&tid=2211&highlight=%C7%A9%C3%FB
    //          */
    // 	errorcode = BRAC_Login(GetID("username").value, GetID("password").value, 0);
    //     	AddLog("BRAC_Login(" + GetID("username").value + ")=" + errorcode, LOG_TYPE_API);            	
    //                
    //         // 隐藏设置界面
    //         GetID("setting_div").style.display = "none";
    //     }
    //     else {
    //         GetID("a_error_user").style.color = "red";
    //         AddLog("The user name can not be empty!", LOG_TYPE_ERROR);
    //         GetID("username").focus();
    //     }
    // }
    //退出系统
    GetID("ExitSystemBtn").onclick = function () {
        var errorcode = BRAC_Logout();
        AddLog("BRAC_Logout()=" + errorcode, LOG_TYPE_API);
        ShowHallDiv(false);
        ShowLoginDiv(true);
    }
    //下载插件按钮鼠标划入划出时间
    GetID("prompt_div_btn_load").onmouseover = function () {
        GetID("prompt_div_btn_load").style.backgroundColor = "#ffc200";
    }
    GetID("prompt_div_btn_load").onmouseout = function () {
        GetID("prompt_div_btn_load").style.backgroundColor = "#ff8100";
    }
    //下载插件界面关闭按钮
    GetID("prompt_div_headline2").onclick = function () {
        document.URL = location.href;
    }
    // // 鼠标移到日志层上面
    // GetID("LOG_DIV_BODY").onmousemove = function () {
    //     GetID("LOG_DIV_BODY").style.zIndex = 100;
    //     GetID("LOG_DIV_CONTENT").style.backgroundColor = "#FAFADD";
    //     GetID("LOG_DIV_CONTENT").style.border = "1px solid black";
    // }
    // // 鼠标从日志层上面移开
    // GetID("LOG_DIV_BODY").onmouseout = function () {
    //     GetID("LOG_DIV_BODY").style.zIndex = -1;
    //     GetID("LOG_DIV_CONTENT").style.backgroundColor = "#C4CEDD";
    //     GetID("LOG_DIV_CONTENT").style.border = "";
    // }
    //关闭设置界面
// 	Getdmo("advanceset_div_close").onclick = function () {
// 		if (Getdmo("advanceset_div").style.display == "block")
// 			Getdmo("advanceset_div").style.display = "none";
// 		else {
// 			Getdmo("advanceset_div").style.display = "block"; // 显示高级设置界面
//             // 初始化高级设置界面
// 			InitAdvanced();
//         }
// }

    getLoginInfo();

}

// function PasswordFocus(obj,color){
// 	// 判断文本框中的内容是否是默认内容
// 	if(obj.value=="密码可为空")
// 		obj.value="";
// 	obj.type="password";
// 	// 设置文本框获取焦点时候背景颜色变换
// 	obj.style.backgroundColor=color;
// }

// // 当鼠标离开时候改变文本框背景颜色
// function myblur(obj,color){
// 	obj.style.background=color;
// }

//计算高度并设置界面位置
function SetDivTop(id, TheHeight) {
    var BodyHeight = document.documentElement.clientHeight; //获得浏览器可见区域高度
    if (TheHeight < BodyHeight) {//div高度小于可见区域高度
        GetID("margintop").style.height = (BodyHeight - TheHeight) / 4 + "px";
        GetID(id).style.marginTop = "0px";
    }
}

//系统信息框滚动条显隐
function DisplayScroll(id) {
    var offset = GetID(id); //需要检测的div
    if (offset.offsetHeight < offset.scrollHeight) {//div可见高度小于div滚动条高度
        GetID(id).style.overflowY = "scroll";//显示滚动条
        GetID(id).scrollTop = GetID(id).scrollHeight;//滚动条自动滚动到底部
    }
    else
        GetID(id).style.overflowY = "hidden";//隐藏滚动条
}

// 显示登录界面
// function ShowLoginDiv(bShow) {
// 	if(bShow) {
// 		GetID("login_div").style.display = "block"; 	//显示登录界面
// 		GetID("username").focus();
// 		SetDivTop("login_div", 195); 					//登录界面垂直居中
// 		GetID("LOG_DIV_BODY").style.display = "block"; 	//显示系统信息框
// 		var serverIP = getCookie("ServerAddr");
// 		var serverPort = getCookie("ServerPort");
// 		GetID("ServerAddr").value = (typeof serverIP != "undefined" && serverIP != null) ? serverIP : mDefaultServerAddr;
// 		GetID("ServerPort").value = (typeof serverPort != "undefined" && serverPort != null) ? serverPort : mDefaultServerPort;
//
// 	} else {
//	
// 	}
// }

// // 显示大厅界面
function ShowHallDiv(bShow) {
    if (bShow) {
        //GetID("login_div").style.display = "none"; 		//隐藏登录界面
        //GetID("hall_div").style.display = "block"; 		//显示大厅界面
        //SetDivTop("hall_div", 400); 					//大厅界面垂直居中
    } else {
        // GetID("hall_div").style.display = "none";
    }
}

function GetID(id) {
    if (document.getElementById) {
        return document.getElementById(id);
    } else if (window[id]) {
        return window[id];
    }
    return null;
}

//div按钮鼠标划入划出效果
function Mouseover(id) {
    GetID(id).style.backgroundColor = "#FFFFCC";
}
//div按钮鼠标划入划出效果
function Mouseout(id) {
    GetID(id).style.backgroundColor = "#E6E6E6";
}
//获取当前时间  (00:00:00)
function GetTheTime() {
    var TheTime = new Date();
    return TheTime.toLocaleTimeString();
}

// 添加日志并显示，根据不同的类型显示不同的颜色
function AddLog(message, type) {
    if (type == LOG_TYPE_API) {			// API调用日志，绿色
        message = message.fontcolor("Green");
    } else if (type == LOG_TYPE_EVENT) {	// 回调事件日志，黄色
        message = message.fontcolor("#CC6600");
    } else if (type == LOG_TYPE_ERROR) {	// 出错日志，红色
        message = message.fontcolor("#FF0000");
    } else {							// 普通日志，灰色
        message = message.fontcolor("#333333");
    }
    // GetID("LOG_DIV_CONTENT").innerHTML += message + "&nbsp" + GetTheTime().fontcolor("#333333") + "<br />";
    // DisplayScroll("LOG_DIV_CONTENT");
    console.log(message);
}

// 显示等待进度条，提示用户操作正在进行中
function DisplayLoadingDiv(bShow) {
    if (bShow) {
        GetID("LOADING_DIV").style.display = "block";
        GetID("LOADING_GREY_DIV").style.display = "block";
        var TheHeight = document.documentElement.clientHeight;
        var TheWidth = document.body.offsetWidth;
        GetID("LOADING_DIV").style.marginTop = (TheHeight - 50) / 2 + "px";
        GetID("LOADING_DIV").style.marginLeft = (TheWidth - 130) / 2 + "px";
    }
    else {
        GetID("LOADING_DIV").style.display = "none";
        GetID("LOADING_GREY_DIV").style.display = "none";
    }
}
function Getdmo(element) {
    if (document.getElementById) {
        return document.getElementById(element);
    } else if (window[element]) {
        return window[element];
    }
    return null;
}
//初始化所有界面位置
function initialize() {
    var mBrowserWidth = document.body.offsetWidth; // 网页可见区域宽
    var mBrowserHeight = document.documentElement.clientHeight; //  网页可见区域高
    //CenterPosition(mBrowserWidth, mBrowserHeight, "Initiative_Call_Div", 300, 170); //主动呼叫层垂直水平居中
    //CenterPosition(mBrowserWidth, mBrowserHeight, "BeCalls_Div", 300, 170); //被呼叫层垂直水平居中
    //CenterPosition(mBrowserWidth, mBrowserHeight, "SessionPrompt_Div", 300, 170); //会话消息层垂直水平居中
    CenterPosition(mBrowserWidth, mBrowserHeight, "advanceset_div", 1500, -350); //会话消息层垂直水平居中
    CenterPosition(mBrowserWidth, mBrowserHeight, "hall_div", 770, 650); //结束会话询问层垂直水平居中
    if (mBrowserHeight < 650) $("#hall_div").css("top", "0px");
}

// DIV层垂直居中和水平居中  浏览器可视区域宽度  浏览器可视区域高度  DIV层ID DIV层的高度 DIV层的宽度
function CenterPosition(VWidth, VHeight, DivID, DivWidth, DivHeight) {
    $("#" + DivID).css("left", (VWidth - DivWidth) / 2 + "px"); // 设置X坐标
    $("#" + DivID).css("top", (VHeight - DivHeight) / 2 + "px"); // 设置Y坐标
}

// 开始视频会话第一界面 宽屏视频
function showVideoSessionScreen() {
    //网页可见区域宽：
    var VWidth = document.body.offsetWidth; // (包括边线的宽) 
    //网页可见区域高：
    var VHeight = document.body.offsetHeight; //  (包括边线的高)
    //CenterPosition(VWidth, 730, "VideoShowDiv", 1020, 450);
    createVideoContainer(); // 动态生成宽屏视频容器
    setVideoShow("videoshow2", "videoshow1");
    //mRefreshVolumeTimer = setInterval(updateCurrentVolume, 200); // 获取显示语音音量
}
// 设置显示视频位置
function setVideoShow(firVideo, secVideo) {
    BRAC_SetVideoPos(mSelfUserId, Getdmo(firVideo), "ANYCHAT_VIDEO_LOCAL");
    BRAC_SetVideoPos(mTargetUserId, Getdmo(secVideo), "ANYCHAT_VIDEO_REMOTE");
}

// 双方音量条
function updateCurrentVolume() {
    Getdmo("Mine_Volume").style.width = Getdmo("videoshow2").offsetWidth / 100 * BRAC_QueryUserStateInt(mSelfUserId, BRAC_USERSTATE_SPEAKVOLUME) + "px";
    Getdmo("Target_Volume").style.width = Getdmo("videoshow1").offsetWidth / 100 * BRAC_QueryUserStateInt(mTargetUserId, BRAC_USERSTATE_SPEAKVOLUME) + "px";
}

//动态生成宽屏视频容器
function createVideoContainer() {
    Getdmo("VideoShowDiv").innerHTML = "";
    // 左边视频框
    var upper_video1 = document.createElement("div");
    upper_video1.id = "videoshow1";
    upper_video1.className = "videoshow";
    Getdmo("VideoShowDiv").appendChild(upper_video1);
    // 右边视频框
    var upper_video2 = document.createElement("div");
    upper_video2.id = "videoshow2";
    upper_video2.className = "videoshow";
    upper_video2.style.marginLeft = "6px";
    Getdmo("VideoShowDiv").appendChild(upper_video2);
    /*//左边音量条框
     var volume_other_Holder = document.createElement("div");
     volume_other_Holder.id = "Target_Volume_Holder";
     Getdmo("VideoShowDiv").appendChild(volume_other_Holder);
    
     //右边音量条框
     var volume_self_Holder = document.createElement("div");
     volume_self_Holder.id = "Mine_Volume_Holder";
     Getdmo("VideoShowDiv").appendChild(volume_self_Holder);
    
     //左边音量条
     var volume_other = document.createElement("div");
     volume_other.id = "Target_Volume";
     Getdmo("Target_Volume_Holder").appendChild(volume_other);
    
     //右边音量条
     var volume_self = document.createElement("div");
     volume_self.id = "Mine_Volume";
     Getdmo("Mine_Volume_Holder").appendChild(volume_self);*/

    // 显示己方名字
    var upper_othername = document.createElement("div");
    upper_othername.className = "ShowName";
    upper_othername.innerHTML = BRAC_GetUserInfo(mTargetUserId, USERINFO_NAME);
    Getdmo("VideoShowDiv").appendChild(upper_othername);
    // 显示对方名字
    var upper_myname = document.createElement("div");
    upper_myname.className = "ShowName";
    upper_myname.innerHTML = BRAC_GetUserName(mSelfUserId);
    Getdmo("VideoShowDiv").appendChild(upper_myname);
    // 挂断 按钮
    var under_finish = document.createElement("div");
    under_finish.id = "finishprivate";
    under_finish.onmouseout = function () {
        $("#finishprivate").css("background", "url('./images/dialog/btnfalse_move.png')");
    }
    under_finish.onmouseover = function () {
        $("#finishprivate").css("background", "url('./images/dialog/btnfalse_over.png')");
    }
    under_finish.onclick = function () {
        BRAC_VideoCallControl(BRAC_VIDEOCALL_EVENT_FINISH, mTargetUserId, 0, 0, 0, ""); 	// 挂断
    }
    Getdmo("VideoShowDiv").appendChild(under_finish);
    // 高级设置 按钮
    var video_paramers_config = document.createElement("div");
    video_paramers_config.id = "video_paramers_config";
    video_paramers_config.className = "Buttons";
    //高级设置
    video_paramers_config.onclick = function () {
        if (Getdmo("advanceset_div").style.display == "block")
            Getdmo("advanceset_div").style.display = "none";
        else {
            Getdmo("advanceset_div").style.display = "block"; // 显示高级设置界面
            // 初始化高级设置界面
            InitAdvanced();
        }
    }
    video_paramers_config.innerHTML = "设置";
    Getdmo("VideoShowDiv").appendChild(video_paramers_config);
}

//设置登录信息，包括用户名、服务器IP、服务器端口、应用ID
function setLoginInfo() {
    setCookie('username', GetID("username").value, 30);
    setCookie('ServerAddr', GetID("ServerAddr").value, 30);
    setCookie('ServerPort', GetID("ServerPort").value, 30);

}

//获取登录信息
function getLoginInfo() {
    GetID("username").value = getCookie("username");
    var serverIP = getCookie("ServerAddr");
    GetID("ServerAddr").value = (serverIP != "") ? serverIP : mDefaultServerAddr;
    var serverPort = getCookie("ServerPort");
    GetID("ServerPort").value = (serverPort != "") ? serverPort : mDefaultServerPort;
}

//获取cookie项的cookie值
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return document.cookie.substring(c_start, c_end);
        }
    }
    return "";
}

//设置cookie
function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + expiredays);
    document.cookie = c_name + "=" + value + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
}

//呼叫(遍历在线好友的登录名称获取待呼叫的ID)
function StartCall(userName) {
    var OnLineUserList = BRAC_GetUserFriends();
    if (OnLineUserList.length == 0) {
        if (tryCall == 1) {
            callWaitTimeout = setTimeout(StartCall, 2000);
            if (clearCallTimeout == -1) {
                clearCallTimeout = setTimeout(function () {
                    tryCall = 0;
                }, 10000);
            }
        }
    }
    var userID;
    for (var i = 0, len = OnLineUserList.length; i < len; i++) {
        var name = BRAC_GetUserInfo(OnLineUserList[i], USERINFO_NAME);
        if (name == userName) {
            userID = OnLineUserList[i];
            VideoCallRequest(userID);
            break;
        }
    }
    if (OnLineUserList.length > 0 && !userID) {
        ForSession(userName + "不在线");
        CloseCallByUserName(userName);
    }

}
