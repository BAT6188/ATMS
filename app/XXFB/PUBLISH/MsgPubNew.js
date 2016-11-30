define(function (require, exports, module) {
    var controller = ['$scope', 'Message', 'MsgPublish', 'DictCache', 'Restangular', 'Auth', '$rootScope', '$location',
     function ($scope, Message, MsgPublish, DictCache, Rest, Auth, $rootScope, $location) {
     $scope.record = {};
     $scope.uploadFileNum = 0;
     // $scope.isShowLngLat = false;

     //信息来源
     DictCache("0114", function(dict){
         $scope.sources = dict;
         // $scope.record.source = $scope.sources[0];
     });

     //信息类型
//     DictCache("0111", function(dict){
//         $scope.types = dict;
//         $scope.record.type = $scope.types[0];
//     });
     var dict = [];
     var d = {code: '1', name: '施工占道'};
     dict.push(d);
     d = {code: '2', name: '交通管制'};
     dict.push(d);
     d = {code: '3', name: '其他'};
     dict.push(d);
     d= {code: '4', name: '道路状态'};
     dict.push(d);
     $scope.types = dict;
     $scope.record.type = $scope.types[0];

     //发送目标
     DictCache("0112", function(dict){
         $scope.targets = dict;
         // $scope.record.target = $scope.targets[0];
     });

     $scope.shareMsg = function(targetCode) {
       if($scope.entityForm.$invalid) {
         Message.warning('提示信息', '请填写完整的信息发布信息！');
         return;
       }
       
       //网站1，微信2
       if(!targetCode) {
         return;
       }
       var content;
       if(targetCode==$scope.targets[0].code) {
         content = '确认分享到'+$scope.targets[0].name+'吗?';
       }
       if(targetCode==$scope.targets[1].code) {
         content = '确认分享到'+$scope.targets[1].name+'吗?';
       }
       if(!content) {
         return;
       }
       $scope.record.target = {'code': targetCode};
       Message.confirm('提示', content, {}, $scope.upload, function(){});
     };

     $scope.add = function () {
       if($scope.sources && $scope.sources[0] && $scope.sources.code)
       {
         $scope.record.source = $scope.sources[0];
       }
       else
       {
         $scope.record.source = {'code': '1'};
       }
       $scope.record.imageType = 'upload';
       Rest.all('').one('msgPub').post('', $scope.record).then(function(data){
         if(!data.success){
           alert(data.msg);
           return;
         }
         Message.success('信息提示', '添加成功！');
         $location.path('XXFB.PUBLISH.MsgPubList');
       }, function(e) {
         console.log(e);
       }); 
     };

      //上传照片
      $scope.upload = function (){
        if($('#file_upload-queue').length>=1)
        {
          if($('#file_upload-queue').children('div').length>=1)
          {
            $('#file_upload').uploadify('upload', '*');
          }
          else
          {
            $scope.add();
          }
        }
      };

      $scope.fileUploadFun = function() {
        var sessionId = Auth.getSessionId();
        if(!sessionId) {
          return;
        }
        
        $('#file_upload').uploadify({
          'queueSizeLimit' : 5,
          'fileSizeLimit' : '1024KB',
          'swf'      : 'libs/uploadify/uploadify.swf',
          'uploader' : '/java/common/upload?jsessionid='+sessionId+'&module=msgPub',
          'buttonText': '浏览',
          'auto':false,
          // 'formData'  : {'ASPSESSID':$("#sessionId").val()},
           // 'cancelImg'      : 'libs/uploadify/uploadify-cancel.png',
          // 'method'   : 'post',
          'onUploadComplete' : function(file) {
            console.log('The file ' + file.name + ' finished processing.');
            // alert('The file ' + file.name + ' finished processing.');
          },
          'onUploadError' : function(file, errorCode, errorMsg, errorString) {
            console.log('The file ' + file.name + ' could not be uploaded: ' + errorString);
            // alert('The file ' + file.name + ' could not be uploaded: ' + errorString);
          },
          'onUploadProgress' : function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) {
            $('#progress').html(totalBytesUploaded + ' bytes uploaded of ' + totalBytesTotal + ' bytes.');
            // alert(totalBytesUploaded + ' bytes uploaded of ' + totalBytesTotal + ' bytes.');
          },
          'onUploadStart' : function(file) {
            console.log('Starting to upload ' + file.name);
            // alert('Starting to upload ' + file.name);
          },
          'onUploadSuccess' : function(file, data, response) {
            console.log('The file ' + file.name + ' was successfully uploaded with a response of ' + response + ':' + data);
            // alert('The file ' + file.name + ' was successfully uploaded with a response of ' + response + ':' + data);
            $scope.uploadFileNum--;
            if($scope.uploadFileNum===0) {
              $scope.add();
            }
          },
          'onSelect' : function(file) {
            // alert('The file ' + file.name + ' was added to the queue.');
            $scope.uploadFileNum++;
          },
          'onCancel' : function(file) {
            // alert('The file ' + file.name + ' was cancelled.');
            $scope.uploadFileNum--;
          },
          'onSelectError' : function(file, errorCode, errorMsg, errorString) {
            if(errorCode && errorCode=='-100')
            {
              alert('文件上传数量不能超过5个！');
            }
            if(errorCode && errorCode=='-110')
            {
              alert('文件上传大小不能超过1M！');
            }
            if(errorCode && errorCode=='-120')
            {
              alert('不能上传空文件！');
            }
            return false;
            //alert('The file ' + file.name + ' returned an error and was not added to the queue.');
           }
        });
      };

      setTimeout(function (){
         $scope.fileUploadFun();
         $scope.initData();
      }, 1000);

     $scope.doUpload = function(){
         $('#file_upload').uploadify('upload','*');
     };

     $scope.reset = function(){
      $scope.record = {};
     };

        $scope.initData = function() {
            if ($rootScope.tempData) {
                //1施工占道，2交通管制，9其他
                // $scope.isShowLngLat = true;
    
                //施工占道
                if ($rootScope.tempData.key === 'ZHGL_SGZD_LIST_RECORD') {
                    $scope.record.title = '施工占道提醒';
                    $scope.record.content = '';
                    if ($rootScope.tempData.val.applyUnit) {
                        $scope.record.content += '申请单位：' + $rootScope.tempData.val.applyUnit + '\n';
                    }
                    if ($rootScope.tempData.val.applyReason) {
                        $scope.record.content += '申请理由：' + $rootScope.tempData.val.applyReason + '\n';
                    }
                    if ($rootScope.tempData.val.roadDesc) {
                        $scope.record.content += '施工路段-描述：' + $rootScope.tempData.val.roadDesc + '\n';
                    }
                    $scope.record.type = $scope.types[0];
                    $scope.$apply();
                }
                //交通管制
                if ($rootScope.tempData.key === 'ZHGL_JTGZ_LIST_RECORD') {
                    $scope.record.title = $rootScope.tempData.val.title;
                    $scope.record.content = $rootScope.tempData.val.description;
                    $scope.record.type = $scope.types[1];
                    $scope.$apply();
                }
                if ($rootScope.tempData.key === 'TIPS_ROADTIPS') {
                    $scope.record.title = '路段流量提醒';
                    $scope.record.type = $scope.types[3];
                    $scope.record.content = $rootScope.tempData.val.name + '：' + $rootScope.tempData.val.stateName;
                    $scope.record.lng = $rootScope.tempData.val.lng;
                    $scope.record.lat = $rootScope.tempData.val.lat;
                    $scope.$apply();
                }
                $rootScope.tempData = null;
            } else {
                $scope.record.lng = 0;
                $scope.record.lat = 0;
            }
        };

    }];
    module.exports = controller;
});
