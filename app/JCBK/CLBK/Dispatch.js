define(function(){'use strict';
    return ['$scope', 'Modal', 'ngTableParams', 'Restangular', '$state', 'CurUser', 'DictCache', function($scope,Modal, ngTableParams, Restangular, $state, User, DictCache){
      $('#plateNo').keydown(function(event){
            if(event.keyCode===13){
                $scope.query();
            }
        });
      
      //号牌颜色字典
        /*Restangular.one('dict/parent', 'PLATE_COLOR').get().then(function (data) {
            $scope.plateColors = data.results;
        });*/
        DictCache('PLATE_COLOR', function (value){
          $scope.plateColors = value;
        });

        //布控审核状态字典
        /*Restangular.one('dict/parent', 'DISP_VERIFY_STATUS ').get().then(function (data) {
            $scope.statuses = data.results;
        });*/
        DictCache('DISP_VERIFY_STATUS', function (value){
          $scope.statuses = value;
        });
        
        var user = User();
        
        $scope.tableParams = new ngTableParams($scope.tableParameters, {
            getData: function ($defer, params) {
                var queryParams = {
                  plateColor: !$scope.plateColor ? '':$scope.plateColor,
                  plateNo: !$scope.plateNo ? '':$scope.plateNo,
                  verifyStatus: !$scope.status ? '':$scope.status,
                  startDispTime: !$scope.dispTime ? '':$scope.dispTime,
                  endDispTime: !$scope.dispEndTime ? '':$scope.dispEndTime,
                  dispDeptCode: !$scope.dispDept ? '':$scope.dispDept.code,
                  // dispOperator: $scope.dispOperator===null ? '':$scope.dispOperator,
                    page: params.page(),
                    limit: params.count(),
                    total:params.total()
                };
                // queryParams.dispOperator = user.userName;
                
                Restangular.all('bukong/list').post(queryParams).then(function (data) {
                    params.total(data.total);
                    $scope.records = data.results;
                    $defer.resolve(data.results);
                });
            }
        });
        $scope.query = function(){
            if($scope.tableParams.page() === 1){
                $scope.tableParams.reload();
            }else{
                $scope.tableParams.page(1);
            }
        };
        
        //新建布控
        $scope.add = function(){
          var modalInstance = Modal('ApplyNew');
            modalInstance.result.then(function(data){
              $scope.tableParams.reload();
            });
        };
        
        //查看布控
        $scope.view = function(record){
          Modal('DispatchView', {id: record.dispId}).result
              .then(function(){
            });
        };
        
        //编辑布控
        $scope.edit = function(record){
          Modal('DispatchEdit', {id: record.dispId}).result
              .then(function(){
                $scope.tableParams.reload();
            });
        };
        
        //撤控
        $scope.cancleMod = function(record){
          var modalInstance = Modal('Cancle', {'record':record});
            modalInstance.result.then(function(data){
                console.log(data);
            });
        };
        
        //报警记录
        $scope.alarmList = function(record){
          var modalInstance = Modal('DispAlarmList', {'record':record});
            modalInstance.result.then(function(data){
                console.log(data);
            });
        };

    }];
});