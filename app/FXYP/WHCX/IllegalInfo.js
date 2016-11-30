define(function (require, exports, module) {
    var controller = ['$scope', 'DictCache','Query', 'Message','Violation',
     function ($scope, DictCache,Query, Message,Violation) {
        //警情类型数据字典
        DictCache('TRAVEL_STATUS', function(dicts) {
            $scope.acts = dicts;
        },true);

        DictCache('0081', function(dicts) {
            $scope.carTypes = dicts;
        },true);


        $scope.Q = Query.data();

        // 查询功能
        var _query = function(){
            var q = $scope.Q.query();
            $scope.allChecked = false;
            Violation.query(q, function(data){
                if(data.success){
                    $scope.total = data.total;
                    $scope.records = data.results;
                }
            });
        };


        $scope.pChange = function(page){
            $scope.Q.page = page;
            _query();
        };

        $scope.query = function(){
            $scope.pChange(1);
        };
    }];

    module.exports = controller;
});