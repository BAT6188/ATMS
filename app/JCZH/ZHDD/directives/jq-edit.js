define(function(require, exports, module){

    return ['$rootScope', 'Message', 'PoliceTask', function($rootScope, Message, PoliceTask){

        var linker = function($scope, el, attrs) {

            $scope.locate = function(){
                var GetCdtCtl = new OpenLayers.Control.GetCoordinate($scope.map.clientLayer,{
                    callback:function(){
                        $scope.record.lng = arguments[0].x;
                        $scope.record.lat = arguments[0].y;
                        $scope.$apply();
                        console.log($scope.record.lng ,$scope.record.lat);
                        if(!$scope.record || !$scope.record.id || !$scope.record.lng || !$scope.record.lat)
                        {
                            return;
                        }
                        var yesCallback = function(){
                            PoliceTask.update({'id': $scope.record.id, 'lng': $scope.record.lng, 'lat': $scope.record.lat}, function(data) {
                                if (!data.success) {
                                    alert(data.msg || '后台出错');
                                    return;
                                }
                                alert('更新成功!');
                            }, function(e) {
                                alert('后台出错!');
                            });
                        };
                        Message.confirm('提示', '经纬度获取成功，确定要保存吗？', {}, yesCallback, function() {});
                    }
                });
                $scope.map.map.addControls([GetCdtCtl]);
                GetCdtCtl.activate(1);
            };

            $rootScope.$on('ptask:setPosition', function(e){
                $scope.locate();
            });

        };

        return {
            restrict:'EA',
            link: linker,
            scope: {
                record: '=data',
                types : '=',
                levels : '=',
                alarmWays : '=',
                map:'='
            },
            templateUrl: 'app/JCZH/ZHDD/directives/jq-edit.html'
        };
    }];
    
});