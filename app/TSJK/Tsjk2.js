define(function(require, exports, module){

    var controller = ['$scope', 'DrawRegion', 'LocationMonitor', 'Restangular', '$http', '$rootScope',
      function($scope, DrawRegion, LM, Restangular, $http, $rootScope){
        //定时刷新图层>>>
        var it_refresh = setInterval(function(){
          try{
            $map.map.layers[5].refresh();
          }catch(evt){
            console.log('定时刷新警员和警车图层,',evt);
          }
        },1000 * 60);
        //<<<定时刷新图层
        $scope.rightToolShow = true;
        $scope.layersSwitcher = true;
        //诱导屏检测
        Restangular.one('cms/jiance').post();
        var policeTrackLayer = new OpenLayers.Layer.Vector('policeTrackLayer');
        var policeTrackNos = [];
        $scope.policeTrackFeatures = [];

        var carTrackLayer = new OpenLayers.Layer.Vector('carTrackLayer');
        var carTrackNos = [];
        $scope.carTrackFeatures = [];

        $scope.$watch('map', function (map){
          if(!map){
              return;
          }
          //添加轨迹图层
          map.map.addLayer(policeTrackLayer);
          map.map.addLayer(carTrackLayer);

        });

      //地图初始化
      var $un = $rootScope.$on('yhte-map:init', function(e, map){
          if(map){
              if($scope.map){
                  //去除多余control
                  setTimeout(function(){
                      console.log($('.olControlDrawFeaturePolygonItemInactive'));
                      $('.olControlDrawFeaturePolygonItemInactive').hide();
                      $('.olControlDrawFeatureRegularPolygonItemInactive').hide();
                      $('.olControlDrawFeaturePathItemInactive').hide();
                      $('.olControlDrawFeaturePointItemActive').hide();
                  }, 2000);

              }
          }
      });


      $('.navbar').hide();
      $('.user-icon').css('color', 'black');

      $('.viewport').addClass('map-full-screen');

      LM.beforeLeave(function(){
        $('.navbar').show();
        $('.viewport').removeClass('map-full-screen');
      });

      $scope.page = 1;
      $scope.size = 5; 
      
      $scope.$watch('map', function (map){
        if(!map){
          return;
        }
        // new DrawRegion(map.map).draw();
      });

      $scope.onLayerSwitchClick = function (){
          console.log($scope);
        $scope.xyTipVisible = false;
      };

      $scope.onXyTipClose = function (){
        $scope.position= null;
        $scope.xyTipVisible = false;
      };

      $scope.onXyTipPosition = function (){
        $scope.tsListVisible = false;
        $scope.xyTipVisible = true;
        $scope.featureTipVisible = false;
      };

      $scope.onTsListItemClick = function ($feature){
        $scope.feature = $feature;
        $scope.featureTipVisible = true;
        $scope.tsListVisible = false;
      };

      $scope.onFeatureTipClose = function (){
        $scope.featureTipVisible = false;
        if($scope.features){
          $scope.tsListVisible = true;
        }
      };

      $scope.onFeatureTipShow = function (){
        $scope.featureTipVisible = true;
        $scope.xyTipVisible = false;
      };

      $scope.onTsListFetch = function(){
        $scope.tsListVisible = true;
      };

      $scope.onTsListClean = function(){
        $scope.tsListVisible = false;
      };

      $http.get('data/layers.json').success(function(data) {
        var code;
        try{
          code = JSON.parse(sessionStorage._login).dept.area.code;
        }catch(i){
          code = '0';
        }

        if(code === '0'){
          data[0].visible = true;
        }else{
          data[1].visible = true;
        }

        $scope.config = data;
      });

      $scope.onRoadAlarmTransport = function($features) {
        $scope.flowInfos = $features;
        $scope.$apply();
      };

      $scope.onRoadAlarmClick = function($feature, $featureTipVisible, $tsListVisible) {
        $scope.feature = $feature;
        $scope.featureTipVisible = $featureTipVisible;
        $scope.tsListVisible = $tsListVisible;
        $scope.$apply();
      };

      $scope.$watch('tsListVisible', function(visible){
        if(typeof(visible) !== 'undefined') {
            $rootScope.$broadcast('direction-refresh');
        }
      });


        $scope.$on('$destroy', function() {
        //socket.emit('unsubscribe',{clientType:'gpsCar',id:'苏C12345'});

        angular.forEach(policeTrackNos,function(e){
          socket.emit('unsubscribe',{clientType:'gpsPolice',id:e});
        });
        socket.removeAllListeners();
        $scope.map.map.removeLayer(carTrackLayer);
        $scope.map.map.removeLayer(policeTrackLayer);

       /* $scope.enter = function(ev) {
            if (ev.keyCode !== 13) {
                return;
            }
            $rootScope.$broadcast("shuaxinyoudao",$scope.shuaxin);
        }*/

        //清除定时刷新的定时器
        clearInterval(it_refresh);
      });

    }];

    module.exports = controller;
});