define(function (require, exports, module) {
  return ['$scope', 'Query', 'Restangular', function ($scope, Query, Rest) {
    $scope.title = '综合管理 > 设备设施管理 > 卡口点位管理';

    $scope.Q = Query.data();

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
        var q = $scope.Q.query();

        $scope.allChecked = false;

        Rest.all('devPoint/list').post(q).then(function(data){
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
  }];
});