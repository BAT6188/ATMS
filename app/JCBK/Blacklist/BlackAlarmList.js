define(function () {'use strict';
  return ['$scope', 'Modal', 'ngTableParams', 'Restangular', 'DictCache', function($scope, Modal, ngTableParams, Restangular, DictCache){
    
    window.setTimeout(function(){
      $('.modal-dialog').width(850);
    });
    
    //报警类型字典
    DictCache('ALARM_TYPE', function (dicts){
      $scope.alarmTypes = dicts;
    });

    //处理标记
    $scope.statuses = [
      {'name': '未处理', 'code': '0'},
      {'name': '已处理', 'code': '1'}
    ];
    
    $scope.status = {};
    
    $scope.tableParams = new ngTableParams($scope.tableParameters, {
      getData: function ($defer, params) {
        var pointNos = [];

        angular.forEach($scope.points,function(p){
          if(p.targetId){
            pointNos.push(p.targetId);
          }
        }); 
        
        var queryParams = {
          dispType: 1,
          alarmStartTime: $scope.alarmStartTime==null ? '':$scope.alarmStartTime,
          alarmEndTime: $scope.alarmEndTime==null ? '':$scope.alarmEndTime,
          mark: $scope.mark==null ? '':$scope.mark,
          alarmType: $scope.alarmType==null ? '':$scope.alarmType,
          page: params.page(),
          limit: params.count(),
          total:params.total()
        };

        if(pointNos.length > 0){
          queryParams.pointNos = pointNos;
        }

        Restangular.all('alarm/list').post(queryParams).then(function (data) {
            params.total(data.total);
            $scope.records = data.results;
            $defer.resolve(data.results);
        });
      }
    });
    
    //查询
    $scope.query = function(){
      if($scope.tableParams.page() == 1){
        $scope.tableParams.reload();
      }else{
        $scope.tableParams.page(1);
      }
    };
    
        //查看详情
    $scope.alarmInfoModal = function(record){
      if(record.alarmType.code === '1'){//布控
        Modal('AlarmInfo', {'record':record}).result.then(function(data){});
      }else if(record.alarmType.code === '2'){//黑名单布控
        Modal('BlackAlarmInfo', {'record':record}).result.then(function(data){});
      }
    };
    
    //批量处理
    $scope.batchMark = function(){
      var ids =[];
      var checked = $scope.tableParams.selectedItems();
      angular.forEach(checked, function(item){
        ids.push(item.alarmId);
      });
      if(ids.length === 0){
        return Messenger().post({
          message: '请选择需要处理的数据！',
          type: 'warning',
          id: 'warning',
          showCloseButton: true,
          hideAfter: 3
        })
      }
      Restangular.all('alarm/mark/' + ids.toString()).post().then(function(data){
        delResultHandler(data, '更新成功！', data.msg?data.msg:'更新失败!');
      });
    };
    
    //处理
    $scope.mark = function(record){
      record.mark = "1";
      Restangular.one('alarm/mark', record.alarmId).post().then(function(data){
        delResultHandler(data, '更新成功！', data.msg ? data.msg : '更新失败!');
      });
    };
    
    function delResultHandler(data, successMsg, errorMsg){
      if(data.success){
        Messenger().post({
          id: 'msg',
          message: successMsg,
          type: 'success',
          showCloseButton: true,
          hideAfter: 3
        });
        $scope.tableParams.reload();
      }else{
        Messenger().post({
          id: 'msg',
          message: errorMsg,
          type: 'error',
          showCloseButton: true,
          hideAfter: 3
        });
      }
    }
        
  }];
});