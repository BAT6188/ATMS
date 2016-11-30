define(function (require, exports, module) {
  return ['$scope', 'Restangular','$routeParams','$location', 'Modal','DictCache','Dept',
   function ($scope, Rest, $routeParams,$location,Modal,DictCache,Dept) {
    $scope.title = '综合管理 > 设备设施管理 > 卡口点位管理 > 编辑卡口';

    
    // 路段走向
    DictCache('ROAD_TREND', function (dict){
       $scope.trends = dict;
    });

    // 点位性质
    DictCache('POINT_CATEGORY', function (dict){
       $scope.natures = dict;
    });
  
    // 点位状态
    DictCache('POINT_STATUS', function (dict){
       $scope.statuses = dict;
    });
    // 管辖单位
    DictCache('0037', function (dict){
       $scope.managerDepts = dict;
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

      Rest.all('').one('devPoint',$scope.record.pointNo).doPUT($scope.record).then(function (data){
        if(!data.success){
          alert(data.msg);
        }
        alert('更新成功');
      });
    };


    Rest.all('devPoint').get($routeParams.id).then(function (data){
      if(!data.success){
        alert(data.msg);
      }
      $scope.record = data.results;

      Dept.query({}, function(data) {
        $scope.department = data.results;
        $scope.manager = _.find($scope.department, function(d){ return d.deptCode === $scope.record.managerCode; });
      });
    });

    $scope.locate = function(){
      Modal('./Locator', $scope.record);
    };
    $scope.remove = function(){
        Rest.one('devPoint',$routeParams.id).doDELETE().then(function(data){
          if(data.success){
            alert('删除成功');
            $scope.record = null;
            $location.path( 'XXFB.CMS.CmsList');
          }else{
            alert('删除失败');
          }
        });
    };
  }];
});