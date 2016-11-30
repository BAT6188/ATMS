define(function(require, exports, module){

    return [function(){

        var linker = function($scope, $el, $attrs) {
            $scope.isLogin = false;
            $scope.snc = {};

            $scope.origin = {'1':'R','2':'S','3':'L',
                            '4':'R','5':'S','6':'L',
                            '7':'R','8':'S','9':'L',
                            '10':'R','11':'S','12':'L'};

            $scope.types = [{name:"东西直行",code:"a"},
                            {name:"东西左转",code:"b"},
                            {name:"东西方向",code:"c"},
                            {name:"南北左转",code:"d"},
                            {name:"南北直行",code:"e"},
                            {name:"南北方向",code:"f"},
                            {name:"北方向",code:"g"},
                            {name:"北直行",code:"h"},
                            {name:"北左转",code:"i"},
                            {name:"南方向",code:"j"},
                            {name:"南直行",code:"k"},
                            {name:"南左转",code:"l"},
                            {name:"西方向",code:"m"},
                            {name:"西直行",code:"n"},
                            {name:"西左转",code:"o"},
                            {name:"东方向",code:"p"},
                            {name:"东直行",code:"q"},
                            {name:"东左转",code:"r"},
                            {name:"全红",code:"s"},
                            //{name:"灭灯",code:"t"},
                            {name:"东西直右",code:"u"},
                            {name:"南北直右",code:"v"}];

            var dict = {
                "a":{'1':'R','2':'G','3':'R','4':'R','5':'R','6':'R','7':'R','8':'G','9':'R','10':'R','11':'R','12':'R'},
                "b":{'1':'R','2':'R','3':'G','4':'R','5':'R','6':'R','7':'R','8':'R','9':'G','10':'R','11':'R','12':'R'},
                "c":{'1':'G','2':'G','3':'G','4':'R','5':'R','6':'R','7':'G','8':'G','9':'G','10':'R','11':'R','12':'R'},
                "d":{'1':'R','2':'R','3':'R','4':'R','5':'R','6':'G','7':'R','8':'R','9':'R','10':'R','11':'R','12':'G'},
                "e":{'1':'R','2':'R','3':'R','4':'R','5':'G','6':'R','7':'R','8':'R','9':'R','10':'R','11':'G','12':'R'},
                "f":{'1':'R','2':'R','3':'R','4':'G','5':'G','6':'G','7':'R','8':'R','9':'R','10':'G','11':'G','12':'G'},
                "g":{'1':'R','2':'R','3':'R','4':'G','5':'G','6':'G','7':'R','8':'R','9':'R','10':'R','11':'R','12':'R'},
                "h":{'1':'R','2':'R','3':'R','4':'R','5':'G','6':'R','7':'R','8':'R','9':'R','10':'R','11':'R','12':'R'},
                "i":{'1':'R','2':'R','3':'R','4':'R','5':'R','6':'G','7':'R','8':'R','9':'R','10':'R','11':'R','12':'R'},
                "j":{'1':'R','2':'R','3':'R','4':'R','5':'R','6':'R','7':'R','8':'R','9':'R','10':'G','11':'G','12':'G'},
                "k":{'1':'R','2':'R','3':'R','4':'R','5':'R','6':'R','7':'R','8':'R','9':'R','10':'R','11':'G','12':'R'},
                "l":{'1':'R','2':'R','3':'R','4':'R','5':'R','6':'R','7':'R','8':'R','9':'R','10':'R','11':'R','12':'G'},
                "m":{'1':'G','2':'G','3':'G','4':'R','5':'R','6':'R','7':'R','8':'R','9':'R','10':'R','11':'R','12':'R'},
                "n":{'1':'R','2':'G','3':'R','4':'R','5':'R','6':'R','7':'R','8':'R','9':'R','10':'R','11':'R','12':'R'},
                "o":{'1':'R','2':'R','3':'G','4':'R','5':'R','6':'R','7':'R','8':'R','9':'R','10':'R','11':'R','12':'R'},
                "p":{'1':'R','2':'R','3':'R','4':'R','5':'R','6':'R','7':'G','8':'G','9':'G','10':'R','11':'R','12':'R'},
                "q":{'1':'R','2':'R','3':'R','4':'R','5':'R','6':'R','7':'R','8':'G','9':'R','10':'R','11':'R','12':'R'},
                "r":{'1':'R','2':'R','3':'R','4':'R','5':'R','6':'R','7':'R','8':'R','9':'G','10':'R','11':'R','12':'R'},
                "s":{'1':'R','2':'R','3':'R','4':'R','5':'R','6':'R','7':'R','8':'R','9':'R','10':'R','11':'R','12':'R'},
                //"t":{'1':'R','2':'R','3':'R','4':'R','5':'R','6':'R','7':'R','8':'R','9':'R','10':'R','11':'R','12':'R'},
                "u":{'1':'G','2':'G','3':'R','4':'R','5':'R','6':'R','7':'G','8':'G','9':'R','10':'R','11':'R','12':'R'},
                "v":{'1':'R','2':'R','3':'R','4':'G','5':'G','6':'R','7':'R','8':'R','9':'R','10':'G','11':'G','12':'R'}
            };

            var executeDetail = function() {
                //模拟数据   
                if(!$scope.detail){
                    return;
                }            
                for(var i=1;i<13;i++){
                    if($scope.detail[i]){
                        $scope.mix[i] = $scope.origin[i] + $scope.detail[i];
                    }else{//不存在该路口，有待后续处理
                        $scope.mix[i] = 'NO';
                    }
                } 

                $scope.intersection['0'] = [$scope.mix[12],$scope.mix[11],$scope.mix[10]];
                $scope.intersection['1'] = [$scope.mix[3],$scope.mix[2],$scope.mix[1]];
                $scope.intersection['2'] = [$scope.mix[6],$scope.mix[5],$scope.mix[4]];
                $scope.intersection['3'] = [$scope.mix[9],$scope.mix[8],$scope.mix[7]];

                refresh();
            };

            var refresh = function(){
                if ($scope.divSize) {
                    var width = $scope.divSize[0];
                    var height = $scope.divSize[1];
                    if (width && height) {
                        $el.find('.signalMap').parent().css('width', width).css('height', height);
                        // console.log($el.find('.signalMap').css('width'));
                        // console.log($el.find('.signalMap').css('height'));
                    }
                }

                var params = {
                    "inter_id":$scope.interId || 1,
                    "intersection":$scope.intersection || {"0":['LO','SO','RO'],"1":['LO','SO','RO'],"2":['LO','SO','RO'],"3":['LO','SO','RO']},
                    "image_size":$scope.imageSize || [300,300] ,
                    "lane_width":$scope.laneWidth || 20  //大于8
                };

                //要根据路口id，寻找对应图片
                var ele = "#"+$scope.interId;
                if($($el.find(ele)).length===0){
                    jq = $($el.find(".signalMap"));
                }else{
                    jq = $($el.find(ele))
                }
                // console.log(jq);
                jq.attr("src","../signalMap?params="+ JSON.stringify(params));

                if ($scope.imageSize && $scope.imageSize[0]) {
                    var w = $scope.imageSize[0];
                    if(!isNaN(w)) {
                        $el.find('#inputGroupId').css('width', w + 'px');
                    }
                }
            };

            refresh();

            $scope.mix = [];
            $scope.intersection={};

            //执行
            $scope.execute = function() {
                if (!$scope.snc.btnAble) {
                    $scope.snc.btnAble = true;
                }
                setTimeout(function() {
                    if (!$scope.snc.leftTime) {
                        $scope.snc.btnAble = false;
                        $scope.$apply();
                    }
                }, 3000);
                if ($scope.interId && $scope.interCode && $scope.interCode.code && dict[$scope.interCode.code]) {
                    socket.emit('signalControlStart', {
                        roadId : $scope.interId,
                        light : dict[$scope.interCode.code]
                    });
                }
            };

            //撤销
            $scope.cancel = function() {
                if ($scope.interId) {
                    socket.emit('signalControlEnd', {
                        roadId : $scope.interId
                    });
                }
            };

            $scope.$watch('interId', function() {
                if (!$scope.interId) {
                    return;
                }
                $el.find('#msgDiv').html('');
                if (!$scope.isLogin) {
                    //订阅
                    socket.emit('subscribe', {
                        'clientType' : 'signal',
                        'id' : $scope.interId
                    });

                    //监听
                    socket.on('signalStatus:' + $scope.interId, function(data) {
                        if (!data || !data.roadid) {
                            return;
                        }
                        if ($scope.interId && $scope.interId === data.roadid) {
                            if (data.resultstatus === '0') {
                                $scope.detail = data.light || 0;
                                executeDetail();
                            } else {
                                $el.find('#msgDiv').html('错误描述：连接杰瑞信号机服务器出错！');
                            }
                        }
                    });
                    //socket.on('signalStart:' + $scope.interId, function(data) {
                    //    console.log('signal-map-socket-on-signalStart');
                    //    console.log(data);
                    //    console.log($scope.interId);
                    //});

                    //控制信号机
                    if ($scope.controlPrivilege) {
                        socket.on('signalControlStart:' + $scope.interId, function(data) {
                            if ($scope.interId && $scope.interId === data.roadid) {
                                if (data.resultstatus === '0') {
                                    $scope.snc.cancelShow = true;
                                    var i = 300;
                                    $scope.snc.it = setInterval(function() {
                                        if (i > 0) {
                                            $scope.snc.btnAble = true;
                                            $scope.snc.leftTime = i + '秒';
                                            i = i - 1;
                                        } else {
                                            $scope.cancel();
                                        }
                                        $scope.$apply();
                                    }, 1000);
                                    $el.find('#msgDiv').html('');
                                } else {
                                    $el.find('#msgDiv').html('错误描述：连接杰瑞信号机服务器出错！');
                                }
                            }
                        });

                        socket.on('signalControlEnd:' + $scope.interId, function(data) {
                            if ($scope.interId && $scope.interId === data.roadid) {
                                if (data.resultstatus === '0') {
                                    $scope.snc.cancelShow = false;
                                    clearInterval($scope.snc.it);
                                    // $scope.snc.yzw = {};
                                    $scope.snc.btnAble = false;
                                    $scope.snc.leftTime = '';
                                    // $scope.interCode = 0;
                                    $scope.$apply();
                                    $el.find('#msgDiv').html('');
                                } else {
                                    $el.find('#msgDiv').html('错误描述：连接杰瑞信号机服务器出错！');
                                }
                            }
                        });
                    }

                    //获取一次状态
                    socket.emit('signalStatus', {
                        'roadId' : $scope.interId
                    });

                    $scope.isLogin = true;
                }

                //请求长连接
                socket.emit('signalStart', {
                    'roadId' : $scope.interId
                });
            });

            $scope.$on('$destroy', function() {
                //注销
                socket.emit('unsubscribe', {
                    'clientType' : 'signal',
                    'id' : $scope.interId
                }); 
                socket.removeAllListeners();
            });

        };

        return {
            restrict:'EA',
            link: linker,
            replace: true,
            scope: {
                interId: '=?',
                imageSize: '=?',
                divSize: '=?',
                laneWidth: '=?',
                controlPrivilege: '=?'
                // intersection: '=?'
            },
            templateUrl: 'app/$directives/signal-map.html'
        };
    }];
    
});