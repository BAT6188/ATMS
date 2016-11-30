define(function(require, exports, module){
  
  var controller = ['$scope', 'specialDuty', '$routeParams', 'Duty','DrawRegion','User', '$window', '$cookies',
    function ($scope, specialDuty, $routeParams, Duty,DrawRegion,User,$window,$cookies){
      //线路样式
      var pathStyle = OpenLayers.Util.extend(
        OpenLayers.Util.extend({},
            OpenLayers.Feature.Vector.style['default']), 
        {
          strokeColor: "#47a447",
          strokeWidth: 3
      });
      //前导车样式
      var carStyle = OpenLayers.Util.extend(
        OpenLayers.Util.extend({},
            OpenLayers.Feature.Vector.style['default']), 
        {
          graphic:true,
          externalGraphic: '/atms/resources/img/car_b.png', 
          graphicWidth:32,
          graphicHeight:32,
          graphicOpacity:1,
          graphicZIndex:0
      });
      //styleMap
      var getStyleMap = function(){
          var context = {
            getGraphic: function(feature) {
              if(feature.attributes.type === 'signal'){
                return "/atms/resources/img/pt_signal.png";
              }else if(feature.attributes.type === 'video'){
                return "/atms/resources/img/pt_video.png";
              }else if(feature.attributes.type =='post'){
                return "/atms/resources/img/map/gate-text.png";
              }else if(feature.attributes.type =='police'){
                return "/atms/resources/img/pt_police.png";
              }
            }
          };

          var template = OpenLayers.Util.extend(
            OpenLayers.Util.extend({},
                OpenLayers.Feature.Vector.style['default']), 
              {
                graphic:true,
                graphicWidth:32,
                externalGraphic:"${getGraphic}",
                graphicOpacity:1
            });

            var style = new OpenLayers.Style(template, {context: context});
            var styleMap = new OpenLayers.StyleMap({
                "default": style
            });
            return styleMap;
      };

      $scope.layer = new OpenLayers.Layer.Vector("tqlayer", {
        displayInLayerSwitcher: false,
        styleMap: getStyleMap()
      });

      $scope.carXY = {x:0,y:0};
      $scope.car = new OpenLayers.Feature.Vector(
                    new OpenLayers.Geometry.Point($scope.carXY.x,$scope.carXY.y));
      $scope.car.style = carStyle;


      $scope.$on('$destroy',function(){
        socket.emit('car:execute:unsub');
        socket.emit('police:execute:unsub');
      })

      //监听前导车变化，重绘其位置
      socket.on('car:executed', function (data){
        console.log('car:executed,on');
        console.log(data);
        $scope.map.clientLayer.removeFeatures($scope.car);

        $scope.carXY = data;
        $scope.car.geometry = new OpenLayers.Geometry.Point($scope.carXY.x,$scope.carXY.y);
        $scope.map.clientLayer.addFeatures($scope.car);
      });

      //接收后台推送的指定警员对象
      socket.on('police:executed', function (data){
        console.log('police:executed,on');
        console.log(data);
        $scope.layer.removeFeatures($scope.tempfts);
        $scope.tempfts = [];
        _.each(data,function(police){
          console.log(police);
          var policeft = new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.Point(police.lng,police.lat),{type:'police',other:police});
          $scope.tempfts.push(policeft);
        });
        // console.log($scope.tempfts);
        $scope.layer.addFeatures($scope.tempfts);
      });


      $scope.currentSnc = null;  //当前信号机
      var selectCtl = new OpenLayers.Control.SelectFeature($scope.layer,{
        onSelect:function(ft){
          if(ft.attributes.type === 'post'){
            $scope.policeIds = [];
            _.each(ft.attributes.polices,function(police){
              $scope.policeIds.push(police.userId);
            });

            console.log('police:execute,emit')
            socket.emit('police:execute', {
              policeIds: $scope.policeIds
            });

          }else if(ft.attributes.type === 'signal'){
            //主动获取该信号机相位，并更新相位图
            var lonlat = new OpenLayers.LonLat(ft.geometry.x, ft.geometry.y);
            $scope.map.map.setCenter(lonlat, $scope.zoom || $map.map.getZoom());
            var snc = {
                        id:ft.attributes.id,
                        name:ft.attributes.name,
                        lng:ft.geometry.x,
                        lat:ft.geometry.y,
                        config:ft.attributes.devicesConfig
                      };
            $scope.showVideos(snc);

            $scope.layer.removeFeatures($scope.tempfts);
            $scope.tempfts = [];
            _.each(ft.attributes.devicesConfig.videos,function(video){
              var videoft = new OpenLayers.Feature.Vector(
                    new OpenLayers.Geometry.Point(video.lng,video.lat),{type:'video',other:video});
              $scope.tempfts.push(videoft);
            });
            $scope.layer.addFeatures($scope.tempfts);
          }
          console.log(ft);
        }
      });

      var session = JSON.parse(sessionStorage._login).sessionId;
      
      $scope.showVideos = function(snc){
        var session = JSON.parse(sessionStorage._login).sessionId;

        socket.emit('videoDispatch',{
          id: $scope.record.id + session + 'signalVideosCast',
          videos:snc
        });
      };


      //根据权限判断哪个大队，找出对应的行政区内的岗位
      $scope.$watch('map',function(){
        if($scope.map){
          //绘制前导车
          $scope.map.clientLayer.addFeatures($scope.car);
          $scope.map.map.addControl(selectCtl);
          selectCtl.activate();

          $scope.map.map.addLayers([$scope.layer]);

          specialDuty.get({id: $routeParams.id}, function(data){
            origin = data.results;
            $scope.record = angular.copy(origin);
            console.log($scope.record);

            //前导车id
            console.log('car:executed,emit')
            socket.emit('car:execute', {
              id: $scope.record.carNo,
            });

            //信号机
            $scope.sncs = JSON.parse($scope.record.devicesConfig);
            console.log($scope.sncs);
            $scope.sncFts = [];
            _.each($scope.sncs,function(snc){

              if(typeof(snc.config) === 'string'){
                snc.config = JSON.parse(snc.config);
              }
              if(!snc.config.yzw){
                snc.config.yzw = {};
              }

              var ft = new OpenLayers.Feature.Vector(
                    new OpenLayers.Geometry.Point(snc.lng,snc.lat),{
                      type:'signal',devicesConfig:snc.config,id:snc.id,name:snc.name});
              $scope.sncFts.push(ft);

              
            });//each
            console.log('信号机');
            console.log($scope.sncFts);
            $scope.layer.addFeatures($scope.sncFts);
            $scope.currentSnc = $scope.sncFts[0];

            //特勤线路
            var lineft = new OpenLayers.Format.WKT().read($scope.record.wkt);
            var ft = lineft.clone();
            ft.style = pathStyle;
            // $scope.map.clientLayer.removeAllFeatures();
            $scope.map.clientLayer.addFeatures(ft);

            //特勤之勤务（主任务）岗位
            Duty.get({id: $scope.record.dutyId}, function(data){
              $scope.duty = data.results;
              var postfts = [];
              _.each($scope.duty.posts,function(post){
                var ft = new OpenLayers.Feature.Vector(
                    new OpenLayers.Geometry.Point(post.lng,post.lat),{type:'post',polices:post.polices});
                postfts.push(ft);

              });
              console.log('岗位');
              console.log(postfts);
              $scope.layer.addFeatures(postfts);
            });//duty
          });//specialDuty 
        }//if
      });//watch

      $scope.showDetail = function(snc){
        snc.ifDetail = !snc.ifDetail;
      };

      $scope.openVideoPage = function (){
        $window.alert('即将打开的页面,可以拖动到你到第二屏幕,双屏浏览!');
        var url = '/atms/#/JCZH.TQRW.Cast/' + $routeParams.id + '/Video';
        $window.open(url);
      };

      socket.on('signalControl',function(data){
        console.log(data);
        var id = data.roadid;
        var sncs = _.filter($scope.sncs, function (snc){
          return snc.id === id;
        });

        if(sncs.length > 0){
          sncs[0].ifDetail = !sncs[0].ifDetail;
          $scope.$apply();
          var bool = $window.confirm('车辆准备通过>>'+sncs[0].name+'<<，信号机相位已就绪，是否打开关联视频?');
          if(bool){
            $scope.showVideos(sncs[0]);
          }
        }

        for(var i=0;i<$scope.sncFts.length;i++){
          if($scope.sncFts[i].attributes.id === id){
            $scope.currentSnc = $scope.sncFts[i];
            selectCtl.select($scope.currentSnc);
            // $scope.interCode = data.sncXWCcode;
            // console.log($scope.currentSnc);
            $scope.$apply();
            return;
          }
        }

      });

      socket.emit('subscribe',{
        clientType:'signal'/*,
        id: $routeParams.id + session*/
      });

  }];

  module.exports = controller;
});