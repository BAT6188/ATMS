define(function () {'user strict';
    return ['$scope', 'Modal', 'ngTableParams', 'Restangular', '$modalInstance', 'CurUser', '$validator', '$filter', '$http', 
            function($scope,Modal, ngTableParams, Restangular, $modalInstance, User, $validator, $filter, $http){
    
    window.setTimeout(function(){
        $('.modal-dialog').width(600);
      });
    $scope.record = {};
    
    $http.get("app/JCXHKZXT/TSR/sd.json").success(function(data) {
    	$scope.sd = data;
    	$scope.record.sdEntity = $scope.sd[0];
    });

      $scope.save = function(){
        $modalInstance.close($scope.record);
      };
      
    //关闭窗口
    $scope.close = function(){
        $modalInstance.close();
    };
    
}];

});