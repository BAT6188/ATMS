/**
 * Created by brance on 2016/5/11.
 */

'use strict';


angular.module('myApp',[]).controller('Sandcrawler',['$scope',function($scope){

        //define controller methods;

        $scope.location = "Mos Eisley North";
        $scope.recall = function() {
            $scope.$broadcast('recall', $scope.location);
        }

    }])
    .controller('Droid',['$scope',function($scope){

        $scope.location = "Owen Farm";
        $scope.$on('recall', function(e, newLocation) {
            $scope.location = newLocation;
        });

    }]);
