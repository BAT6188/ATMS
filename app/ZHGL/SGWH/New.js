define(function(require, exports, module){
  var controller = ['$scope','Restangular','Modal', 'DictCache','$location',
                    function($scope,Rest,Modal,DictCache,$location){
      DictCache('TRA_TYPE',function(data){
        $scope.types = data;
      })
      $scope.record = {};
        //绘制施工区域
       $scope.region = function(){
        Modal('./Region',$scope.record).result.then(function(){
          console.log($scope.record.wkt);
        });
       };

       //保存
      $scope.save = function(){
         if($scope.record.startMoment) $scope.record.startMoment = $scope.record.startMoment.concat(':00:00');
         if($scope.record.endMoment) $scope.record.endMoment = $scope.record.endMoment.concat(':00:00');
         if($scope.record.planReleaseTime) $scope.record.planReleaseTime = $scope.record.planReleaseTime.concat(' 00:00:00');
         Rest.all('trafficCtrl').post($scope.record).then(function (data){
            if(!data.success){
              //alert(data.msg);
              Messenger().post({
                message: data.msg,
                type: 'error',
                showCloseButton: true
              });
            }
            $scope.record = {};
            $location.path('/ZHGL.JTGZ.TrafficCtrl');
          });
      };

      $scope.toggleShow = function(){
        if(!$scope.record.imgUrl) return;
        $scope.urls = [$scope.record.imgUrl];
        $scope.showImg = !$scope.showImg;
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
        });
        $scope.record.imgUrl = '';
        $scope.showImg = false;
      };
  }];

  module.exports = controller;
});