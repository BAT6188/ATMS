define(function(require, exports, module){
  
  var controller = ['$scope', '$rootScope', 'PassAreas','LocationMonitor', '$location','specialDuty','Duty',
  function ($scope, $rootScope, PassAreas, LocationMonitor, $location,specialDuty,Duty){

    $scope.config = [{
      "label":"信号", 
      "name":"deviceVideo",
      "cls":"layerSignal",
      "url":"../giserver/configs/deviceSignal/",
      "visible": true
    }];

    $scope.toStep2 = function(){
      if($scope.record.id){
        specialDuty.update($scope.record, function(data){
          $scope.record = data.results;
          var path = '/JCZH.TQRW.Create2/'+$scope.record.id;
          $location.path(path);
        });
      }else{
        alert('请先保存！');
      }
    };

    //保存特勤单
    $scope.save = function (){
      if(!$scope.record.wkt){
        alert('请先绘制特勤线路');
        return;
      }
      specialDuty.save($scope.record, function(data){
        $scope.record = data.results;
        var path = '/JCZH.TQRW.Create2/'+$scope.record.id;
        $location.path(path);
      });
    };

    $scope.removeNode = function (feature){
      $scope.map.clientLayer.removeFeatures(feature);
    };

    $scope.changeView = function (){
      $scope.mapVisible = !$scope.mapVisible;
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

    //初始设置
    $scope.record = {
      name: '',//任务名称
      planStartTime:'',//计划开始时间
      requirements:'1，优先通行；2，有条件的路口实行绿波（有遥控器的路口使用遥控器执行「绿波」）；3，各单位要在主要路口、路段加强警力。',//任务要求
      carNo:'苏C12423',//前导车号
      contact:'XXX',//联系人
      contactTel:'12368789',//联系电话
      wkt:''//特勤路线
    };

  }];

  module.exports = controller;
});