define(function(require, exports, module){
  return ['MapHelper','PassAreas', function (MapHelper,PassAreas){

    var linker = function ($scope, el, attrs){

      var passAreas = new PassAreas();

      var featuresChange = function (event){
        $scope.features = $scope.layer.features;
        if(event.type === 'featuresremoved') return;
        _.each($scope.features,function(feature){
          if(!feature.area){
            passAreas.getAreas(feature.geometry,function(ids,names,areas){
              feature.area = areas[0];
            });
          }
        });

        setTimeout(function(){
          $scope.features = _.sortBy($scope.features, function(feature){return feature.area.properties.GID;});
        },300); //有待优化

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

      $scope.$watch('checks.length',function(){
        if($scope.currentPost && $scope.checks.length){
          $scope.currentPost.polices = $scope.checks;
          console.log($scope.currentPost.polices);
          //更新岗位信息，保存警员
          // $scope.savePosts = function(){
          // };
        }
      });

      $scope.getPost = function ($data){
        $scope.currentPost = $data;
        $scope.checks = $scope.currentPost.polices || [];
        console.log($scope.currentPost);
      };
      
    };

    return {
      restrict:'EAC',
      link: linker,
      scope: {
        layer: "=?",
        policeShow: "=?",
        features: "=?",
        checks:"=?",
        currentPost:"=?"
      },
      templateUrl: 'app/JCZH/TQRW/directives/posts.html'
    };
  }];
});