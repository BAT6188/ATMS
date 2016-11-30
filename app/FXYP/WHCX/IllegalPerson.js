define(function (require, exports, module) {
    var controller = ['$scope', 'DictCache','Query', 'Message','Violation',
     function ($scope, DictCache,Query, Message,Violation) {
    $scope.Q = Query.data();

        //违法行为数据字典
        DictCache('TRAVEL_STATUS', function(dicts) {
            $scope.behaviors = dicts;
        },true);

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