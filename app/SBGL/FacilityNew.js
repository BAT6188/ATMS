define(function (require, exports, module) {
    var controller = ['$scope', '$rootScope','Restangular', 'Query','DictCache','Dept','User','Modal','Dispatch','Point',
        function ($scope, $rootScope,Restangular, Query,DictCache,Dept,User,Modal,Dispatch,Point) {
      $scope.title = '新增设施';
      /*------------------标志标牌---------------------------*/
      //标志类型
      DictCache('0069', function(dicts){
        $scope.signalTypes = dicts;
      });

      //辖区
      DictCache('0036', function(dicts){
        $scope.areas = dicts;
      });

      //安装方式
      DictCache('0067', function(dicts){
        $scope.buildWays = dicts;
      });

      //状态
      DictCache('0070', function(dicts){
        $scope.signalStatus = dicts;
      });

      $scope.record =
       {
        type: {code:'1001',name:'标志标牌'}
      };

/*      $scope.record = {
          code: 'P00001',
          name: '设备1',  
          description: '这是一个设备',
          manageDept: '管理单位-XYZ',     
          maintain: '维护单位-ABC',
          maintainUnitContact: '13888888888', //维护单位联系方式
          constructUnit: '建设单位-123',
          constructUnitContact: '13999999999',  //建设单位联系方式
          type: {code: '1', name: '警告'},       //标志类型
          installation: {code: '1', name: '安装方式1'},   //安装方式
          installationDate:'2013-05-30 00:00:00',   //安装时间        
          area: {code: '1', name: '徐州'},       //辖区
          status: {code: '0', name: '不可用'},     //状态
         // icon: {},
         // pic: 'http://dummyimage.com/480x320/ffcc33/FFF.png&text=ICON',
          roadSection: 'eee',
          lng: 120,
          lat: 30
      };*/
      
      //保存
      $scope.save = function(){
        if(!$scope.record.name){
          alert('名称为必选字段，请输入');
          return;
        }
        Restangular.all('facilityNew').post($scope.record).then(function (data){
          if(data.success){
            Messenger().post({message: '添加成功',type: 'success',showCloseButton: true});
            $scope.record = null;
          }else{
            Messenger().post({message: '添加失败',type: 'error',showCloseButton: true});
          }
        });
      };

      //打开地图选择模态对话框
      $scope.locate = function(){
       Modal('./Locator', $scope.record);
      };
      
      $scope.toggleShow = function(){
        if(!$scope.record.imgUrl) return
        $scope.urls = [$scope.record.imgUrl];
        $scope.showImg = !$scope.showImg;
      };

      //删除图片
      $scope.removeImg = function(){
        var url = $scope.record.imgUrl;
        Restangular.all('deleteFile').post({url:url}).then(function (data){
            if(!data.success){
              Messenger().post({message: '删除图片失败',type: 'error',showCloseButton: true});
            }
            Messenger().post({message: '已成功删除图片',type: 'success',showCloseButton: true});
        });
        $scope.record.imgUrl = '';
        $scope.showImg = false;
      };
    }];

    module.exports = controller;
});