define(function (require, exports, module) {
    var controller = ['$scope', 'Message', 'Query', 'Post', 'DictCache',
        function ($scope, Message, Query, Post ,DictCache) {

        $scope.showAdvance = false;

        $scope.Q = Query.data();

        // 全选功能
        $scope.checks = [];

        DictCache('0018',function(dict){
            $scope.types = dict;
        },true);

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

            Post.remove({id: ids}, function(data){
                if(!data.success) alert(data.msg);
                _query();
            });

        };
        //切换查询方式
        $scope.advance = function(){
            $scope.showAdvance = !$scope.showAdvance;
            $scope.Q.startOwnTime = null
            $scope.Q.endOwnTime = null;
        };


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

        $scope.$watch('allChecked', function(){
            initCheck($scope.allChecked);
        });

        // 查询功能
        var _query = function(){
            var q = $scope.Q.query();

            $scope.allChecked = false;

            Post.query(q, function(data){
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

        //表单/地图切换
        $scope.viewChange = function(record) {
            $scope.locateRecord = record;

            if($scope.mapView){
              $scope.mapView = false;
            }else{
              $scope.mapView = true;
            }    

        };

    }];

    module.exports = controller;
});