define(function(require, exports, module){

    return ['Buffer', function (Buffer){

        var linker = function ($scope, el, attrs) {
            $scope.fts = [];
            $scope.devices = [];
            /* ---------用于分页----------*/
            $scope.total = $scope.devices.length;
            $scope.page = 1;
            $scope.size = 10;
            $scope.maxSize = 5;
            /* ---------用于分页----------*/
            var buffer;
            $scope.radius = 200;
            $scope.distances = [500, 200, 100];
            var exStyles = new OpenLayers.ExStyles();

            $scope.onDistanceChange = function(value){
                $scope.radius = value;
            };

            $scope.itemClick = function(record){
                $scope.onItemClick({
                    $record: record
                });
            };

            //请求设备数据
            var execute = function(){
                if($scope.layer){
                    $scope.layer.removeAllFeatures();
                }
                //如果该directive不可见
                // if(!$(el).is(':visible')) return;
                if(!$scope.center) return;
                var url = $scope.url;
                var lng = $scope.center.lng;
                var lat = $scope.center.lat;
                var radius = $scope.radius || 200;
                if(!url || !lng || !lat || !radius) return;
                var whereQuery = '1=1';
                if($scope.deviceName) {
                    whereQuery += " and device_name like '%"+$scope.deviceName+"%'";
                }
                new Buffer(url).buffer({
                    buffer:  radius,
                    geometry:  'POINT(' + lng + ' ' + lat +')',
                    inSR:  '4326',
                    outSR: '4326',
                    outfields: '*',
                    spatialRel:  'intersects',
                    where: whereQuery
                }).success(function(data){
                    $scope.devices = data.features;
                    $scope.total = $scope.devices.length;
                });
            };

            $scope.query = function() {
                execute();
            };

            //勾选警员
            $scope.select = function (record){
                record.checked = !record.checked;
                var data = _.filter($scope.devices, function(record){
                    return record.checked;
                });
                $scope.selectItems = data;
                console.log($scope.selectItems);
            };

            $scope.$watchCollection('[radius, center, url]', execute);

            $scope.$watch('map',function(){
                if(!$scope.map) return;

                var styleMap = exStyles.getStyleMapDevice(); //设备样式
                //设备图层
                $scope.layer = new OpenLayers.Layer.Vector("jq-nearby-vector",{
                  displayInLayerSwitcher:false,
                  styleMap:styleMap
                });
                //添加设备图层
                $scope.map.map.addLayer($scope.layer);

                execute();
            });

            // $scope.$watch('init', function(){
              // $scope.radius = 200;
            // });

            // $scope.$watchCollection('devices',function(){
            $scope.$watchCollection('[devices,layer]',function(){
                if(!$scope.devices || !$scope.layer){
                    return;
                }

                //有变化时清空地图上所有绘制过的元素
                $scope.layer.removeAllFeatures();

                //绘制缓冲区
                if($scope.center && $scope.center.lng && $scope.center.lat){
                    $scope.layer.removeFeatures($scope.bfrft,$scope.ft);
                    var origin = new OpenLayers.Geometry.Point($scope.center.lng,$scope.center.lat);
                    var style = exStyles.centAreaShowStyle;
                    var polygon = new OpenLayers.Geometry.Polygon.createRegularPolygon(origin,$scope.radius*0.0000106,100);
                    $scope.ft = new OpenLayers.Feature.Vector(origin, {}, style);
                    $scope.bfrft = new OpenLayers.Feature.Vector(polygon,{},style);
                    $scope.layer.addFeatures([$scope.ft,$scope.bfrft]);
                    $scope.map.map.zoomToExtent($scope.bfrft.geometry.getBounds());
                }

                //添加设备featur
                if($scope.devices.length>0){
                    $scope.fts = [];   //下面的one变量中未包含经纬度信息
                    _.each($scope.devices,function(one){
                        // var type = $scope.item.name;
                        var lng = one.geometry.coordinates[0];
                        var lat = one.geometry.coordinates[1];
                        var pro = one.properties;
                        if(lng && lat){
                            var feature = new OpenLayers.Feature.Vector(
                                      new OpenLayers.Geometry.Point(lng,lat), one.properties);
                            $scope.fts.push(feature);
                        }
                    });
                    $scope.layer.addFeatures($scope.fts);
                }
            });

            if(attrs.selectItems){
                $scope.hasSelect = true;
            }
                
        };

        return {
            restrict:'EA',
            link: linker,
            replace: true,
            scope: {
                url: '=?',
                center:'=?',
                radius:'=?',
                devices:'=?data',
                selectItems:'=selectItems',
                onItemClick: '&onItemClick',
                map:'=?',
                layer: '=?',
                init:'=?init'
            },
            templateUrl: 'app/$directives/jq-nearby.html'
        };
    }];
    
});