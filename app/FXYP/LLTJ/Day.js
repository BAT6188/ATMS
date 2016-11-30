define(function (require, exports, module) {
    var controller = ['$scope', 'Query', 'Message','FacetFlow','Facet',
     function ($scope, Query, Message,FacetFlow,Facet) {
        //$scope.facets = [{facetId:805,facetName:'kk'},{facetId:806,facetName:'hkk'}];
        $scope.showTypes = [{name:'列表',value:'list'},{name:'柱状图',value:'column'},
                             {name:'曲线图',value:'line'}];
        $scope.showType =  'line' ;
        /* ---------用于分页----------*/
        $scope.page = 1;
        $scope.size = 10;
        $scope.maxSize = 5;
        //断面数据，tree数据
        Facet.queryFacet({},function(data){
            if(!data.success){
              alert(data.msg);
              return;
            }
            $scope.facets = data.results;
        });
        
        //更改统计形式
        $scope.changeType = function(){
            switch($scope.showType){
                case 'list':
                    break;
                case 'line':
                    $scope.chartData('line');
                    break;
                case 'column':
                    $scope.chartData('column');
            }

        };
        
        $scope.Q = {/*
            "facetIds":"1,2,3",*/
            "cycle":1440,/*
            "queryTime":"2014-05-19 00:00:00"*/
            };
        
        $scope.chartLineData = [];
        $scope.chartLineXAxis = [];
        $scope.chartColumnData = [];
        $scope.chartColumnXAxis = [];

        $scope.chartData = function(type){
            $scope.chartLineData = [];
            if(type === 'line'){
                $scope.chartLineXAxis =  $scope.xaxis($scope.records,'getTimeStr',11);
                $scope.chartLineData = $scope.yaxis($scope.records,'flow',type);
            }else if(type === 'column'){
                $scope.chartColumnXAxis = $scope.xaxis($scope.records,'getTimeStr',11);
                $scope.chartColumnData = $scope.yaxis($scope.records,'flow',type);
            }
        };

        //请求所有数据
        $scope.allDate = function(){
            FacetFlow.flowCompareFacet($scope.Q,function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                $scope.records = data.results;
                $scope.changeType();
            });
        };

        //获取x轴值
       $scope.xaxis = function(records,field,length){
            var xaxi = systemConfig.getSystemValue('DAYS');
/*            angular.forEach(records,function(e){
                xaxi.push(e[field]);
            })*/;
            return xaxi;
        };

        //根据highcharts拼接y轴值
        $scope.yaxis = function(records,field,type){
            var records = records;  
            var series = [];  

            angular.forEach(records,function(e){
                var serie = {type: type,name:e.facetName,data:[]};
                angular.forEach(e.facetFlowDatas,function(f){
                    serie.data.push(f['flow']);
                });
                series.push(serie);
            });
            
            return series;
        };
       // $scope.allDate();

        $scope.getSelect = function(){
            var ids = $("#facetSelect").val();

            if(!ids || ids.length < 1){
                alert('请选择断面数据');
                return;
            }
            
            if(!$scope.Q.queryTime){
                alert('请选择分析时间');
                return;
            }


            $scope.Q.queryTime = $scope.Q.queryTime.concat('-01 00:00:00');

            $scope.Q.facetIds = [];
            $scope.Q.facetIds = ids.join(',');
            
            $scope.allDate();
        };
        //$scope.allDate();
    }];

    module.exports = controller;
});