define(function(require, exports, module){
  return ['MapHelper', function (MapHelper){

    var linker = function ($scope, el, attrs){

      /* ---------用于分页----------*/
      

      $scope.$watch('data.polices.length',function(){
        if($scope.data.polices){
          $scope.total = $scope.data.polices.length;
        }else{
          $scope.total = 0;
        }
      });
      
      $scope.page = 1;
      $scope.size = $scope.pageSize || 5;
      $scope.maxSize = 3;
      /* ---------用于分页----------*/


      $scope.close = function (){
        $scope.onClose({
          $data: $scope.data
        });
      };

      $scope.selectPolices = function (){
        $scope.policeShow = true;
        $scope.onSelectPolices({
          $data: $scope.data
        });
      };

      $scope.showDetail = function(){
        $scope.ifDetail = !$scope.ifDetail;
      };

    };

    return {
      restrict:'EAC',
      link: linker,
      replace: true,
      scope: {
        data: '=?',
        policeShow: '=?',
        onClose: '&',
        onSelectPolices: '&'
      },
      templateUrl: 'app/JCZH/TQRW/directives/post.html'
    };
  }];
});