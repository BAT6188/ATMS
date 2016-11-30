define(function() {
  'user strict';
  return [ '$scope', '$modalInstance', 'Restangular', 'param',
      function($scope, $modalInstance, Restangular, param) {

        window.setTimeout(function() {
          $('.modal-dialog').width(1000).height(750);
        });

        $scope.dispatchImgUrl = '';
        Restangular.one('bukong', param.record.dispId).get().then(function(data) {
            if(data && data.success) {
                $scope.disRecord = data.results;
                if($scope.disRecord && $scope.disRecord.carImageUrl) {
                    $scope.dispatchImgUrl = JCBK_PIC_URL + $scope.disRecord.carImageUrl;
                }
            }
        });

        $scope.imgUrl = '';
        $scope.alarmRecord = param.record;
        if($scope.alarmRecord && $scope.alarmRecord.carImgUrl) {
            $scope.imgUrl = '/java' + $scope.alarmRecord.carImgUrl;
        }
        
        // 关闭窗口
        $scope.close = function() {
          $modalInstance.close({
            'checkedNodes' : $scope.checkedNodes,
            'entity' : $scope.entity
          });
        };

      } ];
})