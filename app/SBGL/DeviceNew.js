define(function (require, exports, module) {
  return ['$scope','$location', 'Restangular', 'Modal','Dept','DictCache',
   function ($scope,$location, Rest, Modal,Dept,DictCache) {
    $scope.title = '新增设备';

    $scope.init = function(){
      $scope.record = {};
      $scope.cms = {type: {code:3,name:'诱导显示屏'}};
      $scope.kk = {type: {code:5,name:'卡口'}};
      $scope.video = {type: {code:2,name:'视频摄像机'}};
      $scope.signal = {type: {code:1,name:'信号控制机'}};

      console.log($scope.curt);

      if(!$scope.curt){
        $scope.temp = $scope.cms;   //设备特有属性
        $scope.curt = angular.copy($scope.temp); //标志当前类型设备
      }else{
        $scope.getCurt($scope.curt.type.code);   //设备特有属性
      }
    };

    $scope.init();
    // 线路维护厂商
    DictCache('DEVICE_LINE_MAINTAIN', function (dict){
       $scope.lineMaintains = dict;
    });
    //-----------------------卡口数据字典--------------------------------

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

/*    Dept.query({}, function(data) {
      $scope.department = data.results;
    });*/
    //------------------------诱导屏字典数据---------------------------------
    // 诱导屏类型
    DictCache('0052', function (dict){
       $scope.cmsTypes = dict;
    });

    //------------------------视频字典数据---------------------------------
    // 视频类型
    DictCache('VIDEO_CATEGORY', function (dict){
       $scope.videoTypes = dict;
    });

    //使用情况字典
    DictCache("0007", function(dict){
        $scope.useStatuss = dict;
    }, true);

    //通信方式
    DictCache("0006", function(dict){
        $scope.comModels = dict;
    });

    //切换标签页
    $scope.changeTab = function(code){
      switch(code){
        case "3": 
          $scope.temp = $scope.cms;
          $scope.curt = angular.copy($scope.cms);
          break;
        case "1":
          $scope.temp = $scope.signal;
          $scope.curt = angular.copy($scope.signal);
          break;
        case "2":
          $scope.temp = $scope.video;
          $scope.curt = angular.copy($scope.video);
          break;
        case "5":
          $scope.temp = $scope.kk;
          $scope.curt = angular.copy($scope.kk);
          break;
      }
    };

    $scope.getCurt = function(code){
      switch(code){
        case "3": 
          $scope.temp = $scope.cms;
          break;
        case "1":
          $scope.temp = $scope.signal;
          break;
        case "2":
          $scope.temp = $scope.video;
          break;
        case "5":
          $scope.temp = $scope.kk;
          break;
        case 3: 
          $scope.temp = $scope.cms;
          break;
        case 1:
          $scope.temp = $scope.signal;
          break;
        case 2:
          $scope.temp = $scope.video;
          break;
        case 5:
          $scope.temp = $scope.kk;
          break;

        default:
          $scope.temp = $scope.cms;
      }
      console.log($scope.temp);
    };
    //行政区
    $scope.dists = [
        {code:'320302',name:'鼓楼区',roads:[]},
        {code:'320303',name:'云龙区',roads:[]},
        {code:'320304',name:'九里区',roads:[]},
        {code:'320305',name:'贾汪区',roads:[]},
        {code:'320311',name:'泉山区',roads:[]}
    ];


    $scope.save = function (){
      $scope.record = _.extend($scope.record,$scope.temp);
      if(!$scope.record.name){
        alert('名称为必输字段，请输入');
        return;
      }

      if($scope.record.type.code = "3" || $scope.record.type.code = 3){
            if(!/^\d+$/.test($scope.record.name)){
              alert('诱导屏编号必须为数字,请重新输入');
              return;
            }
      }

      Rest.all('deviceNew').post($scope.record).then(function (data){
        if(!data.success){
          alert(data.msg);
          return;
        }
        alert('添加成功');
        $scope.init();
      });
    };

    $scope.locate = function(){
      Modal('./Locator', $scope.record);
    };

  }];
});