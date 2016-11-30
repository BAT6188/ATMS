define(function(require, exports, module) {

    return ['Restangular', 'Buffer', '$rootScope', 'CmsRoadRelation','Status', '$rootScope',
    function(Restangular, Buffer, $rootScope, CmsRoadRelation, Status, $rootScope) {
        var linker = function($scope, $el, $attrs) {
            //信号机
            $scope.page4s = 1;
            $scope.size4s = 2;
            $scope.maxSize4s = 3;

            //诱导屏
            $scope.page4y = 1;
            $scope.size4y = 3;
            $scope.maxSize4y = 3;

            //视频
            $scope.page4v = 1;
            $scope.size4v = 4;
            $scope.maxSize4v = 3;

            $scope.status = [{
                label : '畅通',
                value : 1,
                cls : 'success'
            }, {
                label : '正常',
                value : 3,
                cls : 'warning'
            }, {
                label : '拥堵',
                value : 4,
                cls : 'danger'
            }];
            // //路段流量状态
            // DictCache('0103', function(dicts){
            // });

            $scope.youdao = [];
            var myDate = new Date();
            $scope.stardate=1388505600;
            $scope.enddate=1420041540;
            $scope.stayTimeSec = 5;

            $scope.changeStatus = function(status) {
                $scope.stardate=myDate.getTime()/1000;
                $scope.enddate= $scope.stardate+$scope.overdueMin*60;
                $scope.sta = status;
                $scope.youdao.length = 0;
                Restangular.all('').one('flow').post('rsState', {
                    roadSectionId : $scope.data.attributes.OBJECTID, //$scope.data.attributes.OBJECTID,990313327
                    overdueMin : $scope.overdueMin || 0,
                    state : status.value - 0
                }).then(function(data) {
                    $scope.data.attributes.STATUS = $scope.sta.value;
                    $scope.youdao = data.results;
                    if($scope.data && $scope.data.dyLyr) {
                        $scope.data.dyLyr.refresh();
                    }
                    if ($scope.selection && $scope.selection === 'YouDao') {
                        window.setTimeout(function() {
                            picYoudao($scope.youdao);
                        }, 100);
                    }
                    Status.init();
                    window.setTimeout(function() {
                      $rootScope.$broadcast('navbar:change', {
                        type: 'roadSectionState'
                      });
                    }, 3000);
                });
            };

            $scope.changeStayTime = function(status){
            };

            //初始化

            $scope.inityoudao = function (index) {

                $scope.data2 = {ID: $scope.youdao[index].id, attributes: {DEVICE_TYPE: '3', IP: $scope.youdao[index].ip, PORT: $scope.youdao[index].port, WIDTH: 12, HEIGHT: 11}};
            }


            $scope.getCmsPic = function(status) {
                $scope.sta = status;
                $scope.youdao.length = 0;
                Restangular.all('').one('flow').post('cmsPic', {
                    roadSectionId : $scope.data.attributes.OBJECTID
                }).then(function(data) {
                    $scope.data.attributes.STATUS = $scope.sta.value;
                    $scope.youdao = data.results;
                    if ($scope.selection && $scope.selection === 'YouDao') {
                        window.setTimeout(function() {
                            picYoudao($scope.youdao);
                        }, 100);
                    }
                });
            };

            var picYoudao = function(yds) {
                if (!yds | yds.length === 0) {
                    return;
                }
                _.each(yds, function(one) {
                    $scope.data2 = {ID:one.id,attributes:{DEVICE_TYPE:'3',IP:one.ip,PORT:one.port,WIDTH:12,HEIGHT:11}};
                    $scope.isReady = false;
                    var path = one.picUrl;
                    var prefix = systemConfig.getSystemValue('VMS_PREFIX_URL');
                    path = prefix + path.substring(path.lastIndexOf('/'));
                    if (one.id) {
                        var ydid = "" + one.id;
                        document.getElementById(ydid).innerHTML = "";
                        if (path.length >= 10) {
                            document.getElementById(ydid).innerHTML = "<img width='250px' height='150px' style='position: absolute;vertical-align:middle;left: 25px; border:0;' src='" + path + "'/>";
                        }
                    }
                });
            }; 

            $scope.$watch('data', function(data) {
            	if(data.attributes && (data.attributes.STATUS || data.attributes.STATUS==0) && (data.attributes.STATUS!=1 && data.attributes.STATUS!=3 && data.attributes.STATUS!=4)) {
                    data.attributes.STATUS = 1;
                }
                for (var i = 0, size = $scope.status.length; i < size; i++) {
                    var status = $scope.status[i];
                    var value = status.value;

                    if (value === data.attributes.STATUS) {
                        $scope.sta = status;
                    }
                }

                if (data && data.attributes && data.attributes.roadSectionId) {
                    var url = "../giserver/configs/xz_road/query?where=OBJECTID=" + data.attributes.roadSectionId + "&geometry=global&inSR=4326&outSR=4326";
                    $.ajax({
                        url : url,
                        dataType : 'json',
                        method : 'POST',
                        success : function(data) {
                            if (data) {
                                var geojson = new OpenLayers.Format.GeoJSON();
                                var features = geojson.read(data);
                                $scope.data.geometry = features[0].geometry;
                            }
                        },
                        error : function() {
                            console.log(arguments);
                        }
                    });
                }
                if (data && data.attributes && data.attributes.STATUS) {
                    $.each($scope.status, function(i, item) {
                        if (item && item.value && item.value === data.attributes.STATUS) {
                            $scope.getCmsPic(item);
                            return false;
                        }
                    }); 
                }
                $scope.shareWechat();
            });

            $scope.$watch('youdao', function(youdao) {
                $scope.shareWechat();
            });

            var $un = $rootScope.$on('featureClose', function() {
                if ($scope.map && $scope.layer) {
                    var bool = _.contains($scope.map.map.layers, $scope.layer);
                    if(bool){
                        $scope.map.map.removeLayer($scope.layer);
                    }
                }
            });

            $scope.$on('$destroy', function (){
                $un();
            });

            //绘制客户端图层
            var exStyles = new OpenLayers.ExStyles();
            //样式
            var styleMap = exStyles.getStyleMapDevice();
            //设备样式
            $scope.layer = new OpenLayers.Layer.Vector("vector-signal-video", {
                displayInLayerSwitcher : false,
                styleMap : styleMap
            });

            $scope.$watch('map', function(map) {
                if (!map) {
                    return;
                }
                $scope.map.map.addLayer($scope.layer);
            });

            var getFts = function(devices) {
                if (devices.length > 0) {
                    var fts = [];
                    _.each(devices, function(one) {
                        var lng = one.geometry.coordinates[0];
                        var lat = one.geometry.coordinates[1];
                        if (lng && lat) {
                            var ft = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(lng, lat), one.properties);
                            fts.push(ft);
                        }
                    });
                    return fts;
                }
            };

            var drawYoudao = function(youdaos) {
                $scope.tempfts = [];
                _.each(youdaos, function(police) {
                    var policeft = new OpenLayers.Feature.Vector(new OpenLayers.Geometry.Point(police.lng, police.lat), {
                        DEVICE_TYPE : '3'
                    });
                    $scope.tempfts.push(policeft);
                });
                $scope.layer.removeAllFeatures();
                $scope.layer.addFeatures($scope.tempfts);
            };

            var calcData4Video = function(page) {
                $scope.total4v = $scope.videos.length || 0;
                if ($scope.total4v > $scope.size4v) {
                    var vs = $scope.videos.slice($scope.size4v * (page - 1), $scope.size4v * page);
                    $scope.videofts = getFts(vs);
                }
                if ($scope.total4v <= $scope.size4v) {
                    var vs = $scope.videos.slice($scope.size4v * (page - 1), $scope.size4v * page);
                    $scope.videofts = getFts(vs);
                }
                $scope.roadVideos = {
                    'regionCode' : $scope.data.attributes.OBJECTID,
                    'videos' : $scope.videofts
                };
            }; 

            $scope.pageFunc4v = function (page){
              calcData4Video(page);
            };

            var radius = 200;
            $scope.$watch('selection', function() {
                if (!$scope.selection || (!$scope.data || !$scope.data.geometry)) {
                    return;
                }
                if ($scope.selection === 'XinHao') {
                    if (!$scope.signals) {
                        new Buffer('../giserver/configs/deviceSignal/').buffer({
                            buffer : radius,
                            geometry : $scope.data.geometry.toString(),
                            inSR : '4326',
                            outSR : '4326',
                            outfields : '*',
                            spatialRel : 'intersects'
                        }).success(function(data) {
                            $scope.signals = data.features;
                            $scope.total4s = $scope.signals.length || 0;
                            $scope.signalfts = getFts($scope.signals);
                            if ($scope.signalfts) {
                                $scope.layer.removeAllFeatures();
                                $scope.layer.addFeatures($scope.signalfts);
                            }
                        });
                    }
                    if ($scope.signalfts) {
                        $scope.layer.removeAllFeatures();
                        $scope.layer.addFeatures($scope.signalfts);
                    }
                } else if ($scope.selection === 'Video') {
                    if (!$scope.videos) {
                        new Buffer('../giserver/configs/deviceVideo/').buffer({
                            buffer : radius,
                            geometry : $scope.data.geometry.toString(),
                            inSR : '4326',
                            outSR : '4326',
                            outfields : '*',
                            spatialRel : 'intersects'
                        }).success(function(data) {
                            $scope.videos = data.features;
                            
                            //计算视频分页
                            calcData4Video($scope.page4v);
                            if ($scope.videofts) {
                                $scope.layer.removeAllFeatures();
                                $scope.layer.addFeatures($scope.videofts);
                            }
                        });
                    }
                    if ($scope.videofts) {
                        $scope.layer.removeAllFeatures();
                        $scope.layer.addFeatures($scope.videofts);
                    }
                } else if ($scope.selection === 'YouDao') {
                    if ($scope.youdao && $scope.youdao.length >= 1) {
                        $scope.layer.removeAllFeatures();
                        drawYoudao($scope.youdao);
                        window.setTimeout(function() {
                            picYoudao($scope.youdao);
                        }, 100);
                        return;
                    }
                    if ($scope.data && $scope.data.attributes && $scope.data.attributes.cmss) {
                        $scope.youdao = $scope.data.attributes.cmss;
                        drawYoudao($scope.youdao);
                        window.setTimeout(function() {
                            picYoudao($scope.youdao);
                        }, 100);
                        return;
                    }
                    if ($scope.data && $scope.data.attributes && $scope.data.attributes.OBJECTID) {
                        //$scope.data.attributes.OBJECTID,990313327
                        CmsRoadRelation.query({
                            roadSectionId : $scope.data.attributes.OBJECTID
                        }, function(data) {
                            if (!data.success) {
                                alert(data.msg);
                                return;
                            }
                            var cmss = [];
                            $.each(data.results, function(i, item) {
                                var cms = {};
                                cms.id = item.cmsId;
                                cms.name = item.cmsName;
                                cms.lng = item.lng || '0';
                                cms.lat = item.lat || '0';
                                cms.picUrl = '';
                                cmss.push(cms);
                            });
                            $scope.youdao = cmss;
                            $scope.total4y = $scope.youdao.length || 0;

                            var data1 = {};
                            data1.attributes = {};
                            data1.attributes.DEVICE_TYPE = '3';
                            data1.attributes.ID = '6';
                            data1.attributes.type = '2';
                            $scope.data1 = data1;
                            $scope.progEditShow = true;
                            window.setTimeout(function() {
                                picYoudao(cmss);
                            }, 500);
                        });
                        return;
                    }
                }
            });

            $rootScope.$on('road-tip:loadScreen', function(e, activeX) {
                if (!activeX) {
                    return;
                }
                $scope.activeX = activeX;
                $scope.isReady = true;
            });

            $scope.shareWechat = function(record) {
                //路段名称，坐标，路段状态名称，诱导屏照片
                var neededData = {};
                neededData.title = '路段流量提醒';
                var name = $scope.data.attributes.NAME || '';
                // var lng = $scope.data.geometry.toString() || '0';
                // neededData.lng = lng.substring(lng.indexOf('((') + 2, lng.indexOf('))'));
                // var lat = $scope.data.geometry.toString() || '0';
                // neededData.lat = lat.substring(lng.indexOf('((') + 2, lng.indexOf('))'));
                var stateName = $scope.sta.label || '';
                neededData.content = name + '：' + stateName;
                neededData.type = {
                    code : '4',
                    name : '道路状态'
                };
                neededData.pics = [];
                $.each($scope.youdao, function(i, item) {
                    var path = '';
                    if(item.picUrl) {
                        var path = item.picUrl;
                        var prefix = systemConfig.getSystemValue('VMS_PREFIX_URL');
                        path = prefix + path.substring(path.lastIndexOf('/') + 1);
                    }
                    neededData.pics.push({'path': path, 'name': item.name});
                });
                $scope.wechat = neededData;
            };

            $scope.release = function(yd) {
              var tmp = yd.picUrl.split("/");
              var urls = tmp[tmp.length-1].split(".");
              var reConTime = 0;
              var tt = setInterval(function(){
                var isCon = 1;
//    				var isCon = $scope.activeX.getOcx().getConnectState();
//    				reConTime++;
//    				if(reConTime>10){
//    					clearInterval(tt);
//    					Messenger().post({
//    	                    message: '发布失败，连接前端设备失败！',
//    	                    type: 'error',
//    	                    showCloseButton: true
//    	               });
//    				}
                if(isCon == 1){
                  clearInterval(tt);
                  var path = urls[0];
                  var prefix = systemConfig.getSystemValue('VMS_PIC_URL');
                  path = prefix + "/" + path;
                  var isSuc = $scope.activeX.getOcx().updateMsg(0, 0, path+'.jpg','楷体_GB2312','20',65280,1,$scope.stayTimeSec,4,$scope.stardate,$scope.enddate,0);
                  if(isSuc){
                    isSuc = $scope.activeX.getOcx().releaseMsg();
                    Messenger().post({message: '发布成功',type: 'success',showCloseButton: true });
                  }
                  else{
                    Messenger().post({
                      message: '发布失败',
                      type: 'error',
                      showCloseButton: true
                    });
                  }
                }
              },500)
            	
            };


        };

        return {
            restrict : 'AC',
            link : linker,
            scope : {
                data : '=',
                map : '='
            },
            templateUrl : 'app/$directives/tips/road-tip.html'
        };
    }];

}); 