define(function (require, exports, module) {
    var controller = ['$scope', '$routeParams', 'Restangular', '$q',
    function ($scope, $routeParams, Restangular, $q) {
        $scope.config = [{
          "label":"路网", 
          "name":"road",
          "cls":"layerRoad",
          "url":"../giserver/configs/xz_road/",
          "visible": true
        }];

        var a = Restangular.all('').one('cms', $routeParams.id).get();

        var b = Restangular.all('').one('relation').post('list',{
            cmsId: $routeParams.id
        });

        $q.all([a,b]).then(function(results){
            $scope.data = results[0].results;
            var data = results[1];

            var objectids = _.map(data.results, function (record){
                return ' objectid = ' + record.roadSectionId + ' ';
            }).join('or');

            $scope.layers[0].getFeatures({
                where: objectids||'1=2'
            }, function (features){
                //选中这些 feature
                $map.exSelector.select(features, this);
                $scope.$apply();

                var center = new OpenLayers.LonLat($scope.data.lng, $scope.data.lat);

                _.each(features, function (feature){
                    var bounds = feature.geometry.getBounds();
                    bounds.extend(center);
                    center = bounds.getCenterLonLat();
                });
                $scope.map.map.setCenter(center, 6);
            });
        });

        $scope.save = function (){
            Restangular.all('').one('relation').post('', {
                cmsId: $routeParams.id,
                roadSectionIds: _.map($scope.features, function (feature){
                    return feature.OBJECTID || feature.attributes.OBJECTID;
                })
            });
        };

        $scope.removeSection = function (feature){
            $scope.map.exSelector.resultLayer.removeFeatures([feature], {silent:true});
        };

        var featureChange = function (){
            $scope.features = $scope.map.clientLayer.features;
            $scope.$apply();
        };

        $scope.$watch('map', function (){
            if($scope.map){
                $scope.map.clientLayer.events.register('featureadded', null, featureChange);
                $scope.map.clientLayer.events.register('featuresremoved', null, featureChange);
            }
        });
    }];

    module.exports = controller;
});