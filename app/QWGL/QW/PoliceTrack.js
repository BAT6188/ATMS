define(function (require, exports, module) {
    var controller = ['$scope','$rootScope','$routeParams','DictCache','Restangular',
    function ($scope,$rootScope,$routeParams,DictCache,Restangular) {
        $scope.Q = {
/*            startTime : '2014-05-06 08:39:46',
            endTime : '2014-05-12 08:39:46'*/
        };

        //var policeTrackLayer = new OpenLayers.Layer.Vector('policeTrackLayer');
        var policeTrackLayer = new OpenLayers.Layer.Vector("policeTrackLayer", {
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
        var trackFeature,stepTrackFeature,labelPointFeature = [];  //完整轨迹,回放轨迹
        var center;             //轨迹第一个点
        $scope.reDrawing = false;  //回放状态

        if($rootScope.tempData){
            $scope.feature = $rootScope.tempData.val;
        }

        $scope.$watch('map', function (map){
            if(!map){
                return;
            }
            map.map.addLayer(policeTrackLayer); //添加轨迹图层
        });


        //查看轨迹
        $scope.query = function(){
            if(trackFeature || stepTrackFeature){
                policeTrackLayer.removeAllFeatures();
                trackFeature = null;
                stepTrackFeature = null;
                labelPointFeature = null;
                points = [];
                labelPoints = []; 
            }
 /*$routeParams.id*/
            Restangular.one('policeGps/history/038113').post('',$scope.Q).then(function (data) {
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
/*
                        var point = new OpenLayers.Geometry.Point(d.lng, d.lat,{
                                            name: i,
                                            fillColor:'red',
                                            favColor: 'blue',
                                            align: "cm",
                                            xOffset: 20,
                                            yOffset: -15
                                        });*/
                        
                    }

                    points.push(point);
                });

                //var MultiPoint = OpenLayers.Geometry.MultiPoint(labelPoints);


                //绘制轨迹
                line = new OpenLayers.Geometry.LineString(points);
                trackFeature = new OpenLayers.Feature.Vector(line,{}, {strokeColor: '#330033'});
                policeTrackLayer.addFeatures([trackFeature]);
                
                //绘制编号
                policeTrackLayer.addFeatures(labelPointFeature);

                //居中 第一个点
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
            policeTrackLayer.addFeatures([stepTrackFeature]);

            //每隔200好毫秒绘制一个点
            $scope.timeOut = setInterval(function(){
               $scope.drawByStep();
            },200);
        };

        //取消回放
        $scope.cancelReDraw = function(){
            $scope.reDrawing = false;
            clearInterval($scope.timeOut);
            policeTrackLayer.removeFeatures([stepTrackFeature]);
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
            policeTrackLayer.drawFeature(stepTrackFeature, {
                strokeColor: 'red'
            });
            step++;
        };

        $scope.$on('$destroy', function() {
            $scope.map.map.removeLayer(policeTrackLayer);
        })
    }];

    module.exports = controller;

});