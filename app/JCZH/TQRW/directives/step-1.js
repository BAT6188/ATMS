define(function(require, exports, module){
  return ['MapHelper', function (MapHelper){

    var linker = function ($scope, el, attrs){

      $scope.nextClick = function (){
        $scope.onNextClick();
      };
    };

    return {
      restrict:'EA',
      link: linker,
      scope: {
        name: '=?',
        onNextClick: '&'
      },
      templateUrl: 'app/JCZH/TQRW/directives/step-1.html'
    };
  }];
});