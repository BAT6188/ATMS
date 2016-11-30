define(function () {'use strict';
  return ['$scope', 'Modal', 'ngTableParams', 'Restangular', 'param', '$modalInstance', function($scope, Modal, ngTableParams, Restangular, param, $modalInstance){
    
    window.setTimeout(function(){
          $('.modal-dialog').width(850);
      });
    
    //处理标记
    $scope.statuses = [{'name':'未处理', 'code':0}, {'name':'已处理', 'code':1}];
    
    $scope.record = param.record;
    $scope.entity = {};
    $scope.entity.status = '';
    
    $scope.tableParams = new ngTableParams($scope.tableParameters, {
      counts: [],
            getData: function ($defer, params) {
                var queryParams = {
                    dispId: param.record.dispId,
                  alarmStartTime: $scope.entity.startDate===null ? '':$scope.entity.startDate,
                  alarmEndTime: $scope.entity.endDate===null ? '':$scope.entity.endDate,
                  mark: $scope.entity.status===null ? '':$scope.entity.status,
                    page: params.page(),
                    limit: params.count(),
                    total:params.total()
                };
                Restangular.all('alarm/list').post(queryParams).then(function (data) {
                    params.total(data.total);
                    $scope.records = data.results;
                    $defer.resolve(data.results);
                });
            }
        });
    
    //查询
    $scope.query = function(){
            if($scope.tableParams.page() === 1){
                $scope.tableParams.reload();
            }else{
                $scope.tableParams.page(1);
            }
        };
    
        //查看详情
    $scope.alarmInfoModal = function(record){
      var modalInstance = Modal('AlarmInfo', {'disRecord':$scope.record, 'record':record});
            modalInstance.result.then(function(data){
                console.log(data);
            });
    };
        
    //关闭窗口
    $scope.close = function(){
      $modalInstance.close({'checkedNodes':$scope.checkedNodes, 'entity':$scope.entity});
    };
        
  }];
});