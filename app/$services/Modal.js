define(function(require, exports, module){
  var factory = ['$modal', '$route', function($modal, $route){

    return function(page, token){

      var prefix = $route.current.loadedTemplateUrl.replace(/(\w+\.html)$/,'');

      if(page.indexOf('./') === 0){
        prefix = 'app/$services/modals/';
      }

      var name =  prefix + page.replace(/^\.\//,'');

      return $modal.open({
        templateUrl: name + '.html',
        controller: page + 'Ctrl',
        resolve: {
          load: ['$q', '$rootScope', function($q, $rootScope) {
              var dfrd = $q.defer();
              require.async(name + '.js', function(controller){
                  dfrd.resolve();
                  // $rootScope.$apply();
                  registerController(page + 'Ctrl', controller);
              });
              return dfrd.promise;
          }],
          token: function (){
            return token;
          },
          param: function (){
            return token;
          }
        }
      });
    };

  }];

  module.exports = factory;
});