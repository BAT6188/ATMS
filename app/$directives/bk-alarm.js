define(function(require, exports, module) {
    return [
    function() {

      var linker = function($scope, $el, $attrs) {
        $scope.data = [];
        socket.emit('subscribe',{clientType:'bukongAlarm'});

        socket.on('bukongAlarmRealtime', function(data) {
            if(data && !_.contains($scope.data, data)){
              $scope.data.push(data);
            }

            if($scope.data.length > 10){
              $scope.data = $scope.data.slice(0,10);
            }
            $scope.count = $scope.data.length;
            $scope.$apply();
        });

        $scope.$on('$destroy', function() {
            socket.emit('unsubscribe', {
                'clientType' : 'bukongAlarm'
            });
            socket.removeAllListeners();
        });

      };
        
      return {
          restrict : 'EA',
          replace : true,
          link : linker,
          scope : {
              data : '=?',
              onItemTransport : '&',
              onItemClick : '&'
          },
          templateUrl : 'app/$directives/bk-alarm.html'
      };
    }];
});
