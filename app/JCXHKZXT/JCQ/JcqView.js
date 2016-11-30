define(function (require, exports, module) {
    var controller = ['Modal', '$scope', 'Query', 'DictCache','$location', 'Restangular','LocationMonitor','$http','$routeParams',
        function (Modal, $scope, Query,DictCache, $location,Rest,LocationMonitor,$http,$routeParams) {
    	$scope.name = $routeParams.name;
    	
    	$http.get("app/JCXHKZXT/JCQ/jcqView.json").success(function(data) {
            $scope.records = data;
        });
    	
    }];

    module.exports = controller;
});