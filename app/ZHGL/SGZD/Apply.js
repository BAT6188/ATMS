define(function(require, exports, module){
    var controller = ['$scope', '$rootScope', '$location','Query', 'Restangular', 'Modal', function($scope,$rootScope, $location,Query, Rest, Modal){
      $scope.Q = Query.data();
      
      // 全选功能
      $scope.checks = [];

      $scope.select = function(index){
        $scope.checks[index] = !$scope.checks[index];
        $scope.allChecked = _.every($scope.checks);
      };

      var initCheck = function(bool){
        var checks = [];
        for(var i = 0; i < $scope.records.length; i++){
          checks.push(bool);
        }
        $scope.checks = checks;
      };

      $scope.selectAll = function(){
        $scope.allChecked = !$scope.allChecked;
        initCheck($scope.allChecked);
      };

      // 查询功能
      var _query = function(){
        var q = $scope.Q.query();

        $scope.allChecked = false;

        Rest.one('roadTakeUp/list').post('',q).then(function(data){
          $scope.total = data.total || data.results.length;
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

      $scope.remove = function(){
            
        var r = [];
        for(var i = 0, size = $scope.checks.length; i < size; i++){
          if($scope.checks[i]){
            r.push($scope.records[i].id);
          }
        }

        var ids = r.join(',');

        var bool = false;
        if(r.length===0){
          alert('请选择需要删除的记录!');
        }else{
          bool = window.confirm('确认删除这 '+ r.length + ' 条记录吗?');
        }

        
        if(!bool){
          return;
        } 

        Rest.one('roadTakeUp').doDELETE(ids).then(function (data){
         $scope.query();
        });

      };

        //分享至微信
        $scope.share2Weixin = function(record) {
            var modalInstance = Modal('Wechat', {
                'record' : record
            });
            modalInstance.result.then(function(data) {
                return;
            });
        };

    }];

    module.exports = controller;
});