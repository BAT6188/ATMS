/**
 * Created by brance on 2016/4/19.
 */
var app = angular.module('Dialog', []);
app.controller('MyCtrl', function ($scope) {
    $scope.person = {
        count: 0
    };
    $scope.email = 'carl@126.com';
    $scope.names = ["name1", "name2", "name3"];
    $scope.show = false;
    $scope.username = "carl";
    $scope.title = "parent title";
    $scope.parentScope = function () {
        alert("scope里面通过&定义的东东，是在父scope中定义");
    };


    $scope.changeCount = function () {
        $scope.person.count = $scope.person.count + 1;
    }


    // 监听controller count变更, 并发出事件广播,再directive 中 监听count CountStatusChange变更事件
    $scope.$watch('person.count', function (newVal, oldVal) {
        console.log('>>>parent Count change:' + $scope.person.Count);
        if (newVal != oldVal) {
            console.log('>>>parent $broadcast count change');
            $scope.$broadcast('CountStatusChange', {"val": newVal})
        }
    });

    $scope.$watch('show',function(show){
        console.log('show:'+show);
        //$scope.$apply();
    });

});