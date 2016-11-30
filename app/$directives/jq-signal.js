define(function(require, exports, module){

    return [function(){

        var linker = function($scope,el,attrs) {

        };

        return {
            restrict:'EA',
            link: linker,
            scope: {
                record: '=data'
            },
            transclude: true,
            templateUrl: 'app/$directives/jq-signal.html'
        };
    }];
    
});