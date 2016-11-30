define(function (require, exports, module) {
    var controller = ['$scope', 'DictCache', 'Restangular', '$location', 'Modal', '$routeParams',
    function ($scope, DictCache, Rest, $location, Modal, $routeParams) {
      
      $scope.record = {};
    // 诱导屏性质
    DictCache('0052', function (dict){
       $scope.types = dict;
    });

      Rest.all('cms').get($routeParams.id).then(function(data){
        $scope.record = data.results;
      });

      //增加
      $scope.save = function (){
        // Rest.all('').one('region',region.fid).doPUT({geom: region.wkt})
        Rest.all('').one('cms',$scope.record.id).doPUT($scope.record).then(function(data){
          if(data.success){
            alert('更新成功!');
          }else{
            alert(data.msg);
          }
        });
      };

      $scope.locate = function(){
        Modal('./Locator', $scope.record);
      };

      $scope.remove = function(){
          Rest.one('cms',$routeParams.id).doDELETE().then(function(data){
            if(data.success){
              alert('删除成功');
              $scope.record = null;
              $location.path( 'XXFB.CMS.CmsList');
            }else{
              alert('删除失败');
            }
          });
      };
    }];

    module.exports = controller;
});