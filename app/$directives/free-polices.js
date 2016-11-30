define(function(require, exports, module){
    return ['$parse', '$filter','Duty','$rootScope', function($parse, $filter,Duty,$rootScope){
      var exStyles = new OpenLayers.ExStyles();
      var linker = function($scope,element,attrs) {
        $scope.layer = new OpenLayers.Layer.Vector("free-polices-vector", {displayInLayerSwitcher: false});
        $scope.selectPoliceslayer = new OpenLayers.Layer.Vector("select-polices-vector", {displayInLayerSwitcher: false});

        //*********警情类型分为普通和重大两类，只有重大的才需要权限控制_start
        $scope.ptaskTypeIsMajor = function() {
          var isMajor = false;
          if ($scope.ptask && $scope.ptask.type && $scope.ptask.type.code) {
            //1~11，交通事故，交通拥堵，交通管制，稽查布控，车辆违法，自然灾害，危化品运输，群体性事件，道路改造，治安管理，其他事件
            var ptaskType = {
              '重大' : ['1'],
              '普通' : ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11']
            };
            var pt4Major = ptaskType["重大"];
            for (var i = 0, j = pt4Major.length; i < j; i++) {
              if (pt4Major[i] && pt4Major[i] === $scope.ptask.type.code) {
                isMajor = true;
                break;
              }
            }
          }
          return isMajor;
        };
        //*********警情类型分为普通和重大两类，只有重大的才需要权限控制_end
        
        $scope.data = [];
        $scope.fts = [];
        /* ---------用于分页----------*/
        $scope.total = $scope.data.length;
        $scope.page = 1;
        $scope.size = $scope.pageSize || 5;
        $scope.maxSize = 5;
        /* ---------用于分页----------*/

        
        $scope.radiuss = [5000,2000,1000,500,100];
        var bufferR = $scope.radius = $scope.radiuss[3];
        $scope.ifbfrs = true;

        $scope.onRadClick = function($event,rad){
          bufferR = rad;
          $scope.radius = rad;
        };

        $scope.select = function (record){
          record.checked = !record.checked;
          var data = _.filter($scope.data, function(record){
            return record.checked;
          });
          $scope.selectItems = data;
        };

        $scope.itemClick = function (record){
          $scope.onItemClick({
            $item: record
          });
        };

        var execute = function(){
          var q = {
            // page: 1,
            // limit: 10,
            lng: $scope.lng || null,          //经度
            lat: $scope.lat || null,          //纬度
            radius: bufferR || null,       //缓冲半径,默认为
            deptCode: $scope.deptCode || null,   //部门编号
            dutyId: $scope.dutyId || null,        //勤务编号
            userName: $scope.userName || null     //用户名
          };
          
          Duty.police(q, function (data){
            if(!data.success){
              alert(data.msg);
            }
            $scope.data = data.results;
            $scope.total = $scope.data.length;
          });
        };

        $scope.query = function() {
            execute();
        };

        //------------------------监听map变化--------------------
        $scope.$watchCollection('[map, lng, lat, radius]', function(){
          if(!$scope.map || !$scope.lng || !$scope.lat || !$scope.radius){
            return;
          }else{
            execute();
            $scope.map.map.addLayer($scope.layer);
            $scope.map.map.addLayer($scope.selectPoliceslayer);
          }
        });

        $scope.$watch('url', function (){
          initData();
        });

        var style = exStyles.centPtStyle;

        var selectedStyle = _.extend({}, style, {externalGraphic: '/atms/resources/img/police_g.png'}); 

        var initData = function() {
          //有变化时清空地图上所有绘制过的元素
          $scope.layer.removeAllFeatures();
          $scope.selectPoliceslayer.removeAllFeatures();

          //缓冲区
          var origin = new OpenLayers.Geometry.Point($scope.lng, $scope.lat);
          var polygon = new OpenLayers.Geometry.Polygon.createRegularPolygon(origin, $scope.radius*0.0000106, 40);
          var buffer = new OpenLayers.Feature.Vector(polygon, {}, _.extend({},exStyles.centAreaShowStyle,{strokeColor:'blue'}));
          $scope.layer.addFeatures([buffer]);
          
          //地图居中
          $scope.map.map.zoomToExtent(buffer.geometry.getBounds());
          
          if($scope.data.length > 0){
            $scope.fts = [];
            //遍历已选警员和全部警员
            if($scope.selectItems){
              _.each($scope.data, function (one){
                for(var i = 0, size = $scope.selectItems.length; i < size; i++){
                  //如果是被选中的,则标记已经选中
                  if(one.userId === $scope.selectItems[i].userId){
                    one.checked = true;
                    // console.log('......');
                  }
                }

                var lng = one.lng;
                var lat = one.lat;

                if(lng && lat && !one.checked){
                  var feature = new OpenLayers.Feature.Vector(
                            new OpenLayers.Geometry.Point(lng,lat), one, style);
                  $scope.fts.push(feature);
                }else{
                  var feature = new OpenLayers.Feature.Vector(
                            new OpenLayers.Geometry.Point(lng,lat), one, selectedStyle);
                  $scope.selectPoliceslayer.addFeatures([feature]);
                }
              });
            }
            $scope.layer.addFeatures($scope.fts);
          }
        };

        $scope.callOutPhone = function($event, phone) {
          if(phone) {
            callOutPhone_xg(phone);
          }
        };

        $scope.$watch('data', function (){
          initData();
        });
        
        $rootScope.$on('polices:selectItems', function (e, msg){
          $scope.selectItems = msg.selectItems;
          initData();
        });

        $rootScope.$on('polices:change', function (e){
          execute();
        });

        $scope.$on('$destroy', function(){
          $scope.map.map.destroy();
        });
      };

      return {
        restrict:'EA',
        replace: true,
        scope: {
          ptask : '=',
          // center: '=?',     //中心点 <Object>
          pageSize:'=?',
          lng:'=?',
          lat:'=?',
          deptCode:'=?',       //部门编号
          dutyId:'=?',        //勤务编号
          radius:'=?',     //缓存半径 
          selectItems:'=?',    //选中项，向外暴露           
          onItemClick:'&',   //单击选中向实际处理
          data:'=?',        //结果集，向外暴露(全部警员)
          map:'=?',        //接收地图对象
          layer:'=?',      //绘制绘制点位的图层，向外暴露
          url: '=?'
        },
        templateUrl:'app/$directives/free-polices.html',
        link: linker
      };
    }];
});