define(function (require, exports, module) {
    var controller = ['$scope','Restangular' ,'Query', 'Message','Violation','DictCache',
     function ($scope, Restangular,Query, Message,Violation,DictCache) {
        
/*        var testQ  = {
            fxjg:"320311000000"
            queryTimes:["2014-05-08", "2014-05-09"]   
            queryType:"0"  
            tableType:"0"  
            wfxw:"10393"
        };
        */
        $scope.field = 'flow';
        $scope.dataFormat = 'yyyy-MM-dd';

        $scope.periods = [
                {name:'日对比',queryType:'0',len:10,cls:'btn-zz',xaxi:systemConfig.getSystemValue('HOURS')},
                {name:'月对比',queryType:'1',len:7,xaxi:systemConfig.getSystemValue('DAYS')},
                {name:'年对比',queryType:'2',len:4,xaxi:systemConfig.getSystemValue('MONTHS')}
        ];

        $scope.tables = [
            {name:'现场',tableType:'1',cls:'btn-zz'},
            {name:'非现场',tableType:'0'}
        ];

        $scope.period = $scope.periods[0];
        $scope.table = $scope.tables[0];

        $scope.Q = {
            /*fxjg:"320316000000", */ 
            queryTimes:[/*"2014-4-22 00:00:00", "2014-4-24 00:00:00"*/],    
            /*wfxw:"10834",*/
            queryType:$scope.period.queryType,
            tableType:'1'
            /*tableType:$scope.table.tableType*/
        };

        //违法行为
        $scope.getWFXW = function(){
            Violation.listWfxwNew({tableType:$scope.Q.tableType},function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                $scope.behaviorAble = false;
                $scope.behaviors = data.results;
                $scope.selectWFXW = [$scope.behaviors[0].wfxw];
                console.log($scope.selectWFXW);
                //$scope.Q.wfxw = $scope.behaviors[0].wfxw;
            });
        };

        //大队
        $scope.getDD = function(){
            Violation.listDaduiList($scope.Q,function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                $scope.deptAble = false;
                $scope.depts = data.results;
                $scope.selectDepts = [$scope.depts[0].deptCod];
                //$scope.Q.fxjg = $scope.depts[0].deptCode;
            });
        };


        $scope.$watch('period', function(){
            $scope.Q.queryType = $scope.period.queryType;   //修改统计周期
            $scope.dataFormat = $scope.period.format;   //修改日期格式
            $scope.Q.queryTimes = [];
        });

        $scope.toggleActive = function(event){
            $(event['currentTarget']).siblings().removeClass('btn-zz');
            $(event['currentTarget']).addClass('btn-zz');
        };
    
        //添加统计时间
        $scope.addTime = function(){
            var newTime = $scope.newTime;
            if(!newTime) return
            if(!_.contains($scope.Q.queryTimes,newTime)){
                $scope.Q.queryTimes.push(angular.copy(newTime));
            }
            $scope.newTime = null;
        };


        //查询统计
        $scope.analyze = function(){
            $scope.Q.fxjg = $("#ddSelect").val();


            if($scope.Q.queryTimes.length === 0){
                alert('请选择对比时间');
                return;
            }
            if(!$scope.Q.fxjg){
                alert('请选择大队信息');
                return;
            }

            if(!$scope.Q.queryType){
                alert('请选择分析类型');
                return;
            }

            if(!$scope.Q.wfxw){
                alert('请选择违法行为');
                return;
            }

            Violation.listCompareTime($scope.Q,function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                $scope.records = data.results;
                if($scope.records.length < 1){
                    alert('没有查询到数据');
                    return;
                }
                $scope.chartData();
            });
        };
        
        $scope.chartLineData = [];
        $scope.chartLineXAxis = [];

        //处理图表数据
        $scope.chartData = function(){
            var xaxi = $scope.period.xaxi;
            $scope.chartLineXAxis =  xaxi ;
            $scope.chartLineData = $scope.yaxis($scope.records,'cs','line');
        };

        //请求所有数据
        $scope.allDate = function(){
            FacetFlow.queryFacetCompareFlow($scope.Q,function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                $scope.records = data.results;
                $scope.chartData();
                //$scope.records = $scope.filterData(records);
            });
        };
        //获取x轴值
       $scope.xaxis = function(records,field,length){
            var xaxi = [];
            angular.forEach(records,function(e){
                xaxi.push(e[field]);
            });
            return xaxi;
        };

        //根据highcharts拼接y轴值
        $scope.yaxis = function(records,field,type){
            var records = records;  //断面数组
            var series = [];  //图表数据

            angular.forEach(records,function(e){
                var serie = {type: type,name:e.wfsj.slice(0,$scope.period.len),data:[]};
                angular.forEach(e.zhiduis,function(f){
                    serie.data.push(f[field]);
                });
                series.push(serie);
            });
            
            return series;
        };

        $scope.getWFXW();
        $scope.getDD();
    }];

    module.exports = controller;
});