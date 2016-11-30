define(function (require, exports, module) {
    var controller = ['$scope', '$modal', 'Modal', 'Message', 'Query', 'Role',function ($scope, $modal, Modal, Message, Query, Role) {
        $scope.showAddModal = function(){
            Modal('UserNew');
        };
        
        $scope.remove = function(){
            
            var r = [];
            for(var i = 0, size = $scope.checks.length; i < size; i++){
                if($scope.checks[i]){
                    r.push($scope.records[i].id);
                }
            }

            var ids = r.join(',');

            var bool = confirm('确认删除这 '+ r.length + ' 条记录吗?');

            if(!bool) return;

            Role.remove({id: ids}, function(data){
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
        

        //拥有此角色的用户
        $scope.userQ = Query.data();
        
        var _userQuery = function(){
          var q = $scope.userQ.query();
          q.roleId = $scope.id;
          Role.getUser(q, function(data) {
        if (!data.success) {
          alert(data.msg);
          return;
        }
        $scope.userTotal = data.total;
        $scope.userRecords = data.results;
      });

        };
        
        $scope.userPChange = function(page){
            $scope.userQ.page = page;
            _userQuery();
        };
        
        $scope.viewUserList = function(record){
          $scope.id = record.id;
          _userQuery();
            $('#userModal').modal();
        };
        
        //拥有此角色的部门
        $scope.depQ = Query.data();
        
        var _depQuery = function(){
          var q = $scope.depQ.query();
          q.roleId = $scope.id;
          Role.getDep(q, function(data) {
        if (!data.success) {
          alert(data.msg);
          return;
        }
        $scope.depTotal = data.total;
        $scope.depRecords = data.results;
      });

        };
        
        $scope.depPChange = function(page){
            $scope.depQ.page = page;
            _depQuery();
        };
        $scope.viewDeptList = function(record){
          $scope.id = record.id;
          _depQuery();
            $('#depModal').modal();
        };

    }];

    module.exports = controller;
});