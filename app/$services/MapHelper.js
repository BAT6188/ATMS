define(function(require, exports, module){
  return ['$rootScope', '$q', function ($rootScope, $q){
    /**
    var factory = function (){

      var deferred = $q.defer();

      $rootScope.$on('yhte-map:init', function(e, map){
        deferred.resolve(map);
      });

      $rootScope.$broadcast('yhte-map:get');

      return deferred.promise;
    };

    return factory;
    **/
    var deferred = $q.defer();

    $rootScope.$on('yhte-map:init', function(e, map){
      deferred.resolve(map);
    });

    $rootScope.$broadcast('yhte-map:get');

    return function (scope){
      return deferred.promise.then(function (map){
        if(scope){
          scope.map = map;
        }
        return map;
      });
    };

  }];
});