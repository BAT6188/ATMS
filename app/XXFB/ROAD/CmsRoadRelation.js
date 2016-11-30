define(function (require, exports, module) {
    var controller = ['$scope', '$modal', 'Modal', 'Message', 'Query', 'CmsRoadRelation', function ($scope, $modal, Modal, Message, Query, CmsRoadRelation) {
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

        $scope.$watch('allChecked', function(){
            initCheck($scope.allChecked);
        });

        // 查询功能
        var _query = function(){
            var q = $scope.Q.query();

            $scope.allChecked = false;

            CmsRoadRelation.query(q, function(data){
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