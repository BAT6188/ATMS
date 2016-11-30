define(function() {
    return ['$scope', '$modalInstance', 'param', 'Facet', 'Modal',
    function($scope, $modalInstance, param, Facet, Modal) {
        $scope.record = {};

        $scope.save = function() {
            // if ($scope.recordForm.$invalid) {
            // Message.warning('提示信息', '请填写完整的断面新增信息！');
            // return;
            // }

            // var add = {
            // "facetId" : 61,
            // "facetName" : "gtrh",
            // "laneCount" : 3,
            // "lng" : 1.2,
            // "lat" : 2.3,
            // "inUse" : 1,
            // "remark" : "uiuuiuixx",
            // "trafficSmoothSpeed" : 20.43,
            // "trafficCommonSpeed" : 12.43,
            // "trafficJamSpeed" : 4.3,
            // "roadSectionList" : [{
            // "roadSectionId" : 600313036
            // }, {
            // "roadSectionId" : 600053221
            // }]
            // };

            Facet.save($scope.record, function(data) {
                if (!data.success) {
                    alert(data.msg || '后台出错');
                    return;
                }
                $modalInstance.close({
                    success : true
                });
            }, function(e) {
                alert('后台出错');
            });
        };

        $scope.locate = function() {
            var modalInstance = Modal('./Locator', {});
            modalInstance.result.then(function(data) {
                if (data && data.x && data.y) {
                    $scope.record.lng = data.x;
                    $scope.record.lat = data.y;
                }
            });
        };

        $scope.close = function() {
            $modalInstance.close();
        };

    }];
});
