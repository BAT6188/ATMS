define(function (require, exports, module) {
    var controller = ['$scope', 'Query', '$routeParams', 'DictCache','PoliceCar','Device',
        function ($scope, Query, $routeParams ,DictCache ,PoliceCar,Device) {
        $scope.Q = Query.data();
        $scope.Q.equipId = $routeParams.id;
         
        $scope.records = [];
        $scope.editable = false;

        $scope.init = function(){
            //请求就警车车信息
            PoliceCar.get({id:$routeParams.id}, function(data){
                if(!data.success){
                    alert(data.msg);
                    return;
                }
                $scope.device = data.results;
            });
            //请求警车领用历史信息
            _query();

            var q1 = $scope.Q.query();
            q1.typeCode = '7';
            Device.query(q1, function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                $scope.gps = data.results;
            });
            
            var q2 = $scope.Q.query();
            q2.typeCode = '8';
            Device.query(q2, function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                $scope.videos = data.results;
            });

            var q3 = $scope.Q.query();
            q3.typeCode = '10';
            Device.query(q3, function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                $scope.radios = data.results;
            });
        };


        //警用装备仓库
        DictCache("0032", function(dict){
            $scope.wareHouses = dict;
        });
        //警用装备leixing
        DictCache("0031", function(dict){
            $scope.types = dict;
        });
         //警用装备leixing
        DictCache("0035", function(dict){
            $scope.statuss = dict;
        });
        //切换查询方式
        $scope.advance = function(){
            $scope.showAdvance = !$scope.showAdvance;
            $scope.Q.startOwnTime = null
            $scope.Q.endOwnTime = null;
        };

        $scope.query = function(){
            _query();
        };

        // 查询功能
        var _query = function(){
            var q = $scope.Q.query();

            $scope.allChecked = false;

            PoliceCar.records(q, function(data){
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

        //派车
        $scope.distribute = function(){
           $("#dispatchModal").modal();
        };

        //领用
        $scope.saveDispatch = function(){
            $scope.newRecord.equipId = $scope.device.id;
            PoliceCar.changeState($scope.newRecord, function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                //重新请求警车信息
                //重新请求警车领用信息
                $scope.init();
                //清空 $scope.newRecord
                $scope.newRecord = {};
                $("#dispatchModal").modal('hide');
            });

        };

        //归还
        $scope.returnEquip = function(){
            console.log($scope.newRecord);
            PoliceCar.returnEquip({equipId:$scope.device.id}, function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                //重新请求警车信息
                //重新请求警车领用信息
                $scope.init();
                //清空 $scope.newRecord
                $scope.newRecord = {};
            });
        };
        
        //保存基本信息
        $scope.saveInfo = function(){
            PoliceCar.update($scope.device, 
                function(data){
                    if(!data.success){
                      alert(data.msg);
                      return;
                    }
                    alert('修改成功!');
                    $scope.editable = false;
                });
        };
        $scope.init();

    }];

    module.exports = controller;
});