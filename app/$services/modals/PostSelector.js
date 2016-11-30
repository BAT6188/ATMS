define(function (require, exports, module) {
    var controller = ['$scope', '$modalInstance', 'Message','Query', '$window','$filter','Post',
    function ($scope, $modalInstance, Message,Query, $window, $filter, Post) {

        $scope.Q = Query.data();
        $scope.Q.maxSize = 3;

        // 全选功能
        $scope.checks = [];
        $scope.selecteds = [];

        //勾选岗位
        $scope.select = function(index){
            $scope.checks[index] = !$scope.checks[index];
            $scope.$$childTail.allChecked = _.every($scope.checks);
        };

        //全选岗位
        $scope.selectAll = function(){
            initCheck($scope.$$childTail.allChecked);
        };

        //初始化岗位check
        var initCheck = function(bool){
            var checks = [];
            for(var i = 0; i < $scope.total; i++){
                checks.push(bool);
            }
            $scope.checks = checks;
        };


        // 查询岗位
        var _query = function(){
            var q = $scope.Q.query();

            $scope.allChecked = false;

            Post.query(q, function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                $scope.total = data.total;
                initCheck(false);
                $scope.records = data.results;
                
                $("#zfModal").find("div:first").css("width", 780);
            });

        };

        $scope.pChange = function(page){
            $scope.Q.page = page;
            _query();
        };

        $scope.query = function(){
            $scope.pChange(1);
        };
        //取消
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        var selDate = $filter('date')($window.date, 'yyyy-MM-dd HH:mm:ss');

/*        $scope.selected = [{
            name: 'title',
            planStartTime: selDate,
            planEndTime: selDate,
            polices: [],
            allDay: false
        }];*/

        //添加岗位
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
                  if(!isContain) $scope.selecteds.push($scope.records[i]); 
                }
            }
            console.log($scope.selecteds.length);
        };

        //删除选中岗位
        $scope.dropPost = function(i){
            if(i === true) {
                $scope.selecteds = [];
                return;
            }
            $scope.selecteds.splice(i,1);
            console.log($scope.selecteds);
        };

        var selStartTime = $filter('date')($window.date, 'yyyy-MM-dd HH:mm:ss');
        var selEndTime = $filter('date')($window.date.getTime()+2*60*60*1000, 'yyyy-MM-dd HH:mm:ss');

        //！！！保存岗位信息
        $scope.save = function(){
            var r =[];
            angular.forEach($scope.selecteds,function(s){
                if(!s.unChecked) {
                    r.push(s);
                    s.pid = s.id;
                    delete s.id;
                    s.planStartTime = selStartTime;
                    s.planEndTime = selEndTime;
                    s.polices = [];
                    s.allDay = false;
                }
            });
            $modalInstance.close(r);
        };
        _query();
    }];

    module.exports = controller;
});