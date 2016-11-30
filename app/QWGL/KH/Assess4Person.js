define(function (require, exports, module) {
    var controller = ['$scope', 'PageQuery', '$modal', 'Message', '$templateCache', '$location', function ($scope, PageQuery, $modal, Message, $templateCache, $location) {
        $scope.showAdvance = false;

        $scope.advance = function(){
            $scope.showAdvance = !$scope.showAdvance;
        };

        $("legend").parent().find("button").addClass('btn-sm');
        $("legend").parent().find("input,select").not("[type=checkbox]").addClass('input-sm');

        $scope.export = function(){
            Message.alert("提示信息", "导出数据！", "#5CB85C");
        };
        
        $scope.records = [{name: '张三', code: '000001', dutyTime: '15:00',
                totalTime: '20:00', dutyRate: '75%'},
                {name: '李四', code: '000002', dutyTime: '16:00',
                totalTime: '20:00', dutyRate: '80%'}];

        var Duty = dpd.tduty;



        $scope.gridOptions = {
            data: 'records',
            columnDefs: [
                {field: 'name', displayName: '警员', cellTemplate: '<a ng-click="showInfo(entry.code, entry.name);">{{entry.name}}</a>'}, //cellTemplate: '<a ng-href="#/QWGL.KH.Assess4Person/{{entry.code}}/2013-12/{{entry.name}}/Info">{{entry.name}}</a>'},
                {field: 'code', displayName: '编号'},
                {field: 'dutyTime', displayName: '执勤时长'},
                {field: 'totalTime', displayName: '勤务总时长'},
                {field: 'dutyRate', displayName: '出勤率'}
            ]
        };
        $scope.showInfo = function(code, name){
            $templateCache.put('name', name);
            $templateCache.put('code', code);
            $templateCache.put('time', '2013-12');
            $location.path('/QWGL.KH.Assess4PersonInfo');
        };

        $scope.Q = PageQuery.data();

        // 全选功能
        $scope.checks = [];

        $scope.allChecks = false;

        $scope.select = function(index){
            $scope.checks[index] = !$scope.checks[index];
            $scope.allChecked = _.every($scope.checks);
        };

        var initCheck = function(bool){
            var checks = [];
            for(var i = 0; i < $scope.Q.pageSize; i++){
                checks.push(bool);
            }
            $scope.checks = checks;
        };

        $scope.selectAll = function(){
            initCheck($scope.allChecked);
        };

        // 查询功能
        var _query = function(){
            var q = $scope.Q.query(), cq = angular.copy(q);
            cq['id'] = 'count';

            $scope.allChecks = false;
            initCheck(false);

            Duty.get(cq, function(r, e){
                if(e) return console.log(e);
                $scope.$apply($scope.total = r.count);
            });

            Duty.get(q, function(records){
                $scope.$apply($scope.records = records);
            });

        };

        // _query();

        $scope.pChange = function(page){
            $scope.Q.page = page;
            _query();
        };

        $scope.query = function(){
            $scope.pChange(1);
        };


    }];

    module.exports = controller;
});