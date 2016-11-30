define(function (require, exports, module) {
    var controller = ['$scope', '$modal', 'Message', 'Dict', 'ngTableParams',function ($scope, $modal, Message, Dict, ngTableParams) {

        $scope.tableParams = new ngTableParams({
            page: 1,
            count: 10
        }, {
            total: 0,
            getData: function($defer, params){
                var queryParams = {
                    page: params.page(),
                    limit: params.count(),
                    name: $scope.name
                };
                Dict.query(queryParams, function(data){
                    params.total(data.total);
                    $defer.resolve($scope.records = data.results);
                });
            }
        });

        $scope.checkboxes = { 'checked': false, items: {} };

        // watch for check all checkbox
        $scope.$watch('checkboxes.checked', function(value) {
            angular.forEach($scope.records, function(item) {
                if (angular.isDefined(item.id)) {
                    $scope.checkboxes.items[item.id] = value;
                }
            });
        });

        // watch for data checkboxes
        $scope.$watch('checkboxes.items', function(values) {
            if (!$scope.records) {
                return;
            }
            var checked = 0, unchecked = 0,
                total = $scope.records.length;
            angular.forEach($scope.records, function(item) {
                checked   +=  ($scope.checkboxes.items[item.id]) || 0;
                unchecked += (!$scope.checkboxes.items[item.id]) || 0;
            });
            if ((unchecked === 0) || (checked === 0)) {
                $scope.checkboxes.checked = (checked === total);
            }
            // grayed checkbox
            angular.element(document.getElementById("select_all")).prop("indeterminate", (checked !== 0 && unchecked !== 0));
        }, true);

        $scope.search = function(event){
            if(event.which === 13){
               $scope.query();
            }
        };

        //关键字查询
        $scope.query = function(){
            if( $scope.tableParams.page() !== 1){
                $scope.tableParams.page(1);
                $scope.tableParams.reload();
            }else{
                 $scope.tableParams.reload();
            }
        };
        $scope.remove = function(){

            var r = [], msg = null, specials = [], ids = [];
            angular.forEach($scope.records, function(item){
                if($scope.checkboxes.items[item.id]){
                    r.push(item);
                }
            });

            if(r.length === 0){
                return Message.warning('信息提示', '请选择需要删除的数据！')
            }
            specials = _.filter(r, function(item){
                return item.initFlag === 1;
            });

            if(specials.length > 0){
                msg = '';
                angular.forEach(specials, function(item){
                    msg += item.name + ',';
                });
                return Message.error('信息提示','不允许删除:\n' + msg.slice(0, msg.length - 1));
            }else{
                msg = '';
                _.each(r, function(item){
                    msg += item.name + ',';
                    ids.push(item.id);
                });

                function okFun(){
                    Dict.remove({id: ids.join(',')}, function(data){
                        if(!data.success){
                            Message.alert('信息提示','删除数据失败！','#DA4F49');
                        }else{
                            Message.alert('信息提示','删除数据成功！','#5BB75B');
                            $scope.tableParams.reload();
                        }
                    });
                };

                function noFun(){};

                Message.confirm('信息提示', '确认删除:\n '+ msg.slice(0, msg.length - 1) + '?',
                    {'right':'50px','bottom':'100px','width':'600px'}, okFun, noFun)
            }
        };

    }];

    module.exports = controller;
});