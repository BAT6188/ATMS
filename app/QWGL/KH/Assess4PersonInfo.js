define(function (require, exports, module) {
    var controller = ['$scope', 'PageQuery', '$modal', 'Message', '$routeParams', '$templateCache', function ($scope, PageQuery, $modal, Message, $routeParams, $templateCache) {
        $("legend").parent().find("button").addClass('btn-sm');
        $("legend").parent().find("input,select,label").not("[type=checkbox]").addClass('input-sm');

        $scope.code = $templateCache.get('code');
        $scope.time = $templateCache.get('time');
        $scope.name = $templateCache.get('name');
        $scope.$apply();

        var Duty = dpd.tduty;

        $scope.gridOptions = {
            data: 'records',
            columnDefs: [
                {field: 'name', displayName: '名称', cellTemplate: '<a ng-href="#/QWGL.QW.Duty/{{entry.id}}/edit">{{entry.name}}</a>'},
                {field: 'type', displayName: '类型'},
                {field: 'level', displayName: '级别'},
                {field: 'principal', displayName: '负责人'},
                {field: 'tel', displayName: '电话'},
                {field: 'status', displayName: '执勤状态'}
            ]
        };

        $scope.records = [{name: '勤务1', type: '1', level: '1',principal: '刘', 
                tel: '13900000000', status: '1'},
                {name: '勤务2', type: '2', level: '2',principal: '刘', 
                tel: '15900000000', status: '3'}];


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