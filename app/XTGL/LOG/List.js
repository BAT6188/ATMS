define(function(require, exports, module){
    var controller = ['$scope', 'Query','Log','Message','DictCache', 
      function($scope, Query,Log, Message, DictCache){
        $scope.showAdvance = false;
        
        $scope.Q = Query.data();
        $scope.showAdvance = false;

        //日志类型字典
        DictCache("0045", function(dict){
            $scope.types = dict;
        }, true);

        //日志执行结果字典
        DictCache("0044", function(dict){
            $scope.results = dict;
        }, true);

        //功能模块字典
        DictCache("0043", function(dict){
            $scope.modules = dict;
        }, true);

        //切换查询方式
        $scope.advance = function(){
          $scope.showAdvance = !$scope.showAdvance;
          $scope.Q.startTime = null
            $scope.Q.endTime = null;
        };

        // 全选功能
        $scope.checks = [];
        $scope.allChecked = false;


        $scope.select = function(index){
            $scope.checks[index] = !$scope.checks[index];
            $scope.allChecked = _.every($scope.checks);
        };

        $scope.selectAll = function(){
            initCheck($scope.allChecked,$scope.records.length);
        };

        //初始化
        var initCheck = function(bool,num){
            var checks = [];
            for(var i = 0; i < num; i++){
                checks.push(bool);
            }
            $scope.checks = checks;
        };

        var _query = function(){
            var q = $scope.Q.query();

            $scope.allChecked = false;

            Log.query(q, function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                $scope.total = data.total;

                $scope.records = data.results;
                initCheck($scope.allChecked,$scope.records.length);
            });
        };

        $scope.pChange = function(page){
            $scope.Q.page = page;
            _query();
        };

        $scope.query = function(){
            $scope.pChange(1);
        };

        $scope.infoModal = function(record){
            $scope.checkRecord = record;
            $('#infoModal').modal();
        };
               
        _query(); 
    }];

    module.exports = controller;
});