define(function (require, exports, module) {
    var controller = ['Modal', '$scope', 'Query', 'Plan', '$location', 'Restangular', '$routeParams','$rootScope',
        function (Modal, $scope, Query, Plan, $location, Rest, $routeParams,$rootScope) {
            $scope.cmsId = $routeParams.id;
            $scope.cmsName = $routeParams.name;

            $scope.status = [{
                label : '畅通',
                value : 1,
                cls : 'success'
            },{
                label : '正常',
                value : 3,
                cls : 'warning'
            },{
                label : '拥堵',
                value : 4,
                cls : 'danger'
            }];

            $scope.youdao = [];
            $scope.youdao.length = 0;
            //图片路径后半段
            $scope.picUrl = "";
            //持续时间默认为5分钟
            $scope.overdueMin = 5;
            //显示时长默认为5秒
            $scope.stayTimeSec = 5;

            $scope.changeStatus = function(record,status) {
                $scope.sta = status;
                Rest.all('').one('flow').post('rsState', {
                    roadSectionId : record.roadSectionId, //$scope.data.attributes.OBJECTID,990313327
                   // overdueMin : $scope.overdueMin || 0,
                    overdueMin : 0,
                    state : status.value - 0
                }).then(function(data) {
                    $scope.youdao = data.results;
                    window.setTimeout(function() {
                        picYoudao($scope.youdao);
                    }, 100);
                });
                _query();
            };


            $scope.changeStatus1 = function(overdueMin){

            }

            $scope.changeStayTime = function(stayTimeSec){

                $scope.stayTimeSec = stayTimeSec;
            };


            $scope.Q = Query.data();

            $scope.Q.cmsId = $routeParams.id;
            $scope.Q.cmsName = $routeParams.name;
            // 查询功能
            var _query = function () {
                var q = $scope.Q.query();
                Rest.all('relation/list').post(q).then(function (data) {
                    if (!data.success) {
                        alert(data.msg);
                        return;
                    }
                    $scope.total = data.total;
                    $scope.records = data.results;
                    for(i=0;i<$scope.records.length;i++){
                        if($scope.records[i].state == '2'){
                            $scope.records[i].state = '1';
                        }
                    }
                    //初始化诱导屏插件
                    $scope.data2 = {ID: $scope.Q.cmsId, attributes: {DEVICE_TYPE: '3', IP:$scope.records[0].ip, PORT:$scope.records[0].port, WIDTH: 200, HEIGHT: 200}};
                    //图片查询
                    var path;
                    var prefix = systemConfig.getSystemValue('VMS_PREFIX_URL');
                    path = prefix + "/"+$scope.records[0].picUrl;
                    $scope.picUrl = $scope.records[0].picUrl;
                    document.getElementById("cmsPic").innerHTML = "";
                    if (path.length >= 10) {
                        document.getElementById("cmsPic").innerHTML = "<img width='340px' height='280px' style='position: absolute;vertical-align:middle;left: 25px; border:0;' src='" + path + "'/>";
                    }
                });

            };

            _query();

            $scope.pChange = function (page) {
                $scope.Q.page = page;
                _query();
            };
            $scope.query = function () {

                $scope.pChange(1);
            };

            //发布
            $scope.release = function (){

                //图片地址
                var path;
                var prefix = systemConfig.getSystemValue('VMS_PIC_URL');
                path = prefix + "/"+$scope.picUrl;
                 //时间设置
                var myDate = new Date();
                var startdate=myDate.getTime()/1000;
                var enddate= startdate+$scope.overdueMin*60;
                var sMM = myDate.getMonth()+1; //截取月
                var sdd = myDate.getDate(); //截取日
                var shh = myDate.getHours(); //截取小时
                var smm = myDate.getMinutes(); //截取分钟

                var isSuc = $scope.activeX.getOcx().updateMsg(0, 0, path,'楷体_GB2312','20',65280,1,$scope.stayTimeSec,4,startdate,enddate,0);
                if(isSuc){
                    isSuc = $scope.activeX.getOcx().releaseMsg();
                    $scope.msgAry = JSON.parse($scope.activeX.getOcx().getAllMsg());
                    $scope.start = $scope.msgAry[0].StartMon+"-"+$scope.msgAry[0].StartDay+" "+ $scope.msgAry[0].StartHour+':'+$scope.msgAry[0].StartMinute ;
                    $scope.end = $scope.msgAry[0].EndMon+"-"+$scope.msgAry[0].EndDay+" "+ $scope.msgAry[0].EndHour+':'+$scope.msgAry[0].EndMinute ;

                    var flag = (sMM == $scope.msgAry[0].StartMon && sdd == $scope.msgAry[0].StartDay && shh == $scope.msgAry[0].StartHour && smm == $scope.msgAry[0].StartMinute);

                    if(flag)
                    {
                        Messenger().post({message: '发布成功',type: 'success',showCloseButton: true });
                    }
                    $scope.ShowTime = true;
                }
                else{
                    Messenger().post({
                        message: '发布失败',
                        type: 'error',
                        showCloseButton: true
                    });
                }
            }
            //取消发布
            $scope.cancel = function (){

                //图片地址
                var path;
                var prefix = systemConfig.getSystemValue('VMS_PIC_URL');
                path = prefix + "/"+'1.jpg';
                //时间设置
                //var myDate = new Date();
                //$scope.startdate=myDate.getTime()/1000;
                //$scope.enddate= $scope.startdate+$scope.overdueMin*60;
                var isSuc = $scope.activeX.getOcx().updateMsg(0, 0, path,'楷体_GB2312','20',65280,1,$scope.stayTimeSec,4,$scope.startdate,$scope.enddate,0);
                if(isSuc){
                    isSuc = $scope.activeX.getOcx().releaseMsg();
                    Messenger().post({message: '取消发布成功',type: 'success',showCloseButton: true });
                }
                else{
                    Messenger().post({
                        message: '取消发布失败',
                        type: 'error',
                        showCloseButton: true
                    });
                }
                $scope.ShowTime = false;
            }

            //初始化诱导屏参数

            $scope.inityoudao = function () {
                //根据cmsid请求cms参数
                Rest.all('cms/list').post($scope.cmsId).then(function (data) {
                    if (!data.success) {
                        alert(data.msg);
                        return;
                    }
                    $scope.total = data.total;
                    $scope.cmsinfo = data.results;
                });

                $scope.data2 = {ID: $scope.cmsId, attributes: {DEVICE_TYPE: '3', IP:$scope.cmsinfo.ip, PORT:$scope.cmsinfo.port, WIDTH: $scope.cmsinfo.weight, HEIGHT: $scope.cmsinfo.height}};
            }


            $rootScope.$on('road-tip:loadScreen', function(e, activeX) {
                if (!activeX) {
                    return;
                }
                $scope.activeX = activeX;
                $scope.isReady = true;
            });

            var picYoudao = function(yds) {
                if (!yds | yds.length === 0) {
                    return;
                }
                _.each(yds, function(one) {
                    $scope.data2 = {ID:one.id,attributes:{DEVICE_TYPE:'3',IP:one.ip,PORT:one.port,WIDTH:12,HEIGHT:11}};
                    $scope.isReady = false;
                    var path = one.picUrl;
                    var prefix = systemConfig.getSystemValue('VMS_PREFIX_URL');
                    path = prefix + path.substring(path.lastIndexOf('/'));
                  $scope.picUrl = path.substring(path.lastIndexOf('/'));
                    if (one.id == $scope.cmsId) {
                        var ydid = "" + one.id;
                        document.getElementById("cmsPic").innerHTML = "";
                        if (path.length >= 10) {
                            document.getElementById("cmsPic").innerHTML = "<img width='340px' height='280px' style='position: absolute;vertical-align:middle;left: 25px; border:0;' src='" + path + "'/>";
                        }
                    }
                });
            };

        }];
    module.exports = controller;
});