define(function(){'use strict';
    return ['$scope', 'Modal', 'ngTableParams', 'Restangular', '$state', 'DictCache', function($scope,Modal, ngTableParams, Restangular, $state, DictCache){

      $('#plateNo').keydown(function(event){
            if(event.keyCode===13){
                $scope.query();
            }
        });
      
      var setting = {
                view: {
                    showLine: false,
                    selectedMulti: false
                },
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "pId"
                    }
                },
                callback: {
                    onClick: onClick
                }
            };
            Restangular.all('department/deptUserTree').post()
                .then(function (data) {
                    $scope.depts = data.results;
                })
                .then(function () {
                    $.fn.zTree.init($("#deptTree"), setting, $scope.depts);
                });

            function onClick(e, treeId, treeNode) {
                $scope.dispDept= {code: treeNode.id, name: treeNode.name,deptId:treeNode.deptId};
                $scope.$apply();
                hideMenu();
            }

            $scope.showMenu = function () {
                var dept = $('#dept');
                $("#menuContent").css({left: 308 + "px", width:275 + "px",top: dept.offset().top -25 + "px", display: "block"}).slideDown("fast");
                $("body").bind("mousedown", onBodyDown);
            }
            function hideMenu() {
                $("#menuContent").fadeOut("fast");
                $("body").unbind("mousedown", onBodyDown);
            }

            function onBodyDown(event) {
                if (!(event.target.id === "menuContent" || $(event.target).parents("#menuContent").length > 0)) {
                    hideMenu();
                }
            }

        DictCache('PLATE_COLOR', function (dict){
           $scope.plateColors = dict;
        });

        DictCache('DISP_NATURE', function (dict){
           $scope.dispNatures = dict;
        });
        
        DictCache('DISP_STATUS', function (dict){
           $scope.statuses = dict;
        });

        DictCache('DISP_VERIFY_STATUS', function (dict){
           $scope.verifyStatuses = dict;
        });
        
        $scope.tableParams = new ngTableParams($scope.tableParameters, {
            getData: function ($defer, params) {
                var queryParams = {
                  plateColor: !$scope.plateColor ? '':$scope.plateColor,
                  plateNo: !$scope.plateNo ? '':$scope.plateNo,
                  status: !$scope.status ? '':$scope.status,
                  verifyStatus: !$scope.verifyStatus ? '':$scope.verifyStatus,
                  startDispTime: !$scope.dispTime ? '':$scope.dispTime,
                  endDispTime: !$scope.dispEndTime ? '':$scope.dispEndTime,
                  dispDeptCode: !$scope.dispDept ? '':$scope.dispDept.code,
                  dispOperator: !$scope.dispOperator ? '':$scope.dispOperator,
                    page: params.page(),
                    limit: params.count(),
                    total:params.total()
                };
//                queryParams.verifyStatus = '1';
                
                Restangular.all('bukong/list').post(queryParams).then(function (data) {
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
        
        //查看布控
        $scope.view = function(record){
          Modal('DispatchView', {id: record.dispId}).result
            .then(function(){
          });
        };
        
        //批量审核
        $scope.examineBatchMod = function(){
          var ids =[];
            var checked = $scope.tableParams.selectedItems();
            var isError = false;
            angular.forEach(checked, function(item){
                ids.push(item.dispId);
                if(item.verifyStatus.code !== '1'){
                  Messenger().post({
                        message: '请选择审核中的数据！',
                        type: 'warning',
                        id: 'warning',
                        showCloseButton: true,
                        hideAfter: 3
                    });
                    isError = true;
                }
            });
            if(isError) return;
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
              $scope.tableParams.reload();
            });
        };
        
        //审核
        $scope.examineMod = function(record){
          var modalInstance = Modal('Examine', {'record':record});
            modalInstance.result.then(function(data){
              $scope.tableParams.reload();
            });
        };
        
        //撤控
        $scope.cancleMod = function(record){
          var modalInstance = Modal('Cancle', {'record':record});
            modalInstance.result.then(function(data){
              $scope.tableParams.reload();
            });
        };
        
        //报警记录
        $scope.alarmList = function(record){
          var modalInstance = Modal('DispAlarmList', {'record':record});
            modalInstance.result.then(function(data){
            });
        };

    }];
});