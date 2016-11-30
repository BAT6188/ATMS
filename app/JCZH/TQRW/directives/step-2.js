define(function(require, exports, module){
  //定义路线样式
  var pathStyle = OpenLayers.Util.extend(
    OpenLayers.Util.extend({},
        OpenLayers.Feature.Vector.style['default']), 
    {
      strokeColor: "#47a447",
      strokeWidth: 3
  });

  var pathStyleMap = new OpenLayers.StyleMap({
      "default": pathStyle
  });

  return ['MapHelper','PassAreas', function (MapHelper,PassAreas){


    var linker = function ($scope, el, attrs){
      //是否激活，默认未激活
      $scope.active = false;

      //请求地图
      MapHelper($scope);
      // MapHelper().then(function (map){
      //   $scope.map = map;
      // });

      $scope.$watchCollection('[active, map]', function (data){
        var active = data[0], map = data[1];

        //当地图已加载，且 active 时
        if(active === true && map){
          //添加图层
          $scope.map.map.addLayers([layer]);
          $scope.map.map.addControls([drawTool]);

          //注册图层事件监听
          layer.events.on({
            featureadded: onPathAdded
          });

          
          if($scope.lineDesc) {
            return;
          }

          //激活绘图
          drawTool.activate();
        }else{
          //删除图层
          // $scope.map.map.removeLayer(layer);
          // $scope.map.map.removeControl(drawTool);

          //删除注册图层事件监听
          layer.events.un({
            featureadded: onPathAdded
          });

          //删除激活绘图
          drawTool.deactivate();
        }
      });

      //创建绘制路线的图层，地图加载完成后添加到地图
      var layer = $scope.layer = new OpenLayers.Layer.Vector("pathLayer", {
        displayInLayerSwitcher: false,
        styleMap: pathStyleMap
      });

      //创建绘制工具
      var drawTool = new OpenLayers.Control.DrawFeature(layer, OpenLayers.Handler.Path);

      var onPathAdded = function (event){
        layer.removeAllFeatures();

        var feature = event.feature, geometry = feature.geometry, components = geometry.components, size = components.length;
        layer.addFeatures([feature], {silent: true});
        $scope.lineDesc = geometry.toString();
        $scope.startPoint = components[0].toShortString();
        $scope.endPoint = components[size - 1].toShortString();
        $scope.lineLength = geometry.getGeodesicLength($scope.map.map.getProjectionObject());
        
        var passAreas = new PassAreas();

        passAreas.getAreas(geometry,function(ids,names,areas){
          $scope.areas = areas;
        });




        $scope.$apply();
        drawTool.deactivate();
      };

      $scope.redraw = function (){
        layer.removeAllFeatures();
        drawTool.activate();
      };

      $scope.prevClick = function (){
        $scope.onPrevClick();
      };

      $scope.nextClick = function (){
        $scope.onNextClick();
      };
    };

    return {
      restrict:'EA',
      link: linker,
      scope: {
        startPoint: '=?',
        endPoint: '=?',
        lineDesc: '=?',
        lineLength: '=?',
        layer:'=?',
        active: '=?',
        areas:'=?',
        onNextClick: '&',
        onPrevClick: '&'
      },
      templateUrl: 'app/JCZH/TQRW/directives/step-2.html'
    };
  }];
});