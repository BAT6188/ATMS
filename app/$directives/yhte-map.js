define(function(require, exports, module){
  return ['$rootScope', function($rootScope){
    
    var linker = function ($scope, el, attrs){

      var mapCtn = $(el);//.height($scope.height||400);

      var map = $scope.map = mapCtn.iMap({
        bases: [base_url],
        extent: GeoSetup.getExtent()//获取地图范围
      });

      $map = map;

      $(window).resize(function(){
        map.map.updateSize();
      });
      
      map.map.updateSize();

      map.exSelector.deactivate();

      //绘制线
      var clientLayer = map.clientLayer;

      map.selector = new OpenLayers.Control.SelectFeature(clientLayer);

      var pathCtrl = new OpenLayers.Control.DrawFeature(clientLayer, OpenLayers.Handler.Path);
      var pointCtrl = new OpenLayers.Control.DrawFeature(clientLayer, OpenLayers.Handler.Point);
      
      map.map.addControls([pathCtrl, pointCtrl,map.selector]);

      map.toDrawLine = function (listener){
        var callback = function (event){
          listener.call(null, event.feature.geometry);
          $scope.$apply();
          pathCtrl.events.unregister('featureadded', null, callback);
          pathCtrl.deactivate();
        };
        pathCtrl.events.unregister('featureadded', null, callback);
        pathCtrl.events.register('featureadded', null, callback);
        pathCtrl.activate();
      };

      map.toDrawPoint = function (listener){
        var callback = function (event){
          listener.call(null, event.feature.geometry);
          clientLayer.removeAllFeatures();
          $scope.$apply();
          pointCtrl.events.unregister('featureadded', null, callback);
          pointCtrl.deactivate();
        };
        pointCtrl.events.unregister('featureadded', null, callback);
        pointCtrl.events.register('featureadded', null, callback);
        pointCtrl.activate();
      };
      
      map.centerAt = function (x, y){
        map.map.setCenter([x, y]);
      };

      $rootScope.$broadcast('yhte-map:init', map);

      $rootScope.$on('yhte-map:get', function(){
        $rootScope.$broadcast('yhte-map:init', map);
        setTimeout(function(){
          $(window).resize();
        },100);     
      });

      $scope.$on('$destroy', function(){
        // $scope.map.map.destroy();
        // map.selector.destroy();
        // pathCtrl.destroy();
        // pointCtrl.destroy();
        $scope.map = null;
      });
    };

    return {
      restrict:'EA',
      link: linker,
      replace: true,
      scope: {
        map: '=?inst'
      },
      template: '<div class="yhte-map mapCtn"></div>'
    };
  }];
});