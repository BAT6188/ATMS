define(function(require, exports, module){

    return ['Duty','PoliceTaskFeedback','PoliceTaskSetPolice','Message', '$rootScope', 'Restangular',
            function(Duty,PoliceTaskFeedback,PoliceTaskSetPolice,Message, $rootScope, Rest){

        var linker = function($scope,el,attrs) {
            $scope.close = function (){
                $scope.onClose();
            };

            $scope.policeItemShow = 0;

            //查询警员反馈信息
            var query = function(){
                //alert(11111111111111111);
                //使用 service:FeedBack, 需要显视的注入 > line: 3
                if(!$scope.pTaskId || !$scope.record) return;
                PoliceTaskFeedback.query({'ptaskId':$scope.pTaskId,'policeNo':$scope.record.userId}, function(data){
                    if(!data.success){
                      alert(data.msg);
                      return;
                    }
                    $scope.total = data.total;
                    $scope.message = data.results;
                });

                PoliceTaskSetPolice.query({'policeNo':$scope.record.userId,'ptaskId':$scope.pTaskId},function(data){
                    if(!data){
                        alert(data.msg);
                    }
                    $scope.policeset = data.results[0];
                });
            };

           /* $scope.message = [{'id':'1','fileContent':'警员未到现场'},
                            {'id':'2','fileContent':'警员到现场'},
                            {'id':'2','fileContent':'警员离开现场'}];*/
            $scope.show = function(num){
                $scope.policeItemShow = num;
               // alert(num);
            };

            //警员到岗确认
            $scope.arrival = function() {
                var police = {};
                police.recordId = $scope.record.recordId;

                //1到岗 0离岗
                police.mark = '1';
                Duty.updatePoliceStatus(police, function(data) {
                    if (!data.success) {
                        alert(data.msg);
                        return;
                    }
                    $scope.record.actualStartTime = data.results.actualStartTime;
                    alert('保存成功!');
                });
            };
            //遍历警员离岗时间拍段完结按钮是否可点击
            var getShowConfirm = function() {
                $scope.isDisabledConfirm = true;
                if(!$scope.selecteds)
                {
                  return;
                }
                var leavePostNum = 0;
                _.each($scope.selecteds, function(police, index) {
                    if (police.actualEndTime) {
                        leavePostNum++;
                    }
                });
                if (leavePostNum === $scope.selecteds.length) {
                    $scope.isDisabledConfirm = false;
                }
            };
            //警员离岗确认
            $scope.leave = function() {
                var policeBean = {};
                policeBean.recordId = $scope.record.recordId;

                //1到岗 0离岗
                policeBean.mark = '0';
                Duty.updatePoliceStatus(policeBean, function(data) {
                    if (!data.success) {
                        alert(data.msg);
                        return;
                    }
                    $scope.record.actualEndTime = data.results.actualEndTime;
                    alert('保存成功!');
                    getShowConfirm();
                });

            };
            //催警
            $scope.dispatch = function(id){
                $scope.policeset.dispatchNumber++;
                PoliceTaskSetPolice.update($scope.policeset,function(data){
                    if(!data){
                    alert(data.msg);
                    }
                    $scope.policeset = data.results;
                    
                    if($scope.record.userCode) {
                        var onSuccess = function(data) {
                            if(data.success){
                                Message.success('成功', '已催警'+$scope.policeset.dispatchNumber+'次，并已发送警务通！',{});
                            } else {
                                Message.warning('警告', '已催警'+$scope.policeset.dispatchNumber+'次，但发送警务通失败！',{});
                            }
                        };
                        var onError = function(e) {
                            Message.warning('警告', '已催警'+$scope.policeset.dispatchNumber+'次，但发送警务通失败！',{});
                        };
                        Rest.all('').one('staskGps').post('sendMsg', {
                            policeids : $scope.record.userCode,
                            content : '请快速到达现场处理！'
                        }).then(onSuccess, onError);
                    } else {
                        Message.warning('警告', '已催警'+$scope.policeset.dispatchNumber+'次，但发送警务通失败！',{});
                    }
                });
            };
            $scope.$watch('record', query);
            // $scope.$watch('pannelShow',function(){
                // console.log('hjhjjjjhhhhhhhhhh',$scope.pannelShow);
            // });

            $scope.$watch('selecteds', function(){
              getShowConfirm();
            });

            $scope.sendJWT = function (){
                $rootScope.$broadcast('jwt:message', {
                    content: '',//JSON.stringify($scope.record),
                    contacts: [{
                        name: $scope.record.userName,
                        code: $scope.record.userCode
                    }]
                });
            };
        };

        return {
            restrict:'EA',
            link: linker,
            replace: true,
            scope: {
                record: '=data',
                pTaskId: '=ptask',
                message : '=',
                policeItemShow : '=policeItemShow',
                pannelShow :'=policeInfoShow',
                selecteds:'=selecteds',
                isDisabledConfirm :'=?',
                onClose: '&'
            },
            templateUrl: 'app/$directives/jq-police-info.html'
        };
    }];
    
});