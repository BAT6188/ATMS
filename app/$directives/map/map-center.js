define(function(require, exports, module){
    var layer;

    return ['MapHelper', function (MapHelper){

        var linker = function ($scope, $el, attrs) {

            if(!layer){
                layer = new OpenLayers.Layer.Vector("map-center-vector", {displayInLayerSwitcher: false});
            }

            var it;

            var center = function(e){
                if(!$scope.map){
                    return;
                }

                $scope.map.map.addLayer(layer);

                var lonlat, feature;

                if($scope.geometry){
                    var pt = $scope.geometry.getCentroid();
                    lonlat = new OpenLayers.LonLat(pt.x, pt.y);
                    feature = new OpenLayers.Feature.Vector($scope.geometry.getBounds().toGeometry());
                }else if($scope.lng !== 0 && $scope.lat !== 0){
                    lonlat = new OpenLayers.LonLat($scope.lng, $scope.lat);
                    var point = new OpenLayers.Geometry.Point($scope.lng, $scope.lat);
                    feature = new OpenLayers.Feature.Vector(point);
                }else{
                    return;
                }

                if(e.type === 'click'){
                    $scope.map.map.setCenter(lonlat, $scope.zoom || $map.map.getZoom());
                }

                if($scope.highlight === 'false'){
                    return;
                }

                feature.style = _.extend({}, OpenLayers.Feature.Vector.style['temporary'], {
                    pointRadius: 14,
                    strokeColor: 'red',
                    fill: false,
                    strokeDashstyle: 'dash'
                });

                if(attrs.icon){
                    feature.style = _.extend(feature.style, {
                        graphic:true,
                        externalGraphic: attrs.icon,
                        graphicWidth:37,
                        graphicHeight:37,
                        graphicXOffset: -13,
                        graphicYOffset: -37,
                        graphicOpacity:1,
                        graphicZIndex:0
                    });
                }

                clearTimeout(it);

                layer.removeAllFeatures();

                layer.addFeatures(feature, {silent: true});

                it = setTimeout(function(){
                    layer.removeFeatures(feature, {silent: true});
                }, 5000);
            };

            $($el).css('cursor', 'pointer').on('click', center);

            MapHelper($scope);
        };

        return {
            restrict: 'A',
            link: linker,
            scope: {
                lng: '=?',
                lat: '=?',
                zoom: '=?',
                highlight: '@',
                geometry: '=?'
            }
        };
    }];
});