define(function (require, exports, module) {
    var controller = ['Modal', '$scope', 'Query', 'Plan', '$location', 'Restangular', '$routeParams',
        function (Modal, $scope, Query, Plan, $location, Rest, $routeParams) {

            $scope.roadSectionId = $routeParams.roadSectionId;
            $scope.roadName = $routeParams.roadName;

            $scope.remove = function () {

                var r = [];
                for (var i = 0, size = $scope.checks.length; i < size; i++) {
                    if ($scope.checks[i]) {
                        r.push($scope.records[i].settingId);
                        /*注意*/
                    }
                }

                var ids = r.join(',');
                var bool = false;
                if (r.length === 0) {
                    alert('请选择需要删除的记录!');
                } else {
                    bool = confirm('确认删除这 ' + r.length + ' 条记录吗?');
                }

                if (!bool)
                    return;

                Plan.remove({id: ids}, function (data) {
                    if (!data.success)
                        alert(data.msg);
                    _query();
                });

            };

            $scope.Q = Query.data();
            $scope.Q.roadSectionId = $routeParams.roadSectionId;
            $scope.Q.roadName = $routeParams.roadName;

            // 全选功能
            $scope.checks = [];
            $scope.allChecked = true;

            $scope.select = function (index) {
                $scope.checks[index] = !$scope.checks[index];
                $scope.allChecked = _.every($scope.checks);
            };

            $scope.selectAll = function () {
                initCheck($scope.allChecked, $scope.records.length);
            };

            //初始化
            var initCheck = function (bool, num) {
                var checks = [];
                for (var i = 0; i < num; i++) {
                    checks.push(bool);
                }
                $scope.checks = checks;
            };

            // 查询功能
            var _query = function () {
                var q = $scope.Q.query();
                $scope.allChecked = false;

                Rest.all('roadSetting/list').post(q).then(function (data) {
                    if (!data.success) {
                        alert(data.msg);
                        return;
                    }
                    $scope.total = data.total;
                    $scope.records = data.results;
                    initCheck(false);
                });


            };

            _query();

            $scope.pChange = function (page) {
                $scope.Q.page = page;
                _query();
            };

            $scope.query = function () {

                if ($scope.Q.datePoint != "") {
                    var s = $scope.Q.datePoint.split(" ");
                    $scope.Q.datePoint = s[0];
                    $scope.Q.timePoint = s[1];
                    var r = s[1].split(":");
                    $scope.Q.timePoint = r[0] + r[1];
                }
                $scope.pChange(1);


            };

            //表单/地图切换
            $scope.viewChange = function (record) {
                var origin = angular.copy(record);
                Modal('./Locator', record).result.then(function () {
                    if (origin.lng === record.lng && origin.lat === record.lat) return
                    Rest.all('').one('deviceNew', record.id).doPUT(record).then(function (data) {
                        if (!data.success) {
                            Messenger().post({
                                message: '更新设备' + record.name + '经纬度失败',
                                type: 'error',
                                showCloseButton: true
                            });
                            return
                        }
                        Messenger().post({message: '成功更新设备' + record.name + '经纬度', type: 'success', showCloseButton: true });
                    });
                });
            };

            $scope.infoModal = function (record) {
                $scope.checkRecord = record;
                $('#infoModal').modal();
            };

        }];

    module.exports = controller;
});