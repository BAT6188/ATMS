define(function(require, exports, module) {
    var controller = ['$scope', 'Message', '$http', '$filter',
    function($scope, Message, $http, $filter) {
        $scope.data = [];
        $scope.total = $scope.data.length;
        $scope.page = 1;
        $scope.size = 8;
        $scope.maxSize = 3;

        $scope.data4Date = [];
        $scope.total4Date = $scope.data.length;
        $scope.page4Date = 1;
        $scope.size4Date = 5;
        $scope.maxSize4Date = 3;

        $scope.model = {};
        $scope.model4Date = {};

        $scope.controls = [{
            'code' : '单点多时段',
            'name' : '单点多时段'
        }, {
            'code' : '单点多时段',
            'name' : '多点多时段'
        }];

        $scope.plans = [{
            'code' : '1',
            'name' : '1'
        }, {
            'code' : '2',
            'name' : '2'
        }];

        $scope.dates = [{
            'code' : '1',
            'name' : '星期一'
        }, {
            'code' : '2',
            'name' : '星期二'
        }, {
            'code' : '3',
            'name' : '星期三'
        }, {
            'code' : '4',
            'name' : '星期四'
        }, {
            'code' : '5',
            'name' : '星期五'
        }, {
            'code' : '6',
            'name' : '星期六'
        }, {
            'code' : '7',
            'name' : '星期日'
        }];

        $http.get('app/JCXHKZXT/SD/sd.json').success(function(data) {
            $scope.data = data;
            $scope.total = data.length;
        });

        $http.get('app/JCXHKZXT/SD/sd4Date.json').success(function(data) {
            $scope.data4Date = data;
            $scope.total4Date = data.length;
        });

        $scope.add = function() {
            $scope.model.id = $filter('date')(new Date(), 'hhmmss');
            $scope.data.push($scope.model);
            $scope.model = {};
            $scope.total = $scope.data.length;
        };

        $scope.remove = function(record) {
            var data = _.filter($scope.data, function(item) {
                if (item.id === record.id) {
                    return false;
                }
                return true;
            });
            $scope.data = data;
            $scope.total = data.length;
        };

        $scope.add4Date = function() {
            var date = '';
            _.each($scope.model4Date.queryDate, function(item) {
                if (date === '') {
                    date += item.code;
                } else {
                    date += ' ' + item.code;
                }
            });
            var data = {
                'id' : $filter('date')(new Date(), 'hhmmss'),
                'name' : $scope.model4Date.name,
                'date' : date,
                'num' : $scope.data.length || 0
            };
            $scope.data4Date.push(data);
            $scope.model4Date.name = '';
            $scope.total4Date = $scope.data4Date.length;
        };

        $scope.remove4Date = function(record) {
            var data = _.filter($scope.data4Date, function(item) {
                if (item.id === record.id) {
                    return false;
                }
                return true;
            });
            $scope.data4Date = data;
            $scope.total4Date = data.length;
        };

    }];

    module.exports = controller;
});

