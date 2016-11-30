define(function(require, exports, module) {
  var controller = ['Restangular', '$scope', '$routeParams', 'PoliceTask', 'Accident','PoliceTaskFeedback', 'Evaluate', 'DictCache', 'Buffer', '$compile',
  function(Restangular, $scope, $routeParams, PoliceTask, Accident,PoliceTaskFeedback, Evaluate, DictCache, Buffer, $compile) {

    // Restangular.all('atms').one('data').one('lyrs.json').get().then(function (data){
    //   $scope.config = data;
    // });

    var exStyles = new OpenLayers.ExStyles(); //样式
    //*********警情类型分为普通和重大两类，只有重大的才需要权限控制_start
    $scope.ptaskTypeIsMajor = function() {
      var isMajor = false;
      if ($scope.record && $scope.record.type && $scope.record.type.code) {
        //1~11，交通事故，交通拥堵，交通管制，稽查布控，车辆违法，自然灾害，危化品运输，群体性事件，道路改造，治安管理，其他事件
        var ptaskType = {
          '重大' : ['1'],
          '普通' : ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11']
        };
        var pt4Major = ptaskType["重大"];
        for (var i = 0, j = pt4Major.length; i < j; i++) {
          if (pt4Major[i] && pt4Major[i] === $scope.record.type.code) {
            isMajor = true;
            break;
          }
        }
      }
      return isMajor;
    };
    //*********警情类型分为普通和重大两类，只有重大的才需要权限控制_end

    //警情类型数据字典
    DictCache('0011', function(dicts) {
      $scope.types = dicts;
    });

    //警情等级数据字典
    DictCache('0012', function(dicts) {
      $scope.levels = dicts;
    });

    //报警数据字典
    DictCache('0020', function(dicts) {
      $scope.alarmWays = dicts;
    });

    //获取警情数据
    var getPTask = function() {
      PoliceTask.get({
        id : $routeParams.id
      }, function(data) {
        if (!data.success) {
          alert(data.msg || '后台出错');
          return;
        }
        $scope.record = data.results;
        if (data.results.dutyId) {

        };
        /*
        if (data.results.id) {
          Accident.query({
            ptaskId:data.results.id
          },function(data){
            $scope.accident = data.results[0];
          });
        }
        */
      });
    };

    //获取评价
    var getEvaluation = function() {
      Evaluate.query({
        'ptaskId' : $routeParams.id
      }, function(data) {
        if (!data.success) {
          alert(data.msg || '后台出错');
          return;
        }
        $scope.evaluations = data.results || [];
      });
    };

    $scope.detail = function(record) {
      $scope.detailItem = $scope.selectedItem.title;
      $scope._device = record;
    };

    $scope.$watch('selectedItem', function() {
      $scope.detailItem = null;
      if (!$scope.selectedItem) {
        return;
      }
      $scope.$parent.tipType = $scope.selectedItem.name;
    });

    $scope.onItemClick = function(viewCode) {
      $scope.viewCode = viewCode;
      $scope.devices = [];
      $scope.initJqnearby = [];
    };

    $scope.update = function() {
      PoliceTask.update($scope.record, function(data) {
        if (!data.success) {
          alert(data.msg || '后台出错');
          return;
        }
        alert('更新成功!');
      }, function(e) {
        alert('后台出错!');
      });
    };

    $scope.saveFeedback = function(police, file) {
      var feedback = {
        'policeNo' : police.id,
        'policeName' : police.name,
        'ptaskId' : $scope.record.id,
        'feedbackTime' : new Date(),
        'fileContent' : (file.fileContent) ? file.fileContent : null,
        'fileType' : (file.fileType) ? file.fileType : null,
        'filePath' : (file.filePath) ? file.filePath : null
      };

      PoliceTaskFeedback.save(feedback, function(data) {
        if (!data.success) {
          alert(data.msg || '后台出错');
          return;
        }
      });
    };

    //完结该警情
    $scope.finish = function() {
      var pt = {};
      //警情id
      pt.id = $scope.record.id;
      //状态为3-完结
      pt.status = {
        code : '3',
        name : '已处置'
      };
      pt.dutyId = $scope.record.dutyId;
      PoliceTask.update(pt, function(data) {
        if (!data.success) {
          alert(data.msg || '后台出错');
          return;
        }
        alert('更新成功!');
        $scope.record.status = {
          code : '3',
          name : '已处置'
        };
        $(window).resize();
      }, function(e) {
        alert('后台出错!');
      });
    };

    $scope.baseShow = 'info';
    $scope.viewCode = '1';

    getPTask();
    getEvaluation();

    $scope.onPoliceClick = function ($item){
      if($scope._police === $item){
        $scope._police = null;
      }else{
        $scope._police = $item; 
      }
    };

  }];

  module.exports = controller;

});
