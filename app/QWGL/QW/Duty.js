define(function(require, exports, module){

    var controller = ['$scope', 'Query', 'LocationMonitor', 'Duty',
      function($scope, Query, LocationMonitor, Duty){
        
        $scope.Q = Query.data();

        // 全选功能
        $scope.checks = [];
        $scope.allChecked = true;

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
                bool = confirm('确认删除这 '+ r.length + ' 条记录吗?');
            }

            if(!bool) return;

            Duty.remove({id: ids}, function(data){
                if(!data.success) alert(data.msg);
                _query();
            });

        };

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

        // 查询功能
        var _query = function(){
            var q = $scope.Q.query();

            $scope.allChecked = false;

            Duty.query(q, function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                $scope.total = data.total;

                $scope.records = data.results;

                initCheck($scope.allChecked,$scope.records.length);
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

    module.exports = controller;
});