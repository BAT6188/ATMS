define(function(require, exports, module){
  var controller = ['$scope', 'Message', 'PoliceTask', 'Dict', 'DictCache','LocationMonitor', 'Modal', '$location', 'Violation',
    function($scope, Message, PoliceTask, Dict, DictCache,LocationMonitor, Modal, $location, Violation){

      $scope.entity = {
       /*"name":"周峰测试4",
        "type":{"code":"3", "name":"交通管制"},
        "occurTime":"2014-03-05 16:26:00",
        "occurAddress":"测试地点",
        "lng":117.48011,
        "lat":34.37616,
        "level":{"code":"1","name":"特大"},
        "desc":"警情描述",*/
        "status":{"code":"1","name":"未调度"}/*,
        "alarmWay":{"code":"2","name":"警员上报"},
        "dutyId":null,
        "caller":"报警人姓名",
        "phone":"1234567",*/
        /*"evaluations":null,
        "feedbacks":null,
        "merge":{"code":"1","name":"待合单"},
        "affiliate":null,
        "createUser":{"id":81,"name":null},
        "createTime":"2014-03-06 11:22:16",
        "dispatchTime":null,
        "dealStartTime":null,
        "dealEndTime":null,
        "waitTime":"2小时33分35秒",
        "area":{"code":"320000","name":null},
        "tempAffiliate":[],
        "callerFeedback":"报警人反馈",
        "isAllSplit":null*/};

      //警情类型数据字典
      DictCache('0011', function(dicts){
        $scope.types = dicts;
      });

      //警情等级数据字典
      DictCache('0012', function(dicts){
        $scope.levels = dicts;
      });

      //报警数据字典
      DictCache('0020', function(dicts){
        $scope.alarmWays = dicts;
      });

      //管辖区域数据字典
      DictCache('0036', function(dicts){
        $scope.districts = dicts;
      });

      //部门
      Violation.listDaduiList({},function(data){
        if(!data.success){
          alert(data.msg);
          return;
        }
        $scope.depts = data.results;
      });

      //重置
      $scope.reset = function(){
        $scope.entity = {"status":{"code":"1","name":"未调度"}};
      };

      //表单/地图切换
      $scope.viewChange = function() {
        Modal('./Locator', $scope.entity);
      };
      $scope.locate = function(){
        var GetCdtCtl = new OpenLayers.Control.GetCoordinate($scope.map.clientLayer,{
            callback:function(){
                $scope.entity.lng = arguments[0].x;
                $scope.entity.lat = arguments[0].y;
                $scope.$apply();
            }
        });
        $scope.map.map.addControls([GetCdtCtl]);
        GetCdtCtl.activate(1);
      }
      $scope.save = function(){
        if($scope.entity && $scope.entity.dept && $scope.entity.dept.deptCodeNew) {
            $scope.entity.deptCode = $scope.entity.dept.deptCodeNew;
        }
        PoliceTask.save($scope.entity, 
          function(data){
            if(!data.success){
              alert('操作失败！');
              return;
            }
/*              $scope.entity = {
              status: {code:'0', name:'未调度'}
            };*/
            Message.success('保存成功', '成功添加警情数据',{});
            $location.path('/JCZH.ZHDD.CommandDispatchExecuter');

          });
      };

  }];

  module.exports = controller;
});