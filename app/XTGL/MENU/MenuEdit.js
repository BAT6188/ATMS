define(function(require, exports, module) {
  var controller = [ '$scope', '$routeParams', 'Message', 'Menu',
      function($scope, $routeParams, Message, Menu) {
        var id = $routeParams.id;

        var origin;

        Menu.tree({},function(data){
          
          var parents = _.map(data.results, function (record){
            return {
              id: record.menuId,
              name: record.menuName
            };
          });

          parents.push({id: 0, name: '顶层菜单'});
          
          $scope.parents = parents;
        });

        Menu.get({id : id}, function(data) {
          origin = data.results;
          
          if(!origin.parent){
            origin.parent = {
              id: 0
            };
          }
          
          $scope.record = angular.copy(origin);
        });

        $scope.isUnchanged = function (record){
          return angular.equals(record, origin);
        };

        $scope.reset = function (){
          $scope.record = angular.copy(origin);
        };

        $scope.save = function() {
          Menu.update($scope.record, function(data) {
            origin = data.results;
            $scope.record = angular.copy(origin);
            Messenger().post({
              message: "更新成功!",
              type: "info"
            });
          })
        };

      }];

  module.exports = controller;
})
