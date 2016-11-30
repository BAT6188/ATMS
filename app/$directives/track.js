define(function(require, exports, module){
  return ['$rootScope',function ($rootScope){
    var i = 0;

    var linker = function($scope,element,attrs) {

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
      /*---------------------- 警员轨迹-----------------------------------------------------*/
      //订阅轨迹
      var un = $rootScope.$on('trackPolice', function (event,feature){

        //该对象的是否被追踪轨迹
        //var feature = _.find($scope.policeTrackFeatures, function(p){ return p.attributes.POLICE_NO === feature.attributes.POLICE_NO; }) || feature;
        var temp = _.find($scope.policeTrackFeatures, function(p){ return p.attributes.POLICE_NO === feature.attributes.POLICE_NO; });
        
        if(temp){
          //-------已在追踪列表里,返回???
          var feature = temp;
          feature.onTrack = true; 
          return;
        } else{
          //--------不在追踪列表里面,
          if($scope.policeTrackFeatures.length >= 5){
            alert('最多追踪5个警员轨迹，否则会影响效率');
            return;
          }
          feature.onTrack = true; 
          feature.color = policeTarckColors[$scope.policeTrackFeatures.length] || 'red';
          console.log(feature.color);
          $scope.policeTrackFeatures.push(feature);
          //console.log('............'+$scope.policeTrackFeatures.length);

          var policeNO = feature.attributes.POLICE_NO;
          //保存被追踪的警员编号
          policeTrackNos.push(policeNO);
          //如果存在feature,刪除
          if(feature.trackFeature) policeTrackLayer.removeFeatures([feature.trackFeature]);

          //订阅轨迹数据
          socket.emit('subscribe',{clientType:'gpsPolice',id:policeNO});  
          feature.points = [];

          //接收轨迹点位数据处理函数
          socket.on('gpsPoliceTrackRealtime:'+policeNO,function(data){
            // console.log(data.carNo + " : " + data.lat + " - " + data.lng );
            
            //刷新警员动态图层 刘荣涛 2014.07.08
            $scope.map.map.layers[6].refresh();

            var _point = new OpenLayers.Geometry.Point(data.lng, data.lat);

            //保存点位数据
            feature.points.push(_point); 
            //创建轨迹线(第一个和第二个点)
            if(feature.points.length === 2){
              feature.line = new OpenLayers.Geometry.LineString([feature.points[0], feature.points[1]]);
              feature.trackFeature = new OpenLayers.Feature.Vector(feature.line);
              policeTrackLayer.addFeatures([feature.trackFeature]);
            }

            //追加点位，重绘轨迹图
            if(feature.points.length > 2){
              feature.line.addPoint(_point,feature.trackFeature.geometry.components.length);
              feature.line.components = feature.line.components.slice(-TrackPointNum);
              policeTrackLayer.drawFeature(feature.trackFeature, {
                strokeColor: feature.color,
                strokeWidth: 7
              });
            }

          });
         
          $scope.$apply();
          }
      });
      
      //解除轨迹追踪
      var un = $rootScope.$on('unTrackPolice', function (event,feature){
          //congfeature列表中删除
          $scope.policeTrackFeatures = _.without($scope.policeTrackFeatures,feature);
          feature.onTrack = false;

          //取消订阅
          socket.emit('unsubscribe',{clientType:'gpsPolice',id:feature.attributes.POLICE_NO});
          $scope.$apply();

          //没有接收到警员数据，所以没有创建feature.trackFeature
          if(!feature.trackFeature){
            alert('没有接收到该警员轨迹数据,重新尝试连接');
            return;
          }
          //有创建feature.trackFeature，-在地图上删除轨迹轨迹-feature.trackFeature
          policeTrackLayer.removeFeatures([feature.trackFeature]);

      });

      //取消所有警员的轨迹追踪
      $scope.untrackAllPolice = function(){

        //标志追踪标记为false
        angular.forEach($scope.policeTrackFeatures,function(e){
          e.onTrack = false;
          socket.emit('unsubscribe',{clientType:'gpsPolice',id:e.attributes.POLICE_NO});
        });

        //从图层上清除features
        policeTrackLayer.removeAllFeatures();

        //fetures数组清空
        $scope.policeTrackFeatures = [];

        //取消订阅后台追踪请求
      };

      /*---------------------- 警车轨迹-----------------------------------------------------*/
      //订阅轨迹
      var un = $rootScope.$on('trackCar', function (event,feature){

        //该对象的是否被追踪轨迹
        //var feature = _.find($scope.policeTrackFeatures, function(p){ return p.attributes.POLICE_NO === feature.attributes.POLICE_NO; }) || feature;
        var temp = _.find($scope.carTrackFeatures, function(p){ return p.attributes.CAR_NO === feature.attributes.CAR_NO; });
        
        if(temp){
          //-------已在追踪列表里,返回???
          var feature = temp;
          feature.onTrack = true; 
          return;
        } else{
          //--------不在追踪列表里面,
          if($scope.carTrackFeatures.length >= 5){
            alert('最多追踪5个警车轨迹，否则会影响效率');
            return;
          }
          feature.onTrack = true; 
          feature.color = carTarckColors[$scope.carTrackFeatures.length] || 'red';
          console.log(feature.color);
          $scope.carTrackFeatures.push(feature);
          //console.log('............'+$scope.policeTrackFeatures.length);

          var carNO = feature.attributes.CAR_NO;
          //保存被追踪的警车编号
          carTrackNos.push(carNO);
          //如果存在feature,刪除
          if(feature.trackFeature) carTrackLayer.removeFeatures([feature.trackFeature]);

          //订阅轨迹数据
          socket.emit('subscribe',{clientType:'gpsCar',id:carNO});  
          feature.points = [];

          //接收轨迹点位数据处理函数
          socket.on('gpsCarTrackRealtime:'+carNO,function(data){
            // console.log(data.carNo + " : " + data.lat + " - " + data.lng );
            
            //刷新警车动态图层 刘荣涛 2014.07.08
            $scope.map.map.layers[7].refresh();

            var _point = new OpenLayers.Geometry.Point(data.lng, data.lat);

            //保存点位数据
            feature.points.push(_point); 
            //创建轨迹线(第一个和第二个点)
            if(feature.points.length === 2){
              feature.line = new OpenLayers.Geometry.LineString([feature.points[0], feature.points[1]]);
              feature.trackFeature = new OpenLayers.Feature.Vector(feature.line);
              carTrackLayer.addFeatures([feature.trackFeature]);
            }

            //追加点位，重绘轨迹图
            if(feature.points.length > 2){
              console.log(_point,feature.trackFeature.geometry.components.length);
              feature.line.addPoint(_point,feature.trackFeature.geometry.components.length);
              feature.line.components = feature.line.components.slice(-TrackPointNum);
              carTrackLayer.drawFeature(feature.trackFeature, {
                strokeColor: feature.color,
                strokeWidth: 7
              });
            }

          });
         
          $scope.$apply();
          }
      });
      
      //解除轨迹追踪
      var un = $rootScope.$on('unTrackCar', function (event,feature){
          
          $scope.carTrackFeatures = _.without($scope.carTrackFeatures,feature);
          feature.onTrack = false;
         
          //取消订阅
          socket.emit('unsubscribe',{clientType:'gpsCar',id:feature.attributes.CAR_NO});
          $scope.$apply();

          if(!feature.trackFeature){
            alert('没有就接收到轨迹数据,重新尝试连接');
            return;
          }

           //---------取消轨迹----------------
          carTrackLayer.removeFeatures([feature.trackFeature]);
      });

      //取消所有警员的轨迹追踪
      $scope.untrackAllCar = function(){

        //标志追踪标记为false
        angular.forEach($scope.carTrackFeatures,function(e){
          e.onTrack = false;
          socket.emit('unsubscribe',{clientType:'gpsCar',id:e.attributes.CAR_NO});
        });

        //从图层上清除features
        carTrackLayer.removeAllFeatures();

        //fetures数组清空
        $scope.carTrackFeatures = [];
      };  

      $scope.$on('$destroy', function() {
        socket.emit('unsubscribe', {
            'clientType' : 'gpsCar'
        });

        socket.emit('unsubscribe', {
            'clientType' : 'gpsPolice'
        });
        socket.removeAllListeners();
      });
    };

    return {
      restrict:'EA',
      replace: true,
      scope: {
         map: '=?',
         policeTrackFeatures : '=?',
         carTrackFeatures : '=?'
      },
      templateUrl:'app/$directives/track.html',
      link: linker
    };
  }];
});