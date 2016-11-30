define(function (require, exports, module) {
    var controller = ['$scope','$rootScope','$routeParams','DictCache','Restangular',
    function ($scope,$rootScope,$routeParams,DictCache,Restangular) {
        $scope.Q = {
/*            startTime : '2014-05-06 08:39:46',
            endTime : '2014-05-12 08:39:46'*/
        };

        var carTrackLayer = new OpenLayers.Layer.Vector("carTrackLayer", {
            styleMap: new OpenLayers.StyleMap({'default':{
                strokeColor: "#00FF00",
                strokeOpacity: 1,
                strokeWidth: 3,
                fillColor: "#FF5500",
                fillOpacity: 0.5,
                pointRadius: 6,
                pointerEvents: "visiblePainted",
                // label with \n linebreaks
                label : "${name}",
                
                fontColor: "${favColor}",
                fontSize: "12px",
                fontFamily: "Courier New, monospace",
                fontWeight: "bold",
                labelAlign: "${align}",
                labelXOffset: "${xOffset}",
                labelYOffset: "${yOffset}",
                labelOutlineColor: "white",
                labelOutlineWidth: 3
            }})/*,
            renderers: renderer*/
        });

        var points = [],labelPoints = [];   //轨迹点的openlayer对象
        var line,lineStep;  
        var trackFeature,stepTrackFeature,labelPointFeature = []; ;  //完整轨迹,回放轨迹
        var center;             //轨迹第一个点
        $scope.reDrawing = false;  //回放状态

        if($rootScope.tempData){
            $scope.feature = $rootScope.tempData.val;
            console.log($scope.feature);
            //$scope.$apply();
        }

        $scope.$watch('map', function (map){
            if(!map){
                return;
            }
            map.map.addLayer(carTrackLayer); //添加轨迹图层
        });


        //查看轨迹
        $scope.query = function(){
            if(trackFeature || stepTrackFeature || labelPointFeature){
                carTrackLayer.removeAllFeatures();
                trackFeature = null;
                stepTrackFeature = null;
                labelPointFeature = null;
                points = [];
                labelPoints = []; 
            }

            Restangular.one('carGps/history/'+ $routeParams.id).post('',$scope.Q).then(function (data) {
                $scope.reDrawing = false;       //重置回放状态
                $scope.records = data.results;

                if($scope.records.length < 1){
                    alert('数据过少,无法绘制轨迹');
                    return
                }

                //点数据装换为OL 点位数据
                angular.forEach($scope.records,function(d,i){
                    var point = new OpenLayers.Geometry.Point(d.lng, d.lat);
                    if(i%10 === 0 ){
                        var labelPoint = new OpenLayers.Geometry.Point(d.lng,  d.lat);
                        var labelFeature = new OpenLayers.Feature.Vector(labelPoint,{
                                                    name: i,
                                                    favColor: 'red',
                                                    align: "cm"
                                                });
                        labelPointFeature.push(labelFeature);
                        labelPoints.push(d); 
                    }
                    points.push(point);
                });


                //绘制轨迹
                line = new OpenLayers.Geometry.LineString(points);
                trackFeature = new OpenLayers.Feature.Vector(line,{}, {strokeColor: '#330033'});
                carTrackLayer.addFeatures([trackFeature]);
                
                //居中
                //第一个点
                center = new OpenLayers.LonLat($scope.records[0].lng, $scope.records[0].lat);
                if(!$scope.map) return
                $scope.map.map.setCenter(center);

            });
        };

        //回放轨迹
        $scope.reDraw = function(){
            $scope.reDrawing = true;
            step = 2     //绘制点的个数
            //policeTrackLayer.removeFeatures([trackFeature]);
            lineStep = new OpenLayers.Geometry.LineString([points[0], points[1]]);
            stepTrackFeature = new OpenLayers.Feature.Vector(lineStep);
            carTrackLayer.addFeatures([stepTrackFeature]);

            //每隔200好毫秒绘制一个点
            $scope.timeOut = setInterval(function(){
               $scope.drawByStep();
            },200);
        };

        //取消回放
        $scope.cancelReDraw = function(){
            $scope.reDrawing = false;
            clearInterval($scope.timeOut);
            carTrackLayer.removeFeatures([stepTrackFeature]);
            stepTrackFeature = null;
        };

        $scope.drawByStep = function(){
            if(step > points.length){
                console.log(step);
                console.log(points.length);
                clearInterval($scope.timeOut);
                return;
            }
            var _point = points[step];
            console.log(step);
            lineStep.addPoint(_point,stepTrackFeature.geometry.components.length);
            console.log(stepTrackFeature.geometry.components.length);
            carTrackLayer.drawFeature(stepTrackFeature, {
                strokeColor: 'red'
            });
            step++;
        };


        $scope.$on('$destroy', function() {
            $scope.map.map.removeLayer(carTrackLayer);
        });
    }];

    module.exports = controller;

});