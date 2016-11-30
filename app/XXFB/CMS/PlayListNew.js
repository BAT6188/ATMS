define(function (require, exports, module) {
    var controller = ['$scope', '$routeParams', 'Message', 'DictCache','PlayList',
     function ($scope, $routeParams, Message, DictCache, PlayList) {
        
      $scope.cmsId = $routeParams.id;
      $scope.width = $routeParams.width;
    $scope.height = $routeParams.height;
      
    $scope.record = {};
    
      //诱导屏字体字典
        DictCache("0056", function(dict){
            $scope.fonts = dict;
            $scope.record.font = $scope.fonts[0];
        });
        
        //诱导屏字体颜色字典
        DictCache("0057", function(dict){
            $scope.fontColors = dict;
            $scope.record.fontColor = $scope.fontColors[0]; 
        });
      
      //诱导屏显示风格字典
        DictCache("0053", function(dict){
            $scope.showStyles = dict;
            $scope.record.showStyle = $scope.showStyles[0];
        });

        $scope.ok = function () {
          $scope.record.cmsId = $routeParams.id;
            PlayList.save($scope.record, function(data){
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
