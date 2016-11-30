define(function(require, exports, module){
  return ['MapHelper', function (MapHelper){

    var linker = function ($scope, el, attrs){

      var featuresChange = function (event){
        $scope.features = $scope.layer.features;
        
        var tmp = _.sortBy($scope.features, function(feature){return feature.attributes.distance;});
        $scope.features.length = 0;

        _.each(tmp, function (feature){
          $scope.features.push(feature);
        });
        
        if(event.type === 'featuresremoved') return;
        $scope.$apply();
      };

      $scope.$watch('layer', function (layer){
        if(!layer) return;

        layer.events.on({
          featuresadded: featuresChange,
          featuresremoved: featuresChange
        });

        $scope.features = $scope.layer.features;
      });

      //删除feature
      $scope.remove = function ($data){
        $scope.layer.removeFeatures($data);
      };

    };

    return {
      restrict:'EAC',
      link: linker,
      scope: {
        layer: "=?",
        features: "=?"
      },
      templateUrl: 'app/JCZH/TQRW/directives/points.html'
    };
  }];
});