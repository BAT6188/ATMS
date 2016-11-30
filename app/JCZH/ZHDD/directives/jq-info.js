define(function(require, exports, module){

    return ['PoliceTask', 'Restangular', 'Message', '$rootScope', function (PoliceTask, Restangular, Message, $rootScope){

        var linker = function($scope, el, attrs) {
  
            $scope.addFb = function(){
                $scope.fbPanel = !$scope.fbPanel;
            };

            $scope.layer = new OpenLayers.Layer.Vector("jq-info-vector", {displayInLayerSwitcher: false});

            var setPosition = function() {
                $rootScope.$broadcast('ptask:setPosition', {});
            };
            
            $scope.$watchCollection('[map, record]', function (array){
                //map 和 record 都存在
                var map = array[0], record = array[1];
                if(map && record && record.id){
                    if(!(record.lng && record.lat)){
                        alert('请定位该警情！');
                        setPosition();
                        return;
                    }

                    map.map.addLayer($scope.layer);

                    var style = _.extend({}, OpenLayers.Feature.Vector.style['default'], {
                        fillColor: '#ff0000',
                        strokeColor: '#ffffff',
                        pointRadius: 9,
                        fillOpacity: '0.8'
                    });

                    var mark = new OpenLayers.Feature.Vector(
                        new OpenLayers.Geometry.Point(record.lng, record.lat), {}, style);

                    $scope.layer.addFeatures([mark]);

                    var lonlat = new OpenLayers.LonLat(record.lng, record.lat);
                    map.map.setCenter(lonlat);
                }
            });
        };

        return {
            restrict:'EA',
            link: linker,
            scope: {
                record: '=data',
                map: '=?',
                fbPanel : '=fbPanel',
                toEvaluate : '=toEvaluate',
                evaluateLen:'=evaluateLength'
            },
            templateUrl: 'app/JCZH/ZHDD/directives/jq-info.html'
        };
    }];
    
});