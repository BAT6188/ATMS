define(function(require, exports, module){

  return ['$parse', '$filter', 'Restangular','$rootScope', function($parse, $filter,Restangular, $rootScope){
    var linker = function($scope, $el, $attrs) {
      $scope.size = 10;
      $scope.page = 1;

      var callback = function(event){
        var size = $scope.map.clientLayer.features.length;

        if(size > 1){
          $scope.page = 1;
          $scope.data = $filter('paginator')($scope.map.clientLayer.features, $scope.page, 5);
          $scope.total = size;
          $scope.cur_layer = null;
          $scope.mapSelecting = true;
          $scope.onFetch();
        }else{
          $scope.onClose();
        }
        $scope.$apply();
      };

      $rootScope.$on('yhte-map:init', function(e, map){
        $scope.map = map;

        map.clientLayer.events.un({
          featuresadded: callback,
          featuresremoved: callback
        });

        map.clientLayer.events.on({
          featuresadded: callback,
          featuresremoved: callback
        });

      });

      $rootScope.$broadcast('yhte-map:get');

      $rootScope.$on('layers-switcher:getFeatures', function (e, layer, page){
        cleanLayer();
        //alert(1111);
        var size = layer.features.length;
        // if(size > 1){
//          console.log($scope.data);
          $scope.data = layer.features;
          $scope.page = page;
          $scope.cur_layer = layer;
          var yeslink=0;
          var nolink=0;
          if($rootScope.aa!=1&&$scope.cur_layer.name=='deviceMsgPublish')
          {
          for(var i=0;i<$scope.data.length;i++)
          {
              if($scope.data[i].attributes.STATUS==2)
              nolink++;
              else if($scope.data[i].attributes.STATUS==1)
              yeslink++;
          }
          $scope.cur_layer.status[2].statusNum=yeslink;
          $scope.cur_layer.status[3].statusNum=nolink;
          }

          $scope.mapSelecting = false;
          $scope.onFetch();
          $scope.$apply();
        //console.log(1111);
        // }
      });





      $rootScope.$on('layers-switcher:getFeaturesTotal', function (e, total){
        //alert(2222);
        $scope.total = total;
        $scope.$apply();
       // console.log(2222);
      });


        $rootScope.$on('guanping', function (){
            feature.attributes.STATUS=-1;
        });

        $rootScope.$on('kaiping', function (){
            feature.attributes.STATUS=1;
        });

      $rootScope.$on('filter', function (filter){
        //alert(3333);
        $scope.page = 1;
        $scope.filter = filter;
        //$rootScope.$broadcast('layers-switcher:$watch', $scope.filter);
        //pageFunc();
      });

        $rootScope.$on('showlayer',function(e,msg){
            $scope.shuaxin=msg;
        });
        $scope.shuaxing=function(){
            $rootScope.$broadcast("shuaxinyoudao",$scope.shuaxin);
        }



      $scope.itemClick = function (feature){
        $scope.onItemClick({
          $feature: feature
        });
      };

      var cleanLayer = function (){
        $scope.map.clientLayer.removeAllFeatures({silent:true});
        $scope.map.exSelector.vector.removeAllFeatures({silent:true});
        $scope.map.exSelector.bufferLayer.removeAllFeatures({silent:true});
      };

        $rootScope.$on('feaeClose', function (){
            $scope.close();
        });
      $scope.close = function (){

        $rootScope.$broadcast('feaaClose');
        cleanLayer();
        $scope.data = null;
        $scope.onClose();
      };

      $scope.statusClick = function(stat){
        $scope.page = 1;
          console.log(stat);
        $rootScope.aa=1;
        $rootScope.$broadcast('statusFilter', stat?stat.statusCode:null); 
      };

      $scope.pageFunc = function (page){
        if($scope.mapSelecting){
          $scope.data = $filter('paginator')($scope.map.clientLayer.features, page, 5);
        }else{
          $rootScope.$broadcast('page', page); 
        }
      };




      $scope.callOutPhone = function($event, phone) {
        // var e = $($event.target);
        // e.html('');
        // e.removeClass('glyphicon-phone-alt');
        // e.addClass('glyphicon-earphone');
        // e.html('...');
        if(phone) {
            callOutPhone_xg(phone);
        }
        // window.setTimeout(function(){
          // e.removeClass('glyphicon-earphone');
          // e.addClass('glyphicon-phone-alt');
          // e.html('');
        // }, 2000);
      };

    };

    return {
      restrict: 'C',
      replace: true,
      link: linker,
      scope:{
        data:'=?',
        filter:'=?',
        // listType:'=?',
        // page:'=?',
        // size:'=?',
        // total:'=?',
        onItemClick:'&',
        onClose: '&',
        onFetch: '&',
        cur_layer:'=?curLayer'
      },
      templateUrl:'app/$directives/map/ts-list.html'
    };
  }];
});