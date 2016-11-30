define(function(require, exports, module){

    var controller = ['Modal','$location', '$scope', 'Query', 'Message','DictCache', 'LocationMonitor','specialDuty','Duty',
      function(Modal,$location,$scope, Query, Message, DictCache,LocationMonitor,specialDuty,Duty){
        $scope.hrefFunc = function(record){
            if(record.status.code>1){
                var path = '/JCZH.TQRW.Cast/'+record.id;
                $location.path(path);
            }else{
                var path = '/JCZH.TQRW.Edit1/'+record.id;
                $location.path(path);
            }
        };
        
        $scope.Q = Query.data();

        // 全选功能
        $scope.checks = [];

        //特勤任务状态
        DictCache("0034", function(dict){
            $scope.statuss = dict;
        },true);

        //特勤任务级别
        DictCache("0040", function(dict){
            $scope.levels = dict;
        },true);
        
        $scope.select = function(index){
            $scope.checks[index] = !$scope.checks[index];
            $scope.allChecked = _.every($scope.checks);
        };

        $scope.updateTime = function(record){
            Modal('./StaskTime', record);

            // specialDuty.update(record, function(data){
            //   record = data.results;
            // });
        };
        
        $scope.selectAll = function (){
            $scope.allChecked = !$scope.allChecked;
            initCheck($scope.allChecked);
        };

        //初始化
        var initCheck = function(bool){
            var checks = [], max = ($scope.Q.pageSize < $scope.total ? $scope.Q.pageSize : $scope.total);
            for(var i = 0; i < max; i++){
                checks.push(bool);
            }
            $scope.checks = checks;
        };

        // 查询功能
        var _query = function(){
            var q = $scope.Q.query();

            $scope.allChecked = false;
            // q.parentStaskId = 0;
            specialDuty.query(q, function(data){
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
       
        $scope.remove = function(){     
            var r = [];
            var dr = [];
            for(var i = 0, size = $scope.checks.length; i < size; i++){
                if($scope.checks[i]){
                    r.push($scope.records[i].id);
                    if($scope.records[i].dutyId) {
                        dr.push($scope.records[i].dutyId);
                    }
                }
            }

            var ids = r.join(',');
            var dids = dr.join(',');

            var bool = false;
            if(r.length===0){
                alert('请选择需要删除的记录!');
            }else{
                bool = confirm('确认删除这 '+ r.length + ' 条记录吗?');
            }

            
            if(!bool) return;

            specialDuty.remove({id: ids}, function(data){
                if(!data.success) alert(data.msg);
                if(dids.length >= 1) {
                    Duty.remove({id: dids}, function(data1){
                        if(!data1.success) alert(data1.msg);
                    });
                }
                _query();
            });

        };
    }];

    module.exports = controller;
});