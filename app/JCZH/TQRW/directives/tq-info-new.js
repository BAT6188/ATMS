define(function(require, exports, module){
  return ['DictCache', 'specialDuty', 'Duty', '$window','PassAreas','Dept', '$location',function(DictCache, specialDuty, Duty, $window,PassAreas,Dept,$location){
    
    var linker = function ($scope, el, attrs){
      //字典数据等
      DictCache('0015', function(dicts){
        $scope.levels = dicts;
      });

      $scope.record = {
        name: 'A 计划',
        startPoint: 'A 点',
        endPoint: 'B 点',
        startTime: '2014-01-08 15:31:26',
        endTime: '2014-01-08 15:51:26',
        lineDesc: '',//路线描述
        // sncs: [],
        // monitors: [],
        principal:{id:81,name:""},
        principalPhone:"110120119",
        level: {code: '1'},
        status: {code: '0'},//任务状态, 未执行
        parentStaskId: 0,
        desc: '。。。。'//任务描述
      };

      //保存特勤任务
      $scope.save = function(){
        specialDuty.save($scope.record, function(data){
          if(!data.success){
            $window.alert(data.msg);
            return;
          }
          $scope.record = data.results;
          console.log($scope.record);
          $scope.onSave({'$data': $scope.record});
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
        });
      };

      //下发
      $scope.push = function (){
        $scope.record.parentStaskId = 0;
        $scope.record.status = {code: 1};
        // $scope.record.childIds = _.pluck($scope.depts, 'deptId');
        $scope.record.childIds = _.pluck($scope.depts, 'deptCode');
        $scope.update();
        
        // console.log(_.pluck($scope.depts, 'deptId'));
      };

      
      // $scope.$watch('posts',function(){
      //   console.log($scope.posts);
      // });

      //绘制路线
      $scope.editRoute = function (){
        $scope.map.toDrawLine(function(geometry){
          // $scope.onCreateRoute(geometry);
          $scope.record.lineMap = geometry.toString();

          var layer = new OpenLayers.Layer.Vector('line');
          var lineft = new OpenLayers.Format.WKT().read($scope.record.lineMap);

          var style = OpenLayers.Util.extend(
                OpenLayers.Util.extend({},
                    OpenLayers.Feature.Vector.style['default']), 
                {
                  fillOpacity: 1, 
                  strokeColor: "green",
                  strokeWidth: 3,
                  pointRadius:10
              });
          lineft.style = style;
          $scope.map.map.addLayer(layer);
          $scope.map.clientLayer.removeAllFeatures();
          layer.addFeatures(lineft);
          
          var passAreas = new PassAreas();
          passAreas.getAreas($scope.record.lineMap,function(ids,names,areas){
            // var q = {parentdeptCode:'0001'};
            //通过某个接口，查询所有支队和大队（孙晨杰负责）
            Dept.query({}, function (data){
              if(!data.success){
                alert(data.msg);
                return;
              }
              var data = _.filter(data.results, function(record){
                for(var i=0;i<ids.length;i++){
                  if(record.area && ''+ids[i] === record.area.code){
                    return record;
                  }
                }
              });
              $scope.depts = data;
              // $scope.record.childIds = _.pluck($scope.depts, 'deptId');
            });

          });

        });
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
        map: '=',
        posts:'='
      },
      templateUrl: 'app/JCZH/TQRW/directives/tq-info.html'
    };
  }];
});