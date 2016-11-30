define(function(require, exports, module){
  return ['$scope','Modal', 'Restangular', '$location', function($scope, Modal, Rest, $location){
    $scope.record = {};

    //绘制施工区域
    $scope.region = function(){
      Modal('./Region',$scope.record).result.then(function(){
        $scope.record.roads = $scope.record.wkt;
      });
    };

    $scope.save = function (){
      var data = _.extend({}, $scope.record);
      delete data.wkt;
      Rest.one('roadTakeUp').post('', data).then(function(data){
        if(data.success){
          $location.path('/ZHGL.SGZD.Apply');
        }else{
          Messenger().post({message: '保存失败，请重新尝试',type: 'error',showCloseButton: true});
          $scope.record = null;
        }
      });
    };

    $scope.toggleShow = function(){
      if(!$scope.record.imgUrl) return
      $scope.urls = [$scope.record.imgUrl];
      $scope.showImg = !$scope.showImg;
    };

          //删除图片
    $scope.removeImg = function(){
      var url = $scope.record.imgUrl;
      Rest.all('deleteFile').post({url:url}).then(function (data){
          if(!data.success){
             Messenger().post({message: '删除图片失败',type: 'error',showCloseButton: true});
          }
           Messenger().post({message: '删除图片失败',type: 'success',showCloseButton: true});
      });
      $scope.record.imgUrl = '';
      $scope.showImg = false;
    };
  }];

});
