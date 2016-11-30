define(function(require, exports, module) {

    return ['Modal', '$rootScope',
    function(Modal, $rootScope) {

        var linker = function($scope, el, attrs) {
            //是否成功登录
            $scope.isLogin = false;

            //是否登录中
            $scope.isLogining = true;
            $scope.isVideoing = false;

            var initVideo = function() {
                if (!$scope.isLogin) {
                    initData();
                    $scope.createFun();
                    setTimeout(function() {
                        $scope.setFun();
                        $scope.loginFun();
                        $scope.$apply();
                        $scope.startRealplayByWndNoFun();
                        $scope.setDirects();
                    }, 100);
                } else {
                    $scope.startRealplayByWndNoFun();
                }

            };

            var initMultipleVideo = function() {
                if (!$scope.isLogin) {
                    initData();
                    $scope.createFun();
                    setTimeout(function() {
                        $scope.setFun();
                        $scope.loginFun();
                        $scope.$apply();
                        $scope.startRealplayByWndNoFun();
                    }, 100);
                } else {
                    $scope.setFun();
                    $scope.stopRealplayByWndNoFun();
                    $scope.startRealplayByWndNoFun();
                }
            };

            var calcWndCount = function(nWndCount) {
                if (nWndCount) {
                    if (nWndCount === 1) {
                        nWndCount = 1;
                    }
                    if (nWndCount >= 2 && nWndCount <= 4) {
                        nWndCount = 4;
                    }
                    // if (nWndCount >= 5 && nWndCount <= 6) {
                    // nWndCount = 6;
                    // }
                    // if (nWndCount >= 7 && nWndCount <= 8) {
                    // nWndCount = 8;
                    // }
                    if (nWndCount >= 5 && nWndCount <= 9) {
                        nWndCount = 9;
                    }
                    // if (nWndCount >= 10 && nWndCount <= 13) {
                    // nWndCount = 13;
                    // }
                    if (nWndCount >= 10 && nWndCount <= 16) {
                        nWndCount = 16;
                    }
                    // if (nWndCount >= 17 && nWndCount <= 20) {
                    // nWndCount = 20;
                    // }
                    if (nWndCount >= 17 && nWndCount <= 25) {
                        nWndCount = 25;
                    }
                    if (nWndCount >= 26 && nWndCount <= 36) {
                        nWndCount = 36;
                    }
                } else {
                    nWndCount = 1;
                }
                return nWndCount;
            };

            $scope.$watch('record', function() {
                if (!$scope.record) {
                    return;
                }

                //多宫格显示
                if ($scope.record.regionCode) {
                    $scope.records = [];
                    _.each($scope.record.videos, function(r) {
                        if (!r.properties) {
                            if (r.attributes) {
                                r.properties = r.attributes;
                            }
                        }
                        // if (r.properties && r.properties.DEVICE_TYPE && (r.properties.DEVICE_TYPE === '2' || r.properties.DEVICE_TYPE === '5' || r.properties.DEVICE_TYPE === '9')) {
                        if (r.properties && r.properties.DEVICE_TYPE && (r.properties.DEVICE_TYPE === '2' || r.properties.DEVICE_TYPE === '9')) {
                            $scope.records.push(r);
                        }
                    });
                    // if ($scope.records.length >= 0) {
                    initMultipleVideo();
                    // }
                } else {
                    //单宫格显示
                    if (!$scope.record.properties) {
                        if ($scope.record.attributes) {
                            $scope.record.properties = $scope.record.attributes;
                        } else {
                            return;
                        }
                    }
                    // if ($scope.record.properties && $scope.record.properties.DEVICE_TYPE && ($scope.record.properties.DEVICE_TYPE === '2' || $scope.record.properties.DEVICE_TYPE === '5' || $scope.record.properties.DEVICE_TYPE === '9')) {
                    if ($scope.record.properties && $scope.record.properties.DEVICE_TYPE && ($scope.record.properties.DEVICE_TYPE === '2' || $scope.record.properties.DEVICE_TYPE === '9')) {
                        initVideo();
                    }
                }
            });

            //*********************实时视频js_start
            var activeX = null;
            var gWndId = 0;
            var nDirect = -1;
            var onIframeLoaded = function() {
                alert('iframeLoaded, activeX 控件所在 iframe 已经加载完成！');
            };

            //初始化数据
            var initData = function() {
                $scope.isLogin = false;
                $scope.isLogining = true;
                el.find('#msgDiv').html('');
                $scope.destroyFun();
                activeX = null;
                gWndId = 0;
                nDirect = -1;
            };

            //显示错误原因
            var showCallRetInfo = function(nRet, strInfo) {
                el.find('#msgDiv').html('');
                if (nRet !== 0) {
                    el.find('#msgDiv').html(strInfo + ': 大华服务器错误描述 = ' + systemConfig.getVideoError().getErrorDesc(activeX.getOcx().DPSDK_GetLastError()));
                    //单宫格显示
                    if (!$scope.record.regionCode) {
                        $scope.setDirects();
                    }
                    return false;
                }
                //单宫格显示
                if (!$scope.record.regionCode) {
                    $scope.setDirects();
                }
                return true;
            };

            //创建
            $scope.createFun = function() {
                if (activeX) {
                    return;
                }
                if (attrs && (attrs['ocxHeight'] || attrs['ocxWidth'])) {
                    if (attrs['ocxHeight']) {
                        el.find('#VD').css('height', attrs['ocxHeight']);
                    }
                    if (attrs['ocxWidth']) {
                        el.find('#VD').css('width', attrs['ocxWidth']);
                    }
                }
                activeX = el.find('#VD').activeX('VD');
                if (attrs && (attrs['ocxHeight'] || attrs['ocxWidth'])) {
                    if (attrs['ocxHeight']) {
                        activeX.setOcxSize(null, attrs['ocxHeight']);
                    }
                    if (attrs['ocxWidth']) {
                        activeX.setOcxSize(attrs['ocxWidth'], null);
                    }
                }
                activeX.load();
                //activeX.bind('iframeLoaded', onIframeLoaded);
            };

            //还原
            $scope.setBroad = function() {
                if (!activeX) {
                    return;
                }
                if (attrs && (attrs['ocxHeight'] || attrs['ocxWidth'])) {
                    activeX.setCurrentOcxSize(attrs['ocxWidth'], attrs['ocxHeight']);
                }
            };

            //设置
            $scope.setFun = function() {
                if (!activeX) {
                    return;
                }
                var nWndCount = '1';
                if ($scope.record.regionCode) {
                    // 可播放多宫格格数1,4,6,8,9,13,16,20,25,36
                    var rl = $scope.records.length;
                    nWndCount = calcWndCount(rl);
                }
                gWndId = activeX.getOcx().DPSDK_CreateSmartWnd(0, 0, 100, 100);
                activeX.getOcx().DPSDK_SetWndCount(gWndId, nWndCount);
                activeX.getOcx().DPSDK_SetSelWnd(gWndId, 0);
            };

            //销毁
            $scope.destroyFun = function() {
                if (!activeX) {
                    return;
                }
                activeX.destroy();
                activeX = null;
            };

            //登录
            $scope.loginFun = function() {
                if (!activeX) {
                    return;
                }
                var szIp = systemConfig.getSystemValue('VIDEO_DH_SERVER_IP') || '10.38.134.157';
                var nPort = systemConfig.getSystemValue('VIDEO_DH_SERVER_PORT') || '9000';
                var szUsername = systemConfig.getSystemValue('VIDEO_DH_SERVER_USERNAME') || 'ly';
                var szPassword = systemConfig.getSystemValue('VIDEO_DH_SERVER_PASSWORD') || 'ly123';
                var b = showCallRetInfo(activeX.getOcx().DPSDK_Login(systemConfig.getSystemValue('VIDEO_DH_SERVER_IP'), nPort, szUsername, szPassword), '登录');
                if (b) {
                    $scope.loadDGroupInfoFun();
                }
                $scope.isLogining = false;
            };

            //登出
            $scope.logoutFun = function() {
                if (!activeX) {
                    return;
                }
                showCallRetInfo(activeX.getOcx().DPSDK_Logout(), '登出');
                $scope.isLogin = false;
            };

            //加载组织架构
            $scope.loadDGroupInfoFun = function() {
                if (!activeX) {
                    return;
                }
                var b = showCallRetInfo(activeX.getOcx().DPSDK_LoadDGroupInfo(), '加载组织架构');
                if (b) {
                    $scope.isLogin = true;
                }
            };

            /**
             * 当前选中窗口播放视频
             * @param isStartSelf 是否播放当前选中窗口（参数只有在多宫格时才有作用）
             */
            $scope.startRealplayByWndNoFun = function(isStartSelf) {
                if (!activeX) {
                    return;
                }
                if (!$scope.record.regionCode) {
                    var r = $scope.record;
                    if (r && r.properties && r.properties.ID) {
                        var szCameraId = r.properties.ID;
                        var nStreamType = '1';
                        var nMediaType = '1';
                        var nTransType = '1';

                        //从0开始
                        var nWndNo = activeX.getOcx().DPSDK_GetSelWnd(gWndId);
                        showCallRetInfo(activeX.getOcx().DPSDK_StartRealplayByWndNo(gWndId, nWndNo, szCameraId, nStreamType, nMediaType, nTransType), '播放');
                    }
                }
                if ($scope.record.regionCode) {
                    if (isStartSelf) {
                        var nWndNo = activeX.getOcx().DPSDK_GetSelWnd(gWndId);
                        if (nWndNo >= 0 && $scope.records && nWndNo <= $scope.records.length - 1) {
                            var r = $scope.records[nWndNo];
                            if (r && r.properties && r.properties.ID) {
                                var szCameraId = r.properties.ID;
                                var nStreamType = '1';
                                var nMediaType = '1';
                                var nTransType = '1';
                                activeX.getOcx().DPSDK_StartRealplayByWndNo(gWndId, nWndNo, szCameraId, nStreamType, nMediaType, nTransType);
                            }
                        }
                    }
                    if (!isStartSelf) {
                        var rs = $scope.records;
                        var nWndNo = 0;
                        var szCameraId;
                        var nStreamType = '1';
                        var nMediaType = '1';
                        var nTransType = '1';
                        _.each(rs, function(r, i) {
                            if (r && r.properties && r.properties.ID) {
                                window.setTimeout(function() {
                                    szCameraId = r.properties.ID;
                                    activeX.getOcx().DPSDK_StartRealplayByWndNo(gWndId, nWndNo, szCameraId, nStreamType, nMediaType, nTransType);
                                    nWndNo++;
                                }, 100 * i);
                            }
                        });
                    }
                }
            };

            /**
             * 关闭当前选中视频
             * @param isStopSelf 是否关闭当前选中窗口（参数只有在多宫格时才有作用）
             */
            $scope.stopRealplayByWndNoFun = function(isStopSelf) {
                if (!activeX) {
                    return;
                }
                if (!$scope.record.regionCode) {
                    var nWndNo = activeX.getOcx().DPSDK_GetSelWnd(gWndId);
                    showCallRetInfo(activeX.getOcx().DPSDK_StopRealplayByWndNo(gWndId, nWndNo), '关闭');
                }
                if ($scope.record.regionCode) {
                    if (isStopSelf) {
                        var nWndNo = activeX.getOcx().DPSDK_GetSelWnd(gWndId);
                        activeX.getOcx().DPSDK_StopRealplayByWndNo(gWndId, nWndNo);
                    }
                    if (!isStopSelf) {
                        var rl = $scope.records.length;
                        var n = calcWndCount(rl);
                        for (var i = 0; i < n; i++) {
                            window.setTimeout(function() {
                                var nWndNo = i;
                                activeX.getOcx().DPSDK_StopRealplayByWndNo(gWndId, nWndNo);
                            }, 100 * i);
                        }
                    }
                }
            };

            //按窗口号抓图
            $scope.capturePictureByWndNoFun = function() {
                if (!activeX) {
                    return;
                }
                var nWndNo = activeX.getOcx().DPSDK_GetSelWnd(gWndId);
                var mydate = new Date();
                var reg = new RegExp(':', 'g');
                var path = 'c:\\dahuaphoto\\' + mydate.toLocaleString().replace(' ', '').replace('年', '').replace('月', '').replace('日', '').replace(reg, '') + '.bmp';
                var b = showCallRetInfo(activeX.getOcx().DPSDK_CapturePictureByWndNo(gWndId, nWndNo, path), '截图');
                if (b) {
                    alert('截图成功，存储路径为：' + path);
                }
            };

            //开始录像
            $scope.startRealRecordByWndNoFun = function() {
                if (!activeX) {
                    return;
                }
                var nWndNo = activeX.getOcx().DPSDK_GetSelWnd(gWndId);
                var mydate = new Date();
                var reg = new RegExp(':', 'g');
                var path = 'c:\\dahuavideo\\' + mydate.toLocaleString().replace(' ', '').replace('年', '').replace('月', '').replace('日', '').replace(reg, '') + '.dav';
                var b = showCallRetInfo(activeX.getOcx().DPSDK_StartRealRecordByWndNo(gWndId, nWndNo, path), '开始录像');
                if (b) {
                    $scope.isVideoing = true;
                    alert('开始录像，存储路径为：' + path);
                }
            };

            //停止录像
            $scope.stopRealRecordByWndNoFun = function() {
                var nWndNo = activeX.getOcx().DPSDK_GetSelWnd(gWndId);
                var b = showCallRetInfo(activeX.getOcx().DPSDK_StopRealRecordByWndNo(gWndId, nWndNo), '结束录像');
                if (b) {
                    $scope.isVideoing = false;
                    alert('成功停止录像！');
                }
            };

            //开始方向控制，1上，2下，3左，4右，5左上，6左下，7右上，8右下
            $scope.ptzDirection_start = function(nDirects) {
                if (!activeX) {
                    return;
                }
                if ($scope.record && $scope.record.properties && $scope.record.properties.ID) {
                    var szCameraId = $scope.record.properties.ID;
                    nDirect = nDirects;

                    //步长1~8，8最快
                    var nStep = '4';
                    showCallRetInfo(activeX.getOcx().DPSDK_PtzDirection(szCameraId, nDirect, nStep, 0), '开始方向控制');
                }
            };

            //停止方向控制
            $scope.ptzDirection_stop = function() {
                if (!activeX) {
                    return;
                }
                if ($scope.record && $scope.record.properties && $scope.record.properties.ID) {
                    var szCameraId = $scope.record.properties.ID;

                    //步长1~8，8最快
                    var nStep = '4';
                    showCallRetInfo(activeX.getOcx().DPSDK_PtzDirection(szCameraId, nDirect, nStep, 1), '停止方向控制');
                }
            };

            //开始镜头控制，0变倍+，1变焦+，2光圈+，3变倍-，4变焦-，5光圈-
            $scope.ptzCameraOperation_start = function(nOpers) {
                if (!activeX) {
                    return;
                }
                if ($scope.record && $scope.record.properties && $scope.record.properties.ID) {
                    var szCameraId = $scope.record.properties.ID;
                    nOper = nOpers;

                    //步长1~8，8最快
                    var nStep = '4';
                    var b = showCallRetInfo(activeX.getOcx().DPSDK_PtzCameraOperation(szCameraId, nOper, nStep, 0), '开始镜头控制');
                    if (b) {
                        stFun();
                    }
                }
            };

            //停止镜头控制
            $scope.ptzCameraOperation_stop = function() {
                if (!activeX) {
                    return;
                }
                if ($scope.record && $scope.record.properties && $scope.record.properties.ID) {
                    var szCameraId = $scope.record.properties.ID;

                    //步长1~8，8最快
                    var nStep = '4';
                    var b = showCallRetInfo(activeX.getOcx().DPSDK_PtzCameraOperation(szCameraId, nOper, nStep, 1), '停止镜头控制');
                    st = null;
                }
            };

            // $('#reload').click(function() {
            // if (!activeX)
            // return;
            // activeX.reload();
            // });
            //*******************实时视频js_end

            //*******************云台控制_start
            //**********变焦_start
            var st = null;
            var stFun = function() {
                //console.log('停止变焦');
                st = null;
                st = setTimeout(function() {
                    $scope.ptzCameraOperation_stop();
                }, 1000);
            };

            //镜头控制，0变倍+，1变焦+，2光圈+，3变倍-，4变焦-，5光圈-
            var VDMouseWheelFun = function(event) {
                if (st) {
                    clearTimeout(st);
                    stFun();
                    return;
                }
                var e = event;
                if (e && e.wheelDelta) {
                    //IE下，上120拉远，下-120拉近
                    if (e.wheelDelta > 0) {
                        //console.log('拉远');
                        $scope.ptzCameraOperation_start('3');
                    }
                    if (e.wheelDelta < 0) {
                        //console.log('拉近');
                        $scope.ptzCameraOperation_start('0');
                    }
                }
            };
            //**********变焦_end

            //**********全屏_start
            var VDFullScreenFun = function() {
                $scope.modal();
            };

            $scope.modal = function() {
                var modalInstance = Modal('./Jq-video-full', {'activeX' : activeX});
                modalInstance.result.then(function() {
                    $scope.move2current();
                }, function() {
                    $scope.move2current();
                }); 
            };

            //还原
            $scope.move2current = function() {
                activeX.move2current();
                $scope.setBroad();
            };
            //**********全屏_end

            $scope.setDirects = function() {
                var div4VD = el.find('#VD').find('iframe')[0];
                var divLeft4VD = div4VD.offsetLeft;
                var divyTop4VD = div4VD.offsetTop;
                var divWidth4VD = div4VD.offsetWidth;
                var divHeight4VD = div4VD.offsetHeight;

                /*console.log('div4VD:' + div4VD);
                 console.log('divLeft4VD:' + divLeft4VD);
                 console.log('divyTop4VD:' + divyTop4VD);
                 console.log('divWidth4VD:' + divWidth4VD);
                 console.log('divHeight4VD:' + divHeight4VD);*/

                var up_left = divLeft4VD + divWidth4VD / 2 - 15;
                var up_top = divyTop4VD;
                el.find('#upfrm').css('position', 'absolute').css('left', up_left + 'px').css('top', up_top + 'px');
                el.find('#updiv').css('position', 'absolute').css('left', up_left + 'px').css('top', up_top + 'px');

                var dowm_left = divLeft4VD + divWidth4VD / 2 - 15;
                var dowm_top = divyTop4VD + divHeight4VD - 30;
                el.find('#downfrm').css('position', 'absolute').css('left', dowm_left + 'px').css('top', dowm_top + 'px');
                el.find('#downdiv').css('position', 'absolute').css('left', dowm_left + 'px').css('top', dowm_top + 'px');

                var left_left = divLeft4VD;
                var left_top = divyTop4VD + divHeight4VD / 2 - 15;
                el.find('#leftfrm').css('position', 'absolute').css('left', left_left + 'px').css('top', left_top + 'px');
                el.find('#leftdiv').css('position', 'absolute').css('left', left_left + 'px').css('top', left_top + 'px');

                var right_left = divLeft4VD + divWidth4VD - 30;
                var right_top = divyTop4VD + divHeight4VD / 2 - 15;
                el.find('#rightfrm').css('position', 'absolute').css('left', right_left + 'px').css('top', right_top + 'px');
                el.find('#rightdiv').css('position', 'absolute').css('left', right_left + 'px').css('top', right_top + 'px');

                var middle_left = divLeft4VD + divWidth4VD / 2 - 15;
                var middle_top = divyTop4VD + divHeight4VD / 2 - 15;
                el.find('#middlefrm').css('position', 'absolute').css('left', middle_left + 'px').css('top', middle_top + 'px');
                el.find('#middlediv').css('position', 'absolute').css('left', middle_left + 'px').css('top', middle_top + 'px');

                // var rightup_top = divyTop4VD;
                // var rightup_left = divLeft4VD + divWidth4VD - 30;
                // el.find('#rightupfrm').css('position', 'absolute').css('left', rightup_left + 'px').css('top', rightup_top + 'px');
                // el.find('#rightupdiv').css('position', 'absolute').css('left', rightup_left + 'px').css('top', rightup_top + 'px');

                //注册滚轮事件
                var registerMouseWheel = function() {
                    var ifDoc;
                    var iFrameDoc = el.find('#VD').find('iframe')[0];;
                    ifDoc = (iFrameDoc.contentWindow) ? iFrameDoc.contentWindow.document : ((iFrameDoc.contentDocument.document) ? iFrameDoc.contentDocument.document : iFrameDoc.contentDocument);
                    ifDoc.detachEvent('onmousewheel', VDMouseWheelFun);
                    ifDoc.attachEvent('onmousewheel', VDMouseWheelFun);
                };

                //注销滚轮事件
                var cancelMouseWheel = function() {
                    var ifDoc;
                    var iFrameDoc = el.find('#VD').find('iframe')[0];;
                    ifDoc = (iFrameDoc.contentWindow) ? iFrameDoc.contentWindow.document : ((iFrameDoc.contentDocument.document) ? iFrameDoc.contentDocument.document : iFrameDoc.contentDocument);
                    ifDoc.detachEvent('onmousewheel', VDMouseWheelFun);
                };

                var VDMouseOverFun = function() {
                    el.find('#upfrm').show();
                    el.find('#updiv').show();
                    el.find('#downfrm').show();
                    el.find('#downdiv').show();
                    el.find('#leftfrm').show();
                    el.find('#leftdiv').show();
                    el.find('#rightfrm').show();
                    el.find('#rightdiv').show();
                    // el.find('#middlefrm').show();
                    // el.find('#middlediv').show();
                    // el.find('#rightupfrm').show();
                    // el.find('#rightupdiv').show();

                    //注册滚轮事件
                    //console.log('注册滚轮事件');
                    registerMouseWheel();
                };

                var VDMouseLeaveFun = function(event) {
                    var x = event.clientX;
                    var y = event.clientY;

                    var div4up = el.find('#updiv')[0].getBoundingClientRect();
                    var divy14up = div4up.top;

                    var div4dowm = el.find('#downdiv')[0].getBoundingClientRect();
                    var divy24dowm = div4dowm.bottom;

                    var div4left = el.find('#leftdiv')[0].getBoundingClientRect();
                    var divx14left = div4left.left;

                    var div4right = el.find('#rightdiv')[0].getBoundingClientRect();
                    var divx24right = div4right.right;

                    /*console.log('VDMouseLeaveFun');
                     console.log('y:' + y);
                     console.log('x:' + x);
                     console.log('divy14up:' + divy14up);
                     console.log('divy24dowm:' + divy24dowm);
                     console.log('divx14left:' + divx14left);
                     console.log('divx24right:' + divx24right);
                     console.log((y <= divy14up) || (y >= divy24dowm) || (x <= divx14left) || (x >= divx24right));*/

                    if ((y <= divy14up) || (y >= divy24dowm) || (x <= divx14left) || (x >= divx24right)) {
                        el.find('#upfrm').hide();
                        el.find('#updiv').hide();
                        el.find('#downfrm').hide();
                        el.find('#downdiv').hide();
                        el.find('#leftfrm').hide();
                        el.find('#leftdiv').hide();
                        el.find('#rightfrm').hide();
                        el.find('#rightdiv').hide();
                        // el.find('#middlefrm').hide();
                        // el.find('#middlediv').hide();
                        // el.find('#rightupfrm').hide();
                        // el.find('#rightupdiv').hide();
                    }

                    //注销滚轮事件
                    cancelMouseWheel();
                };

                var divMouseLeaveFun = function(event) {
                    var x = event.clientX;
                    var y = event.clientY;

                    var div4up = el.find('#updiv')[0].getBoundingClientRect();
                    var divy14up = div4up.top;

                    var div4dowm = el.find('#downdiv')[0].getBoundingClientRect();
                    var divy24dowm = div4dowm.bottom;

                    var div4left = el.find('#leftdiv')[0].getBoundingClientRect();
                    var divx14left = div4left.left;

                    var div4right = el.find('#rightdiv')[0].getBoundingClientRect();
                    var divx24right = div4right.right;

                    /*console.log('divMouseLeaveFun');
                     console.log('y:' + y);
                     console.log('x:' + x);
                     console.log('divy14up:' + divy14up);
                     console.log('divy24dowm:' + divy24dowm);
                     console.log('divx14left:' + divx14left);
                     console.log('divx24right:' + divx24right);
                     console.log((y <= divy14up) || (y >= divy24dowm) || (x <= divx14left) || (x >= divx24right));*/

                    if ((y <= divy14up) || (y >= divy24dowm) || (x <= divx14left) || (x >= divx24right)) {
                        el.find('#upfrm').hide();
                        el.find('#updiv').hide();
                        el.find('#downfrm').hide();
                        el.find('#downdiv').hide();
                        el.find('#leftfrm').hide();
                        el.find('#leftdiv').hide();
                        el.find('#rightfrm').hide();
                        el.find('#rightdiv').hide();
                        // el.find('#middlefrm').hide();
                        // el.find('#middlediv').hide();
                        // el.find('#rightupfrm').hide();
                        // el.find('#rightupdiv').hide();
                    }
                };

                //方向控制，1上，2下，3左，4右，5左上，6左下，7右上，8右下
                var imgMousedownFun = function(data) {
                    // console.log('down_start');
                    // console.log('nDirect:' + data.data);
                    // console.log('nDirect:' + JSON.stringify(nDirect));
                    $scope.ptzDirection_start(data.data);
                };

                var imgMouseupFun = function() {
                    // console.log('up_end');
                    $scope.ptzDirection_stop();
                };

                el.find('#VD').bind('mouseover', VDMouseOverFun);
                el.find('#VD').bind('mouseleave', VDMouseLeaveFun);
                el.find('#updiv').bind('mouseleave', divMouseLeaveFun);
                el.find('#downdiv').bind('mouseleave', divMouseLeaveFun);
                el.find('#leftdiv').bind('mouseleave', divMouseLeaveFun);
                el.find('#rightdiv').bind('mouseleave', divMouseLeaveFun);
                // el.find('#rightupdiv').bind('mouseleave', divMouseLeaveFun);
                el.find('#updiv').find('img').unbind('mousedown').bind('mousedown', '1', imgMousedownFun);
                el.find('#updiv').find('img').unbind('mouseup').bind('mouseup', imgMouseupFun);
                el.find('#downdiv').find('img').unbind('mousedown').bind('mousedown', '2', imgMousedownFun);
                el.find('#downdiv').find('img').unbind('mouseup').bind('mouseup', imgMouseupFun);
                el.find('#leftdiv').find('img').unbind('mousedown').bind('mousedown', '3', imgMousedownFun);
                el.find('#leftdiv').find('img').unbind('mouseup').bind('mouseup', imgMouseupFun);
                el.find('#rightdiv').find('img').unbind('mousedown').bind('mousedown', '4', imgMousedownFun);
                el.find('#rightdiv').find('img').unbind('mouseup').bind('mouseup', imgMouseupFun);
                // el.find('#middlediv').find('img').unbind('click').bind('click', imgMouseupFun);
                // el.find('#rightupdiv').find('img').unbind('click').bind('click', VDFullScreenFun);
            };
            //*******************云台控制_end

            $rootScope.$on('direction-refresh', function() {
                if(activeX) {
                    setTimeout(function() {
                        $scope.setDirects();
                    }, 1500);
                }
            });

            //销毁scope时清除资源
            $scope.$on('$destroy', function() {
                $scope.destroyFun();
            });

        };

        return {
            restrict : 'EA',
            link : linker,
            scope : {
                record : '=data'
            },
            transclude : true,
            templateUrl : 'app/$directives/jq-video.html'
        };
    }];

});
