var gWndId = 0;
var nDirect=-1;
var nOper=-1;
var gXmlRecords;
var gRecordPath;

function init(){
	ButtonCreateWnd_onclick();
}
function ShowCallRetInfo(nRet, strInfo) 
{
    if (nRet != 0)
    {
        var obj = document.getElementById("DPSDK_OCX");
        alert(strInfo + ": ErrorCode = "+obj.DPSDK_GetLastError());
    }
}
function getDate(strDate) 
{
	var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
	function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
	return date;
}

function ButtonCreateWnd_onclick() 
{
    var obj = document.getElementById("DPSDK_OCX");

    gWndId = obj.DPSDK_CreateSmartWnd(0, 0, 100, 100);
    var nWndCount = document.getElementById("textWndNum").value;
    obj.DPSDK_SetWndCount(gWndId, nWndCount); 
	obj.DPSDK_SetSelWnd(gWndId, 0); 
}

function ButtonLogin_onclick() 
{
    var obj = document.getElementById("DPSDK_OCX");
    
    var szIp = document.getElementById("textIP").value;
    var nPort = document.getElementById("textPort").value;
    var szUsername = document.getElementById("textUser").value;
    var szPassword = document.getElementById("textPassword").value;
    
    ShowCallRetInfo(obj.DPSDK_Login(szIp, nPort, szUsername, szPassword), "登录");
	ButtonLoadDGroupInfo_onclick();
}

function ButtonLogout_onclick() 
{
    var obj = document.getElementById("DPSDK_OCX");
    
    ShowCallRetInfo(obj.DPSDK_Logout(), "登出");
}


function ButtonLoadDGroupInfo_onclick() 
{
    var obj = document.getElementById("DPSDK_OCX");
    
	ShowCallRetInfo(obj.DPSDK_LoadDGroupInfo(), "加载组织结构");
    //alert(obj.DPSDK_GetDGroupStr());
	document.getElementById("DGroupInfo").innerText = obj.DPSDK_GetDGroupStr();
}

function ButtonStartRealplayByWndNo_onclick() 
{
    var obj = document.getElementById("DPSDK_OCX");
    
    var szCameraId = document.getElementById("textCameraID").value;
    var nStreamType = document.getElementById("selectStreamType").value;
    var nMediaType = document.getElementById("selectMediaType").value;
    var nTransType = document.getElementById("selectTransType").value;
   
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
    ShowCallRetInfo(obj.DPSDK_StartRealplayByWndNo(gWndId, nWndNo, szCameraId, nStreamType, nMediaType, nTransType), "播放视频");
}

function ButtonStopRealplayByWndNo_onclick() 
{
    var obj = document.getElementById("DPSDK_OCX");

	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
    ShowCallRetInfo(obj.DPSDK_StopRealplayByWndNo(gWndId, nWndNo), "播放视频");
}

function ButtonStartRecordByWndNo_onclick()
{
    var obj = document.getElementById("DPSDK_OCX");

	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
    ShowCallRetInfo(obj.DPSDK_StartRealRecordByWndNo(gWndId, nWndNo,"C:\\123.dav"), "实时视频录制");
}

function ButtonStopRecordByWndNo_onclick()
{
    var obj = document.getElementById("DPSDK_OCX");

	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
    ShowCallRetInfo(obj.DPSDK_StopRealRecordByWndNo(gWndId, nWndNo), "停止实时视频录制");
}

function ButtonSetOsdTxtByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

	var strOSD = document.getElementById("text7").value;
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	ShowCallRetInfo(obj.DPSDK_SetOsdTxtByWndNo(gWndId, nWndNo,strOSD), "OSD文本信息下发");
}

function ButtonCleanUpOsdInfoByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	ShowCallRetInfo(obj.DPSDK_CleanUpOsdInfoByWndNo(gWndId, nWndNo), "清除osd信息");
}

function ButtonCapturePictureByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var mydate=new Date();
	var reg=new RegExp(":","g");
	var path="c:\\dahuaphoto\\"+mydate.toLocaleString().replace(" ","").replace("年","").replace("月","").replace("日","").replace(reg,"")+".bmp";
	alert("存储路径："+path)
	ShowCallRetInfo(obj.DPSDK_CapturePictureByWndNo(gWndId, nWndNo,path), "抓图");
}

function ButtonStopRealplayByCameraId_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

	var strCameraID = document.getElementById("textCameraID").value;
	ShowCallRetInfo(obj.DPSDK_StopRealplayByCameraId(strCameraID), "关闭CAM");
}

function ButtonPtzDirection_onclick(nDirects)
{
	var obj = document.getElementById("DPSDK_OCX");
    var szCameraId = document.getElementById("textCameraID").value;
    nDirect = nDirects;
    var nStep = document.getElementById("selectPtzDirectionStep").value;
    ShowCallRetInfo(obj.DPSDK_PtzDirection(szCameraId, nDirect, nStep, 0), "方向控制");
}

function ButtonPtzDirection_onclickStop(bStop)
{
	var obj = document.getElementById("DPSDK_OCX");
    var szCameraId = document.getElementById("textCameraID").value;
    var nStep = document.getElementById("selectPtzDirectionStep").value;
    ShowCallRetInfo(obj.DPSDK_PtzDirection(szCameraId, nDirect, nStep, bStop), "方向控制");
}

function ButtonPtzCameraOperation_onclick(nOpers)
{
	var obj = document.getElementById("DPSDK_OCX");
    var szCameraId = document.getElementById("textCameraID").value;
    nOper = nOpers;
    var nStep = document.getElementById("selectCameraStep").value;
    ShowCallRetInfo(obj.DPSDK_PtzCameraOperation(szCameraId, nOper, nStep, 0), "镜头控制");
}

function ButtonPtzCameraOperation_onclickStop(bStop)
{
	var obj = document.getElementById("DPSDK_OCX");
    var szCameraId = document.getElementById("textCameraID").value;
    var nStep = document.getElementById("selectCameraStep").value;
    ShowCallRetInfo(obj.DPSDK_PtzCameraOperation(szCameraId, nOper, nStep, bStop), "镜头控制");
}

function ButtonPtzSit_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
 
    var szCameraId = document.getElementById("textCameraID").value; 
    var nXPosition = document.getElementById("textXPosition").value;
    var nYPosition = document.getElementById("textYPosition").value;
    var nStep = document.getElementById("selectPtzSitStep").value;
   
    ShowCallRetInfo(obj.DPSDK_PtzCameraOperation(szCameraId, nXPosition, nYPosition), "三维定位");
}
function ButtonAddPrePoint_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
    var szCameraId = document.getElementById("textCameraID").value; 
    var nPrePointNum = document.getElementById("textPrePointNum").value;
    var strPrePointName = document.getElementById("textPrePointName").value;
    ShowCallRetInfo(obj.DPSDK_PtzPrePointOperation(szCameraId, nPrePointNum, strPrePointName,2), "增加预置点");
}

function ButtonDelPrePoint_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
 
    var szCameraId = document.getElementById("textCameraID").value; 
    var nPrePointNum = document.getElementById("textPrePointNum").value;
    var strPrePointName = document.getElementById("textPrePointName").value;
   
    ShowCallRetInfo(obj.DPSDK_PtzPrePointOperation(szCameraId, nPrePointNum, strPrePointName,3), "删除预置点");
}

function ButtonQueryPrePoint_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
 
    var szCameraId = document.getElementById("textCameraID").value; 
   
    alert(obj.DPSDK_QueryPrePoint(szCameraId));
}

function ButtonSeekPrePoint_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
 
    var szCameraId = document.getElementById("textCameraID").value; 
    var nPrePointNum = document.getElementById("textPrePointNum").value;
    var strPrePointName = document.getElementById("textPrePointName").value;
   
    ShowCallRetInfo(obj.DPSDK_PtzPrePointOperation(szCameraId, nPrePointNum, strPrePointName,1), "定位预置点");
}
function getDate(strDate) 
{
	var date = eval('new Date(' + strDate.replace(/\d+(?=-[^-]+$)/,
	function (a) { return parseInt(a, 10) - 1; }).match(/\d+/g) + ')');
	return date;
}

