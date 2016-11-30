define(function (require, exports, module) {
    var controller = ['$scope', 'Query', 'Message','FacetFlow','Facet','$filter',
     function ($scope, Query, Message,FacetFlow,Facet,$filter) {
        $scope.selectName = 'facetName';
        //统计周期
        $scope.periods = [
                {name:'5分钟对比',cycle:5,cls:'btn-zz',format:'yyyy-MM-dd hh',idx:13,xaxi:systemConfig.getSystemValue('MINUTE5')},
                {name:'日对比',cycle:60,format:'yyyy-MM-dd',idx:10,xaxi:systemConfig.getSystemValue('HOURS')},
                {name:'月对比',cycle:1440,format:'yyyy-MM',idx:7,xaxi:systemConfig.getSystemValue('DAYS')}
        ];

        //统计字段
        $scope.fields = [
                {name:'流量',code:'flow',cls:'btn-zz',ytitle:'过车数(辆)'},
                {name:'速度',code:'speed',ytitle:'速度(km/h)'},
                {name:'占有率',code:'occupy',ytitle:'占有率(%)'}
        ];

        $scope.field = $scope.fields[0];
        $scope.period = $scope.periods[0]

        $scope.title = "图表";
        $scope.dataFormat = 'yyyy-MM-dd hh';
        $scope.Q = {
            cycle : $scope.period.cycle || 5,
            queryTimes :[],
            /*facetId:'1'*/
        };

        $scope.$watch('period', function(){
            $scope.Q.cycle = $scope.period.cycle;    //修改统计周期
            $scope.dataFormat = $scope.period.format;   //修改日期格式
            $scope.Q.queryTimes = [];
            $scope.times = [];
        });

        $scope.changeField = function($event,p){
            $scope.toggleActive($event);
            $scope.field = p;
            $scope.chartData();
        };

        $scope.toggleActive = function(event){
            $(event['currentTarget']).siblings().removeClass('btn-zz');
            $(event['currentTarget']).addClass('btn-zz');
        };

        //断面数据，tree数据，tree事件
        Facet.queryFacet({},function(data){
            if(!data.success){
              alert(data.msg);
              return;
            }
            $scope.facets = data.results;

        });
    
        //添加统计时间
        $scope.addTime = function(){
            var newTime = $scope.newTime;
            if(!newTime) return
            if(!_.contains($scope.times,newTime)){
                $scope.times.push(angular.copy(newTime));
            }
            $scope.newTime = null;
        };

        //查询统计
        $scope.analyze = function(){
            $scope.selectFacet = $("#facetSelect").val();
            if(!$scope.selectFacet){
                alert('请选取一个断面');
                return;
            }

            $scope.Q.queryTimes = [];
            switch($scope.period.cycle){
                    case 5:
                        angular.forEach($scope.times,function(t){
                            t = t.concat(':00:00');
                            $scope.Q.queryTimes.push(t);
                        });
                        break;
                    case 60:
                        angular.forEach($scope.times,function(t){
                            t = t.concat(' 00:00:00');
                            $scope.Q.queryTimes.push(t);
                        });
                        break;
                    case 1440:
                        angular.forEach($scope.times,function(t){
                            t = t.concat('-01 00:00:00');
                            $scope.Q.queryTimes.push(t);
                        });
                        break;
            }

            if($scope.Q.queryTimes.length < 1){
                alert('请选择对比统计时间');
                return;
            }

            $scope.Q.facetId = $scope.selectFacet;

            FacetFlow.flowCompareTime($scope.Q,function(data){
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
            var field = $scope.field.code;
            var xaxi = $scope.period.xaxi;
            $scope.YTitle = $scope.field.ytitle;
            $scope.chartLineXAxis =  xaxi;
            $scope.chartLineData = $scope.yaxis($scope.records,field,'line');
            //$scope.title = '【' + $scope.records[0].facetName +'】'+ $scope.period.name + '同期对比分析';
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
       $scope.xaxis = function(){
            var xaxi = $scope.period.xaxi;
           /* angular.forEach(records,function(e){
                xaxi.push(e[field]);
            });*/
            return xaxi;
        };

        //根据highcharts拼接y轴值
        $scope.yaxis = function(records,field,type){
            var records = records;  //断面数组
            var series = [];  //图表数据
            var len = $scope.period.idx;
            angular.forEach(records,function(e){
                var serie = {type: type,name:e.getTime.slice(0,len),data:[]};
                angular.forEach(e.facetFlowDatas,function(f){
                    if(field === 'occupy'){
                        var n = f[field]*100;
                        n.toFixed(2);
                        serie.data.push(n);
                    }else{
                        serie.data.push(f[field]);
                    } 
                });
                series.push(serie);
            });
            
            return series;
        };

    }];

    module.exports = controller;
});