define(function(require, exports, module) {
  var controller = ['$scope', '$routeParams', 'Modal', 'Restangular', function($scope, $routeParams, Modal, Rest) {
    
    $scope.region = function(){
      Modal('./Region',$scope.record).result.then(function(){
        $scope.record.roads = $scope.record.wkt;
      });
    };

    Rest.one('roadTakeUp', $routeParams.id).get().then(function (data){
      $scope.record = data.results;
      $scope.record.wkt = $scope.record.roads;
      $scope.imgUrl =  $scope.record.imgUrl;
    });

    $scope.save = function (){
      var data = _.extend({}, $scope.record);
      Rest.one('roadTakeUp', $routeParams.id).doPUT(data).then(function(data){
        if(!data.success){
             Messenger().post({message: '更新数据失败',type: 'error',showCloseButton: true});
          }
           Messenger().post({message: '成功更新数据',type: 'success',showCloseButton: true});
      });
    };

    $scope.toggleShow = function(){
        if(!$scope.record.imgUrl) return
        $scope.urls = [$scope.record.imgUrl];
        $scope.showImg = !$scope.showImg;
    };

    $scope.imgUpdate = function(){
      $scope.record.imgUrl = '';
      $scope.save();
      $scope.showImg = false;
    };
      //删除图片
    $scope.removeImg = function(){
      var url = $scope.record.imgUrl;
      Rest.all('deleteFile').post({url:url}).then(function (data){
          if(!data.success){
             Messenger().post({message: '删除图片失败',type: 'error',showCloseButton: true});
          }
           Messenger().post({message: '已成功删除图片',type: 'success',showCloseButton: true});
          $scope.record.imgUrl = '';
          $scope.showImg = false;
          $scope.save();
      });
    };
  }];

  module.exports = controller;
});
