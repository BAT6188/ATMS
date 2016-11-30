define(function (require, exports, module) {
    var controller = ['$scope', 'Message', 'MsgPublish', 'DictCache',
     function ($scope, Message, MsgPublish, DictCache) {
        
      $scope.record = {};
      
      //来源字典
        DictCache("0026", function(dict){
            $scope.sources = dict;
            $scope.record.source = $scope.sources[0];
        });
        //信息状态字典
        DictCache("0028", function(dict){
            $scope.statuses = dict;
        });
        //信息分类字典
        DictCache("0027", function(dict){
            $scope.types = dict;
            $scope.record.type = $scope.types[0]; 
        });
        //匹配道路字典
        DictCache("0050", function(dict){
            $scope.roads = dict;
            $scope.record.road = $scope.roads[0];
        });
        //路况
        DictCache("0029", function(dict){
            $scope.trafficReports = dict;
            $scope.record.trafficReport = $scope.trafficReports[0];
        });
        
        $scope.ok = function () {
//            $scope.record.department = {
//                            'id':$scope.record.dept.deptId,
//                            'name':$scope.record.dept.deptName
//                        };
          MsgPublish.save($scope.record, function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                Message.success('信息提示', '添加成功！');
            });
        };
        
        $scope.reset = function(){
          $scope.record = {};
        };
        
    }];
    module.exports = controller;
})
