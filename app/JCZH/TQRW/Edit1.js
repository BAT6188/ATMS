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


    $scope.removeNode = function (feature){
      $scope.map.clientLayer.removeFeatures(feature);
    };

    $scope.changeView = function (){
      $scope.mapVisible = !$scope.mapVisible;
      setTimeout(function(){$(window).resize();}, 500)
    };

    specialDuty.get({id: $routeParams.id}, function(data){
      $scope.record = data.results;
      
      if($scope.signalMap){
        if($scope.record.wkt){
          $scope.wkt = $scope.record.wkt;
          var lineft = new OpenLayers.Format.WKT().read($scope.record.wkt);
          $scope.map.exSelector.vector.addFeatures(lineft,{silent:true});
        }
        
        if($scope.record.devicesConfig){
          if(typeof($scope.record.devicesConfig)=='string'){
            $scope.record.devicesConfig = JSON.parse($scope.record.devicesConfig);
          }
          var fts = [];
          _.each($scope.record.devicesConfig,function(snc){
            var ft = new OpenLayers.Feature.Vector(
              new OpenLayers.Geometry.Point(snc.lng,snc.lat),{NAME:snc.name,config:snc.config,ID:snc.id}); 
            ft.style = OpenLayers.Feature.Vector.style['SELECT'];
            fts.push(ft);
          });
          $scope.map.clientLayer.addFeatures(fts);
        }
      }
    });
    
    //保存特勤单
    $scope.save = function (){
      if(typeof($scope.record.devicesConfig)!='string'){
        $scope.record.devicesConfig = JSON.stringify($scope.record.devicesConfig);
      }
      if($scope.record.status.code > 1){
        var flag = confirm('是否清除子任务?');
        $scope.record.ignore = !flag;
      }
      if($scope.record.wkt !== $scope.wkt){
        $scope.record.dutyId = null;
      }
      specialDuty.update($scope.record, function(data){
        $scope.record = data.results;
        var path = '/JCZH.TQRW.Create2/'+$scope.record.id;
        $location.path(path);
      });
    };

    // $scope.distribute = function (){
    //   alert('向执行任务单位派发任务!');
    //   var ids = $scope.deptIds.join(',');
    //   //下发前先保存
    //   if($scope.record.status.code > 1){
    //     var flag = confirm('是否清除子任务?');
    //     $scope.record.ignore = !flag;
    //   }
    //   specialDuty.update($scope.record, function(data){
    //     $scope.record = data.results;
    //     alert('特勤单已更新！');
    //   });

    //   specialDuty.dispatch({id:$scope.record.id,deptIds:ids},function(data){
    //     console.log(data.results);
    //     $scope.record = data.results;
    //     alert('特勤任务已下发！');
    //   });
    // };

    var passAreas = new PassAreas();
    var callback = function (event){
      console.log('callback');
      $scope.features = $scope.map.clientLayer.features;
      var lineft = $scope.map.exSelector.vector.features[0];
      $scope.record.wkt = lineft.geometry.toString();
      if(lineft){
        passAreas.getAreas(lineft.geometry,function(ids,names,areas){
          $scope.regions = '';
          _.each(names,function(name){
            $scope.regions = $scope.regions + ' '+name;
          });
        });
      }
      //任务路线，该文字只展示不保存
      $scope.interSections = _.map($scope.features, function (feature){
        return feature.attributes.NAME;
      });

      $scope.record.devicesConfig = _.map($scope.features, function (feature){
        return {
                  id:feature.attributes.ID,
                  name:feature.attributes.NAME,
                  lng:feature.geometry.x,
                  lat:feature.geometry.y,
                  config:feature.attributes.config ||'{}'  //在该js也可直接获得相应数据，现放在编辑信号机预置位页面处理
                };
      });

      // 转换为字符串
      $scope.record.devicesConfig = JSON.stringify($scope.record.devicesConfig);
    };//callback


    $scope.$watch('signalMap',function(){
      if($scope.signalMap){
        $scope.map = $scope.signalMap;
        $(".olControlEditingToolbar").css('display',"none");

        $scope.map.clientLayer.events.un({
          featuresadded: callback,
          featuresremoved: callback
        });

        $scope.map.clientLayer.events.on({
          featuresadded: callback,
          featuresremoved: callback
        });
      }
      
    });

    $scope.drawLine = function(){
      if(!$scope.map){
        return;
      }
      $scope.map.exSelector.pathCtl.deactivate();
      $scope.map.exSelector.pathCtl.activate();
      $(".buffer-input").css('display',"none");
    };


    $scope.toStep2 = function(){
      if($scope.record.id){
        var path = '/JCZH.TQRW.Create2/'+$scope.record.id;
        $location.path(path);
      }else{
        alert('请先保存！');
      }
    };

    // $scope.toStep3 = function(){
    //   if($scope.record.id){
    //     var path = '/JCZH.TQRW.Create3/'+$scope.record.id;
    //     $location.path(path);
    //   }else{
    //     alert('请先保存！');
    //   }
    // };

    // $scope.$watch('record.wkt',function(){
    //   if($scope.record.status.code > 1){
    //     var flag = confirm('是否清除子任务?');
    //     $scope.record.ignore = !flag;
    //   }
    //   specialDuty.update($scope.record, function(data){
    //     $scope.record = data.results;
    //     alert('特勤单已更新！');
    //   });

    // });

  }];

  module.exports = controller;
});