/**
 * Created by brance on 2016/5/11.
 */

'use strict';

angular.module('myApp',[]).controller('Sandcrawler',['$scope',function($scope){

        $scope.$on('requestDroidRecall', function(e) {
            $scope.$broadcast('executeDroidRecall');
        });
    }])
    .controller('Droid1',['$scope',function($scope){
        $scope.location = "Owen Farm1";
        $scope.recallAddDroids1 = function() {
            $scope.$emit('requestDroidRecall');
        };
        $scope.$on('executeDroidRecall',function() {
            $scope.location = "Sandcrawler1";
        });
    }])
    .controller('Droid2',['$scope',function($scope){

        $scope.location = "Owen Farm2";
        $scope.recallAddDroids2 = function() {
            $scope.$emit('requestDroidRecall');
        };
        $scope.$on('executeDroidRecall', function() {
            $scope.location = "Sandcrawler2";
        });
    }]);