define(function(require, exports, module) {
  var controller = [ '$scope', '$routeParams', 'Message', 'ngTableParams', 'Query', 'Role', 'Pri', 'Menu',
      function($scope, $routeParams, Message, ngTableParams, Query, Role, Pri, Menu) {
        var id = $routeParams.id;

        var origin;

        Role.get({
          id : id
        }, function(data) {
          if (!data.success) {
            alert(data.msg);
            return;
          }
          origin = data.results;
          $scope.record = angular.copy(origin);
          $scope.selecteds = $scope.record.privileges;
          $scope.menuSelecteds = $scope.record.menus;
        });

        $scope.ok = function() {
          if (angular.equals($scope.record, origin)) {
            alert('数据没有修改!');
            return;
          }
          var r =[];
                angular.forEach($scope.selecteds,function(s){
                    if(!s.unChecked) {
                      var o = {};
                      o.priId = s.id;
                      r.push(o);
                    }
                });
                $scope.record.rolePrivileges = r;
                
                var m =[];
                angular.forEach($scope.menuSelecteds,function(s){
                    if(!s.unChecked) {
                      var o = {};
                      o.menuId = s.menuId;
                      m.push(o);
                    }
                });
                $scope.record.roleMenus = m;

                Role.update($scope.record, function(data) {
            if (!data.success) {
              alert(data.msg);
              return;
            }
            origin = data.results;
            $scope.record = angular.copy(origin);
            alert('更新成功!');
          })
        };

        $scope.reset = function() {
          $scope.record = angular.copy(origin);
        };
        
        //分配权限
        $scope.RoadQ = Query.data();
          
          $scope.Q = Query.data();
            $scope.Q.cmsId = $routeParams.id;
          var q = $scope.Q.query();
          
            $scope.Q = Query.data();
            $scope.Q.maxSize = 3;

            // 全选功能
            $scope.checks = [];
            $scope.selecteds = [];

            //勾选路段
            $scope.select = function(index){
                $scope.checks[index] = !$scope.checks[index];
                $scope.$$childTail.allChecked = _.every($scope.checks);
            };

            //全选路段
            $scope.selectAll = function(){
                initCheck($scope.$$childTail.allChecked);
            };

            //初始化路段check
            var initCheck = function(bool){
                var checks = [];
                for(var i = 0; i < $scope.total; i++){
                    checks.push(bool);
                }
                $scope.checks = checks;
            };
            
            $scope.$watch('allChecked', function(){
                initCheck($scope.allChecked);
            });

            $scope.tableParams = new ngTableParams({
                page: 1,
                count: 10
            }, {
                total: 0,
                getData: function($defer, params){
                  var q = $scope.Q.query();
                  q.page = $scope.tableParams.page();
                  Pri.query(q, function(data){
                    if(!data.success){
                      alert(data.msg);
                      return;
                    }
                    params.total(data.total);
                        $defer.resolve($scope.records = data.results);
                        console.log("$scope.records");
                        console.log($scope.records);
                  });
                }
            });

            // 查询路段
            var _query = function(){
                var q = $scope.RoadQ.query();

                $scope.allChecked = false;

                Pri.query(q, function(data){
                  if(!data.success){
                    alert(data.msg);
                    return;
                  }
//                  params.total(data.total);
                  $scope.records = data.results;
                });
                
            };

            $scope.pChange = function(page){
                $scope.Q.page = page;
                _query();
            };

            $scope.query = function(){
                $scope.pChange(1);
            };

            //添加路段
            $scope.getPost = function(i){
                if(i === true){
                    initCheck(true);
                    console.log($scope.checks);
                }

                //$scope.selecteds = [];
                for(var i = 0, size = $scope.checks.length; i < size; i++){
                    if($scope.checks[i]){
                      var isContain = false;
                      _.each($scope.selecteds, function(item){
                            if(item.id === $scope.records[i].id){
                              isContain = true;
                            }
                        });
                      if(!isContain){
                        var r =$scope.records[i];
                        r.roadId = r.code;
                        r.roadName = r.name;
                        $scope.selecteds.push(r); 
                      } 
                    }
                }
                console.log($scope.selecteds.length);
            };

            //删除选中路段
            $scope.dropPost = function(i){
                if(i === true) {
                    $scope.selecteds = [];
                    return;
                }
                $scope.selecteds.splice(i,1);
                console.log($scope.selecteds);
            };
            
    //***********************************//
    //分配菜单代码--start
            // 全选功能
            $scope.menuChecks = [];
            $scope.menuSelecteds = [];

            //勾选菜单
            $scope.menuSelect = function(index){
                $scope.menuChecks[index] = !$scope.menuChecks[index];
                $scope.$$childTail.menuAllChecked = _.every($scope.menuChecks);
            };

            //全选菜单
            $scope.menuSelectAll = function(){
                menuInitCheck($scope.$$childTail.menuAllChecked);
            };

            //初始化菜单check
            var menuInitCheck = function(bool){
                var checks = [];
                for(var i = 0; i < $scope.total; i++){
                    checks.push(bool);
                }
                $scope.checks = checks;
            };
            
            $scope.$watch('menuAllChecked', function(){
              menuInitCheck($scope.menuAllChecked);
            });

            $scope.menuTableParams = new ngTableParams({
                page: 1,
                count: 10
            }, {
                total: 0,
                getData: function($defer, params){
                  var q = $scope.Q.query();
                  q.page = $scope.menuTableParams.page();
                  
                  Menu.query(q, function(data){
                    if(!data.success){
                      alert(data.msg);
                      return;
                    }
                    params.total(data.total);
                        $defer.resolve($scope.menuRecords = data.results);
                  });
                }
            });

            // 查询路段
            var _menuQuery = function(){
                var q = $scope.RoadQ.query();

                $scope.menuAllChecked = false;

                Menu.query(q, function(data){
                  if(!data.success){
                    alert(data.msg);
                    return;
                  }
                  $scope.menuRecords = data.results;
                });
                
            };

            $scope.menuPChange = function(page){
                $scope.Q.page = page;
                _menuQuery();
            };

            $scope.menuQuery = function(){
                $scope.menuPChange(1);
            };

            //添加菜单
            $scope.getMenu = function(i){
                if(i === true){
                  menuInitCheck(true);
                }

                for(var i = 0, size = $scope.menuChecks.length; i < size; i++){
                    if($scope.menuChecks[i]){
                      var isContain = false;
                      _.each($scope.menuSelecteds, function(item){
                            if(item.menuId === $scope.menuRecords[i].menuId){
                              isContain = true;
                            }
                        });
                      if(!isContain){
                        var r =$scope.menuRecords[i];
                        $scope.menuSelecteds.push(r); 
                      } 
                    }
                }
                console.log($scope.menuSelecteds.length);
            };

            //删除选中路段
            $scope.dropMenu = function(i){
                if(i === true) {
                    $scope.menuSelecteds = [];
                    return;
                }
                $scope.menuSelecteds.splice(i,1);
                console.log($scope.menuSelecteds);
            };
    //分配菜单代码--end
    //***********************************//
            
            
            
      } ];

  module.exports = controller;
})