function ButtonQueryRecord_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
    var szCameraId = document.getElementById("textCameraID").value; 
    var nRecordSource = document.getElementById("selectRecordSource").value;
    var nRecordType = document.getElementById("selectRecordType").value;
    var strStartTime = document.getElementById("textStartTime").value;
    var strEndTime = document.getElementById("textEndTime").value;	
    var nStartTime = getDate(strStartTime).getTime()/1000;
//	alert(nStartTime);
	var nEndTime = getDate(strEndTime).getTime()/1000;
//	alert(nEndTime);
		
//    ShowCallRetInfo(obj.DPSDK_QueryRecordInfo(szCameraId, nRecordSource, nRecordType, nStartTime, nEndTime), "查询录像");

//	gXmlRecords = obj.DPSDK_QueryRecordInfo(szCameraId, nRecordSource, nRecordType, nStartTime, nEndTime);
	alert(obj.DPSDK_QueryRecordInfo(szCameraId, nRecordSource, nRecordType, nStartTime, nEndTime));
}

function ButtonStartFilePlaybackByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	ShowCallRetInfo(obj.DPSDK_StartFilePlaybackByWndNo(gWndId, nWndNo,0), "按文件回放");
}

function ButtonStartTimePlaybackByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var szCameraId = document.getElementById("textCameraID").value; 
    var nRecordSource = document.getElementById("selectRecordSource").value;
 //   var nRecordType = document.getElementById("selectRecordType").value;
    var strStartTime = document.getElementById("textStartTime").value;
    var strEndTime = document.getElementById("textEndTime").value;	
    var nStartTime = getDate(strStartTime).getTime()/1000;
	var nEndTime = getDate(strEndTime).getTime()/1000;

	ShowCallRetInfo(obj.DPSDK_StartTimePlaybackByWndNo(gWndId, nWndNo, szCameraId, nRecordSource, nStartTime, nEndTime), "按时间回放");
}

function ButtonPausePlaybackByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	ShowCallRetInfo(obj.DPSDK_PausePlaybackByWndNo(gWndId, nWndNo), "暂停回放");
}

function ButtonResumePlaybackByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	ShowCallRetInfo(obj.DPSDK_ResumePlaybackByWndNo(gWndId, nWndNo), "继续回放");
}

function ButtonStopPlaybackByWndNo_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	ShowCallRetInfo(obj.DPSDK_StopPlaybackByWndNo(gWndId, nWndNo), "停止回放");
}

function ButtonSetPlaybackSpeedByWndNo_onclick(nPlaybackRate)
{
	var obj = document.getElementById("DPSDK_OCX");
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	//var nPlaybackRate = document.getElementById("selectPlaybackRate").value;
	alert(nPlaybackRate);
	ShowCallRetInfo(obj.DPSDK_SetPlaybackSpeedByWndNo(gWndId, nWndNo, nPlaybackRate), "回放速度");
}

function ButtonDownloadRecordByFile_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var mydate=new Date();
	var reg=new RegExp(":","g");
	gRecordPath="c:\\dahuarecord\\"+mydate.toLocaleString().replace(" ","").replace("年","").replace("月","").replace("日","").replace(reg,"")+".dav";
	alert("存储路径："+gRecordPath);
	ShowCallRetInfo(obj.DPSDK_DownloadRecordByFile(gRecordPath, 0), "按文件下载");
}

