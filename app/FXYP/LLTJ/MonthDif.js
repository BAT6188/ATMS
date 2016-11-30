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
                "cycle":5,
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
/*            FacetFlow.queryFacetCompareFlow($scope.Q,function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                $scope.records = data.results;
                $scope.chartData();
            });*/
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            $scope.selectFacet = zTree.getCheckedNodes(true);

            if($scope.selectFacet.length !== 1){
                alert('只能且必须选取一个断面，请重新选择');
                $scope.removeFlow();
                return;
            }

            if($scope.times.length < 1){
                alert('请选择对比统计时间');
                return;
            }
            $scope.chartData();
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
            FacetFlow.flowCompareTime($scope.Q,function(data){
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

        $scope.records = [
            {
                facetId:'1',         //断面id
                facetName:'sdsd',       //断面名       
                getTime :  '2014-05-01 00:00:00' ,//统计日1 
                facetFlowDatas:[
                    {getTime : '2014-05-02 01:00:00' ,
                    getTimeStr : 1,
                    flow:90,
                    speed:55,
                    occupy: 34    
                    },
                    {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 2,
                    flow:23,
                    speed:34,
                    occupy:12 
                    },
                    {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 3,
                    flow:89,
                    speed:34,
                    occupy:12 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 4,
                    flow:57,
                    speed:33,
                    occupy:11 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 5,
                    flow:33,
                    speed:77,
                    occupy:45 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 6,
                    flow:55,
                    speed:22,
                    occupy:77 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 7,
                    flow:11,
                    speed:33,
                    occupy:44 
                    },
                    {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 8,
                    flow:89,
                    speed:34,
                    occupy:12 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 9,
                    flow:57,
                    speed:33,
                    occupy:11 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 10,
                    flow:33,
                    speed:77,
                    occupy:45 
                    },  
                    {getTime : '2014-05-02 01:00:00' ,
                    getTimeStr : 11,
                    flow:90,
                    speed:55,
                    occupy: 34    
                    },
                    {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 12,
                    flow:23,
                    speed:34,
                    occupy:12 
                    },
                    {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 13,
                    flow:89,
                    speed:34,
                    occupy:12 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 14,
                    flow:57,
                    speed:33,
                    occupy:11 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 15,
                    flow:33,
                    speed:77,
                    occupy:45 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 16,
                    flow:55,
                    speed:22,
                    occupy:77 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 17,
                    flow:11,
                    speed:33,
                    occupy:44 
                    },
                    {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 18,
                    flow:89,
                    speed:34,
                    occupy:12 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 19,
                    flow:57,
                    speed:33,
                    occupy:11 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 20,
                    flow:33,
                    speed:77,
                    occupy:45 
                    },
                     {getTime : '2014-05-02 01:00:00' ,
                    getTimeStr : 21,
                    flow:90,
                    speed:55,
                    occupy: 34    
                    },
                    {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 22,
                    flow:23,
                    speed:34,
                    occupy:12 
                    },
                    {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 23,
                    flow:89,
                    speed:34,
                    occupy:12 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 24,
                    flow:57,
                    speed:33,
                    occupy:11 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 25,
                    flow:33,
                    speed:77,
                    occupy:45 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 26,
                    flow:55,
                    speed:22,
                    occupy:77 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 27,
                    flow:11,
                    speed:33,
                    occupy:44 
                    },
                    {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 28,
                    flow:89,
                    speed:34,
                    occupy:12 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 29,
                    flow:57,
                    speed:33,
                    occupy:11 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 30,
                    flow:33,
                    speed:77,
                    occupy:45 
                    },    
                ]
            },
            {
                facetId:'1',         //断面id
                facetName:'sdsd',       //断面名       
                getTime :  '2014-05-01 01:00:00' ,//统计日1 
                facetFlowDatas:[
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 1,
                    flow:11,
                    speed:33,
                    occupy:44 
                    },
                    {getTime : '2014-05-02 01:00:00' ,
                    getTimeStr : 2,
                    flow:90,
                    speed:55,
                    occupy: 34    
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 3,
                    flow:55,
                    speed:22,
                    occupy:77 
                    },
                    {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 4,
                    flow:89,
                    speed:34,
                    occupy:12 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 5,
                    flow:33,
                    speed:77,
                    occupy:45 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 6,
                    flow:57,
                    speed:33,
                    occupy:11 
                    },
                    {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 7,
                    flow:89,
                    speed:34,
                    occupy:12 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 8,
                    flow:57,
                    speed:33,
                    occupy:11 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 9,
                    flow:33,
                    speed:77,
                    occupy:45 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 10,
                    flow:55,
                    speed:22,
                    occupy:77 
                    },
                                          {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 11,
                    flow:11,
                    speed:33,
                    occupy:44 
                    },
                    {getTime : '2014-05-02 01:00:00' ,
                    getTimeStr : 12,
                    flow:90,
                    speed:55,
                    occupy: 34    
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 13,
                    flow:55,
                    speed:22,
                    occupy:77 
                    },
                    {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 14,
                    flow:89,
                    speed:34,
                    occupy:12 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 15,
                    flow:33,
                    speed:77,
                    occupy:45 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 16,
                    flow:57,
                    speed:33,
                    occupy:11 
                    },
                    {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 17,
                    flow:89,
                    speed:34,
                    occupy:12 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 18,
                    flow:57,
                    speed:33,
                    occupy:11 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 19,
                    flow:33,
                    speed:77,
                    occupy:45 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 20,
                    flow:55,
                    speed:22,
                    occupy:77 
                    },
                                         {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 21,
                    flow:11,
                    speed:33,
                    occupy:44 
                    },
                    {getTime : '2014-05-02 01:00:00' ,
                    getTimeStr : 22,
                    flow:90,
                    speed:55,
                    occupy: 34    
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 23,
                    flow:55,
                    speed:22,
                    occupy:77 
                    },
                    {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 24,
                    flow:89,
                    speed:34,
                    occupy:12 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 25,
                    flow:33,
                    speed:77,
                    occupy:45 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 26,
                    flow:57,
                    speed:33,
                    occupy:11 
                    },
                    {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 27,
                    flow:89,
                    speed:34,
                    occupy:12 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 28,
                    flow:57,
                    speed:33,
                    occupy:11 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 29,
                    flow:33,
                    speed:77,
                    occupy:45 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 30,
                    flow:55,
                    speed:22,
                    occupy:77 
                    },
                ]
            },
        ];
        $scope.chartData();
    }];

    module.exports = controller;
});