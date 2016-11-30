define(function(require, exports, module){

    var controller = ['Device','$scope', 'Buffer','$http','specialDuty','$routeParams','$location',
    function(Device,$scope,Buffer,$http,specialDuty,$routeParams,$location){
      
      $scope.size = 10;
      $scope.page = 1;
      $scope.showList = true;

      var saveSign = function(){
        var sncs = angular.copy($scope.sncs);
        _.each(sncs,function(snc){
          snc.config = JSON.stringify(snc.config);
        });
        $scope.record.devicesConfig = JSON.stringify(sncs);
        if($scope.record.status.code > 1){
          var flag = confirm('是否清除子任务?');
          $scope.record.ignore = !flag;
        }
      };

      $scope.toStep1 = function(){
        saveSign();
        if($scope.record.status.code > 1){
          var flag = confirm('是否清除子任务?');
          $scope.record.ignore = !flag;
        }
        specialDuty.update($scope.record, function(data){
          $scope.record = data.results;
          var path = '/JCZH.TQRW.Edit1/'+$scope.record.id;
          $location.path(path);
        });
      };

      $scope.toStep3 = function (){
        saveSign();
        if($scope.record.status.code > 1){
          var flag = confirm('是否清除子任务?');
          $scope.record.ignore = !flag;
        }
        specialDuty.update($scope.record, function(data){
          $scope.record = data.results;
          var path = '/JCZH.TQRW.Create3/'+$scope.record.id;
          $location.path(path);
        });
      };

      $scope.removeNode = function(snc){
        $scope.sncs = _.without($scope.sncs, snc);
      };


      var getVideos = function(){
        _.each($scope.sncs,function(snc){
          if(typeof(snc.config) === 'string'){
            snc.config = JSON.parse(snc.config);
          }else if(!snc.config){
            snc.config = {};
          }
          if(!snc.config.yzw){
            snc.config.yzw = {};
          }

          if(snc.config.videos){
            return;
          }

          // buffer.buffer({
          //   buffer:  radius,
          //   geometry:  'POINT(' + snc.lng + ' ' + snc.lat +')',
          //   inSR:  '4326',
          //   outSR: '4326',
          //   outfields: '*',
          //   spatialRel:  'intersects'
          // }).success(function(data){
          //   var fts = data.features;
          //   var videos = [];
          //   _.each(fts,function(ft){
          //     var video = {id:ft.properties.ID,name:ft.properties.DEVICE_NAME,lng:ft.geometry.coordinates[0],lat:ft.geometry.coordinates[1],config:''};
          //     videos.push(video);
          //   });
          //   snc.config.videos = videos
          // });//buffer
        });//each
      };


      specialDuty.get({id: $routeParams.id}, function(data){
        origin = data.results;
        $scope.record = angular.copy(origin);

        $scope.sncs = JSON.parse($scope.record.devicesConfig);
        if($scope.sncs && $scope.sncs.length>=1) {
            $scope.itemClick($scope.sncs[0]);
        }
        getVideos();
        $scope.selected = $scope.sncs[0];
        //console.log($scope.selected);
        
      });
        
      $scope.openVideo = function(video){
        $scope.showList = false;
        $scope.currentVideo = video;
        if(video && video.id) {
            $scope.feature = {
                properties : {
                    DEVICE_TYPE : '2',
                    ID : video.id
                }
            }; 
        }
      };

      $scope.$watch('selected.config.videos',function(){
        if($scope.selected && $scope.selected.config.videos){
          $scope.total = $scope.selected.config.videos.length;
        }
      });
      
      $scope.itemClick = function (snc){
        $scope.selected = snc;
        if(!snc.config.videos){

          buffer.buffer({
            buffer:  radius,
            geometry:  'POINT(' + snc.lng + ' ' + snc.lat +')',
            inSR:  '4326',
            outSR: '4326',
            outfields: '*',
            spatialRel:  'intersects'
          }).success(function(data){
            var fts = data.features;
            var videos = [];
            _.each(fts,function(ft){
              var video = {id:ft.properties.ID,name:ft.properties.DEVICE_NAME,lng:ft.geometry.coordinates[0],lat:ft.geometry.coordinates[1],config:''};
              videos.push(video);
            });
            snc.config.videos = videos

            $scope.total = videos.length;
          });//buffer

        }
        


        // $scope.total = $scope.selected.config.videos.length;
      };

      var url = '../giserver/configs/deviceVideo/';
      var radius = 50;
      var buffer = new Buffer(url);

      
      $scope.cancel = function (video){
        $scope.selected.config.videos = _.without($scope.selected.config.videos, video);
      };


      Device.query({typeCode:1}, function(data){
        if(!data.success){
          alert(data.msg);
          return;
        }
        $scope.ifLoaded = true;
        $scope.allsignals = data.results;
      });

      // $scope.querySignal = undefined;
      // $scope.getLocation = function(val) {
      //   return $http.post('../java/device/list', {
      //     name:val,
      //     typeCode:1
      //   }).then(function(res){
      //     var signals = [];
      //     _.each(res.data.results,function(item){
      //       signals.push(item);
      //     });
      //     return signals;
      //   });
      // };

      $scope.onQuerySelect = function(){
        if(!$scope.querySignal[0]){
          return;
        }
        var newSnc = {
          id:$scope.querySignal[0].id,
          lng:$scope.querySignal[0].lng,
          lat:$scope.querySignal[0].lat,
          name:$scope.querySignal[0].name,
          status:$scope.querySignal[0].status,
          type:$scope.querySignal[0].type,
          config:{}
        };

        buffer.buffer({
          buffer:  radius,
          geometry:  'POINT(' + $scope.querySignal[0].lng + ' ' + $scope.querySignal[0].lat +')',
          inSR:  '4326',
          outSR: '4326',
          outfields: '*',
          spatialRel:  'intersects'
        }).success(function(data){
          var fts = data.features;
          var videos = [];
          _.each(fts,function(ft){
            var video = {id:ft.properties.ID,name:ft.properties.DEVICE_NAME,config:''};
            videos.push(video);
          });
          newSnc.config.videos = videos;

          for(var i=0;i<$scope.sncs.length;i++){
            if($scope.sncs[i].id === newSnc.id){
              return;
            }
          }

          var n = _.indexOf($scope.sncs,$scope.selected);
          $scope.sncs.splice(n+1,0,newSnc)
        });
        
      };

      $scope.types = [{name:"东西直行",code:"a"},
                      {name:"东西左转",code:"b"},
                      {name:"东西方向",code:"c"},
                      {name:"南北直行",code:"d"},
                      {name:"南北左转",code:"e"},
                      {name:"南北方向",code:"f"},
                      {name:"北方向",code:"g"}/*,
                      {name:"北直行",code:"h"},
                      {name:"北左转",code:"i"},
                      {name:"南方向",code:"j"},
                      {name:"南直行",code:"k"},
                      {name:"南左转",code:"l"},
                      {name:"西方向",code:"m"},
                      {name:"西直行",code:"n"},
                      {name:"西左转",code:"o"},
                      {name:"东方向",code:"p"},
                      {name:"东直行",code:"q"},
                      {name:"东左转",code:"r"},
                      {name:"全红",code:"s"},
                      {name:"灭灯",code:"t"}*/];

    }];
    module.exports = controller;
});