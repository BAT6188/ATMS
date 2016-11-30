define(function () {'use strict';
  return ['$scope', 'Modal', 'ngTableParams', '$modalInstance', 'Restangular', 'param', 'CurUser', 'DictCache', 
    function($scope, Modal, ngTableParams, $modalInstance, Restangular, param, User, DictCache){
        
        $scope.user = User();
        
        DictCache('PLATE_COLOR', function (dict){
           $scope.plateColors = dict;
        });

        $scope.record = param.record;
        
        //撤控
        $scope.cancle = function(){
            var cancle = {
                            cdispDeptCode:$scope.user.deptCode,   
                            cdispDeptName:$scope.user.deptName,
                            cdispIdNumber:$scope.user.idCard,
                            cdispPerson:$scope.user.userId,
                            cdispReason:$scope.$$childTail.verifyStatu,  
                            dispId:$scope.record.dispId
                        };
            Restangular.all('bukong/removeDispatch').post(cancle).then(function (data) {
                $modalInstance.close();
            });
        }; 
        
        //关闭窗口
        $scope.close = function(){
          $modalInstance.close();
        };
  }];
});