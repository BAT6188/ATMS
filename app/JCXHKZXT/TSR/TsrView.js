define(function (require, exports, module) {
    var controller = ['Modal', '$scope', 'Query', 'DictCache','$location', 'Restangular','LocationMonitor', '$http','Modal','$state','$routeParams',
        function (Modal, $scope, Query,DictCache, $location,Rest,LocationMonitor,$http,Modal,$state,$routeParams) {
        $scope.name = $routeParams.name;

        $scope.showAddModal = function(){
            Modal('TsrNew');
        };
        
        //新建
        $scope.add = function(){
          var modalInstance = Modal('TsrNew');
            modalInstance.result.then(function(data){
              var index = $scope.records.length+1
              data.id = "test"+ index;
              $scope.records.push(data);
              Messenger().post({message:  '添加成功',type: 'success',showCloseButton: true });
            });
        };
        
        $scope.remove = function(){
            var r = [];
            for(var i = 0, size = $scope.checks.length; i < size; i++){
                if($scope.checks[i]){
                    r.push($scope.records[i]);/*注意*/
                }
            }
            var bool = false;
            if(r.length===0){
                alert('请选择需要删除的记录!');
            }else{
                bool = confirm('确认删除这 '+ r.length + ' 条记录吗?');
            }

            if(!bool) return;

            for(var i = size; i>=0; i--){
                if($scope.checks[i]){
                    $scope.records.splice(i,1);
                }
            }
            initCheck(false, $scope.records.length);
        };

        $scope.Q = Query.data();

        // 全选功能
        $scope.checks = [];
        $scope.allChecked = true;

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
            
            $http.get("app/JCXHKZXT/TSR/Tsr.json").success(function(data) {
                $scope.total = data.length;
                $scope.records = data;
            });
        };
        _query();

        }];

    module.exports = controller;
});