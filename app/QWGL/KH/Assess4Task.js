define(function (require, exports, module) {
    var controller = ['$scope', 'PageQuery', '$location', '$templateCache', 'Message', function ($scope, PageQuery, $location, $templateCache, Message) {
        $scope.showAdvance = false;

        $scope.advance = function(){
            $scope.showAdvance = !$scope.showAdvance;
        };

        $("legend").parent().find("button").addClass('btn-sm');
        $("legend").parent().find("input,select,label").not("[type=checkbox]").addClass('input-sm');

        $scope.records = [
            {name: '任务1', code: '000001', type: '巡逻任务', level: '普通', dutyPersons: '张三，李四',
                startTime: '2013-12-17 08:00:00', endTime: '2013-12-17 12:00:00', dutyTime: '3:00:00', totalTime: '4:00:00', dutyRate: '75%'},
            {name: '任务2', code: '000002', type: '临时任务', level: '普通', dutyPersons: '李四，王五',
                startTime: '2013-12-17 13:00:00', endTime: '2013-12-18 17:00:00', dutyTime: '3:12:00', totalTime: '4:00:00', dutyRate: '80%'}
        ];

        $scope.showDetail = function(record){
            $templateCache.put('name', record.name);
            $templateCache.put('code', record.code);
            $templateCache.put('startTime', record.startTime);
            $templateCache.put('endTime', record.endTime);
            $location.path("/QWGL.KH.Assess4TaskNew");
        };

        $scope.export = function(){
            Message.alert("提示信息", "导出数据！", "#5CB85C");
        };


    }];

    module.exports = controller;
});