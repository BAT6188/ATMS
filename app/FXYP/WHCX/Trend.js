define(function (require, exports, module) {
    var controller = ['$scope', 'DictCache','Query', 'Message','Accident',
     function ($scope, DictCache,Query, Message,Accident) {
        $scope.Q = {
            period:'yy'
        };

        $scope.periods = [{name:'年',code:'yy'},{name:'月',code:'mm'},{name:'日',code:'dd'}];
        //违法行为数据字典
        DictCache('TRAVEL_STATUS', function(dicts) {
            $scope.behaviors = dicts;
        },true);
    }];

    module.exports = controller;
});