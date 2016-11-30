define(function(require, exports, module){
  return ['DictCache', 'specialDuty', '$routeParams', 
    function(DictCache, specialDuty, $routeParams){
    
    var linker = function ($scope, el, attrs){

      $scope.addPositionFromMap = function (){
        if(!$scope.map){
          alert('地图未就绪!');
          return;
        }
        snap.activate();
        draw.activate();
      };

      $scope.itemClick = function (record){
        $scope.selectItem = record;
        $scope.onItemClick({
          $item: record
        })
      };

      $scope.pushDevices = function (){
        specialDuty.update($scope.tqData, function (data){
          if(!data.success){
            alert(data.msg);
            return;
          }
          alert('设备部署更新成功！');
        });
      };

      $scope.mapCenter = function (record){
        $scope.map.centerAt(record.lng, record.lat);
      };

      $scope.remove = function (rec){
        for(var i=0,size=$scope.positions.length;i<size;i++){
          if($scope.positions[i] === rec){
            $scope.positions.splice(i, 1);
            break;
          }
        }
      };

      $scope.$watch('tqData', function (tqData){
        if(tqData){
          if(!tqData.staskPoints){
            tqData.staskPoints = [];
          }
          $scope.positions = tqData.staskPoints;
        }
      });

      var staskLayer = new OpenLayers.Layer.Vector('调度点');
            
      //监视设备配置集合，在地图上绘制设备
      $scope.$watchCollection('positions', function (){
        //向地图添加调度点图层
        if($scope.map && $scope.map.map.getLayerIndex(staskLayer) === -1){
          $scope.map.map.addLayer(staskLayer);
        }

        if(!$scope.positions){
          return;
        }

        //遍历调度点，并在地图上绘制
        var features = [];
        _.each($scope.positions, function (point){
          var geom = new OpenLayers.Geometry.Point(point.lng, point.lat);
          var feature = new OpenLayers.Feature.Vector(geom, point);
          features.push(feature);
        });
        staskLayer.removeAllFeatures();
        staskLayer.addFeatures(features);

      });

      
      var snap, 
      draw,
      snaped,
      snapBack = function (event){
        snaped = true;
      },
      unsnapBack = function (event){
        snaped = false;
      },
      drawBack = function (event){
        var feature = event.feature; 
        var point = feature.geometry;
        var router = $scope.snapLayer.features[0].geometry;
                  
        if(!snaped){
          // console.log(point);
          // alert('调度点必须靠近线路!');
          staskLayer.removeFeatures([feature]);
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

          // var map = $scope.map;
          // console.log(router.getGeodesicLength(map.map.getProjectionObject()) +':'+ router.toString());
          // console.log(line.getGeodesicLength(map.map.getProjectionObject()) +':'+ line.toString());
          // _.each(router.splitWith(line,{tolerance:10,edge:false}), function(line){
            // console.log(line.getGeodesicLength(map.map.getProjectionObject()) +':'+ line.toString());
          // });
          
          //splitWith方法接受geometry必须有split方法，point不行
          var line = router.splitWith(line)[0];
          length = line.getGeodesicLength($scope.map.map.getProjectionObject());
        }

        $scope.positions.push({
          lng: point.x,
          lat: point.y,
          distance: length,
          name: ' ',
          pointDevices: []
        });

        //视图排序》失败！！
        // $scope.positions = _.sortBy($scope.positions, function(pos){return pos.distance;});

        $scope.$apply();

        snaped = false;

        //deactivate
        snap.deactivate();
        draw.deactivate();
      };

      var initialize = function (){
        //如果snaplayer存在 && snap CTRL 不存在时，创建 snap CTRL
        if($scope.snapLayer && !snap && $scope.map){
          //snap
          snap = new OpenLayers.Control.Snapping({
            layer: staskLayer,
            targets: [{
              layer: $scope.snapLayer ,
              tolerance: 10
            }]
          });
          //draw
          draw = new OpenLayers.Control.DrawFeature(staskLayer, OpenLayers.Handler.Point);
          $scope.map.map.addControls([snap, draw]);
          
          //添加监听
          snap.events.register('snap', null, snapBack);
          snap.events.register('unsnap', null, unsnapBack);
          draw.events.register('featureadded', null, drawBack);
        }
      };

      //监视snapLayer
      $scope.$watchCollection('[snapLayer,map]', initialize);

    };

    return {
      restrict:'EA',
      link: linker,
      replace: true,
      scope: {
        map: "=?",
        tqData: '=?',
        onItemClick: '&',
        selectItem: '=?',
        snapLayer: '=?'
      },
      templateUrl: 'app/JCZH/TQRW/directives/tq-stask-points.html'
    };
  }];
});