define(function (require, exports, module) {
    var controller = ['$scope', 'Message', 'Menu', '$location',
     function ($scope, Message, Menu, $location) {
        
        Menu.tree({},function(data){
          data.results.unshift({id:0, menuName: '顶层菜单'});
          $scope.parents = data.results;
          _.each(data.results, function (record){
            record.id = record.menuId;
            record.name = record.menuName;
          });
        });

        $scope.save = function (redirect) {
          var data = angular.copy($scope.record);
          
          if(!data.parent){
            data.parent = {
              id: 0
            };
          }

          Menu.save(data, function(data){
            var id = data.results.menuId;
            
            if(redirect){
              $location.path('/XTGL.MENU.Menu/' + id + '/Edit');  
            }else{
              $scope.record = {};
            }

            Messenger().post({
              message: "保存成功!",
              type: "success"
            });
          });
        };
        
        $scope.reset = function(){
          $scope.record = {};
        };
        
    }];
    module.exports = controller;
})
