define(function (require, exports, module) {

    return ['$rootScope', '$routeParams', 'Restangular', 'HKPlayList',
        function ($rootScope, $routeParams, Restangular, HKPlayList) {

            var linker = function ($scope, $el, $attrs) {
                if ($scope.data && ($scope.data.ID || $scope.data.attributes.ID)) {
                    $scope.ledid = $scope.data.ID || $scope.data.attributes.ID;
                }

                $scope.newclicktishi = function () {
//                    var s = $scope.activeX.getOcx().releaseMsg();
//                    if (s == false) {
//                        $scope.progEditShow = false;
//                        $scope.activeshow = false;
//                        Messenger().post({
//                            message: '连接异常，暂时无法操作前端诱导屏！', type: 'error', showCloseButton: true
//                        });
//                        return;
//                    }

                    if(!$scope.linkStatus())
                    {

                        Messenger().post({
                            message: '连接异常，暂时无法操作前端诱导屏！', type: 'error', showCloseButton: true
                        });
                        return;
                    }


                    if ($scope.data.attributes.STATUS == -1) {

                        Messenger().post({
                            message: '该诱导屏已经关闭！', type: 'error', showCloseButton: true
                        });

                        $scope.progEditShow = false;
                        $scope.activeshow = false;
                        return;
                    }
                }
                //新增
                $scope.addScreen = function (data) {

                    //console.log(JSON.stringify(data));
                    if (!(data.ledid && (data.name && data.name != '') && (data.type || data.type === 0) && (data.grade || data.grade === 0) &&
                        (data.exclusive || data.exclusive === 0) && (data.enter || data.enter === 0) &&
                        (data.leave || data.leave === 0) && (data.speed || data.speed === 0) && data.stay &&
                        (data.conn || data.conn === 0) && (data.relationship || data.relationship === 0) &&
                        (data.state || data.state === 0) && (data.nblks && data.nblks != '') && (data.pblks && data.pblks != '') &&
                        (data.timetype || data.timetype === 0) && (data.begintime && data.begintime != '') &&
                        (data.endtime && data.endtime != '') && (data.lineSpace && data.lineSpace != '') && (data.flag || data.flag === 0))) {
                        alert('缺少必要字段信息！');
                        return;
                    }

                    //诱导屏编号
                    var ledid = data.ledid;

                    //屏体类型 0全点阵 1复合屏
                    var nledType = data.type;

                    //节目等级0-10 数值越大等级越高
                    var nproglevel = data.grade;

                    //1-独占 0-插播
                    var exclusive = data.exclusive;

                    //节目id，客户端自己定义的节目唯一标识
                    var myDate = new Date();
                    var year = myDate.getFullYear();
                    var month = myDate.getMonth() + 1;
                    month = month <= 9 ? '0' + month : month;
                    var date = myDate.getDate();
                    date = date <= 9 ? '0' + date : date;
                    var hour = myDate.getHours();
                    hour = hour <= 9 ? '0' + hour : hour;
                    var minute = myDate.getMinutes();
                    minute = minute <= 9 ? '0' + minute : minute;
                    var second = myDate.getSeconds();
                    second = second <= 9 ? '0' + second : second;
                    var millsecond = myDate.getMilliseconds();
                    millsecond = millsecond.toString().slice(0, 2);
                    millsecond = millsecond.length <= 1 ? '0' + millsecond : millsecond;
                    var progid = year + month + date + hour + minute + second + millsecond;

                    //节目进入方式
                    var nenter = data.enter;

                    //节目离开方式
                    var nleave = data.leave;

                    //节目进出速度
                    var nspeed = data.speed;

                    //停留时间
                    var nstaytime = data.stay;
                    var picfilename = "" + data.name + ".bmp";
                    var rtffilename = "" + data.name + ".rtf";

                    //关联路网
                    var nblkconn = data.conn;

                    //路段关联关系
                    var nrelationship = data.relationship;

                    //路段状态
                    var nblkstate = data.state;

                    //路段数量
                    var nblks = data.nblks;

                    //路段字符串
                    var pblks = data.pblks;

                    //行间距字段
                    var lineSpace = data.lineSpace;

                    //表明是星期还是周期
                    var timetype = data.timetype;
                    var starttime = data.begintime;
                    var endtime = data.endtime;

                    //存储的图片格式，0bmp，1jpg
                    var flag = data.flag;

                    //console.log('ledid:'+ledid+',nledType:'+nledType+',nproglevel:'+nproglevel+',exclusive:'+exclusive+
                    //',progid:'+progid+',nenter:'+nenter+',nleave:'+nleave+',nspeed:'+nspeed+',nstaytime:'+nstaytime+
                    //',picfilename:'+picfilename+',rtffilename:'+rtffilename+',nblkconn:'+nblkconn+
                    //',nrelationship:'+nrelationship+',nblkstate:'+nblkstate+',nblks:'+nblks+',pblks:'+pblks+
                    //',timetype:'+timetype+',starttime:'+starttime+',endtime:'+endtime+',flag:'+flag);
                    var isUpload = false;
                    isUpload = $scope.activeX.getOcx().geteditdatax(rtffilename, picfilename, flag);
                    if (!isUpload) {
                        alert("操作失败！");
                        return;
                    }
                    isUpload = $scope.activeX.getOcx().uploadfile(ledid, picfilename, picfilename);
                    if (!isUpload) {
                        alert("操作失败！");
                        return;
                    }
                    isUpload = $scope.activeX.getOcx().uploadFile(ledid, rtffilename, rtffilename);
                    if (!isUpload) {
                        alert("操作失败！");
                        return;
                    }

                    //ledid:32,nledType:0,nproglevel:0,exclusive:0,progid:2014070616481982,nenter:1,nleave:1,nspeed:4,
                    //nstaytime:10,picfilename:路口车多，车辆缓行.bmp,rtffilename:路口车多，车辆缓行.rtf,nblkconn:0,nrelationship:0,
                    //nblkstate:1,nblks:0,pblks:暂无,timetype:0,starttime:2014-07-01 16:47:25,endtime:2014-07-10 16:47:26,
                    //flag:0
                    //ledid:21,nledType:0,nproglevel:0,exclusive:0,progid:2014070617192719,nenter:1,nleave:1,nspeed:4,
                    //nstaytime:10,picfilename:测试.bmp,rtffilename:测试.rtf,nblkconn:0,nrelationship:0,
                    //nblkstate:1,nblks:0,pblks:暂无,timetype:0,starttime:2014-07-01 17:19:07,endtime:2014-07-10 17:19:07,
                    //flag:0
                    isUpload = $scope.activeX.getOcx().addprog(ledid, nledType, nproglevel, exclusive, progid,
                        nenter, nleave, nspeed, nstaytime, picfilename, rtffilename, nblkconn, nrelationship,
                        nblkstate, nblks, pblks, timetype, starttime, endtime, lineSpace);
                    if (!isUpload) {
                        alert("操作失败！");
                        return;
                    }
                    $scope.progEditShow = false;
                    return true;
                };

                //删除
                $scope.delScreen = function (data) {
//        if (!(data.cmsId && data.playId)) {
//          alert('缺少诱导屏或节目菜单编号！');
//          return;
//        }
//
//        //数字类型
//        var ledid = data.cmsId;
//
//          Restangular.all('playlist').customDELETE(data.playId).then(function(data){
//              if (!data.success) {
//                  alert("操作失败！");
//                  return;
//              }
//          });
//
//        $scope.progEditShow = false;
//        return true;
                };

                //修改
                $scope.editScreen = function (data) {
                    //alert('修改数据1：\n' + JSON.stringify(data));
                    var bAdd = $scope.addScreen(data);
                    if (bAdd) {
                        //alert('修改数据2：\n' + JSON.stringify(data));
                        var bDel = $scope.delScreen(data);
                        if (bDel) {
                            //alert('修改数据3：\n' + JSON.stringify(data));
                            $scope.progEditShow = false;
                            return true;
                        }
                    }
                };

                //加载编辑页面
                $scope.loadRtf = function (data) {
//        if (!(data && data.ledid && data.name)) {
//          return;
//        }
//        var rtffilename = data.name + '.rtf';//'路口车多,按线行驶.rtf';//data.name + ".rtf";
//        $scope.activeX.getOcx().downloadfile(data.ledid, rtffilename, rtffilename);
//        //var rtfpath = '路口车多,按线行驶.rtf'; //'C:\led\车辆慢行,谨慎驾驶!!.rtf';
//        $scope.activeX.getOcx().seteditdata(rtffilename);
                    $('#jqscreen').css('top', '0').css('left', '10px');
                };

                //清除编辑页面
                $scope.eliminateRtf = function () {
//        $scope.activeX.getOcx().seteditdata('');
                    $('#jqscreen').css('top', '0').css('left', '10px');
                };

                //显示图片，默认显示播放列表的第一条数据
                $scope.showImg = function (prog) {
                    if (!(prog && prog.ledid)) {
                        return;
                    }
                    var ledid = prog.ledid;
                    var filename = prog.picturePath;
                    if (typeof (filename) !== "undefined" && filename !== null && filename !== "") {
                        $scope.activeX.getOcx().downloadfile(ledid, filename, filename);
                        var path = "C://led//" + filename;
                        document.getElementById("imgPreview").innerHTML = "";
                        if (path.length >= 10) {
                            document.getElementById("imgPreview").innerHTML = "<img id='imgprogid' width='250px' height='150px' style='vertical-align:middle; border:0;' src='" + path + "'/>";
                        }
                    }
                };

                //抓屏
                $scope.getImgFromLed = function (ledid) {
                    if (!ledid) {
                        return;
                    }
                    var filename = "";
                    if ($scope.activeX.getOcx().GetImgFromLed(ledid)) {
                        filename = $scope.activeX.getOcx().strResult;
                    }
                    if (typeof (filename) !== "undefined" && filename !== null && filename !== "") {
                        $scope.activeX.getOcx().downloadfile(ledid, filename, filename);
                        alert("抓屏成功!");
                        var path = "C://led//" + filename;
                        document.getElementById("imgPreview").innerHTML = "";
                        if (path.length >= 10) {
                            document.getElementById("imgPreview").innerHTML = "<img id='imgprogid' width='250px' height='150px' style='vertical-align:middle; border:0;' src='" + path + "'/>";
                        }
                    } else {
                        alert("抓屏失败!");
                        return;
                    }
                };

                //向上移动一位
                $scope.itemUpHandler = function (data) {

//                    var s = $scope.activeX.getOcx().releaseMsg();
//                    if (s == false) {
//                        Messenger().post({
//                            message: '连接异常，暂时无法操作前端诱导屏！', type: 'error', showCloseButton: true
//                        });
//                        return;
//                    }

                    if(!$scope.linkStatus())
                    {

                        Messenger().post({
                            message: '连接异常，暂时无法操作前端诱导屏！', type: 'error', showCloseButton: true
                        });
                        return;
                    }



                    if ($scope.data.attributes.STATUS == -1) {
                        Messenger().post({
                            message: '该诱导屏已经关闭！', type: 'error', showCloseButton: true
                        });

                        $scope.progEditShow = false;
                        $scope.activeshow = false;
                        return;
                    }

                    var issynchronization = confirm("确定要移动一位？");

                    if (!issynchronization)return;
                    $scope.activeshow = false;
                    $scope.progEditShow = false;
                    var isSuc = $scope.activeX.getOcx().releaseMsg();
                    if (isSuc) {
                        data.oldIndex = data.listIndex;
                        data.newIndex = data.listIndex * 1 - 1;
                        HKPlayList.updateIndex(data, function (data) {
                            if (data.success) {
                                Messenger().post({message: '移动成功', type: 'success', showCloseButton: true });
                                reloadList();
                            }
                        });
                    }
                    else if (!isSuc) {
                        Messenger().post({
                            message: '移动失败',
                            type: 'error',
                            showCloseButton: true
                        });
                    }
                };

                //向下移动一位
                $scope.itemDownHandler = function (data) {

//                    var s = $scope.activeX.getOcx().releaseMsg();
//                    if (s == false) {
//                        Messenger().post({
//                            message: '连接异常，暂时无法操作前端诱导屏！', type: 'error', showCloseButton: true
//                        });
//                        return;
//                    }

                    if(!$scope.linkStatus())
                    {

                        Messenger().post({
                            message: '连接异常，暂时无法操作前端诱导屏！', type: 'error', showCloseButton: true
                        });
                        return;
                    }


                    if ($scope.data.attributes.STATUS == -1) {
                        Messenger().post({
                            message: '该诱导屏已经关闭！', type: 'error', showCloseButton: true
                        });

                        $scope.progEditShow = false;
                        $scope.activeshow = false;
                        return;
                    }
                    var issynchronization = confirm("确定要移动一位？");

                    if (!issynchronization)return;
                    $scope.activeshow = false;
                    $scope.progEditShow = false;
                    var isSuc = $scope.activeX.getOcx().releaseMsg();
                    if (isSuc) {
                        data.oldIndex = data.listIndex;
                        data.newIndex = data.listIndex * 1 + 1;
                        HKPlayList.updateIndex(data, function (res) {
                            if (res.success) {
                                Messenger().post({message: '移动成功', type: 'success', showCloseButton: true });
                                reloadList();
                            }
                        });
                    }

                    else if (!isSuc) {
                        Messenger().post({
                            message: '移动失败',
                            type: 'error',
                            showCloseButton: true
                        });
                    }
                };

                //置顶
                $scope.itemTopHandler = function (data) {


//                    var s = $scope.activeX.getOcx().releaseMsg();
//                    if (s == false) {
//                        Messenger().post({
//                            message: '连接异常，暂时无法操作前端诱导屏！', type: 'error', showCloseButton: true
//                        });
//                        return;
//                    }

                    if(!$scope.linkStatus())
                    {

                        Messenger().post({
                            message: '连接异常，暂时无法操作前端诱导屏！', type: 'error', showCloseButton: true
                        });
                        return;
                    }

                    if ($scope.data.attributes.STATUS == -1) {
                        Messenger().post({
                            message: '该诱导屏已经关闭！', type: 'error', showCloseButton: true
                        });

                        $scope.progEditShow = false;
                        $scope.activeshow = false;
                        return;
                    }
                    $scope.activeshow = false;
                    $scope.progEditShow = false;
                    var issynchronization = confirm("确定要置顶？");

                    if (!issynchronization)return;

                    var isSuc = $scope.activeX.getOcx().releaseMsg();
                    if (isSuc) {
                        data.oldIndex = data.listIndex;
                        data.newIndex = 0;
                        HKPlayList.updateIndex(data, function (data) {
                            if (data.success) {
                                Messenger().post({message: '置顶成功', type: 'success', showCloseButton: true });
                                reloadList();
                            }
                        });
                    }

                    else if (!isSuc) {
                        Messenger().post({
                            message: '置顶失败',
                            type: 'error',
                            showCloseButton: true
                        });
                    }
                };

                $scope.closes = function () {

                    if (!$scope.isShow) {
                        $scope.activeshow = false;
                        $scope.progEditShow = false;
                        $scope.isShow = true;
                        return;
                    }

                    $scope.activeshow = false;
                    $scope.progEditShow = true;

                }


                //置底
                $scope.itemBottomHandler = function (data) {

//                    var s = $scope.activeX.getOcx().releaseMsg();
//                    if (s == false) {
//                        Messenger().post({
//                            message: '连接异常，暂时无法操作前端诱导屏！', type: 'error', showCloseButton: true
//                        });
//                        return;
//                    }

                    if(!$scope.linkStatus())
                    {

                        Messenger().post({
                            message: '连接异常，暂时无法操作前端诱导屏！', type: 'error', showCloseButton: true
                        });
                        return;
                    }


                    if ($scope.data.attributes.STATUS == -1) {
                        Messenger().post({
                            message: '该诱导屏已经关闭！', type: 'error', showCloseButton: true
                        });

                        $scope.progEditShow = false;
                        $scope.activeshow = false;
                        return;
                    }
                    $scope.activeshow = false;
                    $scope.progEditShow = false;
                    var issynchronization = confirm("确定要置底？");

                    if (!issynchronization)return;

                    var isSuc = $scope.activeX.getOcx().releaseMsg();
                    if (isSuc) {
                        data.oldIndex = data.listIndex;
                        data.newIndex = $scope.progs.length * 1 - 1;
                        HKPlayList.updateIndex(data, function (data) {
                            if (data.success) {
                                Messenger().post({message: '置底成功', type: 'success', showCloseButton: true });
                                reloadList();
                            }
                        });
                    }

                    else if (!isSuc) {
                        Messenger().post({
                            message: '置底失败',
                            type: 'error',
                            showCloseButton: true
                        });
                    }
                };

                //置为有效
                $scope.setEnableHandler = function (data) {

//                    var s = $scope.activeX.getOcx().releaseMsg();
//                    if (s == false) {
//                        Messenger().post({
//                            message: '连接异常，暂时无法操作前端诱导屏！', type: 'error', showCloseButton: true
//                        });
//                        return;
//                    }

                    if(!$scope.linkStatus())
                    {

                        Messenger().post({
                            message: '连接异常，暂时无法操作前端诱导屏！', type: 'error', showCloseButton: true
                        });
                        return;
                    }

                    if ($scope.data.attributes.STATUS == -1) {
                        Messenger().post({
                            message: '该诱导屏已经关闭！', type: 'error', showCloseButton: true
                        });

                        $scope.progEditShow = false;
                        $scope.activeshow = false;
                        return;
                    }


                    var issynchronization = confirm("确定要置为有效");

                    if (!issynchronization)return;

                    if (!(data.cmsId && data.playId)) {
                        alert('缺少诱导屏或节目菜单编号！');
                        return;
                    }
                    var isSuc = $scope.activeX.getOcx().releaseMsg();
                    if (isSuc) {
                        isSuc = $scope.activeX.getOcx().releaseMsg();
                        if (isSuc) {
                            data.valid = '1';
                            data.listIndex = data.size;
                            Restangular.one('playlist/updateValid').customPUT(data).then(function (data) {
                                if (data.success) {
                                    Messenger().post({message: '置为有效成功', type: 'success', showCloseButton: true });
                                    reloadList();
                                }
                            });
                        }
                    }
                    if (!isSuc) {
                        Messenger().post({
                            message: '置为有效失败',
                            type: 'error',
                            showCloseButton: true
                        });
                    }


                };

                $scope.linkStatus=function(){


                    if($scope.activeX.getOcx().getConnectState()==1)
                    {
                        return true;
                    }
                    else
                    {
                        $scope.progEditShow = false;
                        $scope.activeshow = false;
                        return false;
                    }
                }

                //置为失效
                $scope.setDisableHandler = function (data) {

//                    var s = $scope.activeX.getOcx().releaseMsg();
//                    if (s == false) {
//                        Messenger().post({
//                            message: '连接异常，暂时无法操作前端诱导屏！', type: 'error', showCloseButton: true
//                        });
//                        return;
//                    }

                    if(!$scope.linkStatus())
                    {

                        Messenger().post({
                            message: '连接异常，暂时无法操作前端诱导屏！', type: 'error', showCloseButton: true
                        });
                        return;
                    }


                    if ($scope.data.attributes.STATUS == -1) {
                        Messenger().post({
                            message: '该诱导屏已经关闭！', type: 'error', showCloseButton: true
                        });

                        $scope.progEditShow = false;
                        $scope.activeshow = false;
                        return;
                    }

                    var issynchronization = confirm("确定要置为失效");

                    if (!issynchronization)return;

                    if (!(data.cmsId && data.playId)) {
                        alert('缺少诱导屏或节目菜单编号！');
                        return;
                    }
                    var isSuc = $scope.activeX.getOcx().releaseMsg();
                    if (isSuc) {
                        isSuc = $scope.activeX.getOcx().releaseMsg();
                        if (isSuc) {
                            data.valid = '0';
                            data.oldIndex = data.listIndex;
                            data.listIndex = -1;
                            Restangular.one('playlist/updateValid').customPUT(data).then(function (data) {
                                if (data.success) {
                                    Messenger().post({message: '置为失效成功', type: 'success', showCloseButton: true });
                                    reloadList();
                                }
                            });
                        }
                    }
                    if (!isSuc) {
                        Messenger().post({
                            message: '置为失效失败',
                            type: 'error',
                            showCloseButton: true
                        });
                    }
                };

                //发布
                $scope.onSubmit = function (data) {
                    if (data.content == '' || data.content == undefined) {
                        alert('请填写内容！');
                        return;
                    }
                    var test = data.startTime == undefined || data.endTime == undefined || data.startTime == '' || data.endTime == '';
                    if (test) {
                        alert('请填写开始时间和结束时间！');
                        return;
                    }
                    if ((new Date(data.startTime.replace(/-/g, "\/"))) >= (new Date(data.endTime.replace(/-/g, "\/")))) {
                        alert('开始时间必须小于结束时间！');
                        return;
                    }
                    data.cmsId = $scope.data.attributes.ID;
                    //通过控件添加信息
                    var startDate = new Date(data.startTime.replace(/-/g, "/"));
                    var startMillsecond = startDate.getTime();
                    var endDate = new Date(data.endTime.replace(/-/g, "/"));
                    var endMillsecond = endDate.getTime();

                    var isSuc = false;
                    if (data.preview == true) {   //已经点击预览操作
                        isSuc = true;
                    } else {//未点击预览操作
                        //console.log(data.content+","+ data.font+","+ data.fontSize+","+ parseInt(data.fontColor)+","+ data.enterType*1+","+ data.moveTime+","+ data.speed+","+ startMillsecond/1000+","+ endMillsecond/1000);
                        var ary = data.content.split("\n");
                        ary=$scope.strControl(ary);
                        var str = ary.join("|");
                        if (data.isMiddle == 1) {
                            str = "@" + str;
                        }
//                        isSuc = $scope.activeX.getOcx().addMsg(1, str, data.font, data.fontSize, data.fontColor + '', data.enterType * 1, data.moveTime, data.speed, startMillsecond / 1000, endMillsecond / 1000, data.lineSpace);
                        isSuc = $scope.activeX.getOcx().addMsg(1, str, data.font, data.fontSize, data.fontColor + '', data.enterType * 1, data.moveTime, data.speed, startMillsecond / 1000, 1420041540, data.lineSpace);
                    }

                    if (isSuc) {
                        isSuc = $scope.activeX.getOcx().releaseMsg();
                        if (isSuc) {
                            Restangular.all('playlist').post(data).then(function (result) {
                                if (result.success) {
                                    Messenger().post({message: '发布成功', type: 'success', showCloseButton: true });
                                    $scope.progEditShow = false;
                                    reloadList();
                                }
                            });
                        }
                    }
                    if (!isSuc) {
                        Messenger().post({
                            message: '发布失败',
                            type: 'error',
                            showCloseButton: true
                        });
                    }

                };

                //删除
                $scope.onDelete = function (data) {
                    if (!(data.cmsId && data.playId)) {
                        alert('缺少诱导屏或节目菜单编号！');
                        return;
                    }
//                    var isSuc = $scope.activeX.getOcx().delMsg(data.listIndex*1+1);
//                    if(isSuc){
                    var isSuc = $scope.activeX.getOcx().releaseMsg();
                    if (isSuc) {
                        Restangular.all('playlist').customDELETE(data.playId).then(function (data) {
                            if (data.success) {
                                Messenger().post({message: '删除成功', type: 'success', showCloseButton: true });
                                $scope.progEditShow = false;
                                reloadList();
                            }
                        });
                    }
                    else {
                        Messenger().post({
                            message: '删除失败',
                            type: 'error',
                            showCloseButton: true
                        });
                    }
//                    }
//                    if(!isSuc){
//                        Messenger().post({
//                            message: '删除失败',
//                            type: 'error',
//                            showCloseButton: true
//                        });
//                    }
                };

                //修改
                $scope.onEdit = function (data) {
                    if (data.content == '' || data.content == undefined) {
                        alert('请填写内容！');
                        return;
                    }
                    var test = data.startTime == undefined || data.endTime == undefined || data.startTime == '' || data.endTime == '';
                    if (test) {
                        alert('请填写开始时间和结束时间！');
                        return;
                    }
                    if ((new Date(data.startTime.replace(/-/g, "\/"))) >= (new Date(data.endTime.replace(/-/g, "\/")))) {
                        alert('开始时间必须小于结束时间！');
                        return;
                    }
                    data.cmsId = $scope.data.attributes.ID;

                    //通过控件添加信息
                    var startDate = new Date(data.startTime.replace(/-/g, "/"));
                    var startMillsecond = startDate.getTime();
                    var endDate = new Date(data.endTime.replace(/-/g, "/"));
                    var endMillsecond = endDate.getTime();

                    var isSuc = false;
                    if (data.preview == true) {   //已经点击预览操作
                        isSuc = true;
                    } else {                       //未点击预览操作
                        var ary = data.content.split("\n");
                        ary=$scope.strControl(ary);

                        var str = ary.join("|");
                        if (data.isMiddle == 1) {
                            str = "@" + str;
                        }
                        isSuc = $scope.activeX.getOcx().updateMsg(data.listIndex * 1 + 1, 1, str, data.font, data.fontSize,
                            parseInt(data.fontColor), data.enterType * 1, data.stayTime, data.speed,
                            startMillsecond / 1000, 1420041540, data.lineSpace);
//                            startMillsecond / 1000, endMillsecond / 1000, data.lineSpace);
                    }

                    if (isSuc) {
                        isSuc = $scope.activeX.getOcx().releaseMsg();
                        if (isSuc) {
                            Restangular.one('playlist', data.playId).customPUT(data).then(function (result) {
                                if (result.success) {
                                    Messenger().post({message: '修改成功', type: 'success', showCloseButton: true });
                                    $scope.progEditShow = false;
                                    reloadList();
                                }
                            });
                        }
                    }
                    if (!isSuc) {
                        Messenger().post({
                            message: '修改失败',
                            type: 'error',
                            showCloseButton: true
                        });
                    }
                };

                //连接异常
                $scope.islink = function () {

//                    var s = $scope.activeX.getOcx().releaseMsg();
//                    if (s == false) {
//                        Messenger().post({
//                            message: '连接异常，暂时无法操作前端诱导屏！', type: 'error', showCloseButton: true
//                        });
//
//                        $scope.progEditShow = false;
//                        $scope.activeshow = false;
//                        return;
//                    }

                    if(!$scope.linkStatus())
                    {

                        Messenger().post({
                            message: '连接异常，暂时无法操作前端诱导屏！', type: 'error', showCloseButton: true
                        });

                        return;
                    }
                }


                //不提示的同步
                $scope.synchronization = function () {
                    //获取播放信息列表
//                    var s = $scope.activeX.getOcx().releaseMsg();
//                    if (s == false) {
//                        Messenger().post({
//                            message: '连接异常！', type: 'error', showCloseButton: true
//                        });
//                        return;
//                    }

                    if(!$scope.linkStatus())
                    {

                        Messenger().post({
                            message: '连接异常，暂时无法操作前端诱导屏！', type: 'error', showCloseButton: true
                        });

                        return;
                    }

//                    for (var j = 0; j < 10; j++)
                        $scope.msgAry = JSON.parse($scope.activeX.getOcx().getAllMsg());

                    var temp = $scope.data.attributes.ID;


                    //删除播放信息
                    setTimeout(function () {

//                        for (var n = 0; n < 3; n++) {


                            for (var i = $scope.msgAry.length - 1; i > 0; i--) {

                                $scope.activeX.getOcx().delMsg(i);

                            }
                            $scope.activeX.getOcx().releaseMsg();
//                        }

                        Restangular.all('playlist/list').post({cmsId: temp}).then(function (data) {
                            //添加所有的播放列表信息
                            var pp = [];
                            for (var i = 0; i < data.results.length; i++) {
                                if (data.results[i].valid == 1) {
                                    pp.push(data.results[i]);
                                }
                            }
                            $scope.pp = pp;

                            size = $scope.pp.length;
                            for (var i = 0; i < size; i++) {

                                //通过控件添加信息
                                var startDate = new Date($scope.pp[i].startTime.replace(/-/g, "/"));
                                var startMillsecond = startDate.getTime();
                                var endDate = new Date($scope.pp[i].endTime.replace(/-/g, "/"));
                                var endMillsecond = endDate.getTime();

                                var ary = $scope.pp[i].content.split("\n");
                                ary=$scope.strControl(ary);
                                console.log(ary);
                                var str = ary.join("|");
                                if ($scope.pp[i].isMiddle == 1) {
                                    str = "@" + str;
                                }
//                                $scope.activeX.getOcx().addMsg(1, str, $scope.pp[i].font,
//                                    $scope.pp[i].fontSize, $scope.pp[i].fontColor + '',
//                                    $scope.pp[i].enterType * 1, $scope.pp[i].moveTime,
//                                    $scope.pp[i].speed, startMillsecond / 1000, endMillsecond / 1000,
//                                    $scope.pp[i].lineSpace);
                                $scope.activeX.getOcx().addMsg(1, str, $scope.pp[i].font,
                                    $scope.pp[i].fontSize, $scope.pp[i].fontColor + '',
                                    $scope.pp[i].enterType * 1, $scope.pp[i].moveTime,
                                    $scope.pp[i].speed, startMillsecond / 1000, 1420041540,
                                    $scope.pp[i].lineSpace);
                                var isSuc2 = $scope.activeX.getOcx().releaseMsg();
                                //只要有一次发布失败，便是同步失败；
                                if (!isSuc2) {
                                    Messenger().post({
                                        message: '同步失败', type: 'error', showCloseButton: true
                                    });
                                    return;
                                }

                            }
                        })

                    }, 2000);
                    /* for(var n=0;n<7;n++)
                     {
                     for(var i = $scope.msgAry.length-1;i>0; i--){

                     $scope.activeX.getOcx().delMsg(i);

                     }
                     $scope.activeX.getOcx().releaseMsg();
                     }*/
                    //获取数据库所有的播放列表信息(可能是Restangular指令回调的问题)

                };

                //开屏操作
                $scope.kaiping = function () {


//                    var s = $scope.activeX.getOcx().releaseMsg();
//                    if (s == false) {
//                        Messenger().post({
//                            message: '连接异常，暂时无法操作前端诱导屏！', type: 'error', showCloseButton: true
//                        });
//                        return;
//                    }

                    if(!$scope.linkStatus())
                    {

                        Messenger().post({
                            message: '连接异常，暂时无法操作前端诱导屏！', type: 'error', showCloseButton: true
                        });

                        return;
                    }

                    var issynchronization = confirm("确定要开屏？");

                    if (!issynchronization)return;

                    $rootScope.$broadcast('kaiping');
                    $scope.youdao = {};
                    $scope.youdao.connected = {};
                    $scope.youdao.connected.code = 1;
                    Restangular.one('cms', $scope.data.attributes.ID).customPUT($scope.youdao).then(function (data) {
                        if (data.success) {
                            Messenger().post({message: '开屏成功', type: 'success', showCloseButton: true });
                            $scope.synchronization();
                            $rootScope.$broadcast('jq-screen:activeX');
                        }
                    });

                    $scope.data.attributes.STATUS = 1;


                }


                //关屏操作
                $scope.youclose = function () {

//                    var s = $scope.activeX.getOcx().releaseMsg();
//                    if (s == false) {
//                        Messenger().post({
//                            message: '连接异常，暂时无法操作前端诱导屏！', type: 'error', showCloseButton: true
//                        });
//                        return;
//                    }
                    if(!$scope.linkStatus())
                    {

                        Messenger().post({
                            message: '连接异常，暂时无法操作前端诱导屏！', type: 'error', showCloseButton: true
                        });

                        return;
                    }

                    $scope.progEditShow = false;
                    $scope.activeshow = false;

                    var issynchronization = confirm("确定要关屏？");

                    if (!issynchronization)return;
                    for (var j = 0; j < 10; j++)
                        $scope.msgAry = JSON.parse($scope.activeX.getOcx().getAllMsg());
                    setTimeout(function () {
                        for (var n = 0; n < 3; n++) {
                            for (var i = $scope.msgAry.length - 1; i > 0; i--) {
                                $scope.activeX.getOcx().delMsg(i);
                            }
                            $scope.activeX.getOcx().releaseMsg();
                        }
                    }, 2000)
                    $scope.youdao = {};
                    $scope.youdao.connected = {};
                    $scope.youdao.connected.code = -1;
                    Restangular.one('cms', $scope.data.attributes.ID).customPUT($scope.youdao).then(function (data) {
                        if (data.success) {
                            Messenger().post({message: '关屏成功', type: 'success', showCloseButton: true });
                        }
                    });

                    $scope.data.attributes.STATUS = -1;


                }


                //关屏提示
                $scope.youclosetishi = function () {
                    if ($scope.data.attributes.STATUS == -1) {
                        Messenger().post({
                            message: '该诱导屏已经关闭！', type: 'error', showCloseButton: true
                        });

                        $scope.progEditShow = false;
                        $scope.activeshow = false;
                        return;
                    }
                }


                //同步


                $scope.synchronizationClick = function () {
                    //获取播放信息列表


//                    var s = $scope.activeX.getOcx().releaseMsg();
//                    if (s == false) {
//                        Messenger().post({
//                            message: '连接异常，暂时无法操作前端诱导屏！', type: 'error', showCloseButton: true
//                        });
//                        return;
//                    }

                    if(!$scope.linkStatus())
                    {

                        Messenger().post({
                            message: '连接异常，暂时无法操作前端诱导屏！', type: 'error', showCloseButton: true
                        });
                        return;
                    }

                    if ($scope.data.attributes.STATUS == -1) {
                        Messenger().post({
                            message: '该诱导屏已经关闭！', type: 'error', showCloseButton: true
                        });

                        $scope.progEditShow = false;
                        $scope.activeshow = false;
                        return;
                    }

                    var issynchronization = confirm("确定要同步");

                    if (!issynchronization)return;


//                    for (var j = 0; j < 10; j++)
                        $scope.msgAry = JSON.parse($scope.activeX.getOcx().getAllMsg());
                    var temp = $scope.data.attributes.ID;


//                         删除播放信息
                    setTimeout(function () {

//                        for (var n = 0; n < 3; n++) {


                            for (var i = $scope.msgAry.length - 1; i > 0; i--) {

                                $scope.activeX.getOcx().delMsg(i);

                            }
                            $scope.activeX.getOcx().releaseMsg();
//                        }

                        Restangular.all('playlist/list').post({cmsId: temp}).then(function (data) {
                            //添加所有的播放列表信息
                            var pp = [];
                            for (var i = 0; i < data.results.length; i++) {
                                if (data.results[i].valid == 1) {
                                    pp.push(data.results[i]);
                                }
                            }
                            $scope.pp = pp;

                            size = $scope.pp.length;
                            for (var i = 0; i < size; i++) {

                                //通过控件添加信息
                                var startDate = new Date($scope.pp[i].startTime.replace(/-/g, "/"));
                                var startMillsecond = startDate.getTime();
                                var endDate = new Date($scope.pp[i].endTime.replace(/-/g, "/"));
                                var endMillsecond = endDate.getTime();

                                var ary = $scope.pp[i].content.split("\n");

                                ary=$scope.strControl(ary);
                                var str = ary.join("|");
                                if ($scope.pp[i].isMiddle == 1) {
                                    str = "@" + str;
                                }
//                                    $scope.activeX.getOcx().addMsg(1, str, $scope.pp[i].font,
//                                        $scope.pp[i].fontSize, $scope.pp[i].fontColor+'',
//                                        $scope.pp[i].enterType*1, $scope.pp[i].moveTime,
//                                        $scope.pp[i].speed, startMillsecond/1000, endMillsecond/1000,
//                                        $scope.pp[i].lineSpace);
//                                $scope.activeX.getOcx().addMsg(1, str, $scope.pp[i].font,
//                                    $scope.pp[i].fontSize, $scope.pp[i].fontColor + '',
//                                    $scope.pp[i].enterType * 1, $scope.pp[i].moveTime,
//                                    $scope.pp[i].speed, startMillsecond / 1000, endMillsecond / 1000,
//                                    $scope.pp[i].lineSpace);
                                $scope.activeX.getOcx().addMsg(1, str, $scope.pp[i].font,
                                    $scope.pp[i].fontSize, $scope.pp[i].fontColor + '',
                                    $scope.pp[i].enterType * 1, $scope.pp[i].moveTime,
                                    $scope.pp[i].speed, startMillsecond / 1000, 1420041540 ,
                                    $scope.pp[i].lineSpace);
                                var isSuc2 = $scope.activeX.getOcx().releaseMsg();
                                //只要有一次发布失败，便是同步失败；
                                if (!isSuc2) {
                                    Messenger().post({
                                        message: '同步失败', type: 'error', showCloseButton: true
                                    });
                                    return;
                                }

                            }


                            if (isSuc2) {
                                Messenger().post({message: '同步成功', type: 'success', showCloseButton: true });
                            }
                        })

                    }, 2000);
                    /* for(var n=0;n<7;n++)
                     {
                     for(var i = $scope.msgAry.length-1;i>0; i--){

                     $scope.activeX.getOcx().delMsg(i);

                     }
                     $scope.activeX.getOcx().releaseMsg();
                     }*/
                    //获取数据库所有的播放列表信息(可能是Restangular指令回调的问题)

                };


                //预览字符串处理

                $scope.strControl=function(str){

                    var ary=angular.copy(str);
                    for(var y=ary.length-1;y>=0;y--)
                    {
                        if(ary[y]==""||ary[y]==" ")
                        {
                            ary.splice(y,1);
                        }
                        else
                        {
                            break;
                        }
                    }
                    return ary;

                }


                //更新预览操作
                $scope.onPreview = function (data) {
                    if (data.content == '' || data.content == undefined || data.content == '\n') {
                        alert('请填写内容！');                 return;
                    }
                    var test = data.startTime == undefined || data.endTime == undefined || data.startTime == '' || data.endTime == '';
                    if (test) {
                        alert('请填写开始时间和结束时间！');
                        return;
                    }
                    if ((new Date(data.startTime.replace(/-/g, "\/"))) >= (new Date(data.endTime.replace(/-/g, "\/")))) {
                        alert('开始时间必须小于结束时间！');
                        return;
                    }
                    //清空之前的操作
                    var str = $scope.activeX.getOcx().getAllMsg();
                   $scope.progEditShow=false;
                    $scope.activeshow=true;
                    setTimeout(function () {
                        //调用预览接口
                        var startDate = new Date(data.startTime.replace(/-/g, "/"));
                        var startMillsecond = startDate.getTime();
                        var endDate = new Date(data.endTime.replace(/-/g, "/"));
                        var endMillsecond = endDate.getTime();

                        //console.log(data.content+","+ data.font+","+ data.fontSize+","+ parseInt(data.fontColor)+","+ data.enterType*1+","+ data.moveTime+","+ data.speed+","+ startMillsecond/1000+","+ endMillsecond/1000);
                        var isSuc = false;
                        var ary = data.content.split("\n");

                        ary=$scope.strControl(ary);
                        var str = ary.join("|");
                        if (data.isMiddle == 1) {
                            str = "@" + str;
                        }
                        if (data.isNew) {
                            isSuc = $scope.activeX.getOcx().addMsg(1, str, data.font, data.fontSize, data.fontColor + '', data.enterType * 1, data.moveTime, data.speed, startMillsecond / 1000, 1420041540 , data.lineSpace);
                        } else {
                            isSuc = $scope.activeX.getOcx().updateMsg(data.listIndex * 1 + 1, 1, str, data.font, data.fontSize, data.fontColor + '', data.enterType * 1, data.stayTime, data.speed, startMillsecond / 1000, 1420041540 ,data.lineSpace);
                        }
                        isSuc = $scope.activeX.getOcx().playIndex();
                    }, 1000);
                };

                //获取设备播放实时内容
                $scope.onRealClick = function (data) {
                    $scope.activeX.getOcx().monitor();
                };
                //取消操作
                $scope.getMsgList = function () {
                    //调用接口  查询列表
                    $scope.activeX.getOcx().getAllMsg();
                };
                var reloadList = function () {
                    $rootScope.$broadcast('list-yj-vms:reload', $scope.activeX);
                };


                $rootScope.$on('featureClose', function () {
                    $scope.activeshow = false;
                    $scope.progEditShow = false;
                });


                $scope.$watch('progs', function () {
                    if (!($scope.progs && $scope.progs[0] && $scope.progs[0].picturePath)) {
                        return;
                    }
                    $scope.showImg($scope.progs[0]);
                });

            };

            return {
                restrict: 'EA',
                replace: true,
                link: linker,
                scope: {
                    data: '=data',
                    map: '=map'
                },
                templateUrl: 'app/$directives/vms/panel.html'
            };
        }];

});
