define(function(require, exports, module){
  return ['Restangular',function (Rest){


    var linker = function($scope,element,attrs) {
/*      $scope.urls = ['http://www.baidu.com/img/baidu_sylogo1.gif',
                    'http://s0.hao123img.com/res/img/logo/logonew.png',
                    'http://y0.ifengimg.com/2014/02/07/08482232.gif'];*/
             
      $scope.idx = 0;
      $scope.removedUrls = [];
      //上一个
      $scope.pre = function(){
        $scope.idx--;
        if($scope.idx < 0 ) {
          $scope.idx = 0;
          return
        }
        $('.panel-body').find('img').removeClass('imgActive');
        $('.panel-body').find('img:eq('+$scope.idx+')').addClass('imgActive');
      };

      //下一个
      $scope.next = function(){
        $scope.idx++;
        if($scope.idx > ($scope.urls.length -1)) {
          $scope.idx = $scope.urls.length -1;
          return
        }
        $('.panel-body').find('img').removeClass('imgActive');
        $('.panel-body').find('img:eq('+$scope.idx+')').addClass('imgActive');
      };

      //关闭
      $scope.close = function (){
          $scope.onClose();;
      };

      //删除
      $scope.removeImg = function(){
/*        var url = $scope.urls[$scope.idx].slice(26);
         Rest.all('deleteFile').post({url:url}).then(function (data){
          if(!data.success){
            alert(data.msg);
          }
          alert('成功删除');
          $scope.urls.splice($scope.idx,1);
          $scope.onUpdate();
        });*/
        if(!_.contains($scope.removedUrls, $scope.urls[$scope.idx])){
            $scope.removedUrls.push($scope.urls[$scope.idx]);
            $scope.urls.splice($scope.idx,1);          
            //$scope.onUpdate();
            $scope.onRemove({
              $removedUrls: $scope.removedUrls,
              $urls:$scope.urls
            });
        }
      };
    };

    return {
      restrict:'EA',
      replace: true,
      scope: {
       urls : '=urls',
       removedUrls : "=?",
       remove:'=?',
       onClose: '&',
       onRemove:'&', 
      },
      templateUrl:'app/$directives/img-preview.html',
      link: linker
    };
  }];
});