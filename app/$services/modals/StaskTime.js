define(function(require, exports, module) {
  var controller = ['$scope', '$rootScope', '$modalInstance','token','param','specialDuty',
   function ($scope, $rootScope, $modalInstance,token,param,specialDuty) {

    $scope.record = token;

    $scope.ok = function(){
        specialDuty.update($scope.record, function(data){
          $scope.record = data.results;
          $modalInstance.close();
        });
    };

  }];

  module.exports = controller;

}); 