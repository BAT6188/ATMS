define(function(require, exports, module){
  var controller = ['$scope','$routeParams','Restangular','Modal','DictCache', 
  function($scope,$routeParams,Rest,Modal,DictCache){
    
    DictCache('TRA_TYPE',function(data){
      $scope.types = data;
    })


    Rest.all('trafficCtrl').get($routeParams.id).then(function (data){
      $scope.record = data.results;
      $scope.imgUrl = $scope.record.imgUrl;
    });

    //绘制施工区域
   $scope.region = function(){
    Modal('./Region',$scope.record).result.then(function(){
      console.log($scope.record.wkt);
    });
   };

   //保存
   $scope.save = function(){
   /*  if($scope.record.startMoment) $scope.record.startMoment = $scope.record.startMoment.concat(':00:00');
     if($scope.record.endMoment) $scope.record.endMoment = $scope.record.endMoment.concat(':00:00');
     if($scope.record.planReleaseTime) $scope.record.planReleaseTime = $scope.record.planReleaseTime.concat(' 00:00:00');*/
/*     Rest.all('trafficCtrl').post($scope.record).then(function (data){
        if(!data.success){
          alert(data.msg);
        }
        $scope.record = {};
        $location.path('/ZHGL.JTGZ.TrafficCtrl');
      });*/
      var data = _.extend({}, $scope.record);
      Rest.one('trafficCtrl', $routeParams.id).doPUT(data).then(function(data){
        console.log(data);
        if(!data.success){
           Messenger().post({
                message: '更新数据失败',
                type: 'error',
                showCloseButton: true
           });
          return
        }
         Messenger().post({message: '成功更新数据',type: 'success',showCloseButton: true });
      });
   };

  $scope.toggleShow = function(){
    if(!$scope.record.imgUrl) return
    $scope.urls = [$scope.record.imgUrl];
    $scope.showImg = !$scope.showImg;
  };

  //重新上传
  $scope.reUpload = function(){
    $scope.toUpload = true;
    $scope.imgUrl = angular.copy($scope.record.imgUrl);
    $scope.record.imgUrl = null;
  };

  //取消重新上传
  $scope.cancel = function(){
    $scope.record.imgUrl = $scope.imgUrl;
    $scope.toUpload = false;
  };

  //删除图片
  $scope.removeImg = function(){
    var url = $scope.record.imgUrl;
    Rest.all('deleteFile').post({url:url}).then(function (data){
        if(!data.success){
           Messenger().post({
                message: '删除图片失败',
                type: 'error',
                showCloseButton: true
          });
        }
         Messenger().post({
                message: '已删除图片',
                type: 'success',
                showCloseButton: true
        });
        $scope.record.imgUrl = '';
        $scope.showImg = false;
        $scope.save();
    });
  };
  
}];

  module.exports = controller;
});