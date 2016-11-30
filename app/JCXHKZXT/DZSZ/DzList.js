define(function (require, exports, module) {
    var controller = ['Modal', '$scope', 'Query', 'DictCache','$location', 'Restangular','LocationMonitor', '$http','Modal','$state',
        function (Modal, $scope, Query,DictCache, $location,Rest,LocationMonitor,$http,Modal,$state) {

        $scope.showAddModal = function(){
            Modal('DzNew');
        };
        
        //新建
        $scope.add = function(){
          var modalInstance = Modal('DzNew');
            modalInstance.result.then(function(data){
              console.log(data);
              data.port = data.port.code;
              var index = $scope.records.length+1
              data.name = "灯组"+ index;
              data.isMain = 0;
              $scope.records.push(data);
            });
        };
        
        $scope.remove = function(){
            
            var r = [];
            for(var i = 0, size = $scope.checks.length; i < size; i++){
                if($scope.checks[i]){
                    r.push($scope.records[i].id);/*注意*/
                }
            }

            var ids = r.join(',');

            var bool = false;
            if(r.length===0){
                alert('请选择需要删除的记录!');
            }else{
                bool = confirm('确认删除这 '+ r.length + ' 条记录吗?');
            }

            if(!bool) return;

            var size = $scope.checks.length;
            for(var i = size; i>=0; i--){
                if($scope.checks[i]){
                    $scope.records.splice(i,1);
                }
            }
            initCheck(false, $scope.records.length);
        };
        
        $scope.Q = Query.data();

        // 全选功能
        $scope.checks = [];
        $scope.allChecked = true;

        $scope.select = function(index){
            $scope.checks[index] = !$scope.checks[index];
            $scope.allChecked = _.every($scope.checks);
        };

        $scope.selectAll = function(){
            initCheck($scope.allChecked,$scope.records.length);
        };

        //初始化
        var initCheck = function(bool,num){
            var checks = [];
            for(var i = 0; i < num; i++){
                checks.push(bool);
            }
            $scope.checks = checks;
        };

        // 查询功能
        var _query = function(){
            var q = $scope.Q.query();

            $scope.allChecked = false;
            
            $http.get("app/JCXHKZXT/DZSZ/dzList.json").success(function(data) {
                $scope.total = data.length;
                $scope.records = data;
            });
        };

        _query();

        $scope.pChange = function(page){
            $scope.Q.page = page;
            _query();
        };

        $scope.query = function(){
            $scope.pChange(1);
        };

        //表单/地图切换
        $scope.viewChange = function(dev) {
            var origin = angular.copy(dev);
            var record = {"id":"302","no":"2149624@009@001$1$0$0","name":"110指挥中心4","type":{"code":"2","name":"视频摄像机"},"factory":{"code":null,"name":null},"factoryPhone":null,"mode":{"code":null,"name":null},"address":"192.168.28.213","lng":117.22726465921,"lat":34.264706917209,"buildTime":null,"startTime":null,"manageDeptCode":"320300000000","belongRoad":null,"builder":null,"maintain":null,"phone":null,"status":{"code":"1","name":"正常"},"imgUrl":null,"comModel":{"code":null,"name":null},"comUrl":null,"useStatus":{"code":null,"name":null},"lineMaintain":null,"remark":null,"roadTrend":null,"pointType":null,"contactPerson":null,"pointNature":null,"imgPath1":null,"imgPath2":null,"localityCode":null,"cmsType":null,"ip":"192.168.28.213","port":null,"height":null,"width":null,"connected":null,"updateTime":null};
            Modal('./Locator', record).result.then(function(){
                if(origin.lng === record.lng &&　origin.lat === record.lat) return
                Rest.all('').one('deviceNew',record.id).doPUT(record).then(function (data){
                    if(!data.success){
                       Messenger().post({
                            message: '更新设备'+ dev.name + '经纬度失败',
                            type: 'error',
                            showCloseButton: true
                       });
                      return
                    }
                     Messenger().post({message:  '成功更新设备'+ dev.name + '经纬度',type: 'success',showCloseButton: true });
                });
            });
        };

        $scope.infoModal = function(record){
            $scope.checkRecord = record;
            $('#infoModal').modal();
        };
        
        $scope.psfa = function(record){
        	$state.go('PSFA/View',{'name':record.name})
        };

            $scope.testCt = function(){

                var r = [];
                for(var i = 0, size = $scope.checks.length; i < size; i++){
                    if($scope.checks[i]){
                        r.push($scope.records[i].id);/*注意*/
                    }
                }
                var ids = r.join(',');

                var bool = false;
                if(r.length===0){
                    alert('请选择需要检测的记录!');
                    return;
                }
                $location.path("/JCXHKZXT.CT.CtView");
            };


        }];

    module.exports = controller;
});