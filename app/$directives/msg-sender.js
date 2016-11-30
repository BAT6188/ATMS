define(function(require, exports, module){
  return ['$rootScope', 'Restangular', function($rootScope, Rest){
    
    var linker = function ($scope, $el, $attrs){
      $scope.error = true;
      $scope.message = '';//提示信息
      $scope.contacts = [];//联系人
      $scope.running = false;

      var onSuccess = function (data){
        if(!data.success){
          $scope.error = data.success;
          $scope.comment = data.msg;
        }else{
          $scope.comment = '发送成功!';
        }
        $scope.running = false;
      };

      var onError = function (){
        $scope.error = false;
        $scope.comment = '发送失败!';
        $scope.running = false;
      };

      //发送信息
      $scope.sendMsg = function (){
        $scope.error = true;

        if($scope.message.length < 1){
          $scope.error = false;
          $scope.comment = '请输入要发送内容!';
          return;
        }

        Rest.all('').one('staskGps').post('sendMsg', {
          policeids: _.pluck($scope.contacts, 'code').join(','),
          content: $scope.message
        }).then(onSuccess, onError);

        $scope.comment = '发送中....';
        $scope.running = true;
      };

      //关闭按钮
      $scope.close = function (){
        $scope.error = true;
        $scope.message = '';
        $scope.comment = '';
        $scope.contacts.length = 0;
        $scope.running = false;
        $scope.onClose();
      };

      //双击删除联系人
      $scope.removeContact = function (con){
        if($scope.running){
          return;
        }
        
        for(var i=0,size=$scope.contacts.length;i<size;i++){
          var contact = $scope.contacts[i];
          if(contact.code === con.code){
            $scope.contacts.splice(i, 1);
          }
        }
      };

      //监听事件
      $rootScope.$on('jwt:feature', function (e, features){
        //接受数组或单个 单个的话转化为数组
        if(!angular.isArray(features)){
          features = [features];
        }

        angular.forEach(features, function (feature){
          //不添加重复警务通号
          for(var i=0,size=$scope.contacts.length;i<size;i++){
            var contact = $scope.contacts[i];
            if(feature.attributes.POLICE_NO/*POLICE_PHONE*/ === contact.code){
              return;
            }
          }

          $scope.contacts.push({
            label: feature.attributes.NAME,
            code: feature.attributes.POLICE_NO//POLICE_PHONE
          });
        });

        $scope.onCall();
        $scope.$apply();
      });

      $rootScope.$on('jwt:message', function (e, msg){
        $scope.error = true;
        $scope.message = '';
        $scope.comment = '';
        $scope.contacts.length = 0;
        $scope.running = false;

        $scope.message = msg.content;

        _.each(msg.contacts, function (contact){
          $scope.contacts.push({
            label: contact.name,
            code: contact.code
          });
        });

        $scope.onCall();
      });

    };

    return {
      restrict:'EA',
      link: linker,
      replace: true,
      scope: {
        contacts: '=?',
        onClose: '&',
        onCall: '&'
      },
      templateUrl: 'app/$directives/msg-sender.html'
    };
  }];
});