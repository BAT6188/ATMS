define(function(require, exports, module){
  var MapHelper = require('./$services/MapHelper');

  //导入 service:Auth
  var Auth = require('./$services/Auth');

  var Query = require('./$services/Query');

  var LocationMonitor = require('./$services/LocationMonitor');

  var Modal = require('./$services/Modal');

  var Buffer = require('./$services/Buffer');

  var PassAreas = require('./$services/PassAreas');

  var DrawRegion = require('./$services/DrawRegion');
  
  var Status = require('./$services/Status');

  var Message = require('./$services/Message');

  var app = angular.module('App.services', ['ng'], ['$provide', function($provide){
    //用于登录、登出、获取用户配置
    $provide.factory('Auth', Auth);

    $provide.factory('Query', Query);

    $provide.factory('LocationMonitor', LocationMonitor);

    $provide.factory('Modal', Modal);

    $provide.factory('Buffer', Buffer);

    $provide.factory('PassAreas', PassAreas);

    $provide.factory('DrawRegion', DrawRegion);
    
    $provide.factory('Status', Status);

    $provide.factory('Message', Message);
    
    $provide.factory('MapHelper', MapHelper);       
    
    //兼容通州代码
    $provide.constant('$state', {});

    $provide.constant('CurUser', function (){
      var user = window.sessionStorage.user? JSON.parse(window.sessionStorage.user) : null;

      if(!user){
        var _login = JSON.parse(sessionStorage._login);
        user = JSON.parse(sessionStorage._login).user;
        angular.extend(user, _login.dept);
        user.userName = user.userCode;
      }

      return user;
    });

    //字典数据service 支持缓存功能
    $provide.factory('DictCache', ['$http', function($http){
        
      var store = {};
      /**
       * @param containAll 显示'全部'选项
       */
      var Cache = function(parentCode, callback, containAll){
        var data = store[parentCode];
        
        if(data){
          if(containAll){
              callback.call(null, [{name: '全部'}].concat(data));
          }else{
              callback.call(null, data);
          }
          return;
        }

        var params = {
          parentCode: parentCode,
          page: 1,
          limit: 1000
        };

        $http.post('/java/dicts/list', params).success(function(data){
          if(!data.success){
            alert(data.msg);
            return;
          }

          store[parentCode] = data.results;
          
          if(containAll){
              callback.call(null, [{name: '全部'}].concat(store[parentCode]));
          }else{
              callback.call(null, store[parentCode]);
          }
          
        });
      };

      return Cache;
    }]);

  }]);
});