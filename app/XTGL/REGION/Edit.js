define(function (require, exports, module) {
  var controller = ['$scope', 'Restangular', function ($scope, Rest){
    // 模拟数据
    // $scope.regions = [
    //   {name: '泉山区', id: '1', wkt: 'POLYGON((117.17225173251 34.26647694394,117.16681958151 34.258542341354,117.18110186616 34.259763049444,117.17225173251 34.26647694394))'},
    //   {name: '云龙区', id: '2', wkt: null}
    // ];

    $scope.selectRegion = function (region){
      $scope.record = region;
      if(region.wkt){
        $scope.editWkt(region);
      }else{
        $scope.draw(region);
      }
    };

    $scope.cancel = function (){
      $scope.record = null;
    };

    $scope.removeRegion = function (region){
      Rest.all('').one('region').doDELETE(region.fid).then(function(data){
        if(data.success){
          alert('删除成功');
          $scope.record = null;
          initRegions();
        }else{
          alert('删除失败');
        }
      });
    };

    $Rest = Rest;

    var initRegions = $scope.loadRegions = function(){
      Rest.all('region/list').post({}).then(function (data){
        $scope.regions = _.map(data.results, function (record){
          record.wkt = (record.geom === '' || record.geom === 'POLYGON ((0.0 0.0))')?null:record.geom;
          return record;
        });
      }, function (){
        $scope.error = "后台数据请求错误!";
      });
    };

    initRegions();

    var drawTool, modifyTool, snapTool;

    var wktFormat = new OpenLayers.Format.WKT();

    $scope.$watchCollection('[map, regions]', function (data){
      var map = data[0], regions = data[1];
      if(!map || !regions){
        return;
      }

      //>>>绘制辖区
      
      var features = [];
      _.each(regions, function (region){
        if(region.wkt){
          var feature = wktFormat.read(region.wkt);
          feature.attributes = region;
          feature.id = region.fid;
          features.push(feature);
          region.color = '#'+(Math.random()*0xffffff<<0).toString(16);
          feature.style = _.extend({}, OpenLayers.Feature.Vector.style['default'], {
            fillColor: region.color,
            strokeColor: '#aaaaaa'
          });
        }
      });
      $map.clientLayer.removeAllFeatures();
      $map.clientLayer.addFeatures(features, {silent: true});
      //<<<绘制辖区

      //>>> 部署地图工具
      drawTool = $scope.drawTool = new OpenLayers.Control.DrawFeature(map.clientLayer, OpenLayers.Handler.Polygon);
      modifyTool = $scope.modifyTool = new OpenLayers.Control.ModifyFeature(map.clientLayer);
      modifyTool.mode = OpenLayers.Control.ModifyFeature.RESHAPE;// | OpenLayers.Control.ModifyFeature.ROTATE;
      snapTool = new OpenLayers.Control.Snapping({
        layer: map.clientLayer,
        targets: [{
          layer: map.clientLayer,
          tolerance: 10
        }]
      });
      snapTool.activate();
      // modifyTool.createVertices = true;
      map.map.addControls([drawTool, modifyTool,snapTool]);
      //<<< 部署地图工具
      $scope.map.clientLayer.events.un({
        featuremodified: updateWkt
      });

      $scope.map.clientLayer.events.on({
        featuremodified: updateWkt
      });

      modifyTool.activate();
    });

    $scope.draw = function (region){
      var callback = function (event){
        var feature = event.feature;
        feature.id = region.fid;
        region.wkt = wktFormat.write(feature);
        console.log(region.wkt);

        Rest.all('').one('region',region.fid).doPUT({geom: region.wkt}).then(function(data){
          if(data.success){
            initRegions();
          }else{
            alert('添加失败');
          }
        }, function(){
          $scope.map.clientLayer.removeFeatures([feature]);
          region.wkt = null;
          region.geometry = null;
        });

        region.geometry = feature.geometry;
        $scope.$apply();
        drawTool.deactivate();
        
        $scope.map.clientLayer.events.un({
          featureadded: callback
        });
      };

      $scope.map.clientLayer.events.on({
        featureadded: callback
      });

      drawTool.activate();
    };

    $scope.addRegion = function (){
      Rest.all('').one('region').post('', $scope.record).then(function(data){
        console.log(data);
      });
    };

    $scope.cleanWkt = function (region){
      var bool = confirm('这个操作造成的数据变更无法撤销，确认清除这个区域吗？');
      if(!bool) return;
      // Rest.all('').one('region').doDELETE(region.fid).then(function(){
      // console.log(region);
      // Rest.all('').one('region', region.fid).doPUT({geom: 'POLYGON((0 0,0 0,0 0))'}).then(function(){
      Rest.all('').one('region', region.fid).doPUT({geom: 'POLYGON((0 0))'}).then(function(){
        region.wkt = null;
        var feature = $map.clientLayer.getFeatureById(region.fid);
        $map.clientLayer.removeFeatures([feature]);
      });
    };

    var updateWkt = function (event){
      var feature = event.feature;
      var wkt = wktFormat.write(feature);
      console.log(wkt);
      Rest.all('').one('region', feature.id).doPUT({
        name: $scope.record.name,
        geom: wkt,
        deptCode: $scope.record.deptCode
      }).then(function(data){
        if(data.success){
          // alert('更新成功');
          // initRegions();
        }else{
          alert('更新失败');
        }
      });
    };

    $scope.editWkt = function (region){
      var feature = $map.clientLayer.getFeatureById(region.fid);
      modifyTool.selectFeature(feature);

      // $scope.map.clientLayer.events.un({
      //   featuremodified: updateWkt
      // });

      // $scope.map.clientLayer.events.on({
      //   featuremodified: updateWkt
      // });

      // modifyTool.activate();
    };

  }];

  module.exports = controller;
});