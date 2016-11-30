define(function (require, exports, module) {
    var controller = ['$scope','Restangular' ,'Query', 'DeviceStatus', 'DictCache','DeviceRepair', 'Device',
        function ($scope,Rest, Query, DeviceStatus,DictCache,DeviceRepair,Device) {
        $scope.showAdvance = false;

        $scope.Q = Query.data();
        $scope.Q.statusCode = '2';
        // 全选功能
        $scope.checks = [];

        $scope.allChecks = false;

        //设备类型字典
        DictCache("0001", function(dict){
            $scope.deviceTypes = dict;
        },true);
        //设备状态
        DictCache("0005", function(dict){
            $scope.deviceStatus = dict;
        },true);
        //报修类型类型字典
        DictCache("0010", function(dict){
            $scope.repairTypes = dict;
            for(var i = 0 ; i< $scope.repairTypes.length;i++){
                if($scope.repairTypes[i].code === '1'){
                    $scope.repairTypes.splice(i,1);
                    return;
                }
            }
            console.log($scope.repairTypes.length);
        });
        //切换查询方式
        $scope.advance = function(){
            $scope.showAdvance = !$scope.showAdvance;
            //$scope.Q.name = null;
            $scope.Q.statusCode = null;
            $scope.Q.typeCode = null;
            $scope.Q.startPollingTime = null
            $scope.Q.endPollingTime = null;
        };

        // 查询功能
        var _query = function(){
            var q = $scope.Q.query();

            DeviceStatus.realTime(q, function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                $scope.total = data.total;
                $scope.records = data.results;
            });

        };

        $scope.pChange = function(page){
            $scope.Q.page = page;
            _query();
        };

        $scope.query = function(){
            $scope.pChange(1);
        };
        
        $scope.infoModal = function(statusRecord){
          Device.get({id: statusRecord.id}, function(data){
                if(!data.success){
                    alert(data.msg);
                    return;
                }
                $scope.checkRecord = angular.copy(data.results);
                $('#infoModal').modal();
            });
        };
        
        //快捷报修
        $scope.quickRepair = function(record){
            $scope.quickshotName = record.name;
            $scope.repairObj = record;
            $scope.quickshot={
                type:{code:'1',name:'快捷报修'},
                repairs:[{'deviceId':record.id,'deviceStatus':{code:'6',name:'已申报'}}],
                repairClass: record.type
            };
            $('#quickModal').modal();
        };
        //申请报修
        $scope.applyRepair = function(record){
            $scope.applyName = record.name;
            $scope.repairObj = record;
            $scope.apply={
                repairs:[{'deviceId':record.id,'deviceStatus':{code:'6',name:'已申报'}}],
                repairClass: record.type 
            };
            $('#applyModal').modal();
        };

        //保存快速报修单
        $scope.saveQuick = function(){
            DeviceRepair.save($scope.quickshot, 
              function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                alert('添加成功!');

                $scope.repairObj.status = {code:'6',name:'已申报'};

/*                $scope.repairObj.status = {code:'3',name:'维修中'};                                             
                Rest.all('devStatusRec').post($scope.repairObj).then(function(data){
                    if(data.success){
                        $scope.repairObj = data.results;
                        alert('更新设备成功!');
                    }
                });*/
                $('#quickModal').modal('hide');
              });
        };

        //保存申请报修单
        $scope.saveApply = function(){
             DeviceRepair.save($scope.apply, 
              function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                alert('添加成功!');
                $scope.repairObj.status ={code:'6',name:'已申报'};
                /*Rest.all('devStatusRec').post($scope.repairObj).then(function(){
                    if(data.success){
                        $scope.repairObj = data.results;
                        alert('更新设备成功!');
                    }
                });*/
                $('#applyModal').modal('hide');
              });
        };

        _query();
    }];

    module.exports = controller;
});