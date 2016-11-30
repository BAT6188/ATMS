define(function (require, exports, module) {
    var controller = ['$scope', '$routeParams', '$modalInstance', 'DictCache', 'VehicleQuery', 'token', function ($scope, $routeParams, $modalInstance, DictCache, VehicleQuery, token) {
        $scope.source = "resources/img/1.jpg";
        
        //号牌颜色
        //号牌颜色
        DictCache("PLATE_COLOR", function(dict){
            $scope.plateColors = dict;
        });
        
        VehicleQuery.get({
          id : token.id
        }, function(record){
            $scope.$apply($scope.record = record.results);
            $('.jqzoom').jqzoom({
                zoomType: 'standard',
                lens:true,
                preloadImages: false,
                alwaysOn:false,
                title:false
         });
        });
        
        //关闭窗口
      $scope.close = function(){
        $modalInstance.close();
      };
      
      //更新车牌
      $scope.update = function(){
        var plate = {};
        plate.id = token.id;
        plate.plateColor = $scope.record.plateColor;
        plate.plateNo = $scope.record.plateNo;
        VehicleQuery.update(plate, function(data){
          if(!data.success){
            alert(data.msg);
            return;
          }
          alert('更新成功!');
        });
      };

    }];

    module.exports = controller;
});