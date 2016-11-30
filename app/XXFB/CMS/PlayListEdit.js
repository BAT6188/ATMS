define(function(require, exports, module) {
  var controller = [ '$scope', '$routeParams', 'Message', 'DictCache',
      'PlayList',
      function($scope, $routeParams, Message, DictCache, PlayList) {
        $scope.cmsId = $routeParams.cmsId;
        $scope.width = $routeParams.width;
        $scope.height = $routeParams.height;
        
        //诱导屏字体字典
            DictCache("0056", function(dict){
                $scope.fonts = dict;
            });
            
            //诱导屏字体颜色字典
            DictCache("0057", function(dict){
                $scope.fontColors = dict;
            });
          
        //诱导屏显示风格字典
            DictCache("0053", function(dict){
                $scope.showStyles = dict;
            });
        
        var id = $routeParams.id;

        var origin;

        PlayList.get({
          id : id
        }, function(data) {
          if (!data.success) {
            alert(data.msg);
            return;
          }
          origin = data.results;
          $scope.record = angular.copy(origin);
        });

        $scope.ok = function() {
          if (angular.equals($scope.record, origin)) {
            alert('数据没有修改!');
            return;
          }
          PlayList.update($scope.record, function(data) {
            if (!data.success) {
              alert(data.msg);
              return;
            }
            origin = data.results;
            $scope.record = angular.copy(origin);
            angular.forEach($scope.department, function(item, index) {
              if ($scope.record.dept.deptId === item.deptId) {
                $scope.record.dept = $scope.department[index];
              }
            });
            alert('更新成功!');
          })
        };

        $scope.reset = function() {
          $scope.record = angular.copy(origin);
        };
      } ];

  module.exports = controller;
})
