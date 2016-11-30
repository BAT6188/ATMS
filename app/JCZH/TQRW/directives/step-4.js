define(function(require, exports, module){
  var pointStyle = OpenLayers.Util.extend(
    OpenLayers.Util.extend({},
        OpenLayers.Feature.Vector.style['default']), 
    {
      fillOpacity: 1,
      fillColor: "#3372a7" ,
      strokeColor: "white",
      strokeWidth: 2,
      pointRadius: 12,
      label: '调',
      fontSize: 12,
      fontColor: "#3372a7"
  });

  var pointStyleMap = new OpenLayers.StyleMap({
      "default": pointStyle
  });

  return ['MapHelper', function (MapHelper){

    var linker = function ($scope, el, attrs){

      //是否激活，默认未激活
      $scope.active = false;

      //请求地图
      MapHelper($scope);
      // MapHelper().then(function (map){
      //   $scope.map = map;
      // });

      $scope.$watchCollection('[active, map, targetLayer]', function (data){
        var active = data[0], map = data[1], targetLayer = data[2];

        //当地图已加载，且 active 时
        if(active === true && map && targetLayer){
          
          snap.setTargets([{
            layer: targetLayer,
            tolerance: 10
          }]);

          //添加图层
          $scope.map.map.addLayers([layer]);
          $scope.map.map.addControls([drawTool, snap]);

          //注册图层事件监听
          layer.events.on({
            featureadded: onPointAdded
          });

          //激活绘图
          snap.activate();
          drawTool.activate();
        }else{
          //删除注册图层事件监听
          layer.events.un({
            featureadded: onPointAdded
          });

          //删除激活绘图
          snap.deactivate();
          drawTool.deactivate();
        }
      });

      //创建绘制路线的图层，地图加载完成后添加到地图
      var layer = $scope.layer = new OpenLayers.Layer.Vector("pointLayer", {
        displayInLayerSwitcher: false,
        styleMap: pointStyleMap
      });

      //创建绘制工具
      var drawTool = new OpenLayers.Control.DrawFeature(layer, OpenLayers.Handler.Point);

      //创建扑捉工作
      var snap = new OpenLayers.Control.Snapping({
        layer: layer
      });

      var snaped;

      var snapBack = function (event){
        snaped = true;
      };

      var unsnapBack = function (event){
        snaped = false;
      };

      snap.events.register('snap', null, snapBack);
      snap.events.register('unsnap', null, unsnapBack);

      var onPointAdded = function (event){
        var feature = event.feature; 
        var point = feature.geometry;
        var router = $scope.targetLayer.features[0].geometry;
                  
        if(!snaped){
          // console.log(point);
          // alert('调度点必须靠近线路!');
          layer.removeFeatures([feature]);
          return;
        }

        var length;//起点到盖点的距离

        //获取router的起点和终点
        var sted = router.getVertices(true);

        if(point.x === sted[0].x && point.y === sted[0].y){
          length = 0;
          console.log('起点');
        }else if(point.x === sted[1].x && point.y === sted[1].y){
          length = router.getGeodesicLength($scope.map.map.getProjectionObject());
          console.log('终点');
        }else{
          var start = new OpenLayers.Geometry.Point(point.x + 0.002, point.y);
          var end = new OpenLayers.Geometry.Point(point.x - 0.002, point.y);
          var line = new OpenLayers.Geometry.LineString([start,end]);

          //splitWith方法接受geometry必须有split方法，point不行
          var line = router.splitWith(line)[0];
          length = line.getGeodesicLength($scope.map.map.getProjectionObject());
        }

        feature.attributes.distance = length;

        snaped = false;
      };

      $scope.prevClick = function (){
        $scope.onPrevClick();
      };

      $scope.save = function (){
        $scope.onSaveClick();
      };

      $scope.passClick = function (){

      };
    };

    return {
      restrict:'EAC',
      link: linker,
      scope: {
        layer: '=?',
        active: '=?',
        targetLayer: '=?',
        onSaveClick: '&',
        onPrevClick: '&'
      },
      templateUrl: 'app/JCZH/TQRW/directives/step-4.html'
    };
  }];
});