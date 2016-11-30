define(function (require, exports, module) {
    var controller = ['$scope', 'Message', 'DictCache', 'Post', 'MapTool','LocationMonitor',
    function ($scope, Message, DictCache, Post, MapTool,LocationMonitor) {
        //获取岗位类型
        DictCache('0018', function(dicts){
            $scope.types = dicts;
        });

        //默认数据
        var defaultVal = {
            type: {code: '1'}
        };

        //设置默认表单数据
        $scope.record = angular.copy(defaultVal);


        //保存操作
        $scope.save = function(){
            Post.save($scope.record ,function(data){
                if(!data.success){
                    alert(data.msg);
                    return;
                }
                alert('保存成功!');
                //重置表单
                $scope.record = angular.copy(defaultVal);
            });
        };


        var mapReady = function(el, mp){
            map = mp;
            imap = el;
            imap.exSelector.deactivate(); //隐藏了选择要素控件的UI

            var clientLayer = new OpenLayers.Layer.Vector('clientLyr');
            map.addLayer(clientLayer);

            var GetCdtCtl = new OpenLayers.Control.GetCoordinate(clientLayer,{
              callback:function(){
                var centroid = arguments[0].getCentroid();
                $scope.record.lng = centroid.x.toFixed(6);
                $scope.record.lat = centroid.y.toFixed(6);
                var ft = new OpenLayers.Feature.Vector(arguments[0]);
                var wkt = new OpenLayers.Format.WKT();
                $scope.record.scope = wkt.write(ft);
                $scope.$apply();
              }
            });

            map.addControls([GetCdtCtl]);

            $scope.location = function(){
                GetCdtCtl.activate(3);
            };

        };

        LocationMonitor.beforeLeave(function(){
        });

    }];

    module.exports = controller;
});