define(function(require, exports, module) {
  var controller = ['$scope', '$rootScope', '$modalInstance', 'token', function ($scope, $rootScope, $modalInstance, token) {
    var wkt = new OpenLayers.Format.WKT();


    var $un = $rootScope.$on('yhte-map:init', function(e, map){
        if(map){
            map.clientLayer.removeAllFeatures();
            if(token && token.wkt){
                var feature = wkt.read(token.wkt);
                var bounds = feature.geometry.getBounds();
                map.map.zoomToExtent(bounds);
                map.clientLayer.addFeatures([feature]);
            }

            var GetCdtCtl = new OpenLayers.Control.GetCoordinate(map.clientLayer,{
              callback:function(point){
                token.wkt = point.toString();
                $modalInstance.close(point);
                //去除对事件'yhte-map:init'的监听，否则每次「地图modal」弹出时，都将注册一次事件监听
                $un();
              }
            });
            
            map.map.addControls([GetCdtCtl]);
            GetCdtCtl.activate(3);                
        }
    })
  }];

  module.exports = controller;

}); 