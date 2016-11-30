define(function(require, exports, module){

    return ['$filter', 'Duty', 'PoliceTask', 'PoliceTaskSetPolice', '$rootScope', 'PoliceTaskFeedback', 'Modal',
    function($filter, Duty, PoliceTask, PoliceTaskSetPolice, $rootScope, PoliceTaskFeedback, Modal){

        var linker = function($scope,el,attrs) {
            $scope.sendJWT = function (){
                var contacts = _.map($scope.polices, function (police){
                    return {
                        name: police.userName,
                        code: police.userCode
                    };
                });
                var content = '';
                if($scope.ptask)
                {
                  content += '警情单号：';
                  content += $scope.ptask.name?$scope.ptask.name:'';
                  content += '\n';
                  content += '案发地点：'; 
                  content += $scope.ptask.occurAddress?$scope.ptask.occurAddress:'';
                  content += '\n';
                  content += '警情内容：';
                  content += $scope.ptask.desc?$scope.ptask.desc:'';
                  content += '\n';
                  content += '报警人：';
                  content += $scope.ptask.caller?$scope.ptask.caller:'';
                  content += '\n';
                  content += '报警电话：';
                  content += $scope.ptask.phone?$scope.ptask.phone:'';
                  content += '\n';
                  content += '报警时间：';
                  content += $scope.ptask.createTime?$scope.ptask.createTime:'';
                }
                $rootScope.$broadcast('jwt:message', {
                    content: content,
                    contacts: contacts
                });
            };

            $scope.sendDX = function (){
                var contacts = _.map($scope.polices, function (police){
                    return {
                        name: police.userName,
                        code: police.userCode
                    };
                });
                var content = '';
                if($scope.ptask)
                {
                  content += '警情单号：';
                  content += $scope.ptask.name?$scope.ptask.name:'';
                  content += '\n';
                  content += '案发地点：'; 
                  content += $scope.ptask.occurAddress?$scope.ptask.occurAddress:'';
                  content += '\n';
                  content += '警情内容：';
                  content += $scope.ptask.desc?$scope.ptask.desc:'';
                  content += '\n';
                  content += '报警人：';
                  content += $scope.ptask.caller?$scope.ptask.caller:'';
                  content += '\n';
                  content += '报警电话：';
                  content += $scope.ptask.phone?$scope.ptask.phone:'';
                  content += '\n';
                  content += '报警时间：';
                  content += $scope.ptask.createTime?$scope.ptask.createTime:'';
                }
                $rootScope.$broadcast('jwt:message', {
                    content: content,
                    contacts: contacts
                });
            };

            /* ---------用于分页----------*/
            $scope.polices = [];
            $scope.total = $scope.polices.length;
            $scope.page = 1;
            $scope.size = 5;
            $scope.maxSize = 5;
            /* ---------用于分页----------*/
            var exStyles = new OpenLayers.ExStyles();
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
            
            var query = function(){
                if($scope.ptask && $scope.ptask.dutyId && $scope.lng && $scope.lat){
                    Duty.get({'id':$scope.ptask.dutyId,'lng':$scope.lng,'lat':$scope.lat}, function(data) {
                            if (!data.success) {
                                alert('后台勤务数据出错');
                                return;
                            }
                            if(data.results.posts && data.results.posts[0] && data.results.posts[0].id) {
                                $scope.ptask.postId = data.results.posts[0].id;
                            }
                            if(!data.results.posts.length) {return;}
                            $scope.polices = data.results.posts[0].polices;
                            $scope.origin = angular.copy($scope.polices);
                            $rootScope.$broadcast('polices:selectItems', {
                                selectItems: $scope.polices
                            });
                        }, function(e) {
                            alert('后台出错!');
                        });
                 }
            };

            //时间加2小时，参数yyyy-mm-dd hh:mi:ss
            var add2Hours = function(time) {
                if (!time) {
                    return '';
                }
                try {
                    var year = parseInt(time.substr(0, 4));
                    var month = parseInt(time.substr(5, 2)) - 1;
                    var day = parseInt(time.substr(8, 2));
                    var hour = parseInt(time.substr(11, 2));
                    var mintue = parseInt(time.substr(14, 2));
                    var second = parseInt(time.substr(17, 2));
                    var date = new Date(year, month, day, hour, mintue, second);
                    date.setHours(date.getHours() + 2);
                    return $filter('date')(date, 'yyyy-MM-dd HH:mm:ss');
                } catch(e) {
                    return '';
                }
            };

            $scope.notChange = function(){
                return angular.equals($scope.polices, $scope.origin);
            };

            //详细
            $scope.detail = function (record){
                $scope._police = record;
                $scope.policeInfo = true;
               // alert($scope._police);
               $scope.onItemClick({
                $item: record
               });
            };

            //派警
            $scope.setPolice = function(){
                //确认分配的警力,即这里创建并提交任务  
                //创建勤务对象
                var duty = {
                    name : '处理警情: <' + $scope.ptask.name + '> 的任务',
                    type : {
                        code : 1
                    }, //勤务类型
                    level : {
                        code : 1
                    }, //级别
                    startTime : $scope.ptask.occurTime, //勤务开始时间=警情上报时间?
                    endTime : add2Hours($scope.ptask.occurTime), //勤务结束时间  加2个小时
                    //principal.id: //责任人
                    //principalPhone: //联系电话
                    desc : $scope.ptask.desc, //勤务描述=警情内容
                    status : {
                        code : 1
                    }, //勤务状态,此时为执行中
                    //creator: //当前用户
                    //creatTime: //后台自动填充
                    frequence : {
                        code : 1
                    },
                    posts : [{
                        //pid: 1,//临时岗
                        name : '临时岗',
                        address : '临时位置',
                        type : {
                            code : 4
                        }, //临时岗
                        lng : $scope.ptask.lng,
                        lat : $scope.ptask.lat,
                        // address: $scope.record.position,//地址描述
                        planStartTime : $scope.ptask.dispatchTime ? $scope.ptask.dispatchTime : $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss'), //计划开始时间
                        planEndTime : add2Hours($scope.ptask.dispatchTime ? $scope.ptask.dispatchTime : $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss')), //加2个小时
                        polices : $scope.polices//[{id: '1'}]//岗位警员id列表
                    }]
                };

                Duty.save(duty, function(data) {
                    if (!data.success) {
                        alert(data.msg);
                        return;
                    }
                    if (!$scope.ptask || !$scope.ptask.id) {
                        return;
                    }
                    $scope.ptask.dutyId = data.results.id;
                    
                    //退订到岗确认
                    if($scope.ptask.postId) {
                        destroySocket($scope.ptask.postId);
                    }
                    if(data.results.posts && data.results.posts[0] && data.results.posts[0].id) {
                        $scope.ptask.postId = data.results.posts[0].id;
                    }
                    var pt = {
                        id :  $scope.ptask.id.toString(),
                        status:{
                                    code : '2',
                                    name : '处理中'
                                },
                        dutyId: $scope.ptask.dutyId   
                    };

                    //更新警情
                    PoliceTask.update(pt, function(data) {
                        if (!data.success) {
                            alert(data.msg);
                            return;
                        }
                        alert('警情更新成功!');
                        var postId = $scope.ptask.postId;
                        $scope.ptask = data.results;
                        $scope.ptask.postId = postId;
                        query();
                        //隐藏附近警员列表
                        //去除勾选
                        $scope.selectView = false;
                        angular.forEach($scope.polices,function(e){
                            e.checked = false;
                        });
                        //保存催警数据
                        var polices_set = [];
                        angular.forEach($scope.polices,function(p,i){
                            polices_set.push({
                                'policeNo': p.userId,
                                'dispatchNumber':0,
                                'ptaskId':$scope.ptask.id
                            });
                        });
                        PoliceTaskFeedback.removeByPid({ptaskId: $scope.ptask.id}, function(data){
                            if(!data.success){
                              alert(data.msg);
                              return;
                            }
                            PoliceTaskSetPolice.save({polices:polices_set},function(data){
                                if(!data.success){
                                    alert(data.msg);
                                    return;
                                }
                            });
                        });
                    }, function(e) {
                        alert('后台出错!');
                    });

                    // alert('保存成功');
                });
            };

            //重新派警
            $scope.reSetPolice = function(){
                angular.forEach($scope.polices,function(e){
                    e.checked = false;
                });
                $scope.polices = [];
                $scope.selectView = true;
            };

            $scope.cancle = function(){
                angular.forEach($scope.polices,function(e){
                    e.checked = false;
                });
                $scope.polices = $scope.origin;
                $scope.selectView = false;
            };

            $scope.callOutPhone = function($event, phone) {
              if(phone) {
                  callOutPhone_xg(phone);
              }
            };

            setTimeout(function() {
                query();
            }, 1000);

            //到岗提醒人员列表
            $scope.confirmPolices = [];
            var addConfirmPolice = function(police) {
                var isIn = false;
                _.each($scope.confirmPolices, function(item) {
                    if (item.userCode && police.userCode && item.userCode === police.userCode) {
                        isIn = true;
                    }
                });
                if (police.userCode && !isIn) {
                    $scope.confirmPolices.push(police);
                    return true;
                }
                return false;
            };

            var removeConfirmPolice = function(police) {
                var removeIndex = '-1';
                _.each($scope.confirmPolices, function(item, i) {
                    if (item.userCode && police.userCode && item.userCode === police.userCode) {
                        removeIndex = i;
                    }
                });
                if (removeIndex !== '-1') {
                    $scope.confirmPolices.splice(removeIndex, 1);
                    return true;
                }
                return false;
            };

            var confirmModal = function(polices) {
                _.each(polices, function(police) {
                    var modalInstance = Modal('directives/jq-selected-polices-confirm', {
                        police : police
                    });
                    modalInstance.result.then(function(record) {
                        if(record) {
                            if(record.police) {
                                removeConfirmPolice(record.police);
                            }
                            if(record.success) {
                                query();
                            }
                        }
                    });
                });
            };

            var initSocket = function(postId) {
                if (postId) {
                    postId = postId.toString();
                    socket.emit('subscribe', {
                        clientType : 'duty',
                        id : postId
                    });
                    var callback = function(data) {
                        var isChange = false;
                        var cps = [];
                        if (data && data.PostPoliceGps && data.PostPoliceGps[1] && data.PostPoliceGps[1].length >= 1 && $scope.polices && $scope.polices.length >= 1) {
                            var confirmDistance = systemConfig.getSystemValue('PTASK_CONFIRM_DISTANCE');
                            _.each(data.PostPoliceGps[1], function(d) {
                                if (d.policeNo) {
                                    _.each($scope.polices, function(police) {
                                        if (police.userCode && police.userCode == d.policeNo) {
                                            police.lng = d.lng || police.lng;
                                            police.lat = d.lat || police.lat;
                                            police.distance = d.distance || police.distance;
                                            if(!police.actualStartTime) {
                                                if(parseInt(police.distance) <= confirmDistance) {
                                                    if(addConfirmPolice(police)) {
                                                        cps.push(police);
                                                    }
                                                }
                                            }
                                            isChange = true;
                                        }
                                    });
                                }
                            });
                        }
                        $scope.$apply();
                        if(isChange) {
                            $rootScope.$broadcast('polices:change');
                        }
                        if(cps.length >= 1) {
                            confirmModal(cps);
                        }
                    };
                    socket.on('dutyPoliceToPost:' + postId, callback);
                }
            };

            var destroySocket = function(postId) {
                if (postId) {
                    postId = postId.toString();
                    socket.emit('unsubscribe', {
                        clientType : 'duty',
                        id : postId
                    });
                    socket.removeAllListeners();
                    // socket.removeAllListeners('dutyPoliceToPost:' + postId);
                }
            };

            $scope.$watch('ptask.postId', function() {
                if($scope.ptask && $scope.ptask.postId) {
                    initSocket($scope.ptask.postId);
                }
            });

            $scope.$on('$destroy', function() {
                if($scope.ptask.postId) {
                    destroySocket($scope.ptask.postId);
                }
            });

        };

        return {
            restrict:'EA',
            link: linker,
            replace: true,
            scope: {
                ptask : '=',
                polices: '=?data',
                // _police: '= detail',
                onItemClick: '&',
                selectView :'= selectView',
                lng :'=lng',
                lat :'=lat',
                map:'=map'
            },
            templateUrl: 'app/JCZH/ZHDD/directives/jq-selected-polices.html'
        };
    }];
    
});