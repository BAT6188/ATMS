define(function(require, exports, module){

    var controller = ['$location','$scope','$routeParams','specialDuty','Buffer','Restangular', '$timeout', '$window',
     function($location,$scope,$routeParams,specialDuty,Buffer,Rest, $timeout,$window){

      var url = '../giserver/configs/deviceVideo/';
      var radius = 50;
      var buffer = new Buffer(url);

      var getVideos = function(){
        _.each($scope.sncs,function(snc){
          snc.cancelShow = false;
          snc.btnName = '执行';
          snc.btnAble = false;
          try{
            snc.config = JSON.parse(snc.config);
          }catch(e){
            // alert('不能成功解析信号机数据！');
            snc.config = {};
          }
          

          if(!snc.config.yzw){
            snc.config.yzw = {};
          }

          if(snc.config.videos){
            return;
          }

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
            snc.config.videos = videos;
          });//buffer
        });//each
      };

      specialDuty.get({id: $routeParams.id}, function(data){
        origin = data.results;
        $scope.record = angular.copy(origin);
        $scope.sncs = JSON.parse($scope.record.devicesConfig);
        
        //进入该页面则进入进行状态，最好加个开始按钮
        if($scope.record.status.code === 3 ){
          Rest.all('').one('stask',$scope.record.id).one('start').get().then(function(data){
            console.log(data);
            // alert('操作完成，特勤单已结束');
          });
        }
        getVideos();


      });

      $scope.finish = function(){
        Rest.all('').one('stask',$scope.record.id).one('end').get().then(function(data){
          // console.log(data);
          alert('操作完成，特勤单已结束');
          var path = '/JCZH.TQRW.List';
          $location.path(path);
        });
      };

      $scope.openVideoPage = function (){
        $window.alert('即将打开的页面,可以拖动到你到第二屏幕,双屏浏览!');
        var url = '/atms/#/JCZH.TQRW.Execute/' + $routeParams.id + '/Video'
        $window.open(url);
      };

      $timeout(function (){
        var bool = $window.confirm('是否打开视频页面?');
        if(bool){
          $scope.openVideoPage();
        }
      }, 1500);

      $scope.showVideos = function(snc){
        var session = JSON.parse(sessionStorage._login).sessionId;

        socket.emit('videoDispatch',{
          id: $scope.record.id + session + 'signalVideosExec',
          // action:'signalVideosExec',
          videos:snc
        });
      };
    }];

    module.exports = controller;
});