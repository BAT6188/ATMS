define(function () {'user strict';
  return ['$scope', 'Modal', 'ngTableParams', 'Restangular', '$modalInstance', 'param', 'CurUser', function($scope,Modal, ngTableParams, Restangular, $modalInstance, param, User){
  
  window.setTimeout(function(){
        $('.modal-dialog').width(1000);
      });
  
  var user = User();
  
  $scope.record = {};
  $scope.record.dispDeptCode = user.deptCode;
  $scope.record.dispDeptName = user.deptName;
  $scope.record.person = user.userName;
  $scope.record.dispIdNumber = user.idCard;
  $scope.record.disPoint = [];
    $scope.record.disReceiver = [];
  $scope.record.points = [];
  $scope.points = "";
  $scope.users = "";
  
  Restangular.one('bukong', param.id).get()
      .then(function(data){
        $scope.record = data.results;
        _.each($scope.record.dispatchPoints,function(point){
          $scope.points += $scope.points.length>0? ','+ point.pointName : point.pointName;
        })
        _.each($scope.record.dispatchReceiver,function(receiver){
          $scope.users += $scope.users.length>0? ','+ receiver.targetName : receiver.targetName;
        })
        $scope.record.carImg = JCBK_PIC_URL + $scope.record.carImageUrl;
        
        var parent = $("#imgContent");
          parent.empty();
          var img = $("<img>").appendTo(parent);
          img.css({"width":"320px", "height":"320px"});
          img.attr("src", $scope.record.carImg);
          img.attr("alt", $scope.record.carImg);
    });
  
    //关闭窗口
  $scope.close = function(){
    $modalInstance.close();
  };
      

      
  
}];

});