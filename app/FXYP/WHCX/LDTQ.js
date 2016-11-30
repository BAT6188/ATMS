define(function (require, exports, module) {
    var controller = ['$scope', 'Query', 'Message','Violation',
     function ($scope, Query, Message,Violation) {
        $scope.periods = [
                {name:'日对比',queryType:'0',cls:'btn-zz',idx:10,xaxi:systemConfig.getSystemValue('HOURS')},
                {name:'月对比',queryType:'1',idx:7,xaxi:systemConfig.getSystemValue('DAYS')},
                {name:'年对比',queryType:'2',idx:4,xaxi:systemConfig.getSystemValue('MONTHS')}
        ];

        $scope.tables = [
            {name:'非现场',tableType:'0',cls:'btn-zz'},
            {name:'现场',tableType:'1'}
        ];

        $scope.period = $scope.periods[0];
        $scope.ldDisabled = true;
        $scope.title = "图表";
        $scope.Q = {
            queryTimes:[],
            queryType: "0",
            tableType:"0"
/*            lddm:"6201",
            wfdd:"00003",*/
            /*xzqh:'320316'*/
        };

        //行政区
        $scope.dists = [
            {code:'320302',name:'鼓楼区',roads1:[],roads0:[]},
            {code:'320303',name:'云龙区',roads1:[],roads0:[]},
            {code:'320304',name:'九里区',roads1:[],roads0:[]},
            {code:'320305',name:'贾汪区',roads1:[],roads0:[]},
            {code:'320311',name:'泉山区',roads1:[],roads0:[]}
        ];


        //请求所有路段数据
        angular.forEach($scope.dists,function(d){
            Violation.listRoadMsg({xzqh:d.code,tableType:0},function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                $scope.ldDisabled = false;
                d.roads0 = data.results.slice(0,10);
            });

            Violation.listRoadMsg({xzqh:d.code,tableType:1},function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                $scope.ldDisabled = false;
                d.roads1 = data.results;
            });
        });

        
        $scope.$watchCollection('[xzqh,Q.tableType]', function(){
            if(!$scope.xzqh) return
            var dist =  _.find($scope.dists, function(d){ return d.code === $scope.xzqh;});

            if($scope.Q.tableType == '0' || $scope.Q.tableType == 0){
                $scope.addrs = dist.roads0.slice(0,10);
                $scope.q = {};
                return
            }

            if($scope.Q.tableType == '1' || $scope.Q.tableType == 1){
                $scope.addrs = dist.roads1;
                $scope.q = {};
                return
            }

            $scope.ldDisabled = true;
            Violation.listRoadMsg({xzqh:$scope.xzqh,tableType:$scope.Q.tableType},function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                $scope.ldDisabled = false;
                $scope.addrs = data.results.slice(0,10);
            });
        });

        //切换高亮按钮
        $scope.toggleActive = function(event){
            $(event['currentTarget']).siblings().removeClass('btn-zz');
            $(event['currentTarget']).addClass('btn-zz');
        };

        $scope.$watch('period', function(){
            $scope.Q.queryType = $scope.period.queryType;   //修改统计周期
            $scope.Q.queryTimes = [];
        });

        //切换统计周期
        $scope.changePeriod = function($event,p){
            $scope.toggleActive($event);    //改变高亮
            $scope.Q.queryType = p.queryType;   //修改统计周期
            $scope.Q.queryTimes = [];
            $scope.period = p;
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

            if($scope.Q.queryTimes.length < 1){
                alert('请选择对比统计时间');
                return;
            }

            if(!$scope.Q.queryType){
                alert('请选择统计类型');
                return;
            }

            if(!$scope.Q.tableType){
                alert('请选择数据来源类型(现场或非现场)');
                return;
            }

            if(!$scope.q){
                alert('请选择违法路段');
                return;
            }
            
            if(!$scope.q.lddm || !$scope.q.wfdd || !$scope.q.xzqh){
                alert('请选择违法路段');
                return;
            }

            $scope.Q.xzqh = $scope.q.xzqh;
            $scope.Q.wfdd = $scope.q.wfdd;
            $scope.Q.lddm = $scope.q.lddm;

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


        //获取x轴值
       $scope.xaxis = function(records,field,length){
            var xaxi =systemConfig.getSystemValue('HOURS');
/*            angular.forEach(records,function(e){
                angular.forEach(e.zhiduis,function(f){
                    if(!_.contains(xaxi, f[field]) ){
                        xaxi.push(f[field]);
                    }
                });
            });*/
            return xaxi;
        };

        //根据highcharts拼接y轴值
        $scope.yaxis = function(records,field,type){
            var records = records;  //断面数组
            var series = [];  //图表数据

            angular.forEach(records,function(e){
                var len = $scope.period.idx || 0;
                var serie = {type: type,name:e.wfsj.slice(0,len),data:[]};
                angular.forEach(e.zhiduis,function(f){
                    serie.data.push(f[field]);
                });
                series.push(serie);
            });
            
            return series;
        };

        //处理图表数据
        $scope.chartData = function(){
            var xaxi = $scope.period.xaxi;
            $scope.chartLineXAxis =  xaxi ;
            $scope.chartLineData = $scope.yaxis($scope.records,'cs','line'); 
        };


        //$scope.chartData();
    }];

    module.exports = controller;
});