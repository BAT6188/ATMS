define(function (require, exports, module) {
    var controller = ['$scope', '$modal', 'Modal', 'DictCache', 'Message', 'Query', 'MsgPublish', function ($scope, $modal, Modal, DictCache, Message, Query, MsgPublish) {
        //来源字典
        DictCache("0026", function(dict){
            $scope.sources = dict;
        }, true);
        //信息状态字典
        DictCache("0028", function(dict){
            $scope.statuses = dict;
        }, true);
        //信息分类字典
        DictCache("0027", function(dict){
            $scope.types = dict;
        }, true);
        
        //切换查询方式
        $scope.advance = function(){
            $scope.showAdvance = !$scope.showAdvance;
//            $scope.Q.startOwnTime = null
//            $scope.Q.endOwnTime = null;
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

            MsgPublish.query(q, function(data){
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

            MsgPublish.remove({id: ids}, function(data){
                if(!data.success) alert(data.msg);
                _query();
            });

        };
        
        //查看详情
        $scope.infoModal = function(record){
            $scope.checkRecord = record;
            $('#infoModal').modal();
        };
        
        //表单/地图切换
        $scope.viewChange = function(record) {
            $scope.locateRecord = record;

            $scope.$parent.modalTitle = '绘制点坐标';
            $('.modal-footer').hide();
            $('#map .panel-body').css('height','380px');
            $('#atmModal').modal(); //利用index.html中通用的模态对话框

        };

    }];

    module.exports = controller;
});