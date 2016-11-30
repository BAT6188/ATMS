define(function(require, exports, module){
    var controller = ['Modal', '$scope', 'Query', 'DictCache','$location','$routeParams', 'Restangular','LocationMonitor', '$http','$state','$routeParams',
        function (Modal, $scope, Query,DictCache, $location,$routeParams,Rest,LocationMonitor,$http,$state,$routeParams) {
      $scope.name =$routeParams.name;
      $scope.Q = Query.data();
      // 查询功能
      var _query = function(){
          var q = $scope.Q.query();
          $http.get("app/JCXHKZXT/CT/ct.json").success(function(data) {
              $scope.fa = data;
          });
      };
      _query();
      $scope.send = function(dz){
         if(dz.dz == '冲突'){
             dz.dz = "  ";
         }else  if(dz.dz == "  "){
             dz.dz = '冲突';
         }
      }

  }];
  module.exports = controller;
});