define(function(){'use strict';
    return ['$scope', 'Modal', 'ngTableParams', 'Restangular', 'DictCache', function($scope,Modal, ngTableParams, Restangular, DictCache){

      $('#plateNo').keydown(function(event){
            if(event.keyCode===13){
                $scope.query();
            }
        });

        DictCache('PLATE_COLOR', function (dict){
           $scope.plateColors = dict; 
        });

        DictCache('BLACKLIST_TYPE', function (dict){
           $scope.types = dict; 
        });

        DictCache('DISP_STATUS', function (dict){
           $scope.statuses = dict; 
        });
        
        $scope.tableParams = new ngTableParams($scope.tableParameters, {
            getData: function ($defer, params) {
                var queryParams = {
                  plateColor: $scope.plateColor===null ? '':$scope.plateColor,
                  plateNo: $scope.plateNo===null ? '':$scope.plateNo,
                  type: $scope.type===null? '':$scope.type,
                  status: $scope.status===null? '':$scope.status,
                  alarmEndDateStart: $scope.alarmEndDateStart===null ? '':$scope.alarmEndDateStart,
                  alarmEndDateEnd: $scope.alarmEndDateEnd===null ? '':$scope.alarmEndDateEnd,
                    page: params.page(),
                    limit: params.count(),
                    total:params.total()
                };
                Restangular.all('blacklist/list').post(queryParams).then(function (data) {
                    params.total(data.total);
                    $scope.records = data.results;
                    $defer.resolve(data.results);
                });
            }
        });
        $scope.query = function(){
            if($scope.tableParams.page() === 1){
                $scope.tableParams.reload();
            }else{
                $scope.tableParams.page(1);
            }
        };
        
        //新建布控
        $scope.add = function(){
          var modalInstance = Modal('ApplyNew');
            modalInstance.result.then(function(data){
              $scope.tableParams.reload();
            });
        };
        
        //编辑布控
        $scope.edit = function(record){
          var modalInstance = Modal('DispatchEdit', record);
      modalInstance.result.then(function(data){
        $scope.tableParams.reload();
      });
        };
        
        //撤消布控
        $scope.cancel = function(){
          var msg = null, selectedItems = $scope.tableParams.selectedItems(), ids = [];
          var isError = false;
            if(selectedItems.length > 0){
                 var names = [];
                 _.each(selectedItems, function(value){
                     ids.push(value.id);
                     names.push(value.plateNo);
                     if(value.status.code !== '1'){
                       isError = true;
                     }
                 });
                 if(isError){
                 Messenger().post({
                         message: '请不要选择已经撤控的数据！',
                         type: 'warning',
                         id: 'warning',
                         showCloseButton: true,
                         hideAfter: 3
                     });
                 return;
               }
                 msg = names.toString();
             }else{
                 Messenger().post({
                     id: 'removeItem',
                     message: '请选择要撤消的数据！',
                     type: 'info',
                     showCloseButton: true,
                     hideAfter: 3
                 });
                 return;
             }
             Messenger().post({
                 id: 'remove',
                 message: '撤消：' + msg + '的黑名单布控?',
                 hideAfter: false,
                 actions: {
                     retry: {
                         label: '确定',
                         action: function(){
                           Restangular.all('blacklist/remove?ids=' + ids.toString()).post()
                                 .then(function(data){
                                     delResultHandler(data, '撤消成功！', '撤消失败!');
                                 });
                             this.hide();
                         }
                     },
                     cancel: {
                         label: '取消',
                         action: function(){
                             return this.cancel();
                         }
                     }
                 }
             });
        };
        
        //删除布控
        $scope.del = function(){
          var msg = null, selectedItems = $scope.tableParams.selectedItems(), ids = [];
            if(selectedItems.length > 0){
                 var names = [];
                 _.each(selectedItems, function(value){
                     ids.push(value.id);
                     names.push(value.plateNo);
                 });
                 msg = names.toString();
             }else{
                 Messenger().post({
                     id: 'removeItem',
                     message: '请选择要删除的数据！',
                     type: 'info',
                     showCloseButton: true,
                     hideAfter: 3
                 });
                 return;
             }
             Messenger().post({
                 id: 'remove',
                 message: '删除：' + msg + '的黑名单布控?',
                 hideAfter: false,
                 actions: {
                     retry: {
                         label: '确定',
                         action: function(){
                             Restangular.all('blacklist/' + ids.toString()).remove()
                                 .then(function(data){
                                     delResultHandler(data, '删除成功！', '删除失败!');
                                 });
                             this.hide();
                         }
                     },
                     cancel: {
                         label: '取消',
                         action: function(){
                             return this.cancel();
                         }
                     }
                 }
             });
        };
        
        function delResultHandler(data, successMsg, errorMsg){
            if(data.success){
                Messenger().post({
                    id: 'success',
                    message: successMsg,
                    type: 'success',
                    showCloseButton: true,
                    hideAfter: 3
                });
                $scope.tableParams.reload();
            }else{
                Messenger().post({
                    id: 'error',
                    message: errorMsg,
                    type: 'error',
                    showCloseButton: true,
                    hideAfter: 3
                });
            }
        }
        
        //查看布控
        $scope.view = function(record){
          var modalInstance = Modal('DispatchView', record);
        modalInstance.result.then(function(data){
      });
        };
        
        //批量审核
        $scope.examineBatchMod = function(){
          var ids =[];
            var checked = $scope.tableParams.selectedItems();
            angular.forEach(checked, function(item){
                ids.push(item.dispId);
            });
            if(ids.length === 0){
                return Messenger().post({
                    message: '请选择需要审核的数据！',
                    type: 'warning',
                    id: 'warning',
                    showCloseButton: true,
                    hideAfter: 3
                })
            }
          var modalInstance = Modal('Examine', {'ids':ids});
            modalInstance.result.then(function(data){
                console.log(data);
            });
        };
        
        //审核
        $scope.examineMod = function(record){
          var modalInstance = Modal('Examine', {'record':record});
            modalInstance.result.then(function(data){
                console.log(data);
            });
        };
        
        //撤控
        $scope.cancleMod = function(record){
          var modalInstance = Modal('Cancle', {'record':record});
            modalInstance.result.then(function(data){
                console.log(data);
            });
        };
        
        //报警记录
        $scope.alarmList = function(record){
          var modalInstance = Modal('DispAlarmList', {'record':record});
            modalInstance.result.then(function(data){
                console.log(data);
            });
        };

    }];
});