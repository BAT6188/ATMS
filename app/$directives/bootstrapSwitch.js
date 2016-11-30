define(function(require, exports, module){

    return [function (){
        return {
            restrict: 'EAC',
            require: ['?^ngModel'],
            link: function (scope, el, attrs, ctrls){
                var ngModelCtrl = ctrls[0];
                var $el = $(el);
                
                $el.bootstrapSwitch().on('switchChange.bootstrapSwitch', function (event, state) {
                    ngModelCtrl.$setViewValue(state);
                    scope.$apply();
                });
                
                ngModelCtrl.$formatters.push(function (value){
                    $el.bootstrapSwitch('state', value, true);
                    return value;
                });
            }
        };
    }];
    
});