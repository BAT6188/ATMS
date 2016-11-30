define(function(require, exports, module){

    return [function(){

        var linker = function($scope,el,attrs) {

        };

        return {
            restrict:'EA',
            link: linker,
            transclude: true,
            scope: {
               police:' = police'
            },
            templateUrl: 'app/$directives/jq-police-call.html'
        };
    }];
    
});