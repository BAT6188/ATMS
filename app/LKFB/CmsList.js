define(function (require, exports, module) {
    var controller = ['Modal', '$scope', 'Query', 'Plan', '$location', 'Restangular', '$routeParams',
        function (Modal, $scope, Query, Plan, $location, Rest, $routeParams) {

            $scope.Q = Query.data();
            // 查询功能
            var _query = function () {
                var q = $scope.Q.query();
                console.log($scope.Q.query());
                Rest.all('cms/list').post(q).then(function (data) {
                    if (!data.success) {
                        alert(data.msg);
                        return;
                    }
                    $scope.total = data.total;
                    $scope.records = data.results;
                });
            };

            _query();

            $scope.pChange = function (page) {
                $scope.Q.page = page;
                _query();
            };
            $scope.query = function () {
                $scope.pChange(1);
            };

        }];
    module.exports = controller;
});