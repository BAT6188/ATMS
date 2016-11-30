define(function (require, exports, module) {
    var controller = ['$scope', 'PageQuery', function ($scope, PageQuery) {
        $scope.records = [
            {name: '任务1', type: '巡逻任务', level: '普通', principal: 'xxx',
                phone: '139XXX', status: '审批中', dutyResult: '优', dutyStatus: '未排'},
            {name: '任务2', type: '临时任务', level: '普通', principal: 'xxx',
                phone: '139XXX', status: '审批中', dutyResult: '良', dutyStatus: '缺排'},
            {name: '任务3', type: '临时任务', level: '一级', principal: 'xxx',
                phone: '139XXX', status: '已审批', dutyResult: '良', dutyStatus: '已排'},
        ];

        $scope.showAdvance = false;

        $scope.advance = function(){
            $scope.showAdvance = !$scope.showAdvance;
        };

    }];

    module.exports = controller;
});