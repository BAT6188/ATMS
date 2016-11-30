define(function(require, exports, module){
  return ['DictCache', 'specialDuty', '$routeParams', '$window', 'PassAreas','Dept','$location',function(DictCache, specialDuty, $routeParams, $window,PassAreas,Dept,$location){
    
    var linker = function ($scope, el, attrs){

      var style = OpenLayers.Util.extend(
                OpenLayers.Util.extend({},
                    OpenLayers.Feature.Vector.style['default']), 
                {
                  fillOpacity: 1, 
                  strokeColor: "green",
                  strokeWidth: 3,
                  pointRadius:10
              });
      var layer = new OpenLayers.Layer.Vector('line');
      
      $scope.layer = layer;

      //字典数据等
      DictCache('0015', function(dicts){
        $scope.levels = dicts;
      });

      $scope.$watch('record', function(){
        if($scope.map && $scope.record && $scope.record.lineMap){
          $scope.map.clientLayer.removeAllFeatures();

          $scope.map.map.addLayer(layer);

          //绘制线路
          var lineft = new OpenLayers.Format.WKT().read($scope.record.lineMap);
          lineft.style = style;
          layer.addFeatures(lineft);
          $scope.map.map.zoomToExtent(lineft.geometry.getBounds());

          // $scope.map.drawline($scope.record.lineMap);

          var passAreas = new PassAreas();
          passAreas.getAreas($scope.record.lineMap,function(ids,names,areas){
            Dept.query({}, function (data){
              if(!data.success){
                alert(data.msg);
                return;
              }
              $scope.records = data.results;
              var data = _.filter($scope.records, function(record){
                for(var i=0;i<names.length;i++){
                  if(names[i] === record.deptName){
                    return record;
                  }
                }
              });
              $scope.depts = data;
            });

          });

        }
      });

      specialDuty.get({id: $routeParams.id}, function(data){
        if(!data.success){
          $window.alert(data.msg);
        }
        $scope.record = new specialDuty(data.results);

      });

      //绘制路线
      $scope.editRoute = function (){
        $scope.map.toDrawLine(function(geometry){
          $scope.record.lineMap = geometry.toString();

          layer.removeAllFeatures();
          var lineft = new OpenLayers.Format.WKT().read($scope.record.lineMap);
          lineft.style = style;
          layer.addFeatures(lineft);

        });
      };

      $scope.update = function (){
        $scope.record.$update(function(data){
          if(!data.success){
            alert(data.msg);
          }
          // $scope.record = new specialDuty(data.results);
          alert('更新成功!');

          if(data.results.id===0){
            $location.path('JCZH.TQRW.Edit/' + $scope.record.id + '/');
          }

          //为何chidStaskModels内容都为null
        });
      }

      $scope.push = function (){
        $scope.record.parentStaskId = 0;
        $scope.record.status = {code: 1};
        $scope.record.childIds = _.pluck($scope.depts, 'deptCode');
        $scope.update();
        //跳转到edit页面
      };

    };

    return {
      restrict:'EA',
      link: linker,
      scope: {
        onCreateRoute: '&',
        onSave: '&',
        record: '=?data',
        depts: '=?',
        map: '=?',
        posts:'=?',
        layer: '=?'
      },
      templateUrl: 'app/JCZH/TQRW/directives/tq-info.html'
    };
  }];
});