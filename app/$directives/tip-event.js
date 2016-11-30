define(function(require, exports, module){

    return ['$rootScope', function ($rootScope){

        var linker = function ($scope, $el, attrs) {
            $($el).click(function(){
                $rootScope.$broadcast($scope.eventName, $scope.eventData);
            });
        };

        return {
            restrict: 'A',
            link: linker,
            scope: {
                eventName: '=?',
                eventData: '=?'
            }
        };
    }];
    
});