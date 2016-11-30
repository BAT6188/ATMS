define(function() {
  'user strict';
  return [ '$scope', '$modalInstance', 'Restangular', 'param',
      function($scope, $modalInstance, Restangular, param) {

        window.setTimeout(function() {
          $('.modal-dialog').width(1000).height(750);
        });
        
        Restangular.one('blacklist', param.record.alarmId).get().then(function(data){
            $scope.disRecord = data.results;
            $scope.dispatchImgUrl = JCBK_PIC_URL + $scope.disRecord.carImgUrl;
            console.log($scope.disRecord);
        });
        
        $scope.alarmRecord = param.record;
        
        
        $scope.imgUrl = JCBK_PIC_URL + $scope.alarmRecord.carImgUrl;
        
        console.log($scope.alarmRecord);
        console.log($scope.imgUrl);
        console.log($scope.dispatchImgUrl);

        // 关闭窗口
        $scope.close = function() {
          $modalInstance.close({
            'checkedNodes' : $scope.checkedNodes,
            'entity' : $scope.entity
          });
        };

      } ];
})