function ButtonDownloadRecordByTime_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

	var szCameraId = document.getElementById("textCameraID").value; 
    var nRecordSource = document.getElementById("selectRecordSource").value;
 //   var nRecordType = document.getElementById("selectRecordType").value;
    var strStartTime = document.getElementById("textStartTime").value;
    var strEndTime = document.getElementById("textEndTime").value;	
    var nStartTime = getDate(strStartTime).getTime()/1000;
	var nEndTime = getDate(strEndTime).getTime()/1000;
	var mydate=new Date();
	var reg=new RegExp(":","g");
	gRecordPath="c:\\dahuarecord\\"+mydate.toLocaleString().replace(" ","").replace("年","").replace("月","").replace("日","").replace(reg,"")+".dav";
	alert("存储路径："+gRecordPath);
	ShowCallRetInfo(obj.DPSDK_DownloadRecordByTime(gRecordPath, szCameraId, nRecordSource, nStartTime, nEndTime), "按时间下载");
}

function ButtonPauseDownloadRecord_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var mydate=new Date();
	var reg=new RegExp(":","g");
	//var path="c:\\dahuarecord\\"+mydate.toLocaleString().replace(" ","").replace("年","").replace("月","").replace("日","").replace(reg,"")+".dav";
	//alert("存储路径："+path);
	ShowCallRetInfo(obj.DPSDK_PauseDownloadRecord(gRecordPath), "暂停下载");
}

function ButtonResumeDownloadRecord_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var mydate=new Date();
	var reg=new RegExp(":","g");
	//var path="c:\\dahuarecord\\"+mydate.toLocaleString().replace(" ","").replace("年","").replace("月","").replace("日","").replace(reg,"")+".dav";
	//alert("存储路径："+path);
	ShowCallRetInfo(obj.DPSDK_ResumeDownloadRecord(gRecordPath), "继续下载");
}

function ButtonStopDownloadRecord_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var mydate=new Date();
	var reg=new RegExp(":","g");
	//var path="c:\\dahuarecord\\"+mydate.toLocaleString().replace(" ","").replace("年","").replace("月","").replace("日","").replace(reg,"")+".dav";
	//alert("存储路径："+path);
	ShowCallRetInfo(obj.DPSDK_StopDownloadRecord(gRecordPath), "停止下载");
}

function ButtonPlaybackCapture_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

	var nWndNo = obj.DPSDK_GetSelWnd(gWndId);
	var mydate=new Date();
	var reg=new RegExp(":","g");
	var path="c:\\dahuaphoto\\"+mydate.toLocaleString().replace(" ","").replace("年","").replace("月","").replace("日","").replace(reg,"")+".bmp";
	alert("存储路径："+path);
	ShowCallRetInfo(obj.DPSDK_CapturePictureByWndNo(gWndId, nWndNo,path), "抓图");
}

function ButtonEnableAlarm_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	var szDevID = document.getElementById("textDeviceID").value; 
	var nVideoChannel = document.getElementById("textVideoChan").value; 
	var nAlarmChannel = document.getElementById("textAlarmChan").value; 
    var nAlarmType = document.getElementById("selectAlarmType").value;
	
	ShowCallRetInfo(obj.DPSDK_EnableAlarm(szDevID, nVideoChannel, nAlarmChannel, nAlarmType), "布控");
}

function ButtonDisableAlarm_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");
	
	ShowCallRetInfo(obj.DPSDK_DisableAlarm(), "撤控");
}

function ButtonQueryAlarm_onclick()
{
	var obj = document.getElementById("DPSDK_OCX");

	var szCameraId = document.getElementById("textCameraID").value; 
    var nAlarmType = document.getElementById("selectAlarmType").value;
    var strStartTime = document.getElementById("textAlarmStartTime").value;
    var strEndTime = document.getElementById("textAlarmEndTime").value;	
    var nStartTime = getDate(strStartTime).getTime()/1000;
	var nEndTime = getDate(strEndTime).getTime()/1000;
	
	var nCount = obj.DPSDK_QueryAlarmCount(szCameraId, nAlarmType, nStartTime, nEndTime);
	
	if(nCount > 0)
	{
		var nIndex;
		var strAlarmInfo = obj.DPSDK_QueryAlarmInfo(szCameraId, nAlarmType, nStartTime, nEndTime, nIndex,500);
		alert(strAlarmInfo);
	}
}


