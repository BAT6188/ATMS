define(function(require, exports, module) {
    var controller = ['$scope', 'Message', 'Facet', 'RoadSection', 'Query', '$window', 'Modal',
    function($scope, Message, Facet, RoadSection, Query, $window, Modal) {
        //路段
        $scope.data = [];
        $scope.total = $scope.data.length;
        $scope.Q = Query.data();
        // $scope.Q.pageSize = 5;
        // $scope.Q.maxSize = 5;

        //断面信息
        $scope.record = {};
        $scope.originalRecord = {};

        //断面编号
        $scope.record.currentFacetId = -1;

        //已选路段
        $scope.record.selectData = [];
        $scope.selectTotal = $scope.record.selectData.length;
        $scope.selectPage = 1;
        $scope.selectSize = 5;
        $scope.selectMaxSize = 5;

        //断面查询
        Facet.queryFacet({}, function(data) {
            if (!data.success) {
                Message.error('信息提示', data.msg || '后台出错');
                return;
            }
            $scope.facets = data.results;
            $scope.queryFacets = [];
            $scope.queryFacets.push($scope.facets[0]);
        });

        //路段查询功能
        var _query = function() {
            var q = $scope.Q.query();
            RoadSection.query(q, function(data) {
                if (!data.success) {
                    Message.error('信息提示', data.msg || '后台出错');
                    return;
                }
                $scope.total = data.total;
                $scope.data = data.results;
                $.each($scope.data, function(i1, item1) {
                    var isIn = false;
                    $.each($scope.record.selectData, function(i2, item2) {
                        if (item1.roadSectionId && item2.roadSectionId && item1.roadSectionId === item2.roadSectionId) {
                            isIn = true;
                            return false;
                        }
                    });
                    if (isIn) {
                        item1.checked = !item1.checked;
                    }
                });
            });
        };

        $scope.pChange = function(page) {
            $scope.Q.page = page;
            _query();
        };

        $scope.query = function() {
            $scope.pChange(1);
        };

        _query();

        $scope.select = function(record) {
            //断面和路段1对1关系
            if ($scope.selectTotal >= 1 && !record.checked) {
                Message.warning('提示信息', '断面只能选择一个路段！');
                return;
            }

            record.checked = !record.checked;
            if (record.checked) {
                $scope.record.selectData.push(record);
                $scope.selectTotal = $scope.record.selectData.length;
            }
            if (!record.checked) {
                var data = _.filter($scope.record.selectData, function(item) {
                    if (item.roadSectionId && record.roadSectionId && item.roadSectionId === record.roadSectionId) {
                        return record.checked;
                    }
                    return !record.checked;
                });
                $scope.record.selectData = data;
                $scope.selectTotal = $scope.record.selectData.length;
            }
        };

        $scope.unselect = function(record) {
            record.checked = !record.checked;
            var data = _.filter($scope.record.selectData, function(record) {
                return record.checked;
            });
            $scope.record.selectData = data;
            $scope.selectTotal = $scope.record.selectData.length;
            _query();
        };

        $scope.save = function() {
            if ($scope.entityForm.$invalid || (!$scope.record.selectData || $scope.record.selectData.length === 0)) {
                Message.warning('提示信息', '请填写完整的断面配置信息！');
                return;
            }

            // var update = {
            // "facetId" : 62,
            // "facetName" : "凤飞飞吧",
            // "laneCount" : 4,
            // "lng" : 67,
            // "lat" : 76,
            // "remark" : "ggffggf",
            // "trafficSmoothSpeed" : 1.43,
            // "trafficCommonSpeed" : 2.43,
            // "trafficJamSpeed" : 3.3,
            // "roadSectionList" : [{
            // "roadSectionId" : 600021001
            // }, {
            // "roadSectionId" : 600421119
            // }]
            // };

            var success = function() {
                if ($scope.record.currentFacetId !== -1) {
                    Facet.update({
                        id : $scope.record.currentFacetId,
                        trafficSmoothSpeed : $scope.record.trafficSmoothSpeed,
                        trafficCommonSpeed : $scope.record.trafficCommonSpeed,
                        trafficJamSpeed : $scope.record.trafficJamSpeed,
                        roadSectionList : $scope.record.selectData
                    }, function(data) {
                        if (!data.success) {
                            Message.error('信息提示', data.msg || '后台出错');
                            return;
                        }
                        $window.location.reload();
                    });
                }
            };

            var error = function() {
            };

            Message.confirm('提示', '确定保存路段信息？', {}, success, error);
        };

        $scope.add = function(record) {
            var modalInstance = Modal('FacetConfigAdd', {});
            modalInstance.result.then(function(data) {
                if (data && data.success) {
                    $window.location.reload();
                }
            });
        };

        $scope.remove = function() {
            if (!$scope.record || !$scope.record.currentFacetId) {
                Message.warning('提示信息', '请填写完整的断面配置信息！');
                return;
            }
            var success = function() {
                if ($scope.record.currentFacetId !== -1) {
                    Facet.remove({
                        id : $scope.record.currentFacetId
                    }, function(data) {
                        if (!data.success) {
                            alert(data.msg);
                        }
                        $window.location.reload();
                    });
                }
            };

            var error = function() {
            };

            Message.confirm('提示', '确定删除当前断面信息？', {}, success, error);
        };

        var initRecord = function(result) {
            if (result.facetId) {
                $scope.record.currentFacetId = result.facetId;
            }
            if (result.currentFacetId) {
                $scope.record.currentFacetId = result.currentFacetId;
            }
            $scope.record.trafficSmoothSpeed = result.trafficSmoothSpeed;
            $scope.record.trafficCommonSpeed = result.trafficCommonSpeed;
            $scope.record.trafficJamSpeed = result.trafficJamSpeed;
            if (result.roadSectionList) {
                $scope.record.selectData = result.roadSectionList;
            }
            if (result.selectData) {
                $scope.record.selectData = result.selectData;
            }
            $scope.selectTotal = $scope.record.selectData.length;
            $.each($scope.data, function(i, item) {
                item.checked = false;
            });
            _query();
            $scope.originalRecord = angular.copy($scope.record);
        };

        $scope.reset = function() {
            initRecord($scope.originalRecord);
        };

        $scope.$watch('queryFacets', function() {
            if ($scope.queryFacets && $scope.queryFacets[0] && $scope.queryFacets[0].facetId) {
                $scope.record.currentFacetId = -1;
                Facet.findFacet({
                    id : $scope.queryFacets[0].facetId
                }, function(data) {
                    if (!data.success) {
                        Message.error('信息提示', data.msg || '后台出错');
                        return;
                    }
                    if (data && data.results && data.results.facetId) {
                        initRecord(data.results);
                    }
                });
            }
        });

    }];

    module.exports = controller;
});

