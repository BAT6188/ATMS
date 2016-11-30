define(function(require, exports, module) {

  var controller = ['$scope', '$location','LocationMonitor', 'Auth', 'Status', function($scope, $location,LM, Auth, Status) {
    $scope.user = {};
    $scope.error = null;

    $scope.$watch('user.userCode', function(){
      var password = window.localStorage.getItem($scope.user.userCode);
            if(password){
        $scope.user.password = password;
      }else{
        $scope.user.password = null;
      }
        });
    $scope.closeError = function() {
      $scope.error = null;
    };

    var success = function(data) {
      Status.init();
      if($scope.remember){
        //alert('remember');
        if(window.localStorage.getItem($scope.user.userCode)){
          window.localStorage.removeItem($scope.user.userCode);
          //alert('exist' + window.localStorage.length);
        }
        window.localStorage.setItem($scope.user.userCode,$scope.user.password);
/*        for(var i=0;i<window.localStorage.length;i++){
          alert(window.localStorage.key(i)+ " : " + window.localStorage.getItem(window.localStorage.key(i)));
        }*/
      }
      $location.path('/TSJK.Tsjk2');
    };

    var error = function(data) {
      $scope.error = '验证错误！';
    };

    $scope.login = function() {
      $scope.error = null;
      Auth.login($scope.user, success, error);
    }; 

    $scope.login4key = function(event) {
      if(!event) {
        return;
      }
      
      //回车
      if(event.keyCode === 13) {
        $scope.login();
      }
    };

    $('.navbar').hide();
    $('body').addClass('background-grey');

    LM.beforeLeave(function(){
          $('.navbar').show();
          $('body').removeClass('background-grey');
        });
  }];

  module.exports = controller;
}); 