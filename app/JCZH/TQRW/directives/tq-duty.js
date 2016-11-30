define(function(require, exports, module){
  return ['DictCache', 'specialDuty', '$routeParams', '$window', 'Duty','DrawRegion', 
    function(DictCache, specialDuty, $routeParams, $window, Duty,DrawRegion){
    
    var linker = function ($scope, el, attrs){
      //岗位列表
      $scope.records = [];

      /* ---------用于分页----------*/
      $scope.total = $scope.records.length;
      $scope.page = 1;
      $scope.size = 5;
      $scope.maxSize = 5;
      /* ---------用于分页----------*/



      $scope.deleteMsg = false;

      $scope.addPostFromMap = function (){
        var n = $scope.records.length+1;
        $scope.map.toDrawPoint(function(point){
          //绘制线路
          // $scope.map.clientLayer.addFeatures();

          $scope.records.push({
            lng: point.x,
            lat: point.y,
            polices: [],
            type:{code:4},
            address: ' ',
            name: '岗位'+n
          });
        });
      };

      var style = OpenLayers.Util.extend(
                OpenLayers.Util.extend({},
                    OpenLayers.Feature.Vector.style['default']), 
                {
                  fillOpacity: 1,
                  fillColor:"#5BC0DE" ,
                  strokeColor: "white",
                  pointRadius:10,
                  label:'岗',
                  fontSize:12,
                  fontColor: "#5BC0DE"
              });
      var styleMap = new OpenLayers.StyleMap({
          "default": style
      });


      var dutyLayer = new OpenLayers.Layer.Vector('岗位点',{
        displayInLayerSwitcher:false,
        styleMap:styleMap
      });

      // var pointCtrl = new OpenLayers.Control.DrawFeature(dutyLayer, OpenLayers.Handler.Point);
      // map.map.addControls([pathCtrl, pointCtrl]);
            
      //监视岗位配置集合，在地图上绘制岗位
      $scope.$watchCollection('records', function (){

        $scope.total = $scope.records.length;//分页总数
        //向地图添加调度点图层
        if($scope.map && $scope.map.map.getLayerIndex(dutyLayer) === -1){
          $scope.map.map.addLayer(dutyLayer);
          // $scope.map.map.addControls([pointCtrl]);
        }

        if(!$scope.records){
          return;
        }

        //遍历调度点，并在地图上绘制
        var features = [];
        _.each($scope.records, function (point){
          var geom = new OpenLayers.Geometry.Point(point.lng, point.lat);
          var feature = new OpenLayers.Feature.Vector(geom, point);
          features.push(feature);
        });
        dutyLayer.removeAllFeatures();
        dutyLayer.addFeatures(features);

      });

      $scope.mapCenter = function (record){
        $scope.map.centerAt(record.lng, record.lat);
      };

      $scope.onItemDblClick = function (record){
        $scope.selected = record;
        $scope.onItemClick({
          $item: record
        });
      };

      var rec;
      $scope.removePost = function (record){
        rec = record;
        $scope.deleteMsg = true;
      };

      $scope.cancel = function (){
        $scope.deleteMsg = false;
      };

      $scope.delPosition = function (){
        for(var i=0,size=$scope.records.length;i<size;i++){
          if($scope.records[i] === rec){
            $scope.records.splice(i, 1);
            break;
          }
        }
        $scope.deleteMsg = false;
      };

      //监视特勤数据，以判断是否应请求勤务数据
      $scope.$watch('tqData', function (tqData){
        //如果特勤任务已经分配了勤务信息，则通过 dutyId 请求勤务记录
        if(tqData && tqData.dutyId){
          Duty.get({id: tqData.dutyId}, function (data){
            if(!data.success){
              alert(data.msg);
              return;
            }
            $scope.duty = new Duty(data.results);
            //从勤务信息中取出岗位列表并展示
            //根据子任务的部门，过滤岗位
            if(tqData.parentStaskId !== '0' && $scope.map){//大队

              // var gid = tqData.dept.area.code; 
              // var gid = [6];
              var drawRegion = new DrawRegion($scope.map.map);
              drawRegion.draw(function(){
                var ddgeo = arguments[0][0].geometry;
                var ddposts = [];
                _.each($scope.duty.posts,function(post){
                  var ptgeo = new OpenLayers.Geometry.Point(post.lng,post.lat);
                  if(ddgeo.intersects(ptgeo)){
                    ddposts.push(post);
                  }
                });
                $scope.records = ddposts;
              });
            }else{//支队
              $scope.records = $scope.duty.posts;
            }
          });
        }
      });
      
      var duty = {
        frequence: {code: 1},
        status: {code: 1},
        posts: []
      };

      //测试岗位提交
      $scope.pushDuty = function (){
        angular.extend(duty, {
          name: '特勤任务>>' + $scope.tqData.name,
          type: {code: 4},
          level: $scope.tqData.level,
          startTime: $scope.tqData.startTime,
          endTime: $scope.tqData.endTime,
          desc: '特勤任务>>' + $scope.tqData.name + ', ' + $scope.tqData.desc
        });

        //如果已经分配了勤务
        if($scope.duty){
          $scope.duty.posts = $scope.records;
          console.log('update');
          Duty.update($scope.duty, function(data){
            if(!data.success){
              alert(data.msg);
              return;
            }
          });
        }else{//如果还没有分配勤务
          duty.posts = $scope.records;
          console.log('save');
          Duty.save(duty, function(data){
            if(!data.success){
              alert(data.msg);
              return;
            }
            $scope.duty = new Duty(data.results);
            $scope.tqData.dutyId = data.results.id;
            
            specialDuty.update($scope.tqData, function(data){
              if(!data.success){
                alert(data.msg);
                return;
              }
              $scope.tqData = new specialDuty(data.results);
            })
          });
        }
      };

      


      

      

    };

    return {
      restrict:'EA',
      link: linker,
      replace: true,
      scope: {
        records: '=?data',
        map: "=?",
        tqData: '=?',
        onItemClick: '&',
        selected: '=?',
        duty:'=?'
      },
      // transclude:true,
      templateUrl: 'app/JCZH/TQRW/directives/tq-duty.html'
    };
  }];
});