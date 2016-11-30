define(function(require, exports, module){
  return ['DictCache', 'specialDuty', '$routeParams', '$window', function(DictCache, specialDuty, $routeParams, $window){
    
    var linker = function ($scope, el, attrs){
      //特勤路线图层
      var routeLayer;
      var style = OpenLayers.Util.extend(
                OpenLayers.Util.extend({},
                    OpenLayers.Feature.Vector.style['default']), 
                {
                  fillOpacity: 1, 
                  strokeColor: "green",
                  strokeWidth: 3,
                  pointRadius:10
              });

      $scope.$watch('record', function(){
        //向地图添加特勤路线图层
        if($scope.map && $scope.map.map.getLayerIndex(routeLayer) === -1){
          routeLayer = $scope.routeLayer = new OpenLayers.Layer.Vector('特勤路线');          
          $scope.map.map.addLayer(routeLayer);
        }

        //绘制特勤路线
        if($scope.map && $scope.record && $scope.record.lineMap){
          var vector = new OpenLayers.Format.WKT().read($scope.record.lineMap);
          routeLayer.removeAllFeatures();
          vector.style = style;
          routeLayer.addFeatures(vector);
          // $scope.map.map.zoomToExtent(vector.geometry.getBounds());
        }

      });

      var fetch = function (){
        specialDuty.get({id: $routeParams.id}, function(data){
          if(!data.success){
            $window.alert(data.msg);
          }
          var record = $scope.record = new specialDuty(data.results);
          
        }, function(){
          $scope.error = "特勤后台错误!";
        });  
      };

      fetch();
      
      $scope.viewRoute = function (){
        var vector = new OpenLayers.Format.WKT().read($scope.record.lineMap);
        $scope.map.map.zoomToExtent(vector.geometry.getBounds());
      };

      $scope.reload = function (){
        fetch();
      };

      $scope.apply = function (){
        $scope.record.status = {code: '12'};
        specialDuty.update($scope.record, function(data){
          if(!data.success){
            alert(data.msg);
            return;
          }
          $scope.record = new specialDuty(data.results);
        });
      };

      //勤务图标点击事件处理
      $scope.dutyIconClick = function (){
        $scope.onDutyIconClick({$dutyId: $scope.record.dutyId});
      };
    };

    return {
      restrict:'EA',
      replace: true,
      link: linker,
      scope: {
        record: '=?data',
        depts: '=?',
        map: '=',
        onDutyIconClick: '&',
        routeLayer: '=?layer'
        // ,onDeploy: '&'
      },
      templateUrl: 'app/JCZH/TQRW/directives/tq-info-read.html'
    };
  }];
});