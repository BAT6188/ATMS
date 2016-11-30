define(function(require, exports, module){
    var controller = ['$scope', 'Dept', function($scope, Dept){
        $scope.config = {
          data:{
            simpleData: {
              enable: true,
              idKey: 'deptId'
            },
            key: {
              name: 'deptName'
            }
          }
        };

        Dept.query({}, function(data){
          _.each(data.results, function(record){
            record.pId = record.parentDept ? record.parentDept.deptId : 0;
          });
          $scope.data = data.results;
        });

        $scope.onClick = function(){
          var nodes = $scope.tree1.getNodes();          
          console.log(nodes);
        };

        $scope.$watch('checkedNodes', function(value){
          console.log(value);
        });
    }];

    module.exports = controller;
});