define(function (require, exports, module) {
    var controller = ['$scope','$routeParams', 'ngTableParams', 'Dict', function ($scope, $routeParams, ngTableParams, Dict) {
        var dictId = $routeParams.id;
        var origin;

        $scope.entity = {
            parent: {},
            status: {}
        };

        Dict.getParents({}, function(data){
            if(!data.success) return;
            $scope.parents = data.results;
            Dict.get({id: dictId}, function(data){
                if(!data.success){
                    alert(data.msg);
                    return;
                }
                origin = data.results;
                $scope.entity = angular.copy(origin);
                angular.forEach($scope.parents, function(item, index){
                    if(angular.equals($scope.entity.parent, item)){
                        $scope.entity.parent = $scope.parents[index];
                    }
                });
                initTable();
            });
        });


        $scope.save = function(){
            if($scope.entity.initFlag==='1'){
                alert('系统初始,不能修改!');
                return;
            }
            if(angular.equals($scope.entity, origin)){
                alert('数据没有修改!');
                return;
            }
            Dict.update($scope.entity, function(data){
                if(!data.success){
                    alert(data.msg);
                    return;
                }
                origin = $scope.entity;
                alert('更新成功!');
            })
        };

        $scope.reset = function(){
            $scope.entity = angular.copy(origin);
            angular.forEach($scope.parents, function(item, index){
                if(angular.equals($scope.entity.parent, item)){
                    $scope.entity.parent = $scope.parents[index];
                }
            });
        };

        function initTable(){
            $scope.tableParams1 = new ngTableParams({
                page: 1,
                count: 5
            }, {
                total: 0,
                getData: function($defer, params){
                    var queryParams = {
                        page: params.page(),
                        limit: params.count(),
                        parentCode: origin.parent.code
                    };
                    Dict.query(queryParams, function(data){
                        params.total(data.total);
                        $defer.resolve($scope.records1 = data.results);
                    });
                }
            });

            $scope.checkboxes1 = { 'checked': false, items: {} };

            // watch for check all checkbox
            $scope.$watch('checkboxes1.checked', function(value) {
                angular.forEach($scope.records1, function(item) {
                    if (angular.isDefined(item.id)) {
                        $scope.checkboxes1.items[item.id] = value;
                    }
                });
            });

            // watch for data checkboxes
            $scope.$watch('checkboxes1.items', function(values) {
                if (!$scope.records1) {
                    return;
                }
                var checked = 0, unchecked = 0,
                    total = $scope.records1.length;
                angular.forEach($scope.records1, function(item) {
                    checked   +=  ($scope.checkboxes1.items[item.id]) || 0;
                    unchecked += (!$scope.checkboxes1.items[item.id]) || 0;
                });
                if ((unchecked === 0) || (checked === 0)) {
                    $scope.checkboxes1.checked = (checked === total);
                }
                // grayed checkbox
                angular.element(document.getElementById("select_all1")).prop("indeterminate", (checked !== 0 && unchecked !== 0));
            }, true);


            $scope.tableParams2 = new ngTableParams({
                page: 1,
                count: 5
            }, {
                total: 0,
                getData: function($defer, params){
                    var queryParams = {
                        page: params.page(),
                        limit: params.count(),
                        parentCode: origin.code
                    };
                    Dict.query(queryParams, function(data){
                        params.total(data.total);
                        $defer.resolve($scope.records2 = data.results);
                    });
                }
            });

            $scope.checkboxes2 = { 'checked': false, items: {} };

            // watch for check all checkbox
            $scope.$watch('checkboxes2.checked', function(value) {
                angular.forEach($scope.records2, function(item) {
                    if (angular.isDefined(item.id)) {
                        $scope.checkboxes2.items[item.id] = value;
                    }
                });
            });

            // watch for data checkboxes
            $scope.$watch('checkboxes2.items', function(values) {
                if (!$scope.records2) {
                    return;
                }
                var checked = 0, unchecked = 0,
                    total = $scope.records2.length;
                angular.forEach($scope.records2, function(item) {
                    checked   +=  ($scope.checkboxes2.items[item.id]) || 0;
                    unchecked += (!$scope.checkboxes2.items[item.id]) || 0;
                });
                if ((unchecked === 0) || (checked === 0)) {
                    $scope.checkboxes2.checked = (checked === total);
                }
                // grayed checkbox
                angular.element(document.getElementById("select_all2")).prop("indeterminate", (checked !== 0 && unchecked !== 0));
            }, true);
        };
    }];

    module.exports = controller;
})
