define(function () {'user strict';
  return ['$scope', 'Modal', 'ngTableParams', 'Restangular', '$modalInstance', 'param', 'DictCache', function($scope,Modal, ngTableParams, Restangular, $modalInstance, param, DictCache){
  
  window.setTimeout(function(){
        $('.modal-dialog').width(1000);
      });

  Restangular.one('blacklist', param.id).get()
      .then(function(data){
        $scope.record = data.results;

        var parent = $("#imgContent");
        parent.empty();
        var img = $("<img>").appendTo(parent);
        img.css({"width":"320px", "height":"320px"});
        img.attr("src", JCBK_PIC_URL + $scope.record.carImgUrl);
        img.attr("alt", JCBK_PIC_URL + $scope.record.carImgUrl);
        
        $scope.record.carImg = undefined;
        $scope.record.carImgUrl = undefined;
        
        //布控状态字典
          DictCache('DISP_STATUS', function (dict){
            $scope.statuses = dict;
          });
  });
  
  //号牌颜色字典
    DictCache('PLATE_COLOR', function (dict){
      $scope.plateColors = dict;
    });
    
    //黑名单类型字典
    DictCache('BLACKLIST_TYPE', function (dict){
      $scope.types = dict;
    });
    
    //匹配精度字典
    DictCache('MATCH_LEVEL', function (dict){
      $scope.matchLevels = dict;
    });
    
    $scope.$watch('record.plateNo', function(plateNo){
        if($scope.record){
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
    
    $scope.$watch('record.matchLevel.code', function(param){
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
    });
  
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
        Restangular.one('blacklist', $scope.record.id).customPUT($scope.record).then(function (data) {
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