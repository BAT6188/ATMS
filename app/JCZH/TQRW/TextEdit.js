define(function(require, exports, module){
  
  var controller = ['$scope', '$rootScope', 'PassAreas','LocationMonitor', '$location','specialDuty','$routeParams','Duty','Restangular',
  function ($scope, $rootScope, PassAreas, LocationMonitor, $location,specialDuty,$routeParams,Duty,Rest){
    $('[ng-view]').removeClass('viewport').addClass('container');

    LocationMonitor.beforeLeave(function(){
      $('[ng-view]').removeClass('container').addClass('viewport');
    });

    $scope.config = [{
      "label":"信号", 
      "name":"deviceVideo",
      "cls":"layerSignal",
      "url":"../giserver/configs/deviceSignal/",
      "visible": true
    }];

    $scope.ifEdit = true;
    $scope.ifDis = true;

    //定义路线样式
    var pathStyle = OpenLayers.Util.extend(
      OpenLayers.Util.extend({},
          OpenLayers.Feature.Vector.style['default']), 
      {
        strokeColor: "#47a447",
        strokeWidth: 3
    });

    $scope.execute = function (){
      Rest.all('').one('stask',$scope.record.id).one('start').get().then(function(data){
        alert('执行任务，转至操作人员界面');
      });

      $location.path('/JCZH.TQRW.Execute/'+$scope.record.id);
    };

    $scope.lookon = function (){
      alert('观看任务执行，转至实时状态界面');
      $location.path('/JCZH.TQRW.Cast/'+$scope.record.id);
    };


    $scope.editSignal = function (){
      if(!$scope.record.id){ //保存
        specialDuty.save($scope.record, function(data){
          $scope.record = data.results;
          alert('特勤任务单已保存,编辑信号机列表预置位,转至编辑页面');
          var path = '/JCZH.TQRW.SignalEdit/'+$scope.record.id;
          $location.path(path);
        });
      }else{ //更新
        alert('特勤任务单已保存,编辑信号机列表预置位,转至编辑页面');
        var path = '/JCZH.TQRW.SignalEdit/'+$scope.record.id;
        $location.path(path);
      }
    };


    $scope.removeNode = function (feature){
      $scope.map.clientLayer.removeFeatures(feature);
    };

    $scope.changeView = function (){
      $scope.mapVisible = !$scope.mapVisible;
      setTimeout(function(){$(window).resize();}, 500)
    };

    $scope.changeView1 = function (){
      $scope.map1Visible = !$scope.map1Visible;
      setTimeout(function(){$(window).resize();}, 500)
    };


    specialDuty.get({id: $routeParams.id}, function(data){
      origin = data.results;
      $scope.record = angular.copy(origin);
      
      if($scope.signalMap){
        if($scope.record.wkt){
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
    
    //保存特勤单
    $scope.save = function (){
      if(typeof($scope.record.devicesConfig)!='string'){
        $scope.record.devicesConfig = JSON.stringify($scope.record.devicesConfig);
      }
      if($scope.record.status.code > 1){
        var flag = confirm('是否清除子任务?');
        $scope.record.ignore = !flag;
      }
      specialDuty.update($scope.record, function(data){
        $scope.record = data.results;
        alert('特勤单已更新！');
      });
      console.log($scope.record);
    };

    $scope.editSignal = function (){
      alert('编辑信号机列表预置位,转至编辑页面');
      var path = '/JCZH.TQRW.SignalEdit/'+$scope.record.id;
      $location.path(path);
    };
    
    $scope.distribute = function (){
      alert('向执行任务单位派发任务!');
      var ids = $scope.deptIds.join(',');
      //下发前先保存
      if($scope.record.status.code > 1){
        var flag = confirm('是否清除子任务?');
        $scope.record.ignore = !flag;
      }
      specialDuty.update($scope.record, function(data){
        $scope.record = data.results;
        alert('特勤单已更新！');
      });

      specialDuty.dispatch({id:$scope.record.id,deptIds:ids},function(data){
        console.log(data.results);
        $scope.record = data.results;
        alert('特勤任务已下发！');
      });
    };

    

    var passAreas = new PassAreas();
    var callback = function (event){
      console.log('callback');
      $scope.features = $scope.map.clientLayer.features;
      var lineft = $scope.map.exSelector.vector.features[0];
      $scope.record.wkt = lineft.geometry.toString();

      if(lineft){
        if($scope.postMap){
          var ft = lineft.clone();
          ft.style = pathStyle;
          $scope.postMap.clientLayer.removeAllFeatures();
          $scope.postMap.clientLayer.addFeatures(ft);
        }
        passAreas.getAreas(lineft.geometry,function(ids,names,areas){
          $scope.deptIds = ids; //对应数据库部门code
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

      //信号机变化，自动更新特勤任务
      // specialDuty.update($scope.record, function(data){
      //   $scope.record = data.results;
      // });
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

    $scope.$watch('postMap',function(){
      if($scope.postMap){
        
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
            $scope.$apply();
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


    var duty = {
      frequence: {code: 1},
      status: {code: 1},
      posts: []
    };

    var savePostsFunc = function(){
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

      //如果已经分配了勤务
      if($scope.duty){
        $scope.duty.posts = $scope.posts;
        console.log('update');
        Duty.update($scope.duty, function(data){
          alert('岗位已更新！');
          $scope.ifDis = false;
        });
      }else{//如果还没有分配勤务
        duty.posts = $scope.posts;
        console.log('save');
        Duty.save(duty, function(data){
          
          $scope.duty = new Duty(data.results);
          $scope.record.dutyId = data.results.id;

          if($scope.record.status.code > 1){
            var flag = confirm('是否清除子任务?');
            $scope.record.ignore = !flag;
          }
          specialDuty.update($scope.record, function(data){
            $scope.ifDis = false;
            $scope.record = data.results;
            alert('岗位已保存！');
          })
        });
      }
    };

    $scope.savePosts = function(){
      savePostsFunc();
    };


    $scope.$watch('regions', function (record){
      if($scope.regions){
        $scope.ifEdit = false;
      }
    },true);

    $scope.$watch('record.wkt', function (record){
      if($scope.record && $scope.record.wkt){
        $scope.ifDis = false;
      }
    },true);


  }];

  module.exports = controller;
});