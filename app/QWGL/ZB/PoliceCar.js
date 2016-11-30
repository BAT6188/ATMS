define(function (require, exports, module) {
    var controller = ['$scope', 'Query','Message','PoliceCar','DictCache',
     function ($scope,  Query, Message,PoliceCar,DictCache) {
        $scope.Q = Query.data();
        $scope.showAdvance = false;

        //警车类型字典
        DictCache("0031", function(dict){
            $scope.types = dict;
        }, true);

        //仓库字典
        DictCache("0032", function(dict){
            $scope.wareHouses = dict;
        }, true);

        //警用装备状态
        DictCache("0035", function(dict){
            $scope.status = dict;
        }, true);

        //切换查询方式
        $scope.advance = function(){
            $scope.showAdvance = !$scope.showAdvance;
            $scope.Q.startOwnTime = null
            $scope.Q.endOwnTime = null;
        };

        // 全选功能
        $scope.checks = [];
        $scope.allChecked = false;


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

        var _query = function(){
            var q = $scope.Q.query();

            $scope.allChecked = false;

            PoliceCar.query(q, function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                $scope.total = data.total;

                $scope.records = data.results;
                initCheck($scope.allChecked,$scope.records.length);
            });
        };

        $scope.pChange = function(page){
            $scope.Q.page = page;
            _query();
        };

        $scope.query = function(){
            $scope.pChange(1);
        };
        //删除
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
            PoliceCar.remove({id: ids}, function(data){
                if(!data.success) alert(data.msg);
                _query();
            });

        };

        //领用
        $scope.distribute = function(index,equipid){
            //if(!index || !equipid) return
            $scope.arrayIndex = index; //repeat 数据的 $index
            $scope.selectedId = equipid;
           $("#dispatchModal").modal();
        };

        //领用
        $scope.saveDispatch = function(){
            $scope.newRecord.equipId = $scope.selectedId;
            PoliceCar.changeState($scope.newRecord, function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                //清空 $scope.newRecord
                    $scope.records[$scope.arrayIndex] = data.results;
                    $scope.newRecord = {};
                    $scope.arrayIndex = null;
                    $scope.selectedId = null;
                    $("#dispatchModal").modal('hide');
            });
        };

        //归还
        $scope.returnDispatch = function(index,equipid){
            //if(!index || !equipid) return
            PoliceCar.returnEquip({equipId:equipid}, function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                $scope.records[index] = data.results;
            });
        };
        _query();
    }];

    module.exports = controller;

});