//电视墙操作方法
function getWallCount(){
	var obj = document.getElementById("DPSDK_OCX");
	var count=obj.DPSDK_QueryTvWallList();
	writewall("获取电视墙总数:"+count);
	//alert("获取电视墙总数:"+count);
}
function writewall(info){
	document.getElementById("wallinfoxml").innerText=info;
}
function getWallInfo(){
	var obj = document.getElementById("DPSDK_OCX");
	var allstr=obj.DPSDK_GetTvWallList();
	writewall("获取电视墙信息:"+allstr);
	var xmlDoc=loadXML(allstr);
	var elements = xmlDoc.getElementsByTagName("TvWall");
	var objSelect=document.getElementById("wallid");
	objSelect.options.length = 0;  
	for (var i = 0; i < elements.length; i++) {
		var tvWallId = elements[i].getAttribute("tvWallId");
		var name = elements[i].getAttribute("name");
		//var tvWallId = elements[i].getElementsByTagName("TvWall").getAttribute("tvWallId").value;
		//var name = elements[i].getElementsByTagName("name")[0].firstChild.nodeValue;
		//alert(tvWallId+"----"+name);
		var varItem = new Option(name, tvWallId);      
        objSelect.options.add(varItem); 
	}

	
	
}

function getWallLayout(){
	var obj = document.getElementById("DPSDK_OCX");
	 var wallid = document.getElementById("wallid").value;
	 alert(wallid);
    var allstr=obj.DPSDK_QueryTvWallLayout(wallid);
	writewall("获取电视墙布局:"+allstr);
}

function getOneWallLayout(){
	var obj = document.getElementById("DPSDK_OCX");
	var wallstr=obj.DPSDK_GetTvWallLayout(51);
	writewall("得到电视墙布局"+wallstr);
}

function CutWall(){
	var obj = document.getElementById("DPSDK_OCX");
	var statue=obj.DPSDK_SetTvWallScreenSplit(51,489,4);
	alert("分割:"+statue);
}

function wallset(){
	var obj = document.getElementById("DPSDK_OCX");
	var statue=obj.DPSDK_SetTvWallScreenWindowSource(51,489,1,'1000007$1$0$2',1,30);
	alert("设置"+statue);
}


function wallclose(){
	var obj = document.getElementById("DPSDK_OCX");
	var statue=obj.DPSDK_CloseTvWallScreenWindowSource(51,489,1);
	alert("关闭"+statue);
}


function WallClean(){
	var obj = document.getElementById("DPSDK_OCX");
	var statue=obj.DPSDK_ClearTvWallScreen(51);
	alert("清屏"+statue);
}

loadXML = function(xmlString){
        var xmlDoc=null;
        //判断浏览器的类型
        //支持IE浏览器 
        if(!window.DOMParser && window.ActiveXObject){   //window.DOMParser 判断是否是非ie浏览器
            var xmlDomVersions = ['MSXML.2.DOMDocument.6.0','MSXML.2.DOMDocument.3.0','Microsoft.XMLDOM'];
            for(var i=0;i<xmlDomVersions.length;i++){
                try{
                    xmlDoc = new ActiveXObject(xmlDomVersions[i]);
                    xmlDoc.async = false;
                    xmlDoc.loadXML(xmlString); //loadXML方法载入xml字符串
                    break;
                }catch(e){
                }
            }
        }
        //支持Mozilla浏览器
        else if(window.DOMParser && document.implementation && document.implementation.createDocument){
            try{
                /* DOMParser 对象解析 XML 文本并返回一个 XML Document 对象。
                 * 要使用 DOMParser，使用不带参数的构造函数来实例化它，然后调用其 parseFromString() 方法
                 * parseFromString(text, contentType) 参数text:要解析的 XML 标记 参数contentType文本的内容类型
                 * 可能是 "text/xml" 、"application/xml" 或 "application/xhtml+xml" 中的一个。注意，不支持 "text/html"。
                 */
                domParser = new  DOMParser();
                xmlDoc = domParser.parseFromString(xmlString, 'text/xml');
            }catch(e){
            }
        }
        else{
            return null;
        }

        return xmlDoc;
}

