define(function(require, exports, module) {
  return ['$location', 'Auth', 'Restangular', 'Status', '$rootScope', function($location, Auth, Rest, Status, $rootScope) {

    var linker = function($scope, el, attrs) {
      $scope.title = "海口市公安局交通警察支队交通诱导系统";
      $scope.title1 = "ATMS";

      //是否已经登录
      $scope.authed = false;
      $scope.isNeedSwitchMenu = true;

      //用户登录成功时
      PubSub.on('login', function(e, username) {
        $scope.authed = true;
        $scope.username = username;
      });

      //用户设置加载完成时
      PubSub.on('menu:loaded', function(e, records, menus) {
        $scope.menus = menus;
      });

      $scope.active = function(menu) {
        _.each($scope.menus, function(record) {
          record.active = false;
        });
        menu.active = true;
      };

      var callback = function() {
        $scope.authed = false;
        $scope.menus = [];
        $scope.username = null;
        Status.destroy();
        $location.path('/$modules/$welcome');
        window.setTimeout(function(){
            window.location.reload();
        }, 100);
      };

      $scope.logout = function() {
        Auth.logout(callback);
      };
      
      $scope.clickMainMenu =function(){
    	$rootScope.$broadcast('menu:mainMenuClick');
      };

      var switchMenu = $scope.switchMenu = function() {
        $('.navbar').toggle();
        var visible = $('.navbar').is(':visible');
        $('.layer-attrs-grid').css('top', visible ? 58: 38);
        $('.flow-info-list').css('top', visible ? 58: 0);
        $(window).resize();
      };

      $rootScope.$on('toggleNavbar', switchMenu);

      //*********刷新页面重新加载菜单_start
      if (sessionStorage._login) {
        var _login = sessionStorage._login;
        try {
          _login = JSON.parse(_login);
          $scope.menus = _login.mn;
          $scope.authed = true;
          $scope.username = _login.user.userName || _login.user.userCode;
          Status.init();
        } catch(e) {
          console.log(e);
        }
        
        //判断session是否过期
        Rest.all('').one('isValidSession').get().then(function(data){
          if(!data.success){
            alert(data.msg);
            $scope.logout();
            return;
          }
        }, function(e) {
         console.log(e);
        });
      }
      //*********刷新页面重新加载菜单_end

    };

    return {
      restrict : 'EA',
      link : linker,
      replace : true,
      scope : {},
      templateUrl : 'app/$directives/app-navbar.html'
    };
  }];
}); 