define(function () {'use strict';
    return ['$scope', '$modalInstance', 'Restangular', 'param', 'CurUser', 'DictCache', function($scope, $modalInstance, Restangular, param, User, DictCache){
        
        $scope.user = User();
        
        //号牌颜色字典
        DictCache('PLATE_COLOR', function (dicts){
            $scope.plateColors = dicts;
        });

        if(param.ids){
          $scope.ids = param.ids;
        }else if(param.record){
          $scope.ids = [param.record.dispId];
        }
        
        //审核布控
        $scope.examine = function(){
          var verify = {
                dispId :$scope.ids,
                idcard : $scope.user.idCard,
                verifyDeptCode : $scope.user.deptCode,
                verifyDesc : $scope.$$childTail.verifyDesc,
                verifyStatus : $scope.$$childTail.verifyStatu,
                verifyUserId : $scope.user.userId
            };
            
            Restangular.all('bukong/dispatchSP').post(verify).then(function () {
                $modalInstance.close();
            });
        };
        
        //关闭窗口
        $scope.close = function(){
          $modalInstance.close();
        };
  }];
});