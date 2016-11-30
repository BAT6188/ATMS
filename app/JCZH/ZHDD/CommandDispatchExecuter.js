define(function (require, exports, module) {
    var controller = ['$scope', 'Modal', 'Message', 'Query', 'PoliceTask','DictCache','Dept','$filter',
        function ($scope, Modal, Message, Query, PoliceTask ,DictCache,Dept,$filter) {
        Dept.query({},function(data){
            $scope.parentDepts = [{'deptName':'全部'}].concat(data.results);
        });
        
        //全部1，待调度2
        $scope.btnNum = 1;
        
        /*----------字典--------用于新增-------------*/
        //警情类型数据字典
        DictCache('0011', function(dicts){
            $scope.types = dicts;
         });

      //警情等级数据字典
        DictCache('0012', function(dicts){
            $scope.levels = dicts;
        });

      //报警方式字典
        DictCache('0020', function(dicts){
            $scope.alarmWays = dicts;
        });

       /*----------字典--------用于查询-------------*/
         //警情状态类型数据字典
        DictCache('0013', function(dicts){
            $scope._status = dicts;
        },true);
         //警情类型数据字典
        DictCache('0011', function(dicts){
            $scope._types = dicts;
        },true);
              //警情等级数据字典
        DictCache('0012', function(dicts){
            $scope._levels = dicts;
        },true);

        $scope.showAddModal = function(){
            Modal('UserNew');
        };
       /* ---------------------------------拆单合单-----------------------------*/
        var initCheckRec = function(data,bool){
            angular.forEach(data,function(e){
                e.checked = bool;
            });
        };
        //拆单/合单(自动)
        $scope.showMod = function(record){
            if(record.merge.code == '3'){//拆
                $scope.splitDate(record);
                $scope.s_c = 1;
            }else if(record.merge.code == '1'){//合(auto)
                $scope.autoCombineData(record);
                $scope.s_c = 2;
            }
        };

        //勾选合单modal
        $scope.combineMod = function(){
            $scope.mannulCombineData();
        };

        $scope.autoCombineData = function(record){
         //自动合单
            $scope.c_s_data = [];
            var ids = record.tempAffiliate;
            //更新主单
            PoliceTask.query({'ids':ids}, function(data) {
                if (!data.success) {
                    alert(data.msg);
                    return;
                }
                $scope.c_s_data = data.results;
                            //处理待合单数据
                if($scope.c_s_data.length > 1 ){
                    var index = 0;
                    $scope.majorRec = $scope.c_s_data[0];
                    angular.forEach($scope.c_s_data,function(e,i){
                        if(e.occurTime < $scope.majorRec.occurTime){
                             $scope.majorRec = e ;
                             $scope.selectedRec = e;
                             index = i;
                        }
                    });
                    $scope.c_s_affiliate = angular.copy($scope.c_s_data);
                    $scope.c_s_affiliate.splice(index,1);
                    //console.log($scope.majorRec);
                    //console.log($scope.c_s_affiliate);
                    $('#combineModal').modal();
                }else{
                    alert('选择的警情数目大于等于2，请重新选择！！');
                }
            }, function(e) {
                alert('后台出错!');
            });    
        };

        $scope.mannulCombineData = function(){
            $scope.s_c = 2;
            $scope.c_s_data = [];           
            for(var i = 0, size = $scope.checks.length; i < size; i++){
                if($scope.checks[i]){
                    if($scope.records[i].status.code != "1"){
                        alert('只可对未处置警情进行合单，请重新选择！！');
                        return;
                    }else{
                        $scope.c_s_data.unshift($scope.records[i]);//按时间由就到新
                    }
                }
            }
             
            //处理待合单数据
            if($scope.c_s_data.length > 1 ){
                var index = 0;
                $scope.majorRec = $scope.c_s_data[0];
                angular.forEach($scope.c_s_data,function(e,i){
                    if(e.occurTime < $scope.majorRec.occurTime){
                         $scope.majorRec = e ;
                         $scope.selectedRec = e;
                         index = i;
                    }
                });
                $scope.c_s_affiliate = angular.copy($scope.c_s_data);
                $scope.c_s_affiliate.splice(index,1);
                console.log($scope.majorRec);
                console.log($scope.c_s_affiliate);
                $('#combineModal').modal();
            }else{
                alert('选择的警情数目大于等于2，请重新选择！！');
            }
        };
        //拆单数据
        $scope.splitDate = function(record){
            var ids = record.subList;
            $scope.majorRec = record;
            $scope.selectedRec = record;
            PoliceTask.query({'ids':ids,'limit':-1}, function(data) {
                if (!data.success) {
                    alert(data.msg);
                    return;
                }
                $scope.c_s_affiliate = data.results;
                initCheckRec($scope.c_s_affiliate,false);
                $scope.c_s_data = angular.copy($scope.c_s_affiliate);
                $scope.c_s_data.unshift(angular.copy($scope.majorRec));
                $('#combineModal').modal();
            }, function(e) {
                alert('后台出错!');
            });    
        };

        //拆合单
        $scope.c_s_Ptask = function(){
            $scope.majorRec.affiliate = [];
            //var temp = angular.copy($scope.c_s_affiliate);;
            angular.forEach($scope.c_s_affiliate,function(e,i){
                if(e.checked){
                    $scope.majorRec.affiliate.push(e.id.toString());
                }
            });
            //拆单
            if($scope.s_c == 1){

                if($scope.majorRec.affiliate.length != $scope.majorRec.subList.length){
                    $scope.majorRec.isAllSplit = false;
                }else{
                    $scope.majorRec.isAllSplit = true;
                }
                PoliceTask.split($scope.majorRec, function(data) {
                    if (!data.success) {
                        alert(data.msg);
                        return;
                    }
                    $scope.majorRec = data.results; 
                    //initCheckRec($scope.c_s_affiliate,false); 
                    //重新获取数据
                    alert('拆单成功!');
                    _query();
                }, function(e) {
                    alert('后台出错!');
                });
            //合单
            }else if($scope.s_c == 2){
                $scope.majorRec.merge = {'code':'3','name':'主单'};
                //更新主单
                PoliceTask.merge($scope.majorRec, function(data) {
                    if (!data.success) {
                        alert(data.msg);
                        return;
                    }
                    $scope.majorRec = data.results; 

                    //重新获取数据
                    alert('合单成功!');
                    _query();
                }, function(e) {
                    alert('后台出错!');
                });
            }


            $('#combineModal').modal('hide');
        };

        $scope.c_s_cancle = function(){
            $scope.majorRec = null;
            $scope.c_s_data = [];
            $('#combineModal').modal('hide');
        };
        //评价
        $scope.evaluate = function(record){
            $('#evaluateModal').modal();
            $scope.evaluateRec = record;
        };

        $scope.updatePt = function(){
            PoliceTask.update($scope.evaluateRec, function(data) {
                if (!data.success) {
                    alert(data.msg);
                    return;
                }
                alert('更新成功!');
                $('#combineModal').modal('hide');
            }, function(e) {
                alert('后台出错!');
            });
        };

        $scope.remove = function(){ 
            var r = [];
            for(var i = 0, size = $scope.checks.length; i < size; i++){
                if($scope.checks[i]){
                    r.push($scope.records[i].dataId);
                }
            }

            var ids = r.join(',');

            var bool = confirm('确认删除这 '+ r.length + ' 条记录吗?');

            if(!bool) return;

            PoliceTask.remove({id: ids}, function(data){
                if(!data.success) alert(data.msg);
                _query();
            });

        };

        $scope.Q = Query.data();


        // 全选功能
        $scope.checks = [];
        $scope.allChecked = false;

        $scope.select = function(index){
            $scope.checks[index] = !$scope.checks[index];
            $scope.allChecked = _.every($scope.checks);
            console.log($scope.checks);
        };

        $scope.selectAll = function(){
            initCheck($scope.allChecked,$scope.records.length);
        };

        var initCheck = function(bool){
            var checks = [];
            for(var i = 0; i < $scope.total; i++){
                checks.push(bool);
            }
            $scope.checks = checks;
        };

				var getQueryOfPrivilege = function() {
					//*********根据权限选择查询条件_start
					if (sessionStorage._login) {
						var _login = sessionStorage._login;
						try {
							_login = JSON.parse(_login);
						} catch(e) {
							console.log(e);
						}
						if (_login.priv) {
							//支队权限，大队权限
							for (var i = 0; i < _login.priv.length; i++) {
								// if (_login.priv[i] && _login.priv[i] == PRIVILEGES.getPrivCode('指挥调度_支队')) {
								// $scope.Q.deptCode =
								// break;
								// }
								if (_login.priv[i] && _login.priv[i] == PRIVILEGES.getPrivCode('指挥调度_大队')) {
									if (_login.dept && _login.dept.deptCode) {
										$scope.Q.deptCode = _login.dept.deptCode;
										break;
									}
								}
							}
						}
					}
					//*********根据权限选择查询条件_end
				}; 
				
        // 查询功能
        var _query = function(){
        		getQueryOfPrivilege();
            var q = $scope.Q.query();

            $scope.allChecked = false;
            
            if(q.statusCode===undefined)
            {
	            q.statusCode = '1,2';
            }
            var r = PoliceTask.query(q, function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                $scope.total = data.total;
                initCheck(false);
                $scope.records = data.results;
/*                angular.forEach($scope.records,function(record){
                    if(record.status.code == 1){
                        record._time = 
                    }
                });*/
            });
        };

        //分页查询
        $scope.pChange = function(page){
            $scope.Q.page = page;
            _query();
        };

        //关键字查询
        $scope.query = function(){
            $scope.pChange(1);
        };
        //关键字查询
        $scope.keyQuery = function(){
            $scope.pChange(1);
        };

        //状态查询
        $scope.statusQuery = function (s) {
            $scope.curStatus = s;
            $scope.Q.statusCode = s.code;
            _query();
        };
/*         $scope.arr = [{name: 1}, {name: 2}];
            $scope.object = $scope.arr[0];*/
        //查询
        _query();
        var timer = setInterval(function(){
            _query();
        }, 20000);
        
        //今天
        $scope.query4Today = function() {
            $scope.Q.startOccurTime = $filter('date')(new Date(), 'yyyy-MM-dd 00:00:00');
            $scope.Q.endOccurTime = $filter('date')(new Date(), 'yyyy-MM-dd 23:59:59');
            $scope.query();
        };
        
        //本周
        $scope.query4Week = function() {
            //dayOfWeek从 Date 对象返回一周中的某一天 (0 ~ 6),dayOfMonth从 Date 对象返回一个月中的某一天 (1 ~ 31)。
            var myDate = new Date();
            var dayOfWeek = myDate.getDay();
            if(dayOfWeek==0)
            {
                dayOfWeek = 7;
            }
            var dayOfMonth = myDate.getDate();
            myDate.setDate(dayOfMonth - (dayOfWeek - 1));
            $scope.Q.startOccurTime = $filter('date')(myDate, 'yyyy-MM-dd 00:00:00');
            
            myDate = new Date();
            myDate.setDate(dayOfMonth + (7 - dayOfWeek));
            $scope.Q.endOccurTime = $filter('date')(myDate, 'yyyy-MM-dd 23:59:59');
            $scope.query();
        };
        
        //本月
        $scope.query4Month = function() {
            //month从 Date 对象返回月份 (0 ~ 11)。
            var myDate = new Date();
            myDate.setDate(1);
            $scope.Q.startOccurTime = $filter('date')(myDate, 'yyyy-MM-dd 00:00:00');
            
            myDate = new Date();
            var month = myDate.getMonth();
            myDate.setMonth(month + 1, 1);
            myDate.setDate(myDate.getDate() - 1);
            $scope.Q.endOccurTime = $filter('date')(myDate, 'yyyy-MM-dd 23:59:59');
            $scope.query();
        };

        $scope.$on('$destroy', function() {
            if(timer) {
                clearInterval(timer);
            }
        });

    }];

    module.exports = controller;
});