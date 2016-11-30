define(function(require, exports, module){

    return ['$filter','Evaluate', function($filter,Evaluate){

        var linker = function($scope,el,attrs) {
            $scope.rate = 0;
            $scope.max = 5;
            $scope.newRecd = {
                'content':''
            };
            //query
            var query = function(){
                //使用 service:FeedBack, 需要显视的注入 > line: 3
                if(!$scope.pTaskId) return
                Evaluate.query({'pTaskId':$scope.ptask.id}, function(data){
                    if(!data.success){
                      alert(data.msg);
                      return;
                    }
                    $scope.total = data.total;
                    $scope.records = data.results;
                });
            };

            $scope.save  = function(){
                var newRecd = $scope.newRecd;
                if(!newRecd) return
                var record = {
                    'content':newRecd.content,
                    'ptaskId': $scope.pTaskId,
                    'time': $filter('date')(new Date(), 'yyyy-MM-dd hh:mm:ss').toString()
                };

                if(!$scope.records){
                    $scope.records = [];
                }
                Evaluate.save(record,function(data){
                    if(!data.success){
                        alert(data.msg);
                        return;
                    }
                    $scope.records.push(data.results);
                    //$scope.newRecd = null;
                });
            };
            //单个删除
            $scope.remove = function(record,index){
                if(!record.id) return
                var ids = record.id+'';
                //alert(ids);
                Evaluate.remove({id: ids}, function(data){
                    if(!data.success){
                      alert(data.msg);
                      return;
                    }
                    $scope.records.splice(index,1);
                });
            };

            $scope.hoveringOver = function(value) {
                $scope.overStar = value;
                $scope.rate = value;
                //$scope.percent = 100 * (value / $scope.max);
            };

            $scope.toAdd = function(){
                $scope.addView = !$scope.addView;
            };
        };

        return {
            restrict:'EA',
            link: linker,
            transclude: true,
            scope: {
               pTaskId:' = ptask',
               records : ' = data'
            },
            templateUrl: 'app/JCZH/ZHDD/directives/jq-evaluate.html'
        };
    }];
    
});