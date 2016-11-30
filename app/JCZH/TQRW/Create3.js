define(function(require, exports, module){
  
  var controller = ['$scope', '$rootScope', 'PassAreas','LocationMonitor', '$location','specialDuty','$routeParams','Duty','Restangular',
  function ($scope, $rootScope, PassAreas, LocationMonitor, $location,specialDuty,$routeParams,Duty,Rest){

    $scope.config = [{
      "label":"信号", 
      "name":"deviceVideo",
      "cls":"layerSignal",
      "url":"../giserver/configs/deviceSignal/",
      "visible": true
    }];

    var duty = {
      frequence: {code: 1},
      status: {code: 1},
      posts: []
    };

    var saveFunc = function(){
      $scope.posts= [];
      _.each($scope.points,function(point){
        var post = {
          lng: point.geometry.x,
          lat: point.geometry.y,
          startTime:'2014-05-12',
          endTime:'2014-05-12',
          polices: [],
          type:{code:4},
          address: ' ',
          name: '岗位'+point.geometry.x
        };
        $scope.posts.push(post);
      });

      //创建勤务
      angular.extend(duty, {
        name: '特勤任务>>' + $scope.record.name,
        type: {code: 4,name:''},
        level: $scope.record.level || {code:1,name:''},
        startTime: $scope.record.startTime ||'2014-05-12',
        endTime: $scope.record.endTime ||'2014-05-12',
        desc: '特勤任务>>' + $scope.record.name + ', ' + $scope.record.description
      });
    };

    $scope.savePosts = function(){
      saveFunc();
      //如果已经分配了勤务
      if($scope.duty){
        $scope.duty.posts = $scope.posts;
        Duty.update($scope.duty, function(data){
          alert('岗位已保存！');
        });
      }else{//如果还没有分配勤务
        duty.posts = $scope.posts;
        Duty.save(duty, function(data){
          $scope.duty = data.results;
          $scope.record.dutyId = data.results.id;

          if($scope.record.status.code > 1){
            var flag = confirm('是否清除子任务?');
            $scope.record.ignore = !flag;
          }
          specialDuty.update($scope.record, function(data){
            $scope.record = data.results;
            alert('岗位已保存！');
          })
        });
      }
    };

    $scope.toStep2 = function(){
      saveFunc();
      //如果已经分配了勤务
      if($scope.duty){
        $scope.duty.posts = $scope.posts;
        console.log('update');
        Duty.update($scope.duty, function(data){
          var path = '/JCZH.TQRW.Create2/'+$scope.record.id;
          $location.path(path);
          alert('岗位已保存！');
        });
      }else{//如果还没有分配勤务
        duty.posts = $scope.posts;
        console.log('save');
        Duty.save(duty, function(data){
          $scope.duty = new Duty(data.results);
          $scope.record.dutyId = data.results.id;

          if($scope.record.status && $scope.record.status.code > 1){
            var flag = confirm('是否清除子任务?');
            $scope.record.ignore = !flag;
          }

          specialDuty.update($scope.record, function(data){
            $scope.record = data.results;
            var path = '/JCZH.TQRW.Create2/'+$scope.record.id;
            $location.path(path);
          })
        });
      }
    };



    //定义路线样式
    var pathStyle = OpenLayers.Util.extend(
      OpenLayers.Util.extend({},
          OpenLayers.Feature.Vector.style['default']), 
      {
        strokeColor: "#47a447",
        strokeWidth: 3
    });

    // $scope.execute = function (){
    //   Rest.all('').one('stask',$scope.record.id).one('start').get().then(function(data){
    //     alert('执行任务，转至操作人员界面');
    //   });

    //   $location.path('/JCZH.TQRW.Execute/'+$scope.record.id);
    // };

    // $scope.lookon = function (){
    //   alert('观看任务执行，转至实时状态界面');
    //   $location.path('/JCZH.TQRW.Cast/'+$scope.record.id);
    // };

    var passAreas = new PassAreas();
    specialDuty.get({id: $routeParams.id}, function(data){
      $scope.record = data.results;

      if($scope.postMap){
        if($scope.record.wkt){
          
          passAreas.getAreas($scope.record.wkt,function(ids,names,areas){
            $scope.deptIds = ids.join(','); //对应数据库部门code
            console.log($scope.deptIds);
          });

          var lineft = new OpenLayers.Format.WKT().read($scope.record.wkt);
          var ft = lineft.clone();
          ft.style = pathStyle;
          $scope.postMap.clientLayer.removeAllFeatures();
          $scope.postMap.clientLayer.addFeatures(ft);
        }
      }

      if($scope.record.dutyId){
        Duty.get({id:$scope.record.dutyId},function(data){
          var points = data.results.posts;
          var pts = [];
          _.each(points,function(point){
            var pt = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(point.lng,point.lat));
            pts.push(pt);
          });
          $scope.layer.addFeatures(pts);
        });
      }

    });
    

    $scope.distribute = function (){
      specialDuty.dispatch({id:$scope.record.id,deptIds:$scope.deptIds},function(data){
        $scope.record = data.results;
        alert('特勤任务已下发！');
        var path = '/JCZH.TQRW.List';
        $location.path(path);
      });
    };

  
    $scope.$watch('postMap',function(){
      if($scope.postMap){
        var postStyle = OpenLayers.Util.extend(
          OpenLayers.Util.extend({},
              OpenLayers.Feature.Vector.style['default']), 
          {
            graphic:true,
            graphicWidth:32,
            externalGraphic:"/atms/resources/img/marker.png",
            graphicOpacity:1

            // fillOpacity: 2,
            // fillColor: "#5BC0DE" ,
            // strokeColor: "white",
            // strokeWidth: 2,
            // pointRadius: 12,
            // label: '岗',
            // fontSize: 12,
            // fontColor: "#5BC0DE"
        });

        var postStyleMap = new OpenLayers.StyleMap({
            "default": postStyle
        });

        //创建绘制路线的图层，地图加载完成后添加到地图
        var layer = $scope.layer = new OpenLayers.Layer.Vector("postLayer", {
          displayInLayerSwitcher: false,
          styleMap: postStyleMap
        });

        $scope.layer.events.on({
          featuresadded: function(ft){
            $scope.points = $scope.layer.features;
            $scope.$apply();
          },
          featuresremoved: function(ft){
            $scope.points = $scope.layer.features;
            // $scope.$apply();
          }
        });

        //创建绘制工具
        $scope.drawTool = new OpenLayers.Control.DrawFeature(layer, OpenLayers.Handler.Point);
        $scope.postMap.map.addLayers([layer]);
        $scope.postMap.map.addControls([$scope.drawTool]);
      }
      
    });

    $scope.addPosts = function(){
      if(!$scope.postMap){
        return;
      }
      $scope.drawTool.activate();
    };

    $scope.removePost = function(post){
      $scope.layer.removeFeatures(post);
    };

  }];

  module.exports = controller;
});