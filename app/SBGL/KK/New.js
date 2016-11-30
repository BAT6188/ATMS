define(function (require, exports, module) {
  return ['$scope','$location', 'Restangular', 'Modal','Dept','DictCache', function ($scope,$location, Rest, Modal,Dept,DictCache) {
    $scope.title = '综合管理 > 设备设施管理 > 卡口点位管理 > 新增卡口';

    $scope.record = {
      status:{
              code: 0,
              name:"启用"
              }
    };
  
    // 路段走向
    DictCache('ROAD_TREND', function (dict){
       $scope.trends = dict;
    });

    // 点位性质
    DictCache('POINT_CATEGORY', function (dict){
       $scope.natures = dict;
    });

    // 管辖单位
    DictCache('0037', function (dict){
       $scope.managerDepts = dict;
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
    $scope.save = function (){
      Rest.all('devPoint').post($scope.record).then(function (data){
        if(!data.success){
          alert(data.msg);
        }
        alert('添加成功');
        $location.path('SBGL.KK.Edit/'+ data.results.pointNo);
      });
    };

    $scope.locate = function(){
      Modal('./Locator', $scope.record);
    };

  }];
});