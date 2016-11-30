//程序入口
define(function(require, exports, module){

  PubSub = jQuery({});

  //路由定义
  var router = require('./$router');

  //加载 filters
  require('./$app.filters');
  //加载 services
  require('./$app.services');
  //加载 directives
  require('./$app.directives');

  require('./$app.resources');

  var app = angular.module('App', ['ngAnimate', 'restangular',
    'ngRoute', 'ngCookies', 'App.resources', 'App.filters', 'App.services', 
    'App.directives', 'ui.bootstrap',
    'chieffancypants.loadingBar',
    'ngTable','validator', 'validator.rules','angularjs-bootstrap-datetimepicker']);

  app.run(['$rootScope', '$location', '$templateCache', function ($rootScope,  $location, $templateCache) {
    $rootScope.tableParameters = {page: 1, count: 15};
    $rootScope.$on('$viewContentLoaded', function (event, newUrl, oldUrl) {
      var url = $location.url();
      if(url.match(/TSJK.Tsjk2$/) 
        || url.match(/JCZH.ZHDD.Dispatch\/\d+\/Edit$/)
        || url.match(/JCZH.ZHDD.DispatchNew$/)
        || url.match(/XXFB.ROAD.PostSelector/)
        || url.match(/XTGL.REGION.Edit/)
        || url.match(/JCZH.TQRW.Execute\/\d+\/Video$/)
        || url.match(/FXYP.AccidentSpot/))
      {
        $('[ng-view]').removeClass('default');
      }
      else
      {
        $('[ng-view]').addClass('default');
      }

      if(url.match(/TSJK.Tsjk2$/)){
        $('#id-navbar-toggle').show();
      }else{
        $('#id-navbar-toggle').hide();
      }
    });

    $templateCache.put('ng-table/headers/checkbox.html', '<input type="checkbox" ng-model="checkboxes.checked" id="select_all" name="filter-checkbox" value="" />');
    $templateCache.put('ng-table/headers/checkbox2.html', '<input type="checkbox" ng-model="checkboxes.checked" id="select_all2" name="filter-checkbox" value="" />');
    $templateCache.put('ng-table/headers/checkbox3.html', '<input type="checkbox" ng-model="checkboxes.checked" id="select_all3" name="filter-checkbox" value="" />');
    $templateCache.put('ng-table/headers/checkbox4.html', '<input type="checkbox" ng-model="checkboxes.checked" id="select_all4" name="filter-checkbox" value="" />');
    $templateCache.put('ng-table/headers/checkbox5.html', '<input type="checkbox" ng-model="checkboxes.checked" id="select_all5" name="filter-checkbox" value="" />');
    $templateCache.put('ng-table/headers/checkbox6.html', '<input type="checkbox" ng-model="checkboxes.checked" id="select_all6" name="filter-checkbox" value="" />');
  }]);

  //配置路由
  app.config(router);

  app.config(['RestangularProvider', function(RestangularProvider){
    RestangularProvider.setBaseUrl('/java');
    window.RestangularProvider = RestangularProvider;
  }]);

  app.config(['$httpProvider', '$provide', function($httpProvider, $provide){
    
    $provide.factory('myHttpInterceptor', function($q) {
        return {
          //全局处理服务端请求错误
         responseError: function(rejection) {
            var msg = '服务端 (' + rejection.status + ') 错误!\n' 
              + rejection.config.method + ': ' + rejection.config.url + '\n'
              + JSON.stringify(rejection.config.data, null, 2);

            // alert(msg);
            Messenger().post({
              message: msg,
              type: 'error',
              showCloseButton: true
            });

            return $q.reject(rejection);
          },

          response: function (response){
            // console.log(response);
            if(response && response.data && response.config.url.match(/^\/java\//)){
              // response.data = {success:false, msg: '发生错误'};
              var success = response.data.success;
              if(success){
                if(!response.config.url.match(/^\/java\/dicts\/list/)){
                  /*Messenger().post({
                    message: response.data.msg + '\n' + response.config.url,
                    type: 'success',
                    showCloseButton: true
                  });*/
                }
              }else{
                Messenger().post({
                  message: response.data.msg, //+ '\n' + response.config.url,
                  type: 'error',
                  showCloseButton: true
                });
                //执行下面函数进不了回调函数
                // return $q.reject('rejection');
              }
            }
            return response || $q.when(response);
          }
        };
    });

    $httpProvider.interceptors.push('myHttpInterceptor');
  }]);

  exports.init = function(){
    angular.bootstrap(document.body, ['App']);
    Messenger.options = {
      theme: 'flat'
    };
  };
});