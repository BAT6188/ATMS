define(function () {'user strict';
    return ['$scope', 'Modal', 'ngTableParams', 'Restangular', '$modalInstance', 'CurUser', '$validator', '$filter', '$http', 
            function($scope,Modal, ngTableParams, Restangular, $modalInstance, User, $validator, $filter, $http){
    
    window.setTimeout(function(){
        $('.modal-dialog').width(600);
      });
    $scope.record = {};
    
    $http.get("app/JCXHKZXT/DZSZ/types.json").success(function(data) {
    	$scope.types = data;
    	$scope.record.type = $scope.types[0];
    });
    $http.get("app/JCXHKZXT/DZSZ/ports.json").success(function(data) {
    	$scope.ports = data;
    	$scope.record.port = $scope.ports[0];
    });
    $http.get("app/JCXHKZXT/DZSZ/directions.json").success(function(data) {
    	$scope.directions = data;
    });
      
      $scope.save = function(){
          $validator.validate($scope, 'record')
          .success(function() {
        	  _.each($scope.directions, function(item){
        		  if($scope.record.direction.code == item.code){
        			  $scope.record.direction = item;
        		  }
        	  })
        	  $modalInstance.close($scope.record);
          })
          .error(function(){});
      };
      
    //关闭窗口
    $scope.close = function(){
        $modalInstance.close();
    };
    
}];

});