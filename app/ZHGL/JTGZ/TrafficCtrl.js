define(function (require, exports, module) {
  return ['$scope','$rootScope', '$location','Query', 'Restangular', 'Modal', function ($scope, $rootScope,$location,Query, Rest, Modal) {

    $scope.Q = {limit:10,page:1};

    // 全选功能
    $scope.checks = [];

    $scope.select = function(index){
        $scope.checks[index] = !$scope.checks[index];
        $scope.allChecked = _.every($scope.checks);
    };

    var initCheck = function(bool){
        var checks = [];
        for(var i = 0; i < $scope.total; i++){
            checks.push(bool);
        }
        $scope.checks = checks;
    };

    $scope.selectAll = function(){
      $scope.allChecked = !$scope.allChecked;
      initCheck($scope.allChecked);
    }

    // 查询功能
    var _query = function(){
        var q = $scope.Q;

        $scope.allChecked = false;

        Rest.all('trafficCtrl/list').post(q).then(function(data){
            if(!data.success){
              alert(data.msg);
              return;
            }
            $scope.total = data.total;
            $scope.records = data.results;
            initCheck(false);
        });

    };

    _query();

    $scope.pChange = function(page){
        $scope.Q.page = page;
        _query();
    };

    $scope.query = function(){
        $scope.pChange(1);
    };

    //删除
    $scope.remove = function(){
        var r = [];

        for(var i = 0, size = $scope.checks.length; i < size; i++){
            if($scope.checks[i]){
                r.push($scope.records[i].id);/*注意*/
            }
        }

        var ids = r.join(',');

        var bool = false;
        if(r.length===0){
            alert('请选择需要删除的记录!');
        }else{
            bool = confirm('确认删除这 '+ r.length + ' 条记录吗?');
        }

        if(!bool) return;
        Rest.one('trafficCtrl',ids).doDELETE().then(function(data){
          if(data.success){
            alert('删除成功');
            _query();
          }else{
            alert('删除失败');
          }
        });
    };

    //分享至微信
    $scope.share2Weixin = function(record) {
        var modalInstance = Modal('TrafficCtrlWechat', {'record' : record});
        modalInstance.result.then(function(data) {
            return;
        });
    };

  }];
});