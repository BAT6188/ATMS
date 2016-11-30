define(function(require, exports, module) {
  var factory = ['$http', 'DL', 'Restangular', '$location',
  function($http, DL, Rest, $location) {
    var Klass = function() {
      var load_user_setting = function(user) {
        $http.get('data/settings.json').success(function(results) {
          if (results.length === 0) {
            alert('您尚未被分配任何模块');
            return;
          }

          var records = results[0].mods;

          _.each(records, function(record) {
            record.active = false;
          });

          _settings = records;
          _menus = results[0].menu;

          PubSub.trigger('setting:loaded', [records, _menus]);
        });

      };
      load_user_setting();

      var menuDataSource = function (arr){
        //一级菜单
                var firstLevel = _.filter(arr, function(value){
                    return value.parent === null;
                });

                var notFirst = _.filter(arr, function(value){
                    return value.parent !== null;
                });

                //二级菜单
                var secondLevel = _.map(firstLevel, function(value){
                    var children = _.filter(notFirst, function(m){
                        return m.parent.id === value.menuId;
                    });
                    value.children = children;
                    return value;
                });

                //三级菜单
                var tmp1  = [], tmp2 = [];
                _.each(secondLevel, function(value1){
                    tmp2 = _.map(value1.children, function(value2){
                        var children = _.filter(notFirst, function(m){
                            return m.parent.id === value2.menuId;
                        });
                        value2.children = children;
                        value2.show = true;
                        if(value2.children.length === 0){
                            value2.show = false;
                        }
                        return value2;
                    });
                    tmp2 = _.sortBy(tmp2, function(num){ return parseInt(num.seq); });
                    value1.children = tmp2;
                    tmp1.push(value1);
                });
                return tmp1;
            }

      this.login = function(user, success, error) {
        DL.login(user, function(data) {
          if (!data.success) {
            if ( typeof error !== 'function') {
              return;
            } else {
              error.apply(null, arguments);
            }
            return;
          }
          if (data && data.results && data.results.user && data.results.user.userName) {
            user.userName = data.results.user.userName
          }

          var menus = [];
          if (data.results && data.results.menu) {
            menus = data.results.menu;
            // adds = {
            //           menuId:200,
            //    menuName:"态势监控33",
            //    parent:{
            //                id:101,
            //      name:"态势监控",
            //      parent:null{
            //        code:null,
            //        initFlag:null,
            //        name:"态势监控",
            //        path:"#/TSJK.Tsjk2",  
            //        seq:1
            //      },
            //             },
            //    path:"#/TSJK.Tsjk2",  
            //    seq:1
            //  };
            //  menus.push(adds);
          }

          //抽取 routers
          var routers = [];

          _.each(menus, function(menu) {
            if (menu.path) {
              routers.push({
                name : menu.menuName,
                path : menu.path.replace(/^\#\//, ''),
                parent : menu.parent
              });
            }
          });

/*          var mn = _.groupBy(routers, function(menu) {
            return menu.parent.id + '&' + menu.parent.name;
          });*/

          var mn = menuDataSource(menus);
          
          sessionStorage._login = JSON.stringify({
            'mn' : mn,
            'routers' : routers,
            'priv' : data.results.priv,
            'user' : user,
            'dept' : data.results.dept,
            'sessionId' : data.results.sessionId
          });

          PubSub.trigger('menu:loaded', [routers, mn]);
          PubSub.trigger('login', [user.userName || user.userCode]);

          if ( typeof success !== 'function') {
            return;
          } else {
            success.apply(null, arguments);
          }
        });
      };

      this.logout = function(callback) {
        Rest.all('').one('logout').get().then(function(data) {
          if (!data.success) {
            alert(data.msg);
            return;
          }
          if ( typeof callback !== 'function') {
            return;
          } else {
            callback.apply(null, arguments);
          }
          sessionStorage.removeItem('_login');
        }, function(e) {
          console.log(e);
        });
      };

      /**
       * 判断权限编码是否存在
       *
       * @param pricode 权限编码值
       * @return true/false 存在true/不存在false
       */
      this.getPrivilege = function(pricode) {
        var _login = {};
        if (sessionStorage._login) {
          try {
            _login = JSON.parse(sessionStorage._login);
          } catch(e) {
            console.log(e);
            return false;
          }
        } else {
          return false;
        }
        if (_login.priv) {
          var priv = _login.priv;
          for (var i = 0; i < priv.length; i++) {
            if (priv[i] && priv[i] === pricode) {
              return true;
            }
          }
        }
        return false;
      };

      this.getDeptCode = function() {
        if (sessionStorage._login) {
          var _login = sessionStorage._login;
          try {
            _login = JSON.parse(_login);
            var code = _login.dept ? _login.dept.parentAreaDept.deptCode : '320300000000';
            if(code === '0001'){
              return '320300000000';
            }
            return code;
          } catch(e) {
            console.log(e);
          }
        }
        return null;
      };

      this.getSessionId = function() {
        if (sessionStorage._login) {
          var _login = sessionStorage._login;
          try {
            _login = JSON.parse(_login);
            var sessionId = _login.sessionId;
            return sessionId;
          } catch(e) {
            console.log(e);
          }
        }
        return null;
      };

      /**
       * 报警跳转页面
       */
      var skipPage4Alarm = function() {
          if(!$location.search()) {
              $location.path('/$modules.$login');
              return;
          }
          var sessionid = $location.search().sessionid;
          var redirect = $location.search().redirect;
          if(sessionid && redirect) {
              var success = function() {
                  $location.path(redirect);
              };
              var error = function() {
                  $location.path('/$modules.$login');
              };
              var login4Alarm = function(user, success, error) {
                DL.login4Alarm(user, function(data) {
                  if (!data.success) {
                    if ( typeof error !== 'function') {
                      return;
                    } else {
                      error.apply(null, arguments);
                    }
                    return;
                  }
                  if (data && data.results && data.results.user && data.results.user.userName) {
                    user.userName = data.results.user.userName
                  }
        
                  var menus = [];
                  if (data.results && data.results.menu) {
                    menus = data.results.menu;
                  }
        
                  //抽取 routers
                  var routers = [];
        
                  _.each(menus, function(menu) {
                    if (menu.path) {
                      routers.push({
                        name : menu.menuName,
                        path : menu.path.replace(/^\#\//, ''),
                        parent : menu.parent
                      });
                    }
                  });
        
                  var mn = menuDataSource(menus);
                  
                  sessionStorage._login = JSON.stringify({
                    'mn' : mn,
                    'routers' : routers,
                    'priv' : data.results.priv,
                    'user' : user,
                    'dept' : data.results.dept,
                    'sessionId' : data.results.sessionId
                  });
        
                  PubSub.trigger('menu:loaded', [routers, mn]);
                  PubSub.trigger('login', [user.userName || user.userCode]);
        
                  if ( typeof success !== 'function') {
                    return;
                  } else {
                    success.apply(null, arguments);
                  }
                });
              };
              
              login4Alarm({'sessionid': sessionid}, success, error);
          }
      };
      skipPage4Alarm();

    };

    return new Klass();
  }];

  module.exports = factory;
});
