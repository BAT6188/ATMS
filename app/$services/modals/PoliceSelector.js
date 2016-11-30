define(function (require, exports, module) {
    var controller = ['$scope', '$modalInstance', 'Message','Query', '$window','$filter','Duty','Post',
    function ($scope, $modalInstance, Message,Query, $window, $filter, Duty,Post) {

          //警员查询Q
        $scope.Q = Query.data();

        // 全选功能
        $scope.checks = [];
        $scope.selecteds = [];

        //初始化请求数据
        $scope.init = function(){
            //勤务
            Duty.get({id: $routeParams.dutyId}, function(data){
                if(!data.success){
                    alert(data);
                    return;
                }
            });
            //岗位
        };

        $scope.select = function(index){
            $scope.checks[index] = !$scope.checks[index];
            $scope.$$childTail.allChecked = _.every($scope.checks);
        };

        $scope.selectAll = function(){
            initCheck($scope.$$childTail.allChecked);
        };

        var initCheck = function(bool){
            var checks = [];
            for(var i = 0; i < $scope.total; i++){
                checks.push(bool);
            }
            $scope.checks = checks;
        };

        // 查询功能
        var _query = function(){
            var q = $scope.Q.query();

            $scope.allChecked = false;

            Duty.police(q, function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                $scope.total = data.total;
                initCheck(false);
                $scope.policeList = data.results;
            });

        };

        $scope.pChange = function(page){
            $scope.Q.page = page;
            _query();
        };

        $scope.query = function(){
            $scope.pChange(1);
        };

        //添加警员
        $scope.getPolice = function(i){
            /*selecteds = [];*/
            if(i === true){
                initCheck(true);
                $scope.selectPost.polices = $scope.policeList;
                return;
            }
            
/*            for(var i = 0; i < $scope.checks.length; i++){
                if($scope.checks[i] && !_.contains($scope.selectPost.polices,$scope.policeList[i])){
                    selecteds.push($scope.policeList[i]);
                }
            }*/
            for(var i = 0, size = $scope.checks.length; i < size; i++){
                //遍历所有警员数据
                if($scope.checks[i]){
                    //警员被选中
                    var isContain = false;
                    _.each($scope.selecteds, function(item){
                        if(item.id === $scope.$scope.policeList[i].id){
                            isContain = true;
                        }
                    });
                    if(!isContain) $scope.selecteds.push($scope.$scope.policeList[i]); 
                }
            }

            $scope.selectPost.polices = $scope.selectPost.polices.concat(selecteds);
            console.log($scope.selectPost.polices.length);
        };

        //删除选中警员
        $scope.dropPolice = function(i){
            if(i === true) {
                $scope.selectPost.polices= [];
                return;
            }
            $scope.selectPost.polices.splice(i,1);
            console.log($scope.selectPost.polices.length);
        };

        //保存岗位信息
        $scope.savePost = function(){
            $scope.updateDuty(function(data){
                 if(!data.success){
                  alert(data.msg);
                  return;
                }
            });
            if($scope.editView) $scope.editViewChange()
        };

        $scope.removePost = function(){
             Message.confirm('提示', '确认删除 ' + $scope.selectPost.name + ' 这个岗位吗?', {}, $scope._removePost, $scope.onNo);
        };

        //删除岗位
        $scope._removePost = function(){
            console.log('remove');
            for(var i = 0 ;i < $scope.record.posts.length; i++){
                if($scope.selectPost.pid === $scope.record.posts[i].pid){
                    console.log($scope.selectPost.pid);
                    $scope.record.posts.splice(i,1);
                    i = $scope.record.posts.length;
                    $scope.selectPost = {};
                    console.log($scope.record.posts.length);
                }
            }
            $scope.updateDuty();

            $scope.state = 'calendar';
        };
        $scope.onNo = function(){

        };
        //确认人员到岗
        $scope.confirmStart = function(police){
            var startTime = new Date();
            var _data = {
                //岗位编号
                mark: '1',
                recordId: police.recordId +''
            };
            Duty.updatePoliceStatus(_data,function(data){
                if(!data.success){
                    alert(data.msg);
                    return;
                }
                police.actualStartTime = data.results.actualStartTime;
                console.log(police);
            });
        };

         //确认人员离岗
        $scope.confirmEnd = function(police){
            var endTime = new Date();
            var _data = {
                mark: 2,
                recordId: police.recordId 
            };
            Duty.updatePoliceStatus(_data,function(data){
                if(!data.success){
                    alert(data.msg);
                    return;
                }

                police.actualEndTime = data.results.actualEndTime;
                console.log(police);
            });
        };
        _query();
    }];

    module.exports = controller;
});