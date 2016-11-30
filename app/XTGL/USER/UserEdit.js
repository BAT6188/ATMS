define(function(require, exports, module) {
  var controller = [ '$scope', '$routeParams', 'Message', 'Dept',
      'User',
      function($scope, $routeParams, Message, Dept, User) {
        var id = $routeParams.id;

        var origin;

        Dept.query({}, function(data) {
          $scope.department = data.results;
        });

        User.get({
          id : id
        }, function(data) {
          if (!data.success) {
            alert(data.msg);
            return;
          }
          origin = data.results;
          $scope.record = angular.copy(origin);
        });

        $scope.ok = function() {
          if (angular.equals($scope.record, origin)) {
            alert('数据没有修改!');
            return;
          }
          User.update($scope.record, function(data) {
            if (!data.success) {
              alert(data.msg);
              return;
            }
            origin = data.results;
            $scope.record = angular.copy(origin);
            angular.forEach($scope.department, function(item, index) {
              if ($scope.record.dept.deptId === item.deptId) {
                $scope.record.dept = $scope.department[index];
              }
            });
            alert('更新成功!');
          })
        };

        $scope.reset = function() {
          $scope.record = angular.copy(origin);
        };
      } ];

  module.exports = controller;
})
