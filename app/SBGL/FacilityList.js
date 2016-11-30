define(function (require, exports, module) {
    var controller = ['Modal', '$scope', 'Query', 'DictCache','$location', 'Restangular','LocationMonitor',
        function (Modal, $scope, Query,DictCache, $location,Rest,Device,LocationMonitor) {
        $scope.showAdvance = false;
        $scope.mapView = false;
        $scope.advance = function(){
            $scope.showAdvance = !$scope.showAdvance;
            //$scope.Q.name = null;
            $scope.Q.typeCode = null;
            $scope.Q.statusCode = null;
        };

        //-----------------devicecontroller---------------------
       
        $scope.multiplyExport = function(){
            Message.alert("提示信息", "请批量导入！", "#DA4F49");
        };

        //设施类型字典
        DictCache("0002", function(dict){
          // console.log(dict);
            $scope.types = dict;
        }, true);

        //设备状态字典
        DictCache("0005", function(dict){
            $scope.statuss = dict;
        }, true);
        
        //管辖区域字典
        DictCache("0036", function(dict){
            $scope.manageDepts = dict;
        }, true);

        $scope.remove = function(){
            
            var r = [];
            for(var i = 0, size = $scope.checks.length; i < size; i++){
                if($scope.checks[i]){
                    r.push($scope.records[i].id);/*注意*/
                }
            }

            var ids = r.join(',');

            var bool = false;
            if(r.length===0){
                alert('请选择需要删除的记录!');
            }else{
                bool = confirm('确认删除这 '+ r.length + ' 条记录吗?');
            }

            if(!bool) return;

            Device.remove({id: ids}, function(data){
                if(!data.success) alert(data.msg);
                _query();
            });

        };

        $scope.Q = Query.data();

        // 全选功能
        $scope.checks = [];
        $scope.allChecked = true;

        $scope.select = function(index){
            $scope.checks[index] = !$scope.checks[index];
            $scope.allChecked = _.every($scope.checks);
        };

        $scope.selectAll = function(){
            initCheck($scope.allChecked,$scope.records.length);
        };

        //初始化
        var initCheck = function(bool,num){
            var checks = [];
            for(var i = 0; i < num; i++){
                checks.push(bool);
            }
            $scope.checks = checks;
        };

        // 查询功能
        var _query = function(){
            var q = $scope.Q.query();

            $scope.allChecked = false;

            Rest.all('facilityNew/list').post(q).then(function(data){
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

        //表单/地图切换
        $scope.viewChange = function(record) {
            Modal('./Locator', record).result.then(function(){
                Device.update(record,function(data){
                    if(!data.success){
                        alert(data.msg);
                        return;
                    }
                });
            });
        };

        $scope.infoModal = function(record){
            $scope.checkRecord = record;
            $('#infoModal').modal();
        };

    }];

    module.exports = controller;
});