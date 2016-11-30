define(function(require, exports, module){
  return ['MapHelper', function (MapHelper){

    var linker = function ($scope, el, attrs){
      $scope.close = function (){
        $scope.onClose({
          $data: $scope.data
        });
      };
    };

    return {
      restrict:'EAC',
      link: linker,
      replace: true,
      scope: {
        data: '=?',
        onClose: '&'
      },
      templateUrl: 'app/JCZH/TQRW/directives/point.html'
    };
  }];
});