define(function (require, exports, module) {
    var controller = ['$scope','$routeParams', '$modal', 'Modal', 'Message','DictCache', 'Query', 'PlayList'
                      , function ($scope, $routeParams, $modal, Modal, Message, DictCache, Query, PlayList) {
        $scope.Q = Query.data();
        $scope.Q.cmsId = $routeParams.id;
        $scope.width = $routeParams.width;
        $scope.height = $routeParams.height;
        

        //诱导屏字体字典
        DictCache("0056", function(dict){
            $scope.fonts = dict;
        });
        
        //诱导屏显示风格字典
        DictCache("0053", function(dict){
            $scope.showStyles = dict;
        }, true);
        
        // 全选功能
        $scope.checks = [];

        $scope.select = function(index){
            $scope.checks[index] = !$scope.checks[index];
            $scope.allChecked = _.every($scope.checks);
        };

        var initCheck = function(bool){
            var checks = [];
            for(var i = 0; i < $scope.total; i++){
                checks.push(bool);
            }
            $scope.checks = checks;
        };

        $scope.selectAll = function(){
          $scope.allChecked = !$scope.allChecked;
          initCheck($scope.allChecked);
        }

        // 查询功能
        var _query = function(){
            var q = $scope.Q.query();

            $scope.allChecked = false;

            PlayList.query(q, function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                $scope.total = data.total;
                $scope.records = data.results;
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

        $scope.pressEntry = function(event){
            if(event.which === 13){
                $scope.query();
            }
        };
        
        //删除
        $scope.remove = function(){
            var r = [];
            for(var i = 0, size = $scope.checks.length; i < size; i++){
                if($scope.checks[i]){
                    r.push($scope.records[i].id);
                }
            }

            var ids = r.join(',');
            if(r.length===0){
                alert('请选择需要删除的记录!');
                return;
            }else{
                bool = confirm('确认删除这 '+ r.length + ' 条记录吗?');
            }

            if(!bool) return;

            PlayList.remove({id: ids}, function(data){
                if(!data.success) alert(data.msg);
                _query();
            });

        };
        
        //查看详情
        $scope.infoModal = function(record){
            $scope.checkRecord = record;
            $('#infoModal').modal();
        };
        
        //预览
        $scope.preview = function(record){
          $scope.checkRecord = record;
          var color,font;
          if(record.fontColor.code === 1){//红色
            color = "#FF0000";
          }else if(record.fontColor.code === 2){//绿色
            color = "#00FF00";
          }else if(record.fontColor.code === 3){//白色
            color = "#FFFFFF";
          }else{//蓝色
            color = "#0000FF";
          }
          if(record.font.code === 1){//宋体
            font = "宋体,SimSun";
          }else{//楷体
            font = "楷体,楷体_GB2312,SimKai";
          }
          var content = "<span style='color: " + color + "; font-size: "+record.fontSize
            +"px; font-family: "+font+";'>" + record.content.split("\n").join("<br/>") + "</span>"
            $('#previewModal').modal();
          
          var option = {
              id : '',
              url : ''
        };
        $("#ibsPanelDiv").empty();
        var ibsPanelPreview = $("#ibsPanelDiv").IBSPanel(option);
        ibsPanelPreview.init($scope.width, $scope.height);
        var config = {
            "content" : content,
            "index" : 0,
            "showStyle" : record.showStyle.code,
            "showSpeed" : record.showSpeed,
            "showTime" : record.showTime,
            "startHour" : 0,
            "endHour" : 23,
            "startMinute" : 0,
            "endMinute" : 59,
            "contentType" : 0
          };
        var ibsMenuItem = new IBSMenuItem(config);
        ibsPanelPreview.addItemLocal(ibsMenuItem, 0);
        ibsPanelPreview.play();
        };
        
        //表单/地图切换
        $scope.viewChange = function(record) {
            $scope.locateRecord = record;

            $scope.$parent.modalTitle = '绘制点坐标';
            $('.modal-footer').hide();
            $('#map .panel-body').css('height','380px');
            $('#atmModal').modal(); //利用index.html中通用的模态对话框

        };

    }];

    module.exports = controller;
});