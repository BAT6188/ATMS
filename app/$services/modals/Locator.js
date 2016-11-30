define(function(require, exports, module) {
  var controller = ['$scope', '$rootScope', '$modalInstance', 'token', function ($scope, $rootScope, $modalInstance, token) {

    var $un = $rootScope.$on('yhte-map:init', function(e, map){
        if(map){
            map.clientLayer.removeAllFeatures();
            if(token && token.lng && token.lat){
                map.centerAt(token.lng , token.lat);
                var geom = new OpenLayers.Geometry.Point(token.lng , token.lat);
                var feature = new OpenLayers.Feature.Vector(geom);
                map.clientLayer.addFeatures([feature]);
            }else{

            }

            var GetCdtCtl = new OpenLayers.Control.GetCoordinate(map.clientLayer,{
              callback:function(point){
                token.lng = point.x;
                token.lat = point.y;
                $modalInstance.close(point);
                //去除对事件'yhte-map:init'的监听，否则每次「地图modal」弹出时，都将注册一次事件监听
                $un();
              }
            });
            
            map.map.addControls([GetCdtCtl]);
            GetCdtCtl.activate(1);                
        }
    });

    $scope.close = function() {
        $modalInstance.close();
    };

  }];

  module.exports = controller;

}); 