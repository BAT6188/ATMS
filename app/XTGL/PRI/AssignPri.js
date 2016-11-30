define(function (require, exports, module) {
    var controller = ['$scope', '$modal', 'Modal', 'Message', 'Query', 'Dept', 'User', 'Role', 'Pri', function ($scope, $modal, Modal, Message, Query, Dept, User, Role, Pri) {
        $scope.config = {
        check:{
          enable:true,
            chkboxType: {"Y" : "", "N" : "" }
          }
          ,data:{
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
            
            User.query({}, function(userData){
              _.each(userData.results, function(item){
                item.pId = item.dept? item.dept.deptId : 0;
                item.deptName = item.userName;
                data.results.push(item);
              });
              $scope.data = data.results;
            });
            
          });
        
        $scope.assign = function(){
          var deptList = [];
          var userList = [];
          var roleList = [];
          if(!$scope.checkedNodes){
            Message.alert("提示信息", "请选择至少一个部门或用户!", "#5CB85C");
            return;
          }
          for(var i=0, size=$scope.checkedNodes.length; i<size; i++){
            if($scope.checkedNodes[i].userName){
              userList.push($scope.checkedNodes[i].userId);
            }else{
              deptList.push($scope.checkedNodes[i].deptId);
            }
          }
          for(var i = 0, size = $scope.checks.length; i < size; i++){
                if($scope.checks[i]){
                  roleList.push($scope.records[i].id);
                }
            }
          if(roleList.length < 1){
            Message.alert("提示信息", "请选择至少一个角色!", "#5CB85C");
            return;
          }
          var o = {};
          if(deptList.length>0){
            o.deptList = deptList.join(',');
          }
          if(userList.length>0){
            o.userList = userList.join(',');
          }
          o.roleList = roleList.join(',');
          Pri.assign(o, function(data){
            if(!data.success) alert(data.msg);
            Message.success('信息提示', '分配成功！');
          });
        };
          
        $scope.remove = function(){
            
            var r = [];
            for(var i = 0, size = $scope.checks.length; i < size; i++){
                if($scope.checks[i]){
                    r.push($scope.records[i].userId);
                }
            }

            var ids = r.join(',');

            var bool = confirm('确认删除这 '+ r.length + ' 条记录吗?');

            if(!bool) return;

            User.remove({id: ids}, function(data){
                if(!data.success) alert(data.msg);
                _query();
            });

        };

        $scope.Q = Query.data();

        // 全选功能
        $scope.checks = [];

        $scope.select = function(index){
            $scope.checks[index] = !$scope.checks[index];
            $scope.allChecked = _.every($scope.checks);
        };

        var initCheck = function(bool){
            var checks = [];
            for(var i = 0; i < $scope.total; i++){
                checks.push(bool);
            }
            $scope.checks = checks;
        };

        $scope.selectAll = function(){
          $scope.allChecked = !$scope.allChecked;
          initCheck($scope.allChecked);
        }

        // 查询功能
        var _query = function(){
            var q = $scope.Q.query();

            $scope.allChecked = false;

            Role.query(q, function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                $scope.total = data.total;
                $scope.records = data.results;
                initCheck(false);
            });

        };

        _query();

        $scope.pChange = function(page){
            $scope.Q.page = page;
            _query();
        };

        $scope.query = function(){
            $scope.pChange(1);
        };

        $scope.pressEntry = function(event){
            if(event.which === 13){
                $scope.query();
            }
        };

    }];

    module.exports = controller;
});