define(function (require, exports, module) {
    var controller = ['$scope', 'Query', 'Message','FacetFlow','Facet',
     function ($scope, Query, Message,FacetFlow,Facet) {
        $scope.field = {name:'流量',code:'flow',cls:'btn-zz'};
        $scope.period = {name:'5分钟',cycle:5,cls:'btn-zz',format:'yyyy-MM-dd hh'};

        $scope.title = "图表";
        $scope.dataFormat = 'yyyy-MM-dd hh:mm:ss';
        $scope.Q = {
            cycle : $scope.period.cycle || 5,
            queryTimes :[],
            /*facetId:'1'*/
        };

        $scope.periods = [
                {name:'5分钟',cycle:5,cls:'btn-zz',format:'yyyy-MM-dd hh'},
                {name:'24小时',cycle:60,format:'yyyy-MM-dd'},
                {name:'30天',cycle:1440,format:'yyyy-MM'}
        ];

        $scope.fields = [
                {name:'流量',field:'flow',cls:'btn-zz'},
                {name:'速度',field:'speed'},
                {name:'占有率',field:'occupy'}
        ];

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
    
        //添加统计时间
        $scope.addTime = function(){
            var newTime = $scope.newTime;
            if(!newTime) return
            if(!_.contains($scope.Q.queryTimes,newTime)){
                $scope.Q.queryTimes.push(angular.copy(newTime));
            }
            $scope.newTime = null;
        };

        //移除所选断面
        $scope.clearFacet = function(){
            var cityObj = $("#flowInput");
            cityObj.attr("value", '');
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            zTree.checkAllNodes(false);
        };

        //查询统计
        $scope.analyze = function(){
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            $scope.selectFacet = zTree.getCheckedNodes(true);

            if($scope.selectFacet.length !== 1){
                alert('只能且必须选取一个断面，请重新选择');
                $scope.clearFacet();
                return;
            }

            if($scope.Q.queryTimes.length < 1){
                alert('请选择对比统计时间');
                return;
            }

            $scope.Q.facetId = $scope.selectFacet[0].facetId;

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
            $scope.chartLineXAxis =  $scope.xaxis($scope.records[0].facetFlowDatas,'getTimeStr',11);
            $scope.chartLineData = $scope.yaxis($scope.records,$scope.field.code,'line');
            $scope.title = '【' + $scope.records[0].facetName +'】'+ $scope.period.name + '同期对比分析';
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
                    serie.data.push(f[field]);
                });
                series.push(serie);
            });
            
            return series;
        };

/*        $scope.records = [
            {
                facetId:'1',         //断面id
                facetName:'sdsd',       //断面名       
                getTime :  '2014-05-01 00:00:00' ,//统计日1 
                facetFlowDatas:[
                    {getTime : '2014-05-02 01:00:00' ,
                    getTimeStr : 05,
                    flow:90,
                    speed:55,
                    occupy: 34    
                    },
                    {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 10,
                    flow:23,
                    speed:34,
                    occupy:12 
                    },
                    {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 15,
                    flow:89,
                    speed:34,
                    occupy:12 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 20,
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
                    getTimeStr : 30,
                    flow:55,
                    speed:22,
                    occupy:77 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 35,
                    flow:11,
                    speed:33,
                    occupy:44 
                    },
                    {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 40,
                    flow:89,
                    speed:34,
                    occupy:12 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 45,
                    flow:57,
                    speed:33,
                    occupy:11 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 50,
                    flow:33,
                    speed:77,
                    occupy:45 
                    },  
                    {getTime : '2014-05-01 00:00:00' ,
                    getTimeStr : 55,
                    flow:67,
                    speed:55,
                    occupy: 33        
                    },
                    {getTime : '2014-05-02 01:00:00' ,
                    getTimeStr : 60,
                    flow:90,
                    speed:55,
                    occupy: 34    
                    }
                ]
            },
            {
                facetId:'1',         //断面id
                facetName:'sdsd',       //断面名       
                getTime :  '2014-05-01 01:00:00' ,//统计日1 
                facetFlowDatas:[
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 05,
                    flow:11,
                    speed:33,
                    occupy:44 
                    },
                    {getTime : '2014-05-02 01:00:00' ,
                    getTimeStr : 10,
                    flow:90,
                    speed:55,
                    occupy: 34    
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 15,
                    flow:55,
                    speed:22,
                    occupy:77 
                    },
                    {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 20,
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
                    getTimeStr : 30,
                    flow:57,
                    speed:33,
                    occupy:11 
                    },
                    {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 35,
                    flow:89,
                    speed:34,
                    occupy:12 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 40,
                    flow:57,
                    speed:33,
                    occupy:11 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 45,
                    flow:33,
                    speed:77,
                    occupy:45 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 50,
                    flow:55,
                    speed:22,
                    occupy:77 
                    },
                     {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 55,
                    flow:11,
                    speed:33,
                    occupy:44 
                    },
                    {getTime : '2014-05-03 02:00:00' ,
                    getTimeStr : 60,
                    flow:89,
                    speed:34,
                    occupy:12 
                    }
                ]
            },
        ];*/

        //$scope.chartData();
    }];

    module.exports = controller;
});