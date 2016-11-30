define(function (require, exports, module) {
    var controller = ['$scope', '$location','DictCache','Query', 'Message','Violation',
     function ($scope,$location,DictCache,Query, Message,Violation) {
    //缴费标志
        DictCache('0029_vio', function(dicts) {
            $scope.pays = dicts;
        },true);
        
        $scope.levels = [
            {min:10,max:20,rank:1,reason:'111'},
            {min:20,max:30,rank:2,reason:'222'},
            {min:30,max:40,rank:3,reason:'333'},
            {min:40,max:50,rank:4,reason:'444'}
        ];

        $scope.Q = {limit:10,page:1};
        $scope.q = { limit:10,page:1};
        $scope.chartColumnData = [];
        $scope.chartColumnXAxis = [];

        //违法行为数据字典
        DictCache('0066', function(dicts) {
            $scope.marks = dicts;
        },true);

        // 查询功能
        var _query = function(){
            var q = $scope.Q;
            

            if(!q.startCLTime || !q.endCLTime){
                alert('请选择起止时间段');
                return;
            }

            if(q.startCLTime > q.endCLTime){
                alert('开始时间大于结束时间，请重新选择');
                return;
            }

            if($scope.Q.cs){
                if(isNaN(parseInt($scope.Q.cs))){
                    alert('违法次数必须为数值,请重新填写');
                    $scope.Q.cs = null;
                    return;
                }
            }
            $scope.allChecked = false;
      Violation.listJsrWfCs(q, function(data){
        if(data.success){
          $scope.total = data.total;
                    if(data.results.length === 0){
                        alert('没有符合的数据,尝试重新选择查询条件！');
                        return;
                    }
          $scope.records = data.results;
                    $scope.judges = angular.copy($scope.records.slice(0,10));
                    if($scope.Q.page === 1){
                        $scope.chartData();
                    }
        }
        });
        };


        $scope.pChange = function(page,bool){
            if(bool){
                $scope.q.page = page;
                queryDetail();
            }else{
                $scope.Q.page = page;
                _query();
            }

        };

        $scope.query = function(){
            $scope.pChange(1);
        };

        //获取x轴值
       $scope.xaxis = function(records){
            var xaxi = [];
            angular.forEach(records,function(e){
                xaxi.push(e.dsr);
            });
            return xaxi;
        };

        //根据highcharts拼接y轴值
        $scope.yaxis = function(records,field,type){
            var datas = records;  //断面数组
            var series = [];  //图表数据
            var serie = {type: type,name:'违法车辆分析研判',data:[]};
            angular.forEach(datas,function(e){
               serie.data.push(e[field]);
            });
            series.push(serie);
            return series;
        };


        $scope.chartData = function(){
            $scope.chartPieData = [];
            $scope.chartColumnData = [];
            var chartData = $scope.records.slice(0,10);

            $scope.chartColumnXAxis = $scope.xaxis(chartData);
            $scope.chartColumnData = $scope.yaxis(chartData,'cs','column');

        };

        //查询违法机动车详细
        var queryDetail = function(){
            Violation.listByQueryBean($scope.q, function(data){
                if(data.success){
                    $scope.detailTotal = data.total;
                    $scope.detailRecords = data.results;
                }
            });
        };

        $scope.detail = function(record){
            $scope.checkedDSR = record;
            $scope.q = {
                startCLTime:angular.copy($scope.Q.startCLTime),
                endCLTime:angular.copy($scope.Q.endCLTime),
                limit:10,
                page:1,
                dsr:$scope.checkedDSR.dsr,
                jszh:$scope.checkedDSR.jszh,
                jkbj:angular.copy($scope.Q.jkbj)
            };

            Violation.listByQueryBean($scope.q, function(data){
                if(data.success){
                    $scope.detailTotal = data.total;
                    $scope.detailRecords = data.results;
                    $('#detailModal').modal(open);
                }
            });
        };
        
        //分析研判
        $scope.analysis = function(){
            Violation.listVioAnalyse({id:709}, function(data){
                if(data.success){
                    $scope.levels = data.results;
                    angular.forEach($scope.judges,function(j,i){
                        j.level = _.find($scope.levels, function(l){
                                        return (j.cs > l.min) && (j.cs <= l.max)
                                    });
                    });
                    $("#analysisModal").modal();
                }
            });
        };
    }];

    module.exports = controller;
});