define(function(require, exports, module){
  var postStyle = OpenLayers.Util.extend(
    OpenLayers.Util.extend({},
        OpenLayers.Feature.Vector.style['default']), 
    {
      fillOpacity: 2,
      fillColor: "#5BC0DE" ,
      strokeColor: "white",
      strokeWidth: 2,
      pointRadius: 12,
      label: '岗',
      fontSize: 12,
      fontColor: "#5BC0DE"
  });

  var postStyleMap = new OpenLayers.StyleMap({
      "default": postStyle
  });

  return ['MapHelper', function (MapHelper){

    var linker = function ($scope, el, attrs){
      // $scope.posts = [];

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
          // layer.events.on({
          //   featureadded: onPostAdded
          // });

          //激活绘图
          drawTool.activate();
        }else{
          //删除注册图层事件监听
          // layer.events.un({
          //   featureadded: onPostAdded
          // });

          //删除激活绘图
          drawTool.deactivate();
        }
      });

      //创建绘制路线的图层，地图加载完成后添加到地图
      var layer = $scope.layer = new OpenLayers.Layer.Vector("postLayer", {
        displayInLayerSwitcher: false,
        styleMap: postStyleMap
      });

      //创建绘制工具
      var drawTool = new OpenLayers.Control.DrawFeature(layer, OpenLayers.Handler.Point);

      // var onPostAdded = function (event){
      //   var feature = event.feature;
      //   $scope.posts.push(feature);
      //   $scope.$apply();
      // };

      $scope.prevClick = function (){
        $scope.onPrevClick();
      };

      $scope.nextClick = function (){
        $scope.onNextClick();
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
        onNextClick: '&',
        onPrevClick: '&'
      },
      templateUrl: 'app/JCZH/TQRW/directives/step-3.html'
    };
  }];
});