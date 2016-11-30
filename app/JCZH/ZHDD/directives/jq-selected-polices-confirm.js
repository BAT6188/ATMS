define(function() {
    return ['$scope', '$modalInstance', 'param', 'Duty',
    function($scope, $modalInstance, param, Duty) {

        $scope.content = '';
        $scope.police

        var initData = function(police) {
            if (police.userName) {
                $scope.content = police.userName + '已到岗，确定到岗操作？';
                $scope.police = police;
                $scope.$apply();
            }
        };
        window.setTimeout(function() {
            if (param && param.police) {
                initData(param.police);
            }
        }, 1000);

        //警员到岗确认
        $scope.arrival = function() {
            if ($scope.police) {
                if ($scope.police.recordId) {
                    var police = {};
                    police.recordId = $scope.police.recordId;

                    //1到岗 0离岗
                    police.mark = '1';
                    Duty.updatePoliceStatus(police, function(data) {
                        if (!data.success) {
                            alert(data.msg);
                            return;
                        }
                        $modalInstance.close({
                            success : true,
                            police : $scope.police
                        });
                        Messenger().post({
                            message : '操作成功！',
                            type : 'success',
                            showCloseButton : true,
                            hideAfter : 3
                        });
                    });
                }
            }
        };

        //关闭窗口
        $scope.close = function() {
            if ($scope.police) {
                $modalInstance.close({
                    success : false,
                    police : $scope.police
                });
            } else {
                $modalInstance.close();
            }
        };

    }];

});
