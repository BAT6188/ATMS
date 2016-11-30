define(function(require, exports, module){
  return ['Duty', 'BufferHigh', function (Duty, BufferHigh){
    
    var linker = function ($scope, el, attrs){
      var buffer;

      $scope.mapCenter = function (record){
        $scope.map.centerAt(record.lng, record.lat);
      };

      $scope.$watch('map', function (map){
        if(map){
          buffer = new BufferHigh(map.map, ['../giserver/configs/deviceVideo']);  
        }
      });

      $scope.$watch('showBuffer', function (){
        if(!$scope.data){
          return;
        }

        buffer.buffer({
          geometry: 'POINT(' + $scope.data.lng + ' '+ $scope.data.lat + ')',
          buffer: 2000,
          spatialRel:  'intersects',
          inSR: '4326',
          outSR: '4326'
        })
      });
    };

    return {
      restrict:'EA',
      link: linker,
      replace: true,
      scope: {
        data: '=',
        map: '=?'
      },
      templateUrl: 'app/JCZH/TQRW/directives/tq-stask-point.html'
    };
  }];
});