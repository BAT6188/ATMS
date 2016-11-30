define(function(require, exports, module) {
    return ['MsgPublish', 'DictCache', 'Restangular', 'Auth', '$rootScope',
    function(MsgPublish, DictCache, Rest, Auth, $rootScope) {

        var linker = function($scope, $el, $attrs) {
            $scope.showConfirm = false;
            $scope.showWarning = false;
            
            //诱导屏
            $scope.page4y = 1;
            $scope.size4y = 2;
            $scope.maxSize4y = 3;

            $scope.record = {};

            //信息来源
            DictCache("0114", function(dict) {
                $scope.sources = dict;
            });

            var dict = [];
            dict.push({
                code : '1',
                name : '施工占道'
            });
            dict.push({
                code : '2',
                name : '交通管制'
            });
            dict.push({
                code : '3',
                name : '其他'
            });
            dict.push({
                code : '4',
                name : '道路状态'
            });
            $scope.types = dict;
            $scope.record.type = $scope.types[0];

            //发送目标
            DictCache("0112", function(dict) {
                $scope.targets = dict;
            });

            $scope.shareMsg = function(targetCode) {
                if ($scope.entityForm.$invalid) {
                    // $scope.showWarning = true;
                    // $el.find('#warningId').html('请填写完整的信息发布信息！');
                    return;
                }
                if ($scope.record.pics && $scope.record.pics.length >= 6) {
                    $scope.showWarning = true;
                    $el.find('#warningId').html('发布的图片不能超过5张！');
                    return;
                }

                //网站1，微信2
                if (!targetCode) {
                    return;
                }
                var content;
                if (targetCode == $scope.targets[0].code) {
                    content = '确认发布到' + $scope.targets[0].name + '吗?';
                }
                if (targetCode == $scope.targets[1].code) {
                    content = '确认发布到' + $scope.targets[1].name + '吗?';
                }
                if (!content) {
                    return;
                }
                $scope.record.target = {
                    'code' : targetCode
                };
                $scope.showConfirm = true;
                $el.find('#confirmId').html(content);
            };

            $scope.add = function() {
                if ($scope.sources && $scope.sources[0] && $scope.sources.code) {
                    $scope.record.source = $scope.sources[0];
                } else {
                    $scope.record.source = {
                        'code' : '1'
                    };
                }
                $scope.record.imageType = 'url';
                $scope.record.imageUrl1 = '';
                $scope.record.imageUrl2 = '';
                $scope.record.imageUrl3 = '';
                $scope.record.imageUrl4 = '';
                $scope.record.imageUrl5 = '';
                _.each($scope.record.pics, function(one, i) {
                    if (i == 0) {
                        $scope.record.imageUrl1 = one.path;
                        return true;
                    }
                    if (i == 1) {
                        $scope.record.imageUrl2 = one.path;
                        return true;
                    }
                    if (i == 2) {
                        $scope.record.imageUrl3 = one.path;
                        return true;
                    }
                    if (i == 3) {
                        $scope.record.imageUrl4 = one.path;
                        return true;
                    }
                    if (i == 4) {
                        $scope.record.imageUrl5 = one.path;
                        return true;
                    }
                });
                Rest.all('').one('msgPub').post('', $scope.record).then(function(data) {
                    if (!data.success) {
                        Messenger().post({
                            message: '添加失败！',
                            type: 'error',
                            showCloseButton: true,
                            hideAfter: 3
                        });
                        return;
                    }
                    Messenger().post({
                        message: '添加成功！',
                        type: 'success',
                        showCloseButton: true,
                        hideAfter: 3
                    });
                    $scope.showConfirm = false;
                    $scope.close();
                }, function(e) {
                    console.log(e);
                });
            };

            $scope.remove = function(pic) {
                var removeNum = -1;
                _.each($scope.record.pics, function(one, i) {
                    if (one.path == pic.path) {
                        removeNum = i;
                        return;
                    }
                });
                if (removeNum != -1) {
                    $scope.record.pics.splice(removeNum, 1);
                }
            };

            /**
             * 数据格式
             * {
             *     title: '路段流量提醒',
             *     content: '淮海西路矿务局段：拥堵',
             *     type: {code: '4', name: '道路状态'}
             *     pics[{path: 'http://127.0.0.1:8081/2014/08/03/23/b37c4a5b86d048a8beaef070796b6e18.jpg', name: 'b37c4a5b86d048a8beaef070796b6e18.jpg'}]
             * }
             */
            $scope.initData = function(feature) {
                if (feature) {
                    //1施工占道，2交通管制，9其他
                    $scope.record.title = feature.title;
                    $scope.record.content = feature.content;
                    $scope.record.type = feature.type;
                    if (feature.pics) {
                        var tempPics = [];
                        _.each(feature.pics, function(one) {
                            tempPics.push({
                                'path' : one.path,
                                'name' : one.name
                            });
                        });
                        $scope.record.pics = tempPics;
                    }
                    $scope.$apply();
                }
            };

            $scope.close = function() {
                $scope.onClose();
            };

            $scope.$watchCollection('[filePath, fileName]', function(){
                if($scope.filePath && $scope.fileName) {
                    var tempPics = [];
                    tempPics.push({
                        'path' : $scope.filePath,
                        'name' : $scope.fileName
                    });
                    $scope.record.pics = tempPics;
                }
            });

            //监听事件
            $rootScope.$on('wechat:feature', function(e, feature) {
                if (feature) {
                    $scope.onCall();
                    $scope.initData(feature);
                    $scope.$apply();
                }
            });

        };

        return {
            restrict : 'EA',
            link : linker,
            replace : true,
            scope : {
                modalSwitcher : '=modalSwitcher',
                onClose : '&',
                onCall : '&'
            },
            templateUrl : 'app/$directives/wechat-sender.html'
        };
    }];
});
