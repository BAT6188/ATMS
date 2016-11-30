define(function (require, exports, module) {
    var controller = ['$scope', 'Message', 'User', 'DictCache','Dept',
     function ($scope, Message, User, DictCache,Dept) {
        
        Dept.query({},function(data){
            if(!data.success){
                alert(data.msg);
            }
            $scope.department = data.results;
        });

        $scope.record = {
            status:{code:'1',name:'空闲'},
        };

        $scope.ok = function () {
            $scope.record.department = {
                            'id':$scope.record.dept.deptId,
                            'name':$scope.record.dept.deptName
                        };
            User.save($scope.record, function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                Message.success('信息提示', '用户添加成功！');
            });
        };
        
        $scope.reset = function(){
          $scope.record = {};
        };
        
    }];
    module.exports = controller;
})
