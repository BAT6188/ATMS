define(function(require, exports, module){

  return ['$rootScope', 'Auth', '$location', function ($rootScope, Auth, $location){

    var linker = function($scope, el, attrs) {
      $scope.layers = [];
      $scope.page = 1;
      $scope.size = 10;
      $scope.total = 0;

   var deptCode = Auth.getDeptCode();

      if(deptCode === null || deptCode === '320300000000'){ //支队
        var dlyrWhere = '1=1';
      }else{  //大队
        var dlyrWhere = "AREA_DEPT_CODE='" + deptCode + "'";
      }

      var addLayers = function (){
          if(!$scope.map) return; 
          if(!_.isArray($scope.layersDefs)) return;

          var layers = [];//存储预先加载的图层，用于设置这些图层可以被点选
          
          _.each($scope.layers, function (layer){
              $scope.map.map.removeLayer(layer);
          });

          $scope.layers = [];
          
          _.each($scope.layersDefs, function (def){
              var where, qWhere;

              if(def.name === "police" || def.name === "policeCar"){
                  where =  dlyrWhere + " and status <> '0'";
                  qWhere = dlyrWhere;
              }
              else{
                  qWhere = where = '1=1';
              }
      
              var layer = new OpenLayers.Layer.ExDyLayer2(def.name, def.url, {
                  where: where ,
                  selectedFeatures:[]
              });

              layer.dlyrWhere = where;
              layer.qWhere = qWhere;

              layer.setVisibility(def.visible); 

              if(layer.visibility){
                  layers.push(layer);
                  try{
                      // var options = {
                      //     where:layer.dlyrWhere,
                      //     startRow:1,
                      //     endRow:50   //$scope.size预先查询50条数据
                      //   };  
                      // layer.getFeatures(options,function(features){
                      //     layer.features = features;
                      //     $scope.$apply();
                      // });
                  }catch(i){
                      console.log(i);
                  }
              }

              $scope.map.addLayer(layer);
              
              _.extend(layer, def);

              $scope.layers.push(layer);
          });

          $scope.map.resetTargets(layers);
          $scope.map.exSelector.activate();
      };

      $scope.$watch('map', addLayers);
      $scope.$watch('layersDefs', addLayers);
      
      $scope.toggle = function (layer){
          layer.setVisibility(!layer.visibility);
          var layers = _.filter($scope.layers, function (layer){
              return layer.visibility;// && layer.name !== 'road';
          });
          //将 visibility＝true 的图层，添加至可选择图层列表
          $scope.map.resetTargets(layers);
          $scope.map.clientLayer.removeAllFeatures({silent:true});
          $scope.map.exSelector.vector.removeAllFeatures({silent:true});
          $scope.map.exSelector.bufferLayer.removeAllFeatures({silent:true});
      };

      //调整至指定页面
      $scope.turn =function (layer){
        $location.path(layer.url);
      };

      $scope.onlyShow = function (item){
          _.each($scope.layers, function (layer){
              if(item !== layer){
                  layer.setVisibility(false);
              }else{
                  layer.setVisibility(true);
              }
          });
          $scope.map.resetTargets([item]);
          $scope.map.clientLayer.removeAllFeatures({silent:true});
          $scope.map.exSelector.vector.removeAllFeatures({silent:true});
          $scope.map.exSelector.bufferLayer.removeAllFeatures({silent:true});
      };

      $rootScope.$on('shuaxinyoudao',function(e,shuaxin){
          shuaxin.isshow=!shuaxin.isshow;
          $scope.showData(shuaxin);
      })

        $rootScope.$on('feaaClose',function(){
            for(var i=0;i<$scope.layers.length;i++)
            {
                $scope.layers[i].isshow=false;
            }
        });


      //显示图层数据列表
      $scope.showData = function (layer){


          $rootScope.$broadcast('showlayer',layer);
          if(layer.isshow==true)
          {
              layer.isshow=!layer.isshow;
              $rootScope.$broadcast('feaClose');
              $rootScope.$broadcast('feaeClose');
              return;
          }
          else
              layer.isshow=!layer.isshow;

          for(var i=0;i<$scope.layers.length;i++)
          {
              if($scope.layers[i]!=layer)
              {
                  $scope.layers[i].isshow=false;
              }
          }

          $rootScope.aa=0;


        $scope.page = 1;
          $scope.filter = $scope.filter ? filter : null ;
        $scope.statusCode = null;

        $scope.onlyShow(layer);
        $scope.ifMapCollection = false;
    
        $scope.onItemClick({
          $layer: layer,
          $change: layer === $scope.cur_layer
        });

        /*if($scope.cur_layer === layer){
            $scope.features = null;
            $scope.cur_layer = null;
            $scope.total = 0;
//            return;
        }*/
        
        $scope.cur_layer = layer;
        $scope.placeholder = '查询 ' + layer.label + ':';
        $scope.listType = layer.name;


        //每切换一次图层，查询一次总数，更新页码
        $scope.cur_layer.getTotal('1=1', function (data){
          $scope.total = data;
          $scope.cur_layer.total = data;
            console.log(data);
          $rootScope.$broadcast('layers-switcher:getFeaturesTotal', data);
          $scope.$apply();
        });

        if($scope.buffer){ //查询周边资源
          $rootScope.$broadcast('bufferLayer',$scope.cur_layer);
          $scope.ifMapCollection = true;  //查询周边资源
          $scope.total = 0;
        }else{ //常规显示
          var options = {
            where:layer.qWhere,
            startRow:($scope.page-1)*$scope.size+1,
            endRow:$scope.page*$scope.size
          };  //要依据权限

          layer.getFeatures(options,function(features){
              //尚未考虑features缓存问题，即layer.features只有5条数据，不准确，应累加
              layer.features = $scope.features = features;
              $rootScope.$broadcast('layers-switcher:getFeatures', layer, $scope.page);
              $scope.$apply();
          });
        }
      };

      var pageFunc = function(page){
        if(!$scope.cur_layer || $scope.ifMapCollection || ($scope.position && $scope.buffer)){
          return;
        }

        var where = $scope.cur_layer.qWhere;
        
        //status, filter

        if($scope.statusCode){
          where += ' and status=' + $scope.statusCode;
        }
        if($scope.filter && $scope.cur_layer.name === 'roadSectionState'){
          where += " and tip like '\%%" + $scope.filter + "\%%'";
        }else if($scope.filter && $scope.cur_layer.name !== 'roadSectionState'){
          where += " and text like '%" + $scope.filter + "%'";
        }

          
        $scope.cur_layer.getTotal(where,function(data){
          $scope.total = data;
          $scope.cur_layer.total = data;
          $rootScope.$broadcast('layers-switcher:getFeaturesTotal', data);
          $scope.$apply();
        });
        

        var options = {
          where: where,
          startRow: ($scope.page - 1) * $scope.size + 1,
          endRow: $scope.page * $scope.size
        };  //要依据权限

        $scope.cur_layer.getFeatures(options,function(features){
           $scope.features = features;
           if($scope.cur_layer) {
            $scope.cur_layer.features =features;
           }
          $rootScope.$broadcast('layers-switcher:getFeatures', $scope.cur_layer, $scope.page);
          $scope.$apply();
        });
      };

      //地图服务分页
      $rootScope.$on('page',function(e, page){
        $scope.page = page;
        pageFunc();
      });

      $rootScope.$on('statusFilter',function(e, code){
        $scope.statusCode = code;
        $scope.page = 1;
        pageFunc();
      });

      $scope.$watch('filter', function (filter){
        $scope.page = 1;
        $scope.filter = filter;
        pageFunc();
      });
    };

    return {
      restrict:'EA',
      link: linker,
      replace: true,
      scope:{
        layersDefs: '=?data',
        features: '=?',
        cur_layer:'=?curLayer',
        filter:'=?',
        // page:'=?',
        // size:'=?',
        // total:'=?',
        map: '=?',
        layers: '=?',
        selectFeature: '=?',
        hideStatus: '=?',
        onItemClick:'&'
      },
      templateUrl: 'app/$directives/map/layers-switcher.html'
    };

  }];

});