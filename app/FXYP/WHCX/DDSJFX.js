define(function (require, exports, module) {
    var controller = ['$scope', 'DictCache','Query', 'Message','Violation',
     function ($scope, DictCache,Query, Message,Violation) {
        $scope.Q = {/*
            endCLTime: "2014-4-29 20:23:14",*/
            limit: "8",
            page:"1",    
            xxly:'1'/*
            startCLTime:"2014-4-28 20:23:14",*/
        };


        $scope.chartLineData = [];
        $scope.chartLineXAxis = [];
        $scope.chartColumnData = [];
        $scope.chartColumnXAxis = [];


        $scope.tables = [
            {name:'现场',xxly:'1',cls:'btn-zz'},
            {name:'非现场',xxly:'2'}
        ];

        //违法行为数据字典
        DictCache('TRAVEL_STATUS', function(dicts) {
            $scope.behaviors = dicts;
        },true);

        //大队
        Violation.listDaduiList({},function(data){
            if(!data.success){
              alert(data.msg);
              return;
            }
            $scope.depts = data.results;
        });

        // 查询功能
        var _query = function(){
            var q = $scope.Q;
            var cljgCodes = $('#ddSelect').val();
            if(cljgCodes){   
                q.cljgCodes = cljgCodes.join(',');
            }else{
                q.cljgCodes = null;
            }
            if(!q.startCLTime || !q.endCLTime){
                alert('请选择起止时间段');
                return;
            }

            if(q.startCLTime > q.endCLTime){
                alert('开始时间大于结束时间,请重新选择');
                return;
            }
            
            $scope.allChecked = false;
      Violation.listCljg(q, function(data){
        if(data.success){
          $scope.total = data.total;
                    if(data.results.length === 0){
                        alert('没有查询到符合条件的数据！');
                        return;
                    }
          $scope.records = data.results;
                    $scope.chartData();
                    $scope.total = $scope.records.length;
                    $scope.page = 1;
                    $scope.size = $scope.pageSize || 8;
                    $scope.maxSize = 5;
        }
        });
        };

        $scope.toggleActive = function(event){
            $(event['currentTarget']).siblings().removeClass('btn-zz');
            $(event['currentTarget']).addClass('btn-zz');
        };
        
        $scope.pChange = function(page){
            $scope.Q.page = page;
            _query();
        };

        $scope.query = function(){
            $scope.pChange(1);
        };


        //获取x轴值
       $scope.xaxis = function(records,field,sub){
            var xaxi = [];
            angular.forEach(records,function(e){
                if(sub){
                   var a = e[field].replace(sub,'');
                   if(a.length === 0){
                        xaxi.push(e[field]);
                   }else{
                        xaxi.push(a); 
                   }
                   
               }else{
                    xaxi.push(e[field]);
               }
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
            var serie = {type: 'pie',name:'大队数据合计',data:[]};
           
            angular.forEach(datas,function(e){
               serie.data.push([e.cljgmc,e.cs]);
            });
            series.push(serie);
            return series;
        };

        $scope.count = function(records){
            var count = 0;
            angular.forEach(records,function(e){
                count = count + e.cs;
            });
            return count;
        };

        $scope.chartData = function(){
            $scope.chartPieData = [];
            $scope.wfcsTotal = 0;

            //个大队柱状图数据数据
            angular.forEach($scope.records,function(e){
                e.xaxis = $scope.xaxis(e.zhiduis,'cljgmc',e.cljgmc);
                //e.xaxis.unshift(e.name);
                e.series = $scope.yaxis(e.zhiduis,'cs','column');
                //e.series[0].data.unshift(e.cs);
                //e.zdcs =  $scope.count(e.zhiduis);
            });

            //统计总数
            angular.forEach($scope.records,function(e){
                $scope.wfcsTotal = $scope.wfcsTotal + e.cs;
            });

            //饼图数据
            $scope.chartPieData = $scope.pieSeries($scope.records);
        };
    }];

    module.exports = controller;
});