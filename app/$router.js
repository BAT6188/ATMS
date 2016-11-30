define(function(require, exports, module){
    var load_view = function(module_name, proxy) {
        //IE8下console后非常卡
        // console.log(proxy);
        if(proxy){
            return proxy + '.html';
        }
        return 'app/' + module_name + '.html';
    };

    var config = ['$routeProvider', '$controllerProvider', function(route, $controllerProvider) {
        registerController = $controllerProvider.register;

        var when = function(pages){
            _.each(pages, function(page) {
                var views = _.filter(page.path.split('/'), function(f) {
                    return f.charAt(0) !== ':';
                });

                views = _.map(views, function(a) {
                    return a.replace(/^\w/, function(v) {
                        return v.toUpperCase();
                    });
                }).join('').replace(/\./g,'/');

                var ctrl = './' + views;

                if(page.proxy){
                    var ctrl = page.proxy + '.js';
                }

                route.when('/' + page.path, {
                    templateUrl : load_view(views, page.proxy),
                    controller : ctrl,
                    resolve: {
                        load: ['$q', '$rootScope', function($q, $rootScope) {
                            var dfrd = $q.defer();
                            require.async(ctrl, function(controller){
                                dfrd.resolve();
                                // $rootScope.$apply();
                                registerController(ctrl, controller);
                            });
                            return dfrd.promise;
                        }]
                    }
                });
            });
        };

         var pages = sessionStorage._pages;
        
         if(pages){
             // IE8下不打开debug模式报js错误
             // console.log('从缓存添加路由');
             try{
                when(JSON.parse(pages));
            }catch(e){
                
            }
         }
        //不引用$sys是可删除

        PubSub.on('setting:loaded', function(e, records){
            sessionStorage._pages = JSON.stringify(records);
            when(records);
            // console.dir(records);
            console.log('add routes');
        });
        
        when([{path: '$modules.$welcome'},{path: '$modules.$login'}]);

        route.otherwise({
            redirectTo : '/$modules.$welcome'
        });
        
    }];

    module.exports = config;
});