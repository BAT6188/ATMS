define(function () {'user strict';
    return ['$scope', 'Modal', 'ngTableParams', 'Restangular', '$modalInstance', 'CurUser', '$validator', '$filter', 'DictCache', function($scope,Modal, ngTableParams, Restangular, $modalInstance, User, $validator, $filter, DictCache){
    
    window.setTimeout(function(){
        $('.modal-dialog').width(1000);
      });
    
    var user = User();
    
    $scope.record = {};
    $scope.record.dispDeptCode = user.deptCode;
    $scope.record.dispDeptName = user.deptName;
    $scope.record.person = user.userName;
    $scope.record.dispIdNumber = user.idCard;
    $scope.record.disPoint = [];
    $scope.record.dispatchReceiver = [];
    $scope.record.points = [];
    $scope.points = "";
    
    $scope.record.dispTime = $filter('date')(new Date(),'yyyy-MM-dd hh:mm:ss');

    DictCache('PLATE_COLOR', function (value){
      $scope.plateColors = value;
    });

    DictCache('DISP_REASON', function (value){
      $scope.reasons = value;
    });

    DictCache('DISP_NATURE', function (value){
      $scope.dispNatures = value;
      $scope.record.dispNature = $scope.dispNatures[0];
    });

    DictCache('DISP_TYPE', function (value){
      $scope.dispTypes = value;
    });

    DictCache('PLATE_TYPE', function (value){
      $scope.plateTypes = value;
    });

    DictCache('CAR_TYPE', function (value){
      $scope.carTypes = value;
    });

    DictCache('CAR_COLOR', function (value){
      $scope.carColors = value;
    });
    
    DictCache('0037', function (value){
      $scope.depts = value;
      $scope.record.dept = value[0];
    });
    
    //部门，人员选择树
    var setting1 = {
            view: {
                showLine: false,
                selectedMulti: false
            },
            edit: {
                enable: false
            },
            key: {
                name: 'userName'
            },
            data: {
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "pId"
                }
            },
            check:{
                enable:true,
                chkboxType: {"Y" : "s", "N" : "s" }
            },
            callback: {
                onCheck: zTreeOnCheck
            }

        };

    function zTreeOnCheck(event, treeId, treeNode) {
        var names = [];
        var infoTarget = [];
        var treeObj = $.fn.zTree.getZTreeObj("userTree");
        var nodes = treeObj.getCheckedNodes(true);

        angular.forEach(nodes, function(item){
            var obj={};
            obj.targetId = item.id;
            obj.targetType = item.isParent?"DEPT":"USER";
            obj.targetCode = item.id;
            names.push(item.name);
            infoTarget.push(obj);
        });
        $scope.users =names.join(',');
        $scope.record.infoTarget = infoTarget;
        $scope.$apply();
    };

    Restangular.one('department/deptUserTree').post().then(function (data) {
        $scope.typeTreedata = data.results;
    })
    .then(function () {
        $.fn.zTree.init($("#userTree"), setting1, $scope.typeTreedata);
    });

    $scope.showMenu = function () {
        var users = $('#users');
        $("#menuContent1").css({left: 100 + "px",width:390+"px" ,top: 365+ "px", display: "block"}).slideDown("fast");
        $("body").bind("mousedown", onBodyDown);
    }
    function hideMenu() {
        $("#menuContent1").fadeOut("fast");
        $("body").unbind("mousedown", onBodyDown);
    }

    function onBodyDown(event) {
        if (!(event.target.id === "menuContent1" || $(event.target).parents("#menuContent1").length > 0)) {
            hideMenu();
        }
    }
    
    //点位选择树
    var setting2 = {
            view: {
                showLine: false,
                selectedMulti: false
            },
            edit: {
                enable: false
            },
            data: {
                simpleData: {
                    enable: true,
                    idKey: "id",
                    pIdKey: "pId"
                }
            },
            check:{
                enable:true,
                chkboxType: {"Y" : "ps", "N" : "ps" }
            },
            callback: {
                onCheck: zPointTreeOnCheck
            }

        };
        function zPointTreeOnCheck(event, treeId, treeNode) {
            var names = [];
            var points = [];
            var treeObj = $.fn.zTree.getZTreeObj("pointTree");
            var nodes = treeObj.getCheckedNodes(true);

            angular.forEach(nodes, function(item){
                var obj={};
                obj.targetId = item.id;
                obj.name = item.name;
                names.push(item.name);
                points.push(obj);
            });
            
            $scope.record.points = points;
            $scope.points =names.join(',');
            $scope.$apply();
        };

        Restangular.one('point/findTreeList').post()
            .then(function (data) {
                angular.forEach(data.results, function(item){
                    if(item.isParent){
                        item.nocheck = true;
                    }else{
                        item.nocheck = false;
                    }
                });
                $scope.typePointTreedata = data.results;
            })
            .then(function () {
                $.fn.zTree.init($("#pointTree"), setting2, $scope.typePointTreedata);
            });
    $scope.showPointMenu = function () {
        var points = $('#points');
        $("#menuContent2").css({left: 100 + "px",width:375+"px" ,top: 330 + "px", display: "block"}).slideDown("fast");
        $("body").bind("mousedown", onBodyDown2);
    }
    function hideMenu2() {
        $("#menuContent2").fadeOut("fast");
        $("body").unbind("mousedown", onBodyDown2);
    }

    function onBodyDown2(event) {
        if (!(event.target.id === "menuContent2" || $(event.target).parents("#menuContent2").length > 0)) {
            hideMenu2();
        }
    }
      
    $scope.ajaxFileUpload = function() {
        $.ajaxFileUpload({
          url : '/java/uploadFile', // 需要链接到服务器地址
          secureuri : false,
          fileElementId : 'fileToUpload', // 文件选择框的id属性
          dataType : 'content', // 服务器返回的格式，可以是json
          success: function (data, status)
          {
              var start = data.indexOf(">");
              if(start !== -1) {
                var end = data.indexOf("<", start + 1);
                if(end !== -1) {
                  data = data.substring(start + 1, end);
                }
              }
              var result = eval("("+data+")");
              // $scope.record.carImageUrl = result.results.server+"/"+result.results.url;
              $scope.record.carImageUrl = result.results.url;
              
              var parent = $("#imgContent");
              parent.empty();
              var img = $("<img>").appendTo(parent);
              img.css({"width":"320px", "height":"320px"});
              // img.attr("src", result.results.server+"/"+result.results.url);
              img.attr("src", JCBK_PIC_URL + result.results.url);
          },
          error: function (data)
          {
            var start = data.indexOf(">");
                  if(start !== -1) {
                    var end = data.indexOf("<", start + 1);
                    if(end !== -1) {
                      data = data.substring(start + 1, end);
                    }
                  }
                  var result = eval("("+data+")");
                  alert(result.msg);
          } 
        }

        );
      };
      
      $scope.save = function(){
          $validator.validate($scope, 'record')
          .success(function() {
              angular.forEach($scope.record.points,function(p){
                  if(p.targetId){
                    $scope.record.disPoint.push(p.targetId);
                  }
                });  

                angular.forEach($scope.record.infoTarget,function(p){
                  if(p.targetId){
                    $scope.record.dispatchReceiver.push(p);
                  }
                });

                if($scope.record.dispNature.code === 1){
                    $scope.record.dispatchReceiver = undefined;
                }
                
                Restangular.all('bukong').post($scope.record).then(function (data) {
                    if(data.success){
                        $modalInstance.close();
                        Messenger().post({
                            message: '保存成功！',
                            type: 'success',
                            showCloseButton: true,
                            hideAfter: 3
                        });
                    }else{
                        Messenger().post({
                            message: '保存失败！',
                            type: 'error',
                            showCloseButton: true,
                            hideAfter: 3
                        });
                    }
                });
          })
          .error(function(){});
      };
      
    //关闭窗口
    $scope.close = function(){
        $modalInstance.close();
    };
    
}];

});