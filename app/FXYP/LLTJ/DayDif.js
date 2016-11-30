define(function (require, exports, module) {
    var controller = ['$scope', 'Query', 'Message','FacetFlow','Facet',
     function ($scope, Query, Message,FacetFlow,Facet) {
                //断面数据，tree数据
        Facet.queryFacet({},function(data){
            if(!data.success){
              alert(data.msg);
              return;
            }
            $scope.facets = data.results;
            angular.forEach($scope.facets,function(e){
                e['id'] = e.facetId;
                e['name'] = e.facetName;
            });

            var beforeClick = function(treeId, treeNode) {
                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                zTree.checkNode(treeNode, !treeNode.checked, null, true);
                return false;
            }
            
            var onCheck= function (e, treeId, treeNode) {
                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                var selects = zTree.getCheckedNodes(true);
                v = "";
                angular.forEach(selects,function(e){
                     v += e.name + ",";
                });

                if (v.length > 0 ) v = v.substring(0, v.length-1);
                var cityObj = $("#flowInput");
                cityObj.attr("value", v);
            }

            $scope.showMenu = function() {
                var cityObj = $("#flowInput");
                var cityOffset = $("#flowInput").offset();
                $("#menuContent").css({left:cityOffset.left + "px", top:cityOffset.top - 50+ cityObj.outerHeight() + "px"}).slideDown("fast");

                $("body").bind("mousedown", onBodyDown);
            }
            var  hideMenu = function() {
                $("#menuContent").fadeOut("fast");
                $("body").unbind("mousedown", onBodyDown);
            }
            var  onBodyDown = function(event) {
                if (!(event.target.id === "menuBtn" || event.target.id === "citySel" || event.target.id === "menuContent" || $(event.target).parents("#menuContent").length>0)) {
                    hideMenu();
                }
            }

            var setting = {
                check: {
                    enable: true,
                    chkboxType: {"Y":"", "N":""}
                },
                view: {
                    dblClickExpand: false
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    beforeClick: beforeClick,
                    onCheck: onCheck
                }
            };
            $.fn.zTree.init($("#treeDemo"), setting, $scope.facets);
        });

        $scope.Q ={
                "facetId":1,
                "cycle":60,
                "queryTimes":["2014-05-17 00:00:00","2014-05-18 00:00:00"]
                }

        $scope.times = [];
        //添加时间
        $scope.addTime = function(){
            var newTime = $scope.newTime;
            if(!newTime) return
            if(!_.contains($scope.times,newTime)){
                $scope.times.push(angular.copy(newTime));
            }
            $scope.newTime = null;
        };

        //移除所选断面
        $scope.removeFlow = function(){
            var cityObj = $("#flowInput");
            cityObj.attr("value", '');
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            zTree.checkAllNodes(false);
        };

        //分析
        $scope.analyze = function(){
/*            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            $scope.selectFacet = zTree.getCheckedNodes(true);

            if($scope.selectFacet.length !== 1){
                alert('只能且必须选取一个断面，请重新选择');
                $scope.removeFlow();
                return;
            }

            if($scope.times.length < 1){
                alert('请选择对比统计时间');
                return;
            }*/

            FacetFlow.flowCompareTime($scope.Q,function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                $scope.records = data.results;
                $scope.chartData();
            });
        };
        
        $scope.chartLineData = [];
        $scope.chartLineXAxis = [];

        //处理图表数据
        $scope.chartData = function(){
            $scope.chartLineXAxis =  $scope.xaxis($scope.records[0].facetFlowDatas,'getTimeStr',11);
            $scope.chartLineData = $scope.yaxis($scope.records,'flow','line');
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
                var serie = {type: type,name:e.getTime,data:[]};
                angular.forEach(e.facetFlowDatas,function(f){
                    serie.data.push(f['flow']);
                });
                series.push(serie);
            });
            
            return series;
        };

/*        $scope.records = [
            {
                facetId:'1',         //断面id
                facetName:'qwqw',       //断面名
                getTime:'2013-01-14',            //统计日1
                facetFlowDatas:[
                {getTimeStr:'00:00-01:00',flow:10},   //分时段流量数据，
                {getTimeStr:'01:00-02:00',flow:40},
                {getTimeStr:'02:00-03:00',flow:23},
                {getTimeStr:'03:00-04:00',flow:55},
                {getTimeStr:'04:00-05:00',flow:9},
                {getTimeStr:'05:00-06:00',flow:11}
                ]
            },
            {
                facetId:'2',         //断面id
                facetName:'qwqw',       //断面名
                getTime:'2013-02-14',            //统计日1
                facetFlowDatas:[
                {getTimeStr:'00:00-01:00',flow:3},   //分时段流量数据，
                {getTimeStr:'01:00-02:00',flow:45},
                {getTimeStr:'02:00-03:00',flow:60},
                {getTimeStr:'03:00-04:00',flow:34},
                {getTimeStr:'04:00-05:00',flow:12},
                {getTimeStr:'05:00-06:00',flow:8}
                ]
            }
        ]; */
       // $scope.allDate(); 
    }];

    module.exports = controller;
});