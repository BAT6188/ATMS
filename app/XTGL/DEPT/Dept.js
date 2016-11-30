define(function (require, exports, module) {
    var controller = ['$scope', '$modal', 'Message', 'Query', 'Dept', 'Modal', 
    function ($scope, $modal, Message, Query,Dept,Modal) {
        $scope.showAddModal = function(){
            Modal('New');
        };

        Dept.query({},function(data){
            if(data.success && data.results && data.results.length>=1) {
              $scope.parentDepts = data.results;
            }
        });

        $scope.remove = function(){
            
            var r = [];
            for(var i = 0, size = $scope.checks.length; i < size; i++){
                if($scope.checks[i]){
                    r.push($scope.records[i].deptId);
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

            Dept.remove({id: ids}, function(data){
                if(!data.success) alert(data.msg);
                _query();
            });

        };

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

            if(q && q.parentDept && q.parentDept.length>=1 && q.parentDept[0].deptCode) {
                q.parentDeptCode = q.parentDept[0].deptCode;
            }
            Dept.query(q, function(data){
                console.log(q);
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                $scope.total = data.total;
                initCheck(false);
                $scope.records = data.results;
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