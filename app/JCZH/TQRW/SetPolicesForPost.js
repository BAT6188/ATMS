define(function(require, exports, module){
  
  var controller = ['$http','$location','$scope', 'specialDuty', '$routeParams', 'Duty','DrawRegion','User','Query','Restangular',
    function ($http,$location,$scope, specialDuty, $routeParams, Duty,DrawRegion,User,Query,Rest){
      //该页面大队登录，所以一定有dept.area
      //定义路线样式
      $scope.page = 1;
      $scope.size = 5;

      var pathStyle = OpenLayers.Util.extend(
        OpenLayers.Util.extend({},
            OpenLayers.Feature.Vector.style['default']), 
        {
          strokeColor: "#47a447",
          strokeWidth: 3
      });

      var postStyle = OpenLayers.Util.extend(
        OpenLayers.Util.extend({},
            OpenLayers.Feature.Vector.style['default']), 
        {
          graphic:true,
          graphicWidth:32,
          externalGraphic:"/atms/resources/img/marker.png",
          graphicOpacity:1

          // fillOpacity: 2,
          // fillColor: "#5BC0DE" ,
          // strokeColor: "white",
          // strokeWidth: 2,
          // pointRadius: 12,
          // label: '岗',
          // fontSize: 12,
          // fontColor: "#5BC0DE"
      });
      var postStyleMap = new OpenLayers.StyleMap({
          "default": postStyle
      });

      //创建绘制路线的图层，地图加载完成后添加到地图
      var layer = $scope.layer = new OpenLayers.Layer.Vector("postLayer", {
        displayInLayerSwitcher: false,
        styleMap: postStyleMap
      });

      //根据权限判断哪个大队，找出对应的行政区内的岗位
      $scope.$watch('map',function(){
        if($scope.map){
          $scope.map.map.addLayers([layer]);

          specialDuty.get({id: $routeParams.id}, function(data){
            origin = data.results;
            $scope.record = angular.copy(origin);
            // console.log($scope.record);
            var lineft = new OpenLayers.Format.WKT().read($scope.record.wkt);

            if($scope.map){
              var ft = lineft.clone();
              ft.style = pathStyle;
              $scope.map.clientLayer.removeAllFeatures();
              $scope.map.clientLayer.addFeatures(ft);
            }

            Duty.get({id: $scope.record.dutyId}, function(data){
              $scope.duty = data.results;
              // console.log('get:', $scope.duty);

              var drawRegion = new DrawRegion($scope.map.map);
              drawRegion.draw(function(){
                // console.log('arguments:', arguments);

                var ddgeo = arguments[0][0].geometry;
                var ddposts = [];
                $scope.ddposts = [];
                _.each($scope.duty.posts,function(post){
                  // console.log('post:', post);
                  var ptgeo = new OpenLayers.Geometry.Point(post.lng,post.lat);
                  if(ddgeo.intersects(ptgeo)){
                    ddposts.push(new OpenLayers.Feature.Vector(ptgeo));
                    post.ifDetail = false;
                    $scope.ddposts.push(post);
                  }
                });
                $scope.layer.addFeatures(ddposts);
                $scope.selected = $scope.ddposts[0];
                // console.log($scope.ddposts);
              });
            });//duty
          });//specialDuty 
        }//if
      });//watch

      $scope.showDetail = function(post){
        post.ifDetail = !post.ifDetail;
        $scope.selected = post;
      };


     //  $scope.queryPoliceByName = undefined;
     //  $scope.queryPoliceByNo = undefined;
     //  $scope.getPolicesByName = function(val) {
     //    return $http.post('../java/user/list', {
     //      userName:val
     //    }).then(function(res){
     //      // console.log(res);
     //      var polices = [];
     //      _.each(res.data.results,function(item){
     //        polices.push(item);
     //      });
     //      // console.log(polices);
     //      return polices;
     //    });
     //  };

     //  $scope.getPolicesByNo = function(val) {
     //    return $http.post('../java/user/list', {
     //      policeNo:val
     //    }).then(function(res){
     //      // console.log(res);
     //      var polices = [];
     //      _.each(res.data.results,function(item){
     //        polices.push(item);
     //      });
     //      // console.log(polices);
     //      return polices;
     //    });
     //  };

     // $scope.onQuerySelectName = function(){
     //  $scope.addPolice($scope.queryPoliceByName);
     // };

     // $scope.onQuerySelectNo = function(){
     //  $scope.addPolice($scope.queryPoliceByNo);
     // };

     User.queryNoDept({},function(data){
      $scope.ifLoaded = true;
      $scope.polices = data.results;
      if($scope.polices && $scope.polices.length>=1) {
          $scope.selectedPolice = [];
          $scope.selectedPolice.push($scope.polices[0]);
      }
     });


      $scope.addPolice = function(){

        if(!$scope.selectedPolice || $scope.selectedPolice.length<=0){
          return;
        }
        for(var j=0;j<$scope.ddposts.length;j++){
          var post = $scope.ddposts[j];
          for(var i=0;i<post.polices.length;i++){
            if(post.polices[i].userId === $scope.selectedPolice[0].userId){
              alert('该警员已安排任务');
              return;
            }
          }
        }
        $scope.selected.polices.push($scope.selectedPolice[0]);
        $scope.Q = null;
      };

      $scope.save = function(){
        //有待验证
        /*for(var i=0;i<$scope.ddposts.length;i++){
          for(var j=0;j<$scope.duty.posts.length;j++){
            if($scope.ddposts[i].id === $scope.duty.posts[j].id){
              $scope.duty.posts[j] = $scope.ddposts[i];
              break;
            }
          }
        }*/
        // console.log($scope.duty.posts);
        // $scope.duty.posts = $scope.ddposts;
        
        Duty.update($scope.duty, function(data){
          alert('保存成功！');
          // console.log(data);
        });

      };

      //删除岗位已选警员中的某个警员
      $scope.removePolice = function(one){
        var data = _.filter($scope.selected.polices, function(police){
          if(police.userId !== one.userId){
            return police;
          }
        });
        $scope.selected.polices = data;
      };

      $scope.changeStatus = function(){
        for(var j=0;j<$scope.ddposts.length;j++){
          var post = $scope.ddposts[j];
          if(post.polices.length===0){
            alert('尚有岗位未配备警员');
            return;
          }
        }
        //状态改为3
        Rest.all('').one('stask',$scope.record.id).one('confirm').get().then(function(data){
          var path = '/JCZH.TQRW.List';
          $location.path(path);
          alert('操作完成，特勤单已就绪');
        });
      };



  }];

  module.exports = controller;
});