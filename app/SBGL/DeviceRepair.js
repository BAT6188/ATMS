define(function (require, exports, module) {
    var controller = ['$scope', 'Query', 'Message', '$route', 'DictCache','DeviceRepair',
        function ($scope,Query, Message, $route,DictCache,DeviceRepair) {
        $("legend").parent().find("button").addClass('btn-sm');
        $("legend").parent().find("input,select").not("[type=checkbox]").addClass('input-sm');

        $scope.Q = Query.data();

        
        
        //保修单状态字典
        DictCache("0009", function(dict){
            $scope.repairStates = dict;
        },true);
        
/*        $scope.repairObjs = [
            {'name':'全部','code':'all',repairClass:null},
            {'name':'基础设备','code':'device',repairClass:1},
            {'name':'基础设施','code':'facility',repairClass:2},
            {'name':'标志标牌','code':'signal',repairClass:3},
            {'name':'诱导屏','code':'cms',repairClass:4},
            {'name':'卡口点位','code':'point',repairClass:5},
        ];*/
        //设备类型字典
        DictCache("0001", function(dict){
            $scope.repairObjs = dict;
        },true);

        $scope.Q = Query.data();

        // 全选功能
        $scope.checks = [];

        $scope.select = function(index){
            $scope.checks[index] = !$scope.checks[index];
            $scope.allChecked = _.every($scope.checks);
        };

        $scope.selectAll = function(){
          $scope.allChecked = !$scope.allChecked;
          initCheck($scope.allChecked);
        }
        
        var initCheck = function(bool){
            var checks = [];
            for(var i = 0; i < $scope.total; i++){
                checks.push(bool);
            }
            $scope.checks = checks;
        };

        // 查询功能        
        var _query = function(){
            var q = $scope.Q.query(), cq = angular.copy(q);
            cq['id'] = 'count';

            $scope.allChecks = false;
            DeviceRepair.query(q, function(data){
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

        $scope.D = {};

        $scope.response = function(id){
            var tr;
            $("tr").each(function(index, val) {
                 if($(val).attr("id")==id) {
                    tr = val;
                    return
                 }
            });
            $scope.D.originalRepairState = parseInt($(tr).find("td:eq(11)").text());
            $scope.D.repairId = parseInt($(tr).find("td:eq(2)").text());
            $scope.D.proceedOperate = 4;

            $scope.okFun = function(){
                //4执行中
                deviceRepairs.put(id, {"repairState":"4"}, function(result, err) {
                    if(err){
                        Message.alert('提示信息', '操作失败！', '#DA4F49');
                        return console.log(err);
                    }else{
                        var mesg = '操作成功！<br>' +
                                    '维修人：刘 <br>' +
                                    '维修时间：' + new Date().Format("yyyy-MM-dd hh:mm:ss");
                        Message.alert('提示信息', mesg, '#5BB75B');
                        $route.reload();
                        loginHistory();
                    }
                });
            };

            $scope.noFun = function(){

            };

            Message.confirm('信息提示','您确定要做此操作吗？',{},$scope.okFun,$scope.noFun);
        };

        //****************记录设备历史_开始
        Date.prototype.Format = function (fmt) {
            var o = {
                "M+": this.getMonth() + 1, //月份 
                "d+": this.getDate(), //日 
                "h+": this.getHours(), //小时 
                "m+": this.getMinutes(), //分 
                "s+": this.getSeconds(), //秒 
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
                "S": this.getMilliseconds() //毫秒 
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        };

        var loginHistory = function() {
            var date = new Date().Format("yyyy-MM-dd hh:mm:ss");
            var drHistory = {repairId: $scope.D.repairId, repairState: $scope.D.originalRepairState, 
                proceedOperate: $scope.D.proceedOperate, operateMan: '刘', operateTime: date};
            deviceRepairHistories.post(drHistory, function(result, err) {
                if(err){
                    return console.log(err);
                }
            });
        };
        //****************记录设备历史_结束
        
        //查看保修单详情
        $scope.infoModal = function(record){
            $scope.checkRecord = record;
            $('#infoModal').modal();
        };
        
        //审核数据
        $scope.check = function(record){
            $scope.checkRecord = record ;
            $("#checkModal").modal();
        };
        
        //通过审核
        $scope.pass = function(){
            $scope.checkRecord.status.code = "3";
          $scope.updateLabel();
          DeviceRepair.update($scope.checkRecord, function(data){
            if(!data.success){
              alert(data.msg);
              return;
            }
            origin = data.results;
            alert('通过审核!');
                $("#checkModal").modal('hide');
          })
        };
        
        //驳回
        $scope.reject = function(){
          $scope.checkRecord.status.code = "2";
          $scope.checkRecord.deviceStatus = {
                code:"2",
                name:"故障"
            };
          $scope.updateLabel();
          DeviceRepair.update($scope.checkRecord, function(data){
            if(!data.success){
              alert(data.msg);
              return;
            }
            origin = data.results;
            alert('驳回审核!');
                $("#checkModal").modal('hide');
          })
        };
        
        //打开执行报修对话框
        $scope.doExecute = function(record){
          $scope.checkRecord = record;
            $("#executeModal").modal();
        };
        
        //执行报修
        $scope.execute = function(){
            $scope.checkRecord.status.code = "4";
            $scope.checkRecord.deviceStatus = {
                code:"3",
                name:"维修中"
            };
          $scope.updateLabel();
          DeviceRepair.update($scope.checkRecord, function(data){
            if(!data.success){
              alert(data.msg);
              return;
            }
            origin = data.results;
            alert('更新成功!');
             $("#executeModal").modal('hide');
          })
        };
        
        //打开确认报修对话框
        $scope.doConfirm = function(record){
          $scope.checkRecord = record;
            $("#confirmModal").modal();
        };
        
        //确认维修成功
        $scope.confirm = function(){
            $scope.checkRecord.status.code = "5";
            $scope.checkRecord.deviceStatus = {
                code:"1",
                name:"正常"
            };
          $scope.updateLabel();
          DeviceRepair.update($scope.checkRecord, function(data){
            if(!data.success){
              alert(data.msg);
              return;
            }
            origin = data.results;
            $("#confirmModal").modal('hide');
          })
        };
        
        //重修
        $scope.reRepair = function(){
          $scope.checkRecord.status.code = "3";
          $scope.updateLabel();
          DeviceRepair.update($scope.checkRecord, function(data){
            if(!data.success){
              alert(data.msg);
              return;
            }
            origin = data.results;
            alert('更新成功!');
          })
        };
        
        $scope.updateLabel = function(){
          _.each($scope.repairStates, function(item){
            if(item.code === $scope.checkRecord.status.code){
              $scope.checkRecord.status.name = item.name;
            }
          });
        };
    }];

    module.exports = controller;
});