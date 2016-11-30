define(function (require, exports, module) {
    var controller = ['$scope', 'PageQuery', '$templateCache', function ($scope, PageQuery, $templateCache) {
        function loadedTaskEditCtrl(){
            // require.async('./taskEdit', function(controller){
               // $scope.$apply();
            // });
        };

        loadedTaskEditCtrl();

        $scope.entryTab = function(index){//tab切换
            if(index === 1){
                $('#info').addClass('active');
                $('#assess').removeClass('active');
            }else if(index === 2){
                $('#assess').addClass('active');
                $('#info').removeClass('active');
            }
        };

        

    }];

    var dutyInfoController = ['$scope', 'PageQuery', 'Message', 'Dictionary', function($scope, PageQuery, Message, Dictionary){
        $scope.mainShow = true;//主页面panel显示
        $scope.dutySet = ''; //排班周、日显示
        $scope.postShow = false;//岗位显示
        $scope.personShow = false;//人员显示
        $scope.rightShow = '';

        $scope.dutyTypes = [{number: 0, name: '周勤'}, {number: 1, name: '日勤'}];
        $scope.dutyType = $scope.dutyTypes[0];
        $scope.weeks = ['一/上午', '一/下午', '二/上午', '二/下午', '三/上午', '三/下午', '四/上午', '四/下午', '五/上午', '五/下午'];

        $scope.taskWeekPosts = [];//任务选中的周岗位
        $scope.taskDayPosts = [];//任务选中的日岗位
        $scope.currPost;//当前岗位

        $scope.persons = [
            {id: '1', no: '001', name: '张三', dept: '交警支队'},
            {id: '2', no: '002', name: '李四', dept: '交警支队'},
            {id: '3', no: '003', name: '王二', dept: '姑苏大队'},
            {id: '4', no: '004', name: '小李', dept: '交警支队'},
            {id: '5', no: '005', name: '小王', dept: '姑苏大队'},
            {id: '6', no: '006', name: '小刘', dept: '交警支队'}
        ];

        $scope.duties = [
            {name: '岗位1',type:'巡逻岗'},
            {name: '岗位2',type:'高峰岗'},
            {name: '岗位23',type:'事故外勤岗'},
            {name: '岗位11',type:'领导岗'},
            {name: '岗位132',type:'巡逻岗'},
            {name: '岗位3121',type:'事故内勤岗'},
            {name: '岗位131',type:'事故外勤岗'},
            {name: '岗位531',type:'事故外勤岗'},
            {name: '岗位591',type:'窗口岗'}
        ];

        $scope.editDuty = function(){//选择任务周期
            $scope.mainShow = false;
            if($scope.dutyType.number === 0){
                $scope.dutySet = 'week';
            }else if($scope.dutyType.number === 1){
                $scope.dutySet = 'day';
            }
        };

        $scope.addPost = function(){//添加周岗位
            $('#dutyTable').removeClass('col-md-12').addClass('col-md-8');
            $scope.rightShow = 'post';
        };

        $scope.addPerson = function(record, weekIndex){//添加人员
            $('#dutyTable').removeClass('col-md-12').addClass('col-md-8');
            $scope.rightShow = 'person';
            $scope.currPost = record;
            $scope.curWeekIndex = weekIndex;
        };

        $scope.configPerson = function(){//保存岗位、人员配置
            $('#dutyTable').removeClass('col-md-8').addClass('col-md-12');
            $scope.rightShow = '';

            var personsTemp = [];
            $scope.persons.map(function(item){
                if(item.checked){
                    personsTemp.push(item);
                }
            });

            if($scope.dutySet === 'week'){

            }else if($scope.dutySet === 'day'){
                $scope.taskDayPosts.map(function(item, index){
                    if(item.name === $scope.currPost.name){
                        $scope.taskDayPosts[index].dayPersons = personsTemp;
                    }
                });
            }
        };

        $scope.defaultView = function(){//回到主页面
            $scope.mainShow = true;
        };

        $scope.selectPost = function(duty){
            var tmp = angular.copy(duty);
            tmp.setTime = '00:00 ~ 00:00';
            tmp.weeks = [{show: false},{show: false}, {show: false}, {show: false}, {show: false}, {show: false}, {show: false},
                {show: false}, {show: false}, {show: false}];
            if($scope.dutySet === 'week'){
                $scope.taskWeekPosts.push(tmp);
            }else if($scope.dutySet === 'day'){
                $scope.taskDayPosts.push(tmp);
            }

        };

        $scope.popTime = function(duty){//日排班时间
            duty.addTime = !duty.addTime;
        };

        $scope.submitTime = function(record){//提交日排班时间
            record.setTime = record.startTime + ' ~ ' + record.endTime;
            record.addTime = false;
        };

        $scope.resetTime = function(record){//取消日排班时间
            record.addTime = false;
            record.startTime = '';
            record.endTime = '';
        };

        $scope.removeTaskDuty = function(index){//移除岗位
            if($scope.dutySet === 'week'){
                $scope.taskWeekPosts.splice(index, 1);
            }else if($scope.dutySet === 'day'){
                $scope.taskDayPosts.splice(index, 1);
            }
        };

    }]; 

    registerController('dutyInfo', dutyInfoController);

    var dutyAssessController = ['$scope', 'PageQuery', 'Message', 'Dictionary', '$templateCache', function($scope, PageQuery, Message, Dictionary, $templateCache){
        $scope.code = $templateCache.get('code');
        $scope.name = $templateCache.get('name');
        $scope.startTime = $templateCache.get('startTime');
        $scope.endTime = $templateCache.get('endTime');

        $("div[ng-controller='dutyAssess']").parent().find("button").addClass('btn-sm');
        $("div[ng-controller='dutyAssess']").parent().find("input,select,label").not("[type=checkbox]").addClass('input-sm');

        $scope.records = [
            {postSeq: 1, postName: '望虞河大桥', dutyPerson: '王东辉', policeNo: '41645', dutyTime: '', arrTime: '9:10:38',
                taskTime: '09:51:00', leaveTime: '10:11:05', takeTime: '9分27秒'},
            {postSeq: 1, postName: '望虞河大桥', dutyPerson: '吴玮', policeNo: '41694', dutyTime: '', arrTime: '9:10:42',
                taskTime: '09:51:00', leaveTime: '10:11:05', takeTime: '9分24秒'},
            {postSeq: 1, postName: '望虞河大桥', dutyPerson: '谢峰', policeNo: '41753', dutyTime: '', arrTime: '10:00:00',
                taskTime: '09:51:00', leaveTime: '10:11:35', takeTime: '9分35秒'},
            {postSeq: 2, postName: '苏州新区站', dutyPerson: '朱明奕', policeNo: '41867', dutyTime: '', arrTime: '01:37:16',
                taskTime: '09:54:39', leaveTime: '10:11:36', takeTime: '9分20秒'},
            {postSeq: 2, postName: '苏州新区站', dutyPerson: '谢峰', policeNo: '41753', dutyTime: '', arrTime: '01:37:20',
                taskTime: '09:54:39', leaveTime: '10:11:37', takeTime: '9分17秒'},
            {postSeq: 3, postName: '苏州站', dutyPerson: '韩正庆', policeNo: '41856', dutyTime: '', arrTime: '9:10:44',
                taskTime: '09:58:02', leaveTime: '10:11:09', takeTime: '11分25秒'},
            {postSeq: 3, postName: '苏州站', dutyPerson: '朱明奕', policeNo: '41867', dutyTime: '', arrTime: '9:10:45',
                taskTime: '09:58:02', leaveTime: '10:11:10', takeTime: '11分25秒'},
            {postSeq: 3, postName: '苏州站', dutyPerson: '刘健', policeNo: '41876', dutyTime: '', arrTime: '9:59:00',
                taskTime: '09:58:02', leaveTime: '10:11:10', takeTime: '9分24秒'},
            {postSeq: 4, postName: '工业园区站', dutyPerson: '姚建业', policeNo: '48316', dutyTime: '', arrTime: '9:10:47',
                taskTime: '10:01:07', leaveTime: '10:11:11', takeTime: '9分24秒'},
            {postSeq: 4, postName: '工业园区站', dutyPerson: '马文清', policeNo: '48229', dutyTime: '', arrTime: '9:10:48',
                taskTime: '10:01:07', leaveTime: '10:11:22', takeTime: '11分34秒'}
        ];            

        _.each($scope.records, function(val, index) {
            


        });



    }]; 

    registerController('dutyAssess', dutyAssessController);


    module.exports = controller;
});