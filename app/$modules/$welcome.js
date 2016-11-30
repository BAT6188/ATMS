define(function(require, exports, module){
    var controller = ['$scope', 'LocationMonitor', '$location', 'Auth', 'Status', 'Restangular', function($scope, LocationMonitor, $location, Auth, Status, Rest){

        $scope.title = '海口市公安局交通警察支队交通诱导系统';

        $rest = Rest;

        $scope.descriptions = '先进的交通管理系统，致力于交通组织与管理，对涉车违法犯罪行为的综合管控,提供优质的交通信息与出行服务,持续优化交通环境。';

        var $container = jQuery('body > #container');

        $container.removeClass('container').addClass('full');
        jQuery('#mapCtn').hide();

        var handler = function(e, d, o){
            $container.removeClass('full').addClass('container');
            jQuery('#mapCtn').show();
        };

        LocationMonitor.beforeLeave(handler);
        
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
          //Auth.login($scope.user, success, error);

            if($scope.user.userCode == 'admin' && $scope.user.password == 'admin'){

                window.location.href = '/ATMS/app/$directives/app-navbar.html';
            }
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

    }];

    module.exports = controller;
});