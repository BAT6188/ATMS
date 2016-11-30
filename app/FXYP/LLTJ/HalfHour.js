define(function (require, exports, module) {
    var controller = ['$scope', 'Query', 'Message','FacetFlow','Facet',
     function ($scope, Query, Message,FacetFlow,Facet) {
        $scope.showTypes = [{name:'列表',value:'list'},{name:'柱状图',value:'column'},
                             {name:'曲线图',value:'line'}];
        $scope.showType = 'line';

        /* ---------用于分页----------*/
        $scope.page = 1;
        $scope.size = 10;
        $scope.maxSize = 5;
        //请求断面数据
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

        $scope.Q = {
            circle:'1800',
            startTime:'2014-05-15 01:00:00',
            endTime:'2014-05-15 12:00:00'
        };

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
        

        $scope.filterData = function(records){
            var records = angular.copy(records);
            var timePart = $scope.xaxis(records,'getTimeStr');
            var arr = [];
            var q = _.groupBy(records, 'facetId');
            angular.forEach(q,function(e){
                var temp =  _.groupBy(e, 'getTimeStr');
                angular.forEach(timePart,function(t){
                     arr.push(temp[t][0]);
                     //console.log(temp[t][0]['facetId'],temp[t][0]['getTimeStr']);
                });
            });
            return arr;
        };
        //请求所有数据
        $scope.allDate = function(){
            FacetFlow.queryFacetDayHourFlow($scope.Q,function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                var records = data.results;
                $scope.records = $scope.filterData(records);

                $scope.changeType();
            });
        };

        //单个断面数据
        $scope.getData = function(record){
            var q = {
                facetIds:record.facetId,
                circle:'1800',
                startTime:'2014-05-15 01:00:00',
                endTime:'2014-05-15 12:00:00'
            };

            if(record.data) return
            FacetFlow.queryFacetHalfHourFlow(q,function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                record.data = data.results;
                record.total = data.results.length;
            });
        };

        $scope.chartLineData = [];
        $scope.chartLineXAxis = [];
        $scope.chartColumnData = [];
        $scope.chartColumnXAxis = [];

        $scope.chartData = function(type){
            $scope.chartLineData = [];
            $scope.chartColumnData = [];
            if(type === 'line'){
                $scope.chartLineXAxis =  $scope.xaxis($scope.records,'getTimeStr',11);
                $scope.chartLineData = $scope.yaxis($scope.records,'flow',type);
            }else if(type === 'column'){
                $scope.chartColumnXAxis = $scope.xaxis($scope.records,'getTimeStr',11);
                $scope.chartColumnData = $scope.yaxis($scope.records,'flow',type);
            }
            var q= 0;
        };

        //获取x轴值
       $scope.xaxis = function(records,field,length){
            var xaxi = [];
            var records = angular.copy(records);
            angular.forEach(records,function(e){
                if(!_.contains(xaxi, e[field])){
                    xaxi.unshift(e[field].slice(length));
                }
            });
            return xaxi;
        };

        //根据highcharts拼接y轴值
        $scope.yaxis = function(records,field,type){
            var records = angular.copy(records);
            var facets = $scope.selectFacets;  //断面数组
            var series = [];  //图表数据

            angular.forEach(facets,function(facet){
                var serie = {type: type,name:facet.facetName,data:[]};
                angular.forEach(records,function(e){
                    if(e.facetId === facet.facetId ){
                        //console.log(e.timePart);
                        if(e[field] !== null){
                            serie.data.push(e[field]);
                        }else{
                            serie.data.push(0);
                        }
                        
                    }
                });
                series.push(serie);
            });
            
            return series;
        };

        $scope.getSelect = function(){

            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            $scope.selectFacets = zTree.getCheckedNodes(true);
            if(!$scope.Q.startTime || !$scope.Q.endTime){
                alert('请选择时间区间');
                return;
            }

            if($scope.selectFacets.length < 1){
                alert('请选择断面数据');
                return;
            }

            //$scope.selectFacets = zTree.getCheckedNodes(true);
            var ids = [];
            $scope.Q.facetIds = [];
            angular.forEach($scope.selectFacets,function(e){
                ids.push(e.id);
            });
            $scope.Q.facetIds = ids.join(',');
            $scope.allDate();
        };

        /*---------------------tree------------------------*/

        var zNodes =[
            {id:1, pId:0, name:"北京"},
            {id:2, pId:0, name:"天津"},
            {id:3, pId:0, name:"上海"},
            {id:6, pId:0, name:"重庆"},
            {id:4, pId:0, name:"河北省", open:true, nocheck:true},
            {id:41, pId:4, name:"石家庄"},
            {id:42, pId:4, name:"保定"},
            {id:43, pId:4, name:"邯郸"},
            {id:44, pId:4, name:"承德"},
            {id:5, pId:0, name:"广东省", open:true, nocheck:true},
            {id:51, pId:5, name:"广州"},
            {id:52, pId:5, name:"深圳"},
            {id:53, pId:5, name:"东莞"},
            {id:54, pId:5, name:"佛山"},
            {id:6, pId:0, name:"福建省", open:true, nocheck:true},
            {id:61, pId:6, name:"福州"},
            {id:62, pId:6, name:"厦门"},
            {id:63, pId:6, name:"泉州"},
            {id:64, pId:6, name:"三明"}
         ];
    }];
    module.exports = controller;
});