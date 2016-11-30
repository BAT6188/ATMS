define(function(require, exports, module) {
  var controller = ['$scope', '$rootScope', 'DictCache', 'Modal', '$modalInstance', 'Message', 'token', 'VehicleQuery', 'Point', function ($scope, $rootScope, DictCache, Modal, $modalInstance, Message, token, VehicleQuery, Point) {
    
    //号牌颜色
      DictCache("PLATE_COLOR", function(dict){
          $scope.plateColors = dict;
      }, true);
      
      //方向
      DictCache("MONITOR_DIRECTION", function(dict){
          $scope.directions = dict;
      }, true);
      
      //车道
      DictCache("LANE_NUM", function(dict){
          $scope.lanes = dict;
      }, true);
      
      //车辆类型
      DictCache("CAR_TYPE", function(dict){
          $scope.carTypes = dict;
      }, true);
      
      //车身颜色
      DictCache("CAR_COLOR", function(dict){
          $scope.carColors = dict;
      }, true);
      
      //行使状态
      DictCache("TRAVEL_STATUS", function(dict){
          $scope.travelStatuses = dict;
      }, true);
    
    $scope.entity = token.entity;
    $scope.checkedNodes = token.checkedNodes;
    
    //点位树配置
    $scope.config = {
    check:{
      enable:true,
        chkboxType: {"Y" : "ps", "N" : "ps" }
      }
      ,data:{
        simpleData: {
          enable: true,
          idKey: 'id'
        },
        key: {
          name: 'name'
        }
      }
    };
    
    $scope.treeObj = null;
   $scope.data =[
              {id:1, pId:0, name:"一大队"},
              {id:2, pId:0, name:"二大队"},
              {id:3, pId:0, name:"三大队"},
              {id:6, pId:0, name:"四大队"},
              {id:4, pId:0, name:"下属县", open:true, nocheck:true},
              {id:41, pId:4, name:"睢宁县"},
              {id:42, pId:4, name:"丰县"},
              {id:43, pId:4, name:"沛县"},
              {id:5, pId:0, name:"市区", open:true, nocheck:true},
              {id:51, pId:5, name:"铜山区"},
              {id:52, pId:5, name:"贾汪区"},
              {id:53, pId:5, name:"云龙区"}
             ];
    $scope.setChecks = function(){
      console.log($scope.checkedNodes);
      if($scope.checkedNodes && $scope.checkedNodes.length > 0){
          for (var i=0, l=$scope.checkedNodes.length; i < l; i++) {
            $scope.treeObj.checkNode($scope.checkedNodes[i], true, true);
          }
        }
    };
    
    $scope.initFun = function(e, treeObj){
      $scope.treeObj = treeObj;
      if($scope.checkedNodes && $scope.checkedNodes.length > 0){
      treeObj.expandAll(true);
          for (var i=0, l=$scope.checkedNodes.length; i < l; i++) {
            if(!$scope.checkedNodes[i].isParent){
              treeObj.checkNode($scope.checkedNodes[i], true, true);
            }
          }
          treeObj.expandAll(false);
        }
        un();
    };
    
    var un = $rootScope.$on('z-tree:init', $scope.initFun);
    
/*    Point.findTreeList({}, function(treeData){
    var results = [];
        _.each(treeData.results, function(item){
          results.push(item);
        });
        $scope.data = results;
      });*/
    
    //关闭窗口
  $scope.close = function(){
    $modalInstance.close({'checkedNodes':$scope.checkedNodes, 'entity':$scope.entity});
  };
  
  //提交查询
    $scope.saveQuick = function(){
      if(!$scope.checkedNodes){
        Message.alert("提示信息", "请选择至少一个点位!", "#5CB85C");
        return;
      }
      var points = [];
      for(var i=0, size=$scope.checkedNodes.length; i<size; i++){
        if(!$scope.checkedNodes[i].isParent){
          points.push($scope.checkedNodes[i].id);
        }
      }
      if(points.length>0){
        $scope.entity.pointNos = points.join(',');
      }
      VehicleQuery.query($scope.entity, function(data){
            if(!data.success){
              alert(data.msg);
              return;
            }
            $scope.total = data.total;
            $scope.records = data.results;
            $rootScope.$un('z-tree:init', $scope.initFun);
            $modalInstance.close({'checkedNodes':$scope.checkedNodes, 'entity':$scope.entity, 'total': $scope.total, 'records': $scope.records});
        });
    };
    
    //打开地图选择模态对话框
    $scope.addPointsByMap = function(){
      Modal('./PointSelector', $scope).result
        .then(function(data){
          console.log(data);
          if(data && data.length > 0){
              for (var i=0, l=data.length; i < l; i++) {
                var nodes = $scope.treeObj.getNodesByParam("id", data[i].data.ID, null);
                $scope.treeObj.checkNode(nodes[0], true, true);
              }
           }
        });
        return;
    };
    
  }];

  module.exports = controller;

}); 