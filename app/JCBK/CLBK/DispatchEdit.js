define(function () {'user strict';
  return ['$scope', 'Modal', 'ngTableParams', 'Restangular', '$modalInstance', 'param', 'CurUser', '$validator', 'DictCache', function($scope,Modal, ngTableParams, Restangular, $modalInstance, param, User, $validator, DictCache){
  
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
  $scope.record.points = [];
  $scope.points = "";
  $scope.users = "";
  
  // 布控类型字典
  // Restangular.one('dict/parent', 'DISP_TYPE').get().then(function (data) {
 //        $scope.dispTypes = data.results;
 //        $scope.record.dispType = data.results[0];
 //    });
    DictCache('DISP_TYPE', function (dict){
        $scope.dispTypes = dict;
        $scope.record.dispType = dict[0];
    });
  // 布控原因字典
  // Restangular.one('dict/parent', 'DISP_REASON').get().then(function (data) {
 //        $scope.reasons = data.results;
 //        $scope.record.dispReason = data.results[0];
 //    });
    DictCache('DISP_REASON', function (dict){
        $scope.reasons = dict;
        $scope.record.dispReason = dict[0];
    });
  //号牌颜色字典
  // Restangular.one('dict/parent', 'PLATE_COLOR').get().then(function (data) {
 //        $scope.plateColors = data.results;
 //        $scope.record.plateColor = data.results[0];
 //    });
    DictCache('PLATE_COLOR', function (dict){
        $scope.plateColors = dict;
        $scope.record.plateColor = dict[0];
    });
  // 号牌种类字典
  // Restangular.one('dict/parent', 'PLATE_TYPE').get().then(function (data) {
 //        $scope.plateTypes = data.results;
 //        $scope.record.plateType = data.results[0];
 //    });
    DictCache('PLATE_TYPE', function (dict){
        $scope.plateTypes = dict;
        $scope.record.plateType = dict[0];
    });
  // 车身颜色字典
  // Restangular.one('dict/parent', 'CAR_COLOR').get().then(function (data) {
 //        $scope.carColors = data.results;
 //        $scope.record.carColor = data.results[0];
 //    });
    DictCache('CAR_COLOR', function (dict){
        $scope.carColors = dict;
        $scope.record.carColor = dict[0];
    });
  // 车辆类型字典
  // Restangular.one('dict/parent', 'CAR_TYPE').get().then(function (data) {
 //        $scope.carTypes = data.results;
 //        $scope.record.carType = data.results[0];
 //    });
    DictCache('CAR_TYPE', function (dict){
        $scope.carTypes = dict;
        $scope.record.carType = dict[0];
    });
  // 布控性质字典
  // Restangular.one('dict/parent', 'DISP_NATURE').get().then(function (data) {
 //        $scope.dispNatures = data.results;
 //    }).then(function () {
 //      $scope.record.dispNature = $scope.dispNatures[0];
 //    });
    DictCache('DISP_NATURE', function (dict){
        $scope.dispNatures = dict;
        $scope.record.dispNature = $scope.dispNatures[0];
    });
  // 布控单位
  // Restangular.one('dict/parent', '0037').get().then(function (data) {
 //        $scope.depts = data.results;
 //        $scope.record.dept = data.results[0];
 //    });
    DictCache('0037', function (dict){
        $scope.depts = dict;
        $scope.record.dept = dict[0];
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
//                obj.targetId = item.id;
                obj.targetType = item.isParent?"DEPT":"USER";
                obj.targetCode = item.id;
                names.push(item.name);
                infoTarget.push(obj);
            });
            $scope.users =names.join(',');
            $scope.record.infoTarget = infoTarget;
            $scope.$apply();
        };

        Restangular.one('department/deptUserTree').post()
            .then(function (data) {
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
                
                Restangular.one('bukong', param.id).get()
              .then(function(data){
                $scope.record = data.results;
                _.each($scope.record.dispatchPoints,function(point){
                  $scope.points += $scope.points.length>0? ','+ point.pointName : point.pointName;
                })
                
                var parent = $("#imgContent");
                parent.empty();
                var img = $("<img>").appendTo(parent);
                img.css({"width":"320px", "height":"320px"});
                img.attr("src", JCBK_PIC_URL + $scope.record.carImageUrl);
                    img.attr("alt", JCBK_PIC_URL + $scope.record.carImageUrl);
                
                $scope.record.carImage = undefined;
                $scope.record.carImageUrl = undefined;
                
                $scope.record.points = [];
                var treeObj = $.fn.zTree.getZTreeObj("pointTree");
                treeObj.expandAll(true);
                  angular.forEach($scope.record.dispatchPoints, function(point){
                  var obj={};
                        obj.targetId = point.pointNo;
                        obj.name =  point.pointName;
                        $scope.record.points.push(obj);
                       
                      var nodes = treeObj.getNodesByParam("id", point.pointNo, null);
                      treeObj.checkNode(nodes[0], true, true);
                    });
                  treeObj.expandAll(false);
                  
                  $scope.record.infoTarget = [];
                var treeObj = $.fn.zTree.getZTreeObj("userTree");
                treeObj.expandAll(true);
                  angular.forEach($scope.record.dispatchReceiver, function(receiver){
                  var obj={};
                        obj.targetType = receiver.targetType;
                        obj.targetCode = receiver.targetCode;
                        obj.targetName = receiver.targetName;
                        $scope.record.infoTarget.push(obj);
                        $scope.users += $scope.users.length>0? ','+ receiver.targetName : receiver.targetName;
                       
                      var nodes = treeObj.getNodesByParam("id", receiver.targetCode, null);
                      treeObj.checkNode(nodes[0], true, true);
                    });
                  treeObj.expandAll(false);
            });
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
            $scope.record.carImageUrl = result.results.url;
            
            var parent = $("#imgContent");
            parent.empty();
            var img = $("<img>").appendTo(parent);
            img.css({"width":"320px", "height":"320px"});
            img.attr("src", JCBK_PIC_URL + result.results.url);
              img.attr("alt", JCBK_PIC_URL + result.results.url);
            
            Messenger().post({
                  message: result.msg,
                  type: 'success',
                  showCloseButton: true,
                  hideAfter: 3
              });
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
          $scope.record.disPoint = [];
            angular.forEach($scope.record.points,function(p){
              if(p.targetId){
                $scope.record.disPoint.push(p.targetId);
              }
            });  

            $scope.record.dispatchReceiver = [];
            angular.forEach($scope.record.infoTarget,function(p){
              if(p.targetCode){
              var o = {targetType:p.targetType, targetCode:p.targetCode}
                $scope.record.dispatchReceiver.push(o);
              }
            });

            if($scope.record.dispNature.code === 1){
              $scope.record.dispatchReceiver = undefined;
            }
            Restangular.one('bukong', $scope.record.dispId).customPUT($scope.record).then(function (data) {
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
      
  // 打开地图选择模态对话框
    $scope.addPointsByMap = function(){
      var modalInstance = Modal('../map/PointSelByMap', $scope);
        modalInstance.result.then(function(data){
            if(data && data.length > 0){
              var treeObj = $.fn.zTree.getZTreeObj("pointTree");
              angular.forEach(data, function(item){
                var isIn = false;
                angular.forEach($scope.record.points, function(point){
                  if(point.targetId === item.attributes.ID){
                    isIn = true;
                  }
                });
                if(!isIn){
                  var obj={};
                        obj.targetId = item.attributes.ID;
                        obj.name =  item.attributes.NAME;
                        $scope.record.points.push(obj);
                        
                       treeObj.expandAll(true);
                      for (var i=0, l=data.length; i < l; i++) {
                        var nodes = treeObj.getNodesByParam("id", item.attributes.ID, null);
                        treeObj.checkNode(nodes[0], true, true);
                      }
                      treeObj.expandAll(false);
                }
                    
                });
              
                var names = [];
                angular.forEach($scope.record.points, function(point){
                  names.push(point.name);
                });
                $scope.points =names.join(',');
            }
        });
    };

      
  
}];

});