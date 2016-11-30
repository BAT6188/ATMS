define(function (require, exports, module) {
    var controller = ['$scope', '$modal', 'Modal', 'DictCache', 'Message', 'Query', 'VehicleQuery', '$filter',
     function ($scope, $modal, Modal, DictCache, Message, Query, VehicleQuery, $filter) {
        //号牌颜色
        DictCache("PLATE_COLOR", function(dict){
            $scope.plateColors = dict;
        }, true);
        
        $scope.Q = Query.data();
        $scope.Q.startDate = $filter('date')(new Date(), 'yyyy-MM-dd 00:00:00');
        $scope.Q.endDate = $filter('date')(new Date(), 'yyyy-MM-dd 23:59:59');
        // 全选功能
        $scope.checks = [];

        $scope.select = function(index){
            $scope.checks[index] = !$scope.checks[index];
            $scope.allChecked = _.every($scope.checks);
        };

        var initCheck = function(bool){
            var checks = [];
            for(var i = 0; i < $scope.total; i++){
                checks.push(bool);
            }
            $scope.checks = checks;
        };

        $scope.selectAll = function(){
          $scope.allChecked = !$scope.allChecked;
          initCheck($scope.allChecked);
        }

        // 查询功能
        var _query = function(){
            var q = $scope.Q.query();

            $scope.allChecked = false;
            if(!$scope.Q.startDate || !$scope.Q.endDate){
                alert('请选择时间段!');
            }
            VehicleQuery.query(q, function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                $scope.total = data.total;
                $scope.records = data.results;
                initCheck(false);
            });

        };

        $scope.pChange = function(page){
            $scope.Q.page = page;
            _query();
        };

        $scope.query = function(){
            $scope.pChange(1);
        };

        $scope.pressEntry = function(event){
            if(event.which === 13){
                $scope.query();
            }
        };
        
        //导出数据
        $scope.exportData = function(){
          var q = $scope.Q.query();

            VehicleQuery.exportData(q, function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                var file=data.results;
                window.location = "trafficRecord/downloaddata.do?fileName="+file;
            });
        };
        
        //导出图片
        $scope.exportImg = function(){
          var q = $scope.Q.query();

            VehicleQuery.exportImg(q, function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                var file=data.results;
                window.location = "trafficRecord/downloaddata.do?fileName="+file;
            });
        };
        
        
        //查看详情
        $scope.infoModal = function(record){
          $scope.id = record.id;
          Modal('TrafficRecordDetail', $scope);
          return;    
        };
        
        $scope.entity = {};
        //打开智能查询菜单
        $scope.smartQuery = function() {
          Modal('SmartQuery', $scope).result
          .then(function(data){
              $scope.checkedNodes = data.checkedNodes;
              $scope.entity = data.entity;
              if(data.total && data.records){
                $scope.total = data.total;
                  $scope.records = data.records.slice(0, 9);
              }
          });
          return;
        };

    }];

    module.exports = controller;
});