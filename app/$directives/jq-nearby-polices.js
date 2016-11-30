define(function(require, exports, module){

    return ['Duty', function(Duty){

        var linker = function($scope, el, attrs) {
            //*********警情类型分为普通和重大两类，只有重大的才需要权限控制_start
            $scope.ptaskTypeIsMajor = function() {
              var isMajor = false;
              if ($scope.ptask && $scope.ptask.type && $scope.ptask.type.code) {
                //1~11，交通事故，交通拥堵，交通管制，稽查布控，车辆违法，自然灾害，危化品运输，群体性事件，道路改造，治安管理，其他事件
                var ptaskType = {
                  '重大' : ['1'],
                  '普通' : ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11']
                };
                var pt4Major = ptaskType["重大"];
                for (var i = 0, j = pt4Major.length; i < j; i++) {
                  if (pt4Major[i] && pt4Major[i] === $scope.ptask.type.code) {
                    isMajor = true;
                    break;
                  }
                }
              }
              return isMajor;
            };
            //*********警情类型分为普通和重大两类，只有重大的才需要权限控制_end
            
            $scope.distances = [1000, 500, 200, 100];

            //周边警力
            var findPolice = function () {
                var q = {
                    lng: $scope.lng,
                    lat: $scope.lat,
                    radius: $scope.radius || 100
                };

                Duty.police(q, function(data) {
                    if (!data.success) {
                        alert(data.msg);
                        return;
                    }
                    $scope.total = data.total;
                    $scope.records = data.results;
                });
            };
            
            $scope.$watch('radius', findPolice);

            $scope.onDistanceChange = function(value){
                $scope.radius = value;
            };

            //勾选警员
            $scope.select = function (record){
                record.checked = !record.checked;
                var data = _.filter($scope.records, function(record){
                    return record.checked;
                });
                $scope.selecteds = data;
                console.log($scope.selecteds);
            };

             //详细
            $scope.detail = function (record){
                $scope._police = record;
                $scope.detailShow = true;
            };

            //定位警员
            $scope.onLocate = function (record){
                if(!record.lng || !record.lat){
                    alert('缺少经纬度信息');
                    return;
                }
                $scope.locator({
                    $lng: $scope.record.lng, //注意这个key的`$`前缀
                    $lat: $scope.record.lat
                });
            };

           // getPolice();
        };

        return {
            restrict:'EA',
            link: linker,
            scope: {
                ptask : '=',
                lng: '=',
                lat: '=',
                selecteds: '=',
                _police: '= detail',
                locator: '&onLocationClick',
                detailShow:'=detailShow'
            },
            templateUrl: 'app/$directives/jq-nearby-polices.html'
        };
    }];
    
});