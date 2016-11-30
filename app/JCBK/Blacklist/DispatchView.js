define(function () {'user strict';
  return ['$scope', 'Modal', 'ngTableParams', 'Restangular', '$modalInstance', 'param', 'DictCache', function($scope,Modal, ngTableParams, Restangular, $modalInstance, param, DictCache){
  
  window.setTimeout(function(){
        $('.modal-dialog').width(1000);
      });

  Restangular.one('blacklist', param.id).get()
      .then(function(data){
        $scope.record = data.results;

        if($scope.record.alarmEndDate && $scope.record.alarmEndDate.length > 10){
          $scope.record.alarmEndDate = $scope.record.alarmEndDate.substring(0, 10);
            }
        
        var parent = $("#imgContent");
        parent.empty();
        var img = $("<img>").appendTo(parent);
        img.css({"width":"320px", "height":"320px"});
        img.attr("src", JCBK_PIC_URL + $scope.record.carImgUrl);
        img.attr("src", JCBK_PIC_URL + $scope.record.carImgUrl);
        
        $scope.record.carImg = undefined;
        $scope.record.carImgUrl = undefined;
        
        //布控状态字典
         DictCache('DISP_STATUS', function (dict){
           $scope.statuses = dict;
         });
  });
  
    //关闭窗口
  $scope.close = function(){
    $modalInstance.close();
  };
  
}];

});