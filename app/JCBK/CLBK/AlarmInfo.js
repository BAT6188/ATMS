define(function() {
  'user strict';
  return [ '$scope', '$modalInstance', 'Restangular', 'param',
      function($scope, $modalInstance, Restangular, param) {

        window.setTimeout(function() {
          $('.modal-dialog').width(1000).height(750);
        });

        $scope.disRecord = param.disRecord;
        $scope.alarmRecord = param.record;
        
        $scope.imgUrl = window.RestangularProvider.configuration.baseUrl+$scope.alarmRecord.carImgUrl;
        $scope.dispatchImgUrl = window.RestangularProvider.configuration.baseUrl+$scope.alarmRecord.dispatchImgUrl;

        // 关闭窗口
        $scope.close = function() {
          $modalInstance.close({
            'checkedNodes' : $scope.checkedNodes,
            'entity' : $scope.entity
          });
        };

      } ];
})