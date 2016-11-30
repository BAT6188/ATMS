define(function () {'user strict';
  return ['$scope', 'Modal', 'ngTableParams', 'Restangular', '$modalInstance', 'DictCache', function($scope,Modal, ngTableParams, Restangular, $modalInstance, DictCache){
  
  window.setTimeout(function(){
        $('.modal-dialog').width(1000);
      });
  
  $scope.record= {};
  
  
  //号牌颜色字典
    /*Restangular.one('dicts/list', 'PLATE_COLOR').get().then(function (data) {
        $scope.plateColors = data.results;
        $scope.record.plateColor = data.results[0];
    });*/
    DictCache('PLATE_COLOR', function (dict){
       $scope.plateColors = dict;
       $scope.record.plateColor = dict[0]; 
    });
    
    //黑名单类型字典
    /*Restangular.one('dict/parent', 'BLACKLIST_TYPE').get().then(function (data) {
        $scope.types = data.results;
        $scope.record.type = data.results[0];
    });*/
    DictCache('BLACKLIST_TYPE', function (dict){
       $scope.types = dict;
       $scope.record.type = dict[0]; 
    });
    
    function clone (jsonObj) 
    {
        var buf;
        if (jsonObj instanceof Array) {
            buf = [];
            var i = jsonObj.length;
            while (i--) {
                buf[i] = arguments.callee(jsonObj[i]);
            }
            return buf;
        }else if (typeof jsonObj === "function"){
            return jsonObj;
        }else if (jsonObj instanceof Object){
            buf = {};
            for (var k in jsonObj) {
                buf[k] = arguments.callee(jsonObj[k]);
            }
            return buf;
        }else{
            return jsonObj;
        }
    }
    
    
    //匹配精度字典
    /*Restangular.one('dict/parent', 'MATCH_LEVEL').get().then(function (data) {
        $scope.matchLevels = data.results;
        $scope.matchLevelsClone = clone($scope.matchLevels);
        $scope.record.matchLevel = data.results[0];
    });*/
    DictCache('MATCH_LEVEL', function (dict){
        $scope.matchLevels = dict;
        $scope.matchLevelsClone = clone($scope.matchLevels);
        $scope.record.matchLevel = dict[0]; 
    });
    //布控状态字典
    /*Restangular.one('dict/parent', 'DISP_STATUS').get().then(function (data) {
        $scope.statuses = data.results;
        $scope.record.status = {code:$scope.statuses[1].code};
    });*/
    DictCache('DISP_STATUS', function (dict){
        $scope.statuses = dict;
        $scope.record.status = {code:$scope.statuses[1].code}; 
    });
  
    $scope.$watch('record.plateNo', function(plateNo){
        if($scope.record && $scope.record.matchLevel){
          var param = $scope.record.matchLevel.code;
          if(param === 01){
              $scope.record.matchPlateNo = $scope.record.plateNo.substring(0,7);
              $('#matchPlateNo').attr("readonly","readonly");
            }else if(param === 02){
              $scope.record.matchPlateNo = $scope.record.plateNo.substring(1,7);
              $('#matchPlateNo').attr("readonly","readonly");
            }else if(param === 03){
              $scope.record.matchPlateNo = '';
              $('#matchPlateNo').removeAttr("readonly");
            }
        }
    });
    
    $scope.selChange = function(code){
      $scope.matchLevels = $scope.matchLevelsClone;
      if($scope.record && $scope.record.plateNo){
        if(code === 01){
              $scope.record.matchPlateNo = $scope.record.plateNo.substring(0,7);
              $('#matchPlateNo').attr("readonly","readonly");
            }else if(code === 02){
              $scope.record.matchPlateNo = $scope.record.plateNo.substring(1,7);
              $('#matchPlateNo').attr("readonly","readonly");
            }else if(code === 03){
              $scope.record.matchPlateNo = '';
              $('#matchPlateNo').removeAttr("readonly");
            }
      }
    };
    
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
            $scope.record.carImgUrl = result.results.server+"/"+result.results.url;
            
            var parent = $("#imgContent");
            parent.empty();
            var img = $("<img>").appendTo(parent);
            img.css({"width":"320px", "height":"320px"});
            img.attr("src", result.results.server+"/"+result.results.url);
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
        //
        var record = _.extend({}, $scope.record);
        delete record.matchLevel.id;
        delete record.matchLevel.parent;
        delete record.matchLevel.status;
        delete record.matchLevel.initFlag;

        delete record.plateColor.id;
        delete record.plateColor.parent;
        delete record.plateColor.status;
        delete record.plateColor.initFlag;

        delete record.type.id;
        delete record.type.parent;
        delete record.type.status;
        delete record.type.initFlag;

        Restangular.all('blacklist').post(record).then(function (data) {
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
      };
      
    //关闭窗口
  $scope.close = function(){
    $modalInstance.close();
  };
  
}];

});