define(function(require, exports, module) {

  var controller = [
      '$scope',
      'DrawRegion',
      'LocationMonitor',
      'Restangular',
      '$modalInstance',
      function($scope, DrawRegion, LM, Restangular, $modalInstance) {

        Restangular.all('atms').one('data').one('igateLayer.json')
            .get().then(function(data) {
              $scope.config = data;
            });
        //确认响应
        $scope.ok = function() {
          $modalInstance.close($scope.map.clientLayer.features);
        };
        
        // 关闭窗口
        $scope.close = function() {
          $modalInstance.close([]);
        };
      } ];

  module.exports = controller;
});