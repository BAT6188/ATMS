define(function (require, exports, module) {
    var controller = ['$scope', 'Message', 'DictCache', 'Post', '$routeParams','LocationMonitor',
    function ($scope, Message, DictCache, Post, $routeParams,LocationMonitor) {

        //获取岗位类型
        DictCache('0018', function(dicts){
            $scope.types = dicts;
        });

        //定义变量,保存原始数据
        var origin;

        //当前数据和原始数据相较。是否改变
        $scope.changed = function(){
            return !angular.equals(origin, $scope.record)
        };
        //获取记录
        Post.get({id: $routeParams.id}, function(data){
            if(!data.success){
                alert(data.msg);
                return;
            }
            origin = data.results;
            $scope.record = angular.copy(origin);
            //绘制岗位区域
            PubSub.on('mapPage:loaded', function(){
                PubSub.trigger('map:drawPolygon', [$scope.record.scope]);    
            });
            
        }, function(){
            alert('后台出错!');
        });

        //保存操作
        $scope.save = function(){
            if(angular.equals($scope.record, origin)){
                alert('数据没有修改!');
                return;
            }

            Post.update($scope.record, function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                alert('更新成功!');
                origin = data.results;
                $scope.record = angular.copy(origin);
            }, function(){
                alert('后台出错!');
            });
        };

        //还原数据
        $scope.reset = function(){
            $scope.record = angular.copy(origin);
        };


        var mapReady = function(el, mp){
            map = mp;
            imap = el;
            imap.exSelector.deactivate(); //隐藏了选择要素控件的UI

            var clientLayer = new OpenLayers.Layer.Vector('clientLyr');
            map.addLayer(clientLayer);

            var wkt = new OpenLayers.Format.WKT();
            if($scope.record.scope){
                var ft = wkt.read($scope.record.scope);
                clientLayer.addFeatures(ft);
            }

            var GetCdtCtl = new OpenLayers.Control.GetCoordinate(clientLayer,{
              callback:function(){
                var centroid = arguments[0].getCentroid();
                $scope.record.lng = centroid.x.toFixed(6);
                $scope.record.lat = centroid.y.toFixed(6);
                var ft = new OpenLayers.Feature.Vector(arguments[0]);
                $scope.record.scope = wkt.write(ft);
                $scope.$apply();
              }
            });

            map.addControls([GetCdtCtl]);

            $scope.location = function(){
                clientLayer.removeAllFeatures();
                GetCdtCtl.activate(3);
            };

        };

        LocationMonitor.beforeLeave(function(){
        });

        
    }];

    module.exports = controller;
});