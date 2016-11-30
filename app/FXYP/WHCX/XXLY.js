define(function (require, exports, module) {
    var controller = ['$scope', 'DictCache','Query', 'Message','Violation',
     function ($scope, DictCache,Query, Message,Violation) {
        $scope.Q = {
            limit: "8",
            page:"1", 
        };

        $scope.chartLineData = [];
        $scope.chartLineXAxis = [];
        $scope.chartColumnData = [];
        $scope.chartColumnXAxis = [];

        //违法行为数据字典
        DictCache('0002_vio', function(dicts) {
            $scope.types = dicts;
        },true);

        // 查询功能
        var _query = function(){
            var q = $scope.Q;

            if(!q.startCLTime || !q.endCLTime){
                alert('请选择起止时间段');
                return;
            }
            if(q.startCLTime > q.endCLTime){
                alert('开始时间大于结束时间,请重新选择');
                return;
            }
            $scope.allChecked = false;
      Violation.listByXxly(q, function(data){
        if(data.success){
          $scope.total = data.total;
                    if(data.results.length === 0){
                        alert('没有符合的数据,尝试重新选择查询条件！');
                        return;
                    }
          $scope.records = data.results;
                    $scope.chartData();
        }
        });
        };


        $scope.pChange = function(page){
            $scope.Q.page = page;
            _query();
        };

        $scope.query = function(){
            $scope.pChange(1);
        };

        //获取x轴值
       $scope.xaxis = function(records){
            var xaxi = [];
            angular.forEach(records,function(e){
                var code ;
                code = (e.xxly) ? e.xxly.name : '暂缺';
                xaxi.push(code);
            });

            return xaxi;
        };

        //根据highcharts拼接y轴值
        $scope.yaxis = function(records,field,type){
            var datas = records;  //断面数组
            var series = [];  //图表数据
            var serie = {type: type,name:'已处理数',data:[]};
            angular.forEach(datas,function(e){
               serie.data.push(e[field]);
            });
            series.push(serie);
            return series;
        };

        $scope.pieSeries = function(records){
            var datas = records;
            var series = [];
            var serie = {type: 'pie',name:'已处理百分比',data:[]};
           
            angular.forEach(datas,function(e){
                var code;
                var count;
                code = (e.xxly) ? e.xxly.name : '暂缺';
                count = (e.cs) ? e.cs : 0;
               serie.data.push([code,count]);
            });
            series.push(serie);
            return series;
        };

        $scope.chartData = function(){
            $scope.chartPieData = [];
            $scope.chartColumnData = [];
            var chartData = $scope.records;
            $scope.chartPieData = $scope.pieSeries(chartData,'cs','line');

            $scope.chartColumnXAxis = $scope.xaxis(chartData);
            $scope.chartColumnData = $scope.yaxis(chartData,'cs','column');

        };
      
    }];

    module.exports = controller;
});