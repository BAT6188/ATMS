define(function(require, exports, module) {
    return [
    function() {

        var linker = function($scope, $el, $attrs) {

            $scope.flowInfos = [/*{
             attributes : {
             STATUS : {
             code : '3',
             name : '拥堵'
             },
             NAME : '三环东路与洞山路交叉口',
             ROAD_NAME : '三环东路与洞山路交叉口',
             roadSectionId : '123456',
             cmss : [{id: 123, name: '诱导屏测试', picUrl: 'http://127.0.0.1/'}]
             }
             }*/];

            socket.emit('subscribe', {
                "clientType" : "flowRoad"
            });

            socket.on('flow:reminded', function(datas) {
                //格式
                /* jamToCommon: [],
                 commonToJam: [{
                 roadSectionId: -700931003,
                 roadSectionName: '段庄农贸市场',
                 roadSectionState: {
                 changed: true,
                 overdueMin: 0,
                 state: 4,
                 stateName: '阻塞',
                 updateMode: '1',
                 updateTime: 1402934400000,
                 speed: 20,
                 flow: 10,
                 cycle: 10
                 },
                 cmss: [{
                 id,
                 name,
                 picUrl
                 }]
                 }]*/
                if (datas && datas.commonToJam && datas.commonToJam.length >= 1) {
                    $.each(datas.commonToJam, function(dnum, data) {
                        var d = {
                            roadSectionId : data.roadSectionId,
                            OBJECTID : data.roadSectionId,
                            STATE : data.roadSectionState,
                            STATUS : data.roadSectionState.state,
                            NAME : data.roadSectionName,
                            ROAD_NAME : data.roadSectionName,
                            cmss : data.cmss
                        };
                        var isInFlowInfos = false;
                        $.each($scope.flowInfos, function(inum, info) {
                            if (info && info.attributes && info.attributes.roadSectionId && data && data.roadSectionId && info.attributes.roadSectionId === data.roadSectionId) {
                                isInFlowInfos = true;
                                return false;
                            }
                        });
                        if (!isInFlowInfos) {
                            $scope.flowInfos.unshift({
                                attributes : d
                            });
                            if ($scope.flowInfos.length > 10) {
                                $scope.flowInfos.length = 10;
                            }
                            $scope.$apply();
                        }
                    });
                }
                if (datas && datas.jamToCommon && datas.jamToCommon.length >= 1) {
                    $.each(datas.jamToCommon, function(dnum, data) {
                        var isInFlowInfos = false;
                        var flowInfoNum = -1;
                        $.each($scope.flowInfos, function(inum, info) {
                            if (info && info.attributes && info.attributes.roadSectionId && data && data.roadSectionId && info.attributes.roadSectionId === data.roadSectionId) {
                                isInFlowInfos = true;
                                flowInfoNum = inum;
                                return false;
                            }
                        });
                        if (isInFlowInfos && flowInfoNum !== -1) {
                            $scope.flowInfos.splice(flowInfoNum, 1);
                            $scope.$apply();
                        }
                    });
                }
                $scope.data = $scope.flowInfos;
                $scope.onItemTransport({
                    $features : $scope.data
                });
            });

            $scope.onTsListItemClick = function(feature) {
                for (var i = 0; i < $scope.flowInfos.length; i++) {
                    if ($scope.flowInfos[i] === feature) {
                        $scope.flowInfos.splice(i, 1);
                        break;
                    }
                }
                if ($scope.layersDefs) {
                    _.each($scope.layersDefs, function (layer){
                        if(layer.cls && layer.cls === 'layerRoad') {
                            feature.dyLyr = layer;
                            return false;
                        }
                    });
                }
                $scope.onItemClick({
                    $feature : feature,
                    $featureTipVisible : true,
                    $tsListVisible : false
                });
            };

            $scope.$on('$destroy', function() {
                socket.emit('unsubscribe', {
                    'clientType' : 'flowRoad'
                });
                socket.removeAllListeners();
            });

        };

        return {
            restrict : 'EA',
            replace : true,
            link : linker,
            scope : {
                data : '=?',
                layersDefs: '=?layer',
                onItemTransport : '&',
                onItemClick : '&'
            },
            templateUrl : 'app/$directives/road-alarm.html'
        };
    }];
});
