define(function(require, exports, module){
  
  var controller = ['$scope', '$rootScope', 'PassAreas','LocationMonitor', '$location','specialDuty','Duty',
  function ($scope, $rootScope, PassAreas, LocationMonitor, $location,specialDuty,Duty){
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
    

    //保存特勤单
    $scope.save = function (){
      if(!$scope.record.id){ //保存
        specialDuty.save($scope.record, function(data){
          $scope.record = data.results;
          alert('特勤单保存成功');
        });
      }else{ //更新
        specialDuty.update($scope.record, function(data){
          $scope.record = data.results;
          alert('特勤单更新成功');
        });
      }
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
        alert('编辑信号机列表预置位,转至编辑页面');
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

    //定义路线样式
    var pathStyle = OpenLayers.Util.extend(
      OpenLayers.Util.extend({},
          OpenLayers.Feature.Vector.style['default']), 
      {
        strokeColor: "#47a447",
        strokeWidth: 3
    });
    var passAreas = new PassAreas();
    var callback = function (event){
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
                  config:{}  //在该js也可直接获得相应数据，现放在编辑信号机预置位页面处理
                };
      });
      //转换为字符串
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
      // if(!$scope.record.id){
      //   if(!$scope.record.name){
      //     alert('请先输入特勤单名称！');
      //     return;
      //   }
      //   specialDuty.save($scope.record, function(data){
      //     $scope.record = data.results;
      //   });
      // }
      if(!$scope.postMap){
        return;
      }
      $scope.drawTool.activate();

    };

    $scope.removePost = function(point){
      $scope.layer.removeFeatures(point);
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
        planStartTime: $scope.record.planStartTime ||'2014-05-12',
        planEndTime: $scope.record.planEndTime ||'2014-05-12',
        desc: '特勤任务>>' + $scope.record.name + ', ' + $scope.record.description
      });

      //如果已经分配了勤务
      if($scope.duty){
        $scope.duty.posts = $scope.posts;
        console.log('update');
        Duty.update($scope.duty, function(data){
          $scope.ifDis = false;
        });
      }else{//如果还没有分配勤务
        duty.posts = $scope.posts;
        console.log('save');
        Duty.save(duty, function(data){
          if (!data.success) {
              alert(data.msg);
              return;
          }
          $scope.duty = new Duty(data.results);
          $scope.record.dutyId = data.results.id;

          specialDuty.update($scope.record, function(data){
            $scope.ifDis = false;
            $scope.record = data.results;
          })
        });
      }
    };

    $scope.savePosts = function(){
      // if(!$scope.record.id){ //保存
      //   specialDuty.save($scope.record, function(data){
      //     // $scope.record = data.results;
      //     savePostsFunc();
      //     alert('特勤任务单已保存,岗位已保存');
      //   });
      // }else{
        savePostsFunc();
      // }
    };

    $scope.distribute = function (){
      alert('向执行任务单位派发任务!');
      var ids = $scope.deptIds.join(',');
      specialDuty.dispatch({id:$scope.record.id,deptIds:ids},function(data){
        alert('特勤任务下发成功');
      });
    };

    //初始设置
    $scope.record = {
      // pid: '',//主任务
      // dutyId: '',//勤务
      // startTime:'',//实际开始时间
      // endTime:'',//实际结束时间
      name: '',//任务名称
      planStartTime:'',//计划开始时间
      requirements:'1，优先通行；2，有条件的路口实行绿波（有遥控器的路口使用遥控器执行「绿波」）；3，各单位要在主要路口、路段加强警力。',//任务要求
      carNo:'苏C12423',//前导车号
      contact:'XXX',//联系人
      contactTel:'12368789',//联系电话
      wkt:'',//特勤路线
      // devicesConfig:{}//设置配置

      // id: , //后
      // createTime:,//创建时间,后
      // createUser:,//创建用户,后
      // createDept:,//创建部门,后
      // resDept://责任部门,后
      // status:,//责任部门,后

      // planEndTime:'',//计划结束时间
      // description:'',//任务描述
      // type:,//状态
      // subIds:,//子任务ID集合
      // subReadyIds://就绪子任务ID集合
    };

    $scope.$watch('record', function (record){
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