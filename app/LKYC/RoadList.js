define(function (require, exports, module) {
    var controller = ['Modal', '$scope', 'Query', 'DictCache','$location', 'Restangular','LocationMonitor','CmsRoadRelation',
        function (Modal, $scope, Query,DictCache, $location,Rest,LocationMonitor,CmsRoadRelation) {
        $scope.mapView = false;

        $scope.selectOptions=[{val:'2',show:'全部'},{val:'1',show:'是'},{val:'0',show:'否'}];
        

        //设施类型字典
        DictCache("0001", function(dict){
            $scope.types = dict;
        }, true);

        //设备状态字典
        DictCache("0005", function(dict){
            $scope.statuss = dict;
        }, true);
        
        //管辖区域字典
        DictCache("0036", function(dict){
            $scope.manageDepts = dict;
        }, true);

        $scope.remove = function(){
            
            var r = [];
            for(var i = 0, size = $scope.checks.length; i < size; i++){
                if($scope.checks[i]){
                    r.push($scope.records[i].id);/*注意*/
                }
            }

            var ids = r.join(',');

            var bool = false;
            if(r.length===0){
                alert('请选择需要删除的记录!');
            }else{
                bool = confirm('确认删除这 '+ r.length + ' 条记录吗?');
            }

            if(!bool) return;

            Device.remove({id: ids}, function(data){
                if(!data.success) alert(data.msg);
                _query();
            });

        };

        $scope.Q = Query.data();
        $scope.Q.isRelateCmsInfo=$scope.selectOptions[0].val;
        $scope.able=$scope.Q.isRelateCmsInfo==1?false:true;
        

        // 全选功能
        $scope.checks = [];
        $scope.allChecked = true;

        $scope.select = function(index){
            $scope.checks[index] = !$scope.checks[index];
            $scope.allChecked = _.every($scope.checks);
        };

        $scope.selectAll = function(){
            initCheck($scope.allChecked,$scope.records.length);
        };

        //初始化
        var initCheck = function(bool,num){
            var checks = [];
            for(var i = 0; i < num; i++){
                checks.push(bool);
            }
            $scope.checks = checks;
        };

        // 查询功能
        var _query = function(){
            var q = $scope.Q.query();

            $scope.allChecked = false;

            Rest.all('roadsec/list').post(q).then(function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                $scope.total = data.total;
                $scope.records = data.results;
                for(var i=0;i<$scope.records.length;i++)
                {
                    if($scope.records[i].status!=null||$scope.records[i].status!='')
                    {
                        if($scope.records[i].status=='1')
                        {
                            $scope.records[i].statu="畅通";
                        }
                        else if($scope.records[i].status=='4')
                        {
                            $scope.records[i].statu="拥堵";
                        }
                        else if($scope.records[i].status=='3')
                        {
                            $scope.records[i].statu="正常";
                        }
                    }
                }
                initCheck(false);
            });
        };

        _query();

        $scope.pChange = function(page){
            $scope.Q.page = page;
            _query();
        };

        $scope.query = function(){
            $scope.pChange(1);
        };

        //表单/地图切换
        $scope.viewChange = function(record) {

            //根据roadSectionId查询geometry;
            if(record.roadSectionId){
                var url = "../giserver/configs/hk_road/query?where=OBJECTID=" +record.roadSectionId + "&geometry=global&inSR=4326&outSR=4326";
                $.ajax({
                    url : url,
                    dataType : 'json',
                    method : 'POST',
                    success : function(data) {
                        if (data) {
                            console.log(data);
                            var geojson = new OpenLayers.Format.GeoJSON();
                            var features = geojson.read(data);
                            record.geometry = features[0].geometry;
                        }
                    },
                    error : function() {
                        console.log(arguments);
                    }
                });
            }

            var origin = angular.copy(record);
             Modal('./Locator', record).result.then(function(){
             if(origin.lng === record.lng &&origin.lat === record.lat) return
             Rest.all('').one('deviceNew',record.id).doPUT(record).then(function (data){
             if(!data.success){
             Messenger().post({
             message: '更新设备'+ record.name + '经纬度失败',
             type: 'error',
             showCloseButton: true
             });
             return
             }
             Messenger().post({message:  '成功更新设备'+ record.name + '经纬度',type: 'success',showCloseButton: true });
             });
             });
        };

        $scope.infoModal = function(record){
        	//将当前记录添加到作用域上的checkRecord
            $scope.checkRecord = record;
            $('#infoModal').modal();
        };    
    }];


    module.exports = controller;
});