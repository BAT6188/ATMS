define(function(require, exports, module) {

    return ['$rootScope',
    function($rootScope) {

        var linker = function($scope, el, attrs) {
            $scope.isShowScreen = true;
            var activeX = null;

            //创建
            $scope.createScreen = function() {
                if (activeX) {
                    resetVms();
                    return;
                }
                activeX = el.find('#SC').activeX('SC');
                $scope.activeX = activeX;
                $rootScope.$broadcast('road-tip:loadScreen', activeX);
                if (attrs && (attrs['ocxHeight'] || attrs['ocxWidth'])) {
                    if (attrs['ocxHeight']) {
                        el.find('#SC').css('height', attrs['ocxHeight']);
                        activeX.setOcxSize(null, attrs['ocxHeight']);
                    }
                    if (attrs['ocxWidth']) {
                        el.find('#SC').css('width', attrs['ocxWidth']);
                        activeX.setOcxSize(attrs['ocxWidth'], null);
                    }
                }
                activeX.load();
                setTimeout(function() {
                    $scope.setScreen();
                }, 100);
            };

            //设置
            $scope.setScreen = function() {
                if (!activeX) {
                    return;
                }
                setTimeout(function() {
                    $scope.loginScreen();
                }, 100);
            };

            //登录
            $scope.loginScreen = function() {
            	activeX.getOcx().InitLed(1,$scope.data.attributes.IP,$scope.data.attributes.PORT,$scope.data.attributes.WIDTH,$scope.data.attributes.HEIGHT);
                $rootScope.$broadcast('jq-screen:activeX', activeX, $scope.ledid, $scope.data.attributes.WIDTH,$scope.data.attributes.HEIGHT);
                setTimeout(function() {
                    $scope.isShowScreen = false;
                    $scope.$apply();
                }, 200);
            };

            //登出
            $scope.logoutScreen = function() {
                if (!activeX) {
                    return;
                }
            };

            //销毁
            $scope.destroyScreen = function() {
                if (!activeX) {
                    return;
                }
                activeX.destroy();
                activeX = null;
            };
            
            $scope.$watch('isEdit', function() {
                if ($scope.isEdit === undefined || $scope.isEdit === null) {
                    return;
                }
                if ($scope.isEdit) {
                    $scope.isShowScreen = true;
                    return;
                }
                if (!$scope.isEdit) {
                    $scope.isShowScreen = false;
                    return;
                }
            });

            $scope.$watch('data', function() {
                if (!$scope.data) {
                    return;
                }
                if ($scope.data && ($scope.data.ID || $scope.data.attributes.ID)) {
                    $scope.ledid = $scope.data.ID || $scope.data.attributes.ID;
                } else {
                    return;
                }
                if ($scope.data.attributes && $scope.data.attributes.DEVICE_TYPE && $scope.data.attributes.DEVICE_TYPE == '3') {
                    if ($scope.data.attributes.type && $scope.data.attributes.type == '2') {
                        // $scope.createScreen('2');
                        return;
                    }
                    $scope.createScreen();
                }
            });
            
            var resetVms = function() {
        		activeX.getOcx().InitLed(1,$scope.data.attributes.IP,$scope.data.attributes.PORT,$scope.data.attributes.WIDTH,$scope.data.attributes.HEIGHT);
                $rootScope.$broadcast('jq-screen:activeX', activeX, $scope.ledid, $scope.data.attributes.WIDTH,$scope.data.attributes.HEIGHT);
            };

             //销毁scope时清除资源
             $scope.$on("$destroy", function() {
            	 $scope.destroyScreen();
             });
        };

        return {
            restrict : 'EA',
            link : linker,
            transclude : true,
            scope : {
                activeX : '=?',
                isEdit : '=isEdit',
                data : '=data'
            },
            templateUrl : 'app/$directives/jq-screen.html'
        };
    }];

});
