define(function (require, exports, module) {
  return ['$scope','$location','$routeParams', 'Restangular', 'Modal','Dept','DictCache', 
    function ($scope,$location,$routeParams, Rest, Modal,Dept,DictCache) {

    Rest.all('deviceNew').get($routeParams.id).then(function (data){
      if(!data.success){
        alert(data.msg);
      }
      $scope.record = data.results;
      $scope.origin = angular.copy($scope.record);
      $scope.title = ' 编辑' +'【'+ $scope.record.type.name +': ' + $scope.record.name + '】' ;
    });  
//-----------------------卡口数据字典--------------------------------
    // 设备大类
    DictCache('0005', function (dict){
      $scope.statuses = dict;
    });
    // 线路维护厂商
    DictCache('DEVICE_LINE_MAINTAIN', function (dict){
       $scope.lineMaintains = dict;
    });
    // 路段走向
    DictCache('ROAD_TREND', function (dict){
       $scope.trends = dict;
    });

    //点位类型
    DictCache('POINT_CATEGORY', function (dict){
       $scope.pointTypes = dict;
    });
    
    // 管辖单位
    DictCache('0037', function (dict){
       $scope.managerDepts = dict;
    });
  //------------------------诱导屏字典数据---------------------------------
    // 诱导屏性质
    DictCache('0052', function (dict){
       $scope.cmsTypes = dict;
    });

    Dept.query({}, function(data) {
      $scope.department = data.results;
    });
    
    $scope.$watch('manager',function(){
      if($scope.manager){
        $scope.record.managerName = $scope.manager.name;
        $scope.record.managerCode = $scope.manager.code;
      }
    });

    //行政区
    $scope.dists = [
        {code:'320302',name:'鼓楼区',roads:[]},
        {code:'320303',name:'云龙区',roads:[]},
        {code:'320304',name:'九里区',roads:[]},
        {code:'320305',name:'贾汪区',roads:[]},
        {code:'320311',name:'泉山区',roads:[]}
    ];

    //更新
    $scope.save = function (){
      if($scope.record === $scope.origin){
          alert('没有任何修改');
          return;
      }
      Rest.all('').one('deviceNew',$scope.record.id).doPUT($scope.record).then(function (data){
        if(!data.success){
          alert(data.msg);
        }
        alert('更新成功');
        $scope.record = data.results;
        $scope.origin = angular.copy($scope.record);
      });
    };

    //更新
    $scope.remove = function(){
      Rest.one('deviceNew',$routeParams.id).doDELETE().then(function(data){
        if(data.success){
          alert('删除成功');
          $scope.record = null;
          $location.path( 'SBGL.DeviceList');
        }else{
          alert('删除失败');
        }
      });
    };
    $scope.locate = function(){
      Modal('./Locator', $scope.record);
    };

  }];
});