define(function (require, exports, module) {
    var controller = ['$scope', 'DictCache', 'Restangular', '$location', 'Modal',
    function ($scope, DictCache, Rest, $location, Modal) {
      
      $scope.record = {};
    // 诱导屏性质
    DictCache('0052', function (dict){
       $scope.types = dict;
    });
      //增加
      $scope.save = function (){
        Rest.all('cms').post($scope.record).then(function(data){
          // if(!data.success){
          //   Messenger().post({
          //     message: data.msg,
          //     type: 'error',
          //     showCloseButton: true
          //   }); 
          // }
          // Messenger().post({
          //   message: '诱导屏>>'+data.results.name+'<<添加成功!',
          //   type: 'success',
          //   showCloseButton: true
          // });
          $location.path('XXFB.CMS.CmsEdit/'+ data.results.id);
        });
      };

      $scope.locate = function(){
        Modal('./Locator', $scope.record);
      };

    }];

    module.exports = controller;
});