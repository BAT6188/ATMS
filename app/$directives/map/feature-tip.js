define(function(require, exports, module){

    return ['$rootScope','$location',function($rootScope,$location){

        var linker = function($scope, $el, $attrs) {

            $scope.$watch('map', function (map){
                if(!map){
                    return;
                }

                var callback = function (event){

                    if(map.clientLayer.features.length === 1){
                        $scope.feature = map.clientLayer.features[0];
                        $scope.onShow({
                            $feature: $scope.feature
                        });
                    }else{
                        $scope.feature = null;
                        $rootScope.$broadcast('featureClose');
                        $scope.onClose();
                    }
                    $scope.$apply();
                };

                map.clientLayer.events.un({
                  featuresadded: callback,
                  featuresremoved: callback
                });

                map.clientLayer.events.on({
                  featuresadded: callback,
                  featuresremoved: callback
                });

            });


            $rootScope.$on('feaClose',function(){
                $scope.close();
            });

            $scope.close = function (){
                if($scope.feature){
                    $scope.map.clientLayer.removeAllFeatures({silent:true});
                    $scope.map.exSelector.vector.removeAllFeatures({silent:true});
                    $scope.map.exSelector.bufferLayer.removeAllFeatures({silent:true});
                }
                $scope.feature = null;
                $scope.onClose();

                $rootScope.$broadcast('featureClose');
            };

            //呼叫中心
            $scope.callOutPhone = function($event, phone) {
              // var e = $($event.target);
              // e.html('');
              // e.removeClass('glyphicon-phone-alt');
              // e.addClass('glyphicon-earphone');
              // e.html('...');
              if(phone) {
                  callOutPhone_xg(phone);
              }
              // window.setTimeout(function(){
                // e.removeClass('glyphicon-earphone');
                // e.addClass('glyphicon-phone-alt');
                // e.html('');
              // }, 2000);
            };

            $scope.$watch('feature', function() {
                if ($scope.feature && $scope.feature.attributes && $scope.feature.attributes.ID) {
                    $scope.roadid = $scope.feature.attributes.ID;
                }
            });

            //历史轨迹
            $scope.carHistory = function(feature) {
                var tempData = {};
                tempData.key = 'TSJK_CAR_RECORD';
                tempData.val = feature;
                $rootScope.tempData = tempData;
                $location.path('QWGL.QW.CarTrack/' + feature.attributes.CAR_NO);
            };
            //历史轨迹
            $scope.policeHistory = function(feature) {
                var tempData = {};
                tempData.key = 'TSJK_POLICE_RECORD';
                tempData.val = feature;
                $rootScope.tempData = tempData;
                $location.path('QWGL.QW.PoliceTrack/' + feature.attributes.POLICE_NO);
            };
        };

        return {
            restrict:'EA',
            link: linker,
            replace: true,
            scope: {
                map: '=?',
                feature: '=?',
                onShow: '&',
                onClose: '&'
            },
            templateUrl: 'app/$directives/map/feature-tip.html'
        };
    }];
    
});