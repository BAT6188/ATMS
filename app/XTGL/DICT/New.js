define(function (require, exports, module) {
    var controller = ['$scope', 'Dict', function ($scope, Dict) {
      
      $scope.entity = {
          /*parent: {},*/
          status: {code: 1}
      };

      //保存
      $scope.save = function(){
        Dict.save($scope.entity, function(data){
          if(!data.success){
            alert(data.msg);
            return;
          }
          $scope.reset();
          alert('添加成功!');
        });
      };

      //重置
      $scope.reset = function(){
        $scope.entity = { 
                status: {code: 1},
                parent: $scope.parents[0]
                };
      };


      Dict.getParents(function(data){
          if(!data.success) return;
          $scope.parents = data.results;
          $scope.entity.parent = $scope.parents[0];
      });

    }];

    module.exports = controller;
})
