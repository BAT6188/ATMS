define(function(require, exports, module){

    return ['$rootScope','Restangular',
  function($rootScope,Restangular){

        var linker = function($scope, $el, $attrs) {
            $scope.isAdd = true;
            
            $scope.types = [
                {value: 0, label: '全点阵'},
                {value: 1, label: '复合屏'}
            ];

            $scope.enters = [
                {value: '1', label: '立即显示'},
                {value: '3', label: '左移'},
                {value: '4', label: '上移'},
                {value: '5', label: '右移'},
                {value: '6', label: '下移'}
            ];

            $scope.leaves = [
                {value: '0', label: '立即消隐'},
                {value: '1', label: '闪烁退出'},
                {value: '2', label: '向右移出'},
                {value: '3', label: '向左移出'},
                {value: '4', label: '向右擦除'},
                {value: '5', label: '向左擦除'},
                {value: '6', label: '左右向中间擦除'},
                {value: '7', label: '中间向左右擦除'},
                {value: '8', label: '向上移出'},
                {value: '9', label: '向上擦除'},
                {value: '10', label: '向下擦除'},
                {value: '11', label: '上下向中间擦除'},
                {value: '12', label: '水平百叶窗擦除'},
                {value: '13', label: '垂直百叶窗擦除'},
                {value: '14', label: '区域闪烁后复原'},
                {value: '15', label: '区域闪烁后消失'}
            ];

            $scope.fonts = [
                {label: "宋体", value: "宋体"},
                {label: "黑体", value: "黑体"},
                {label: "楷体_GB2312", value: "楷体_GB2312"},
                {label: "仿宋体_GB2312", value: "仿宋体_GB2312"},
                {label: "隶书", value: "隶书"},
                {label: "幼圆", value: "幼圆"},
                {label: "方正大标宋简体", value: "方正大标宋简体"}];


          $scope.lineSpaces = [
            {value: "1", label: "1"},
            {value: "2", label: "2"},
            {value: "3", label: "3"},
            {value:  "4", label: "4"},
            {value: "5", label: "5"},
            {value: "6", label: "6"},
            {value: "7", label: "7"},
            {value: "8", label: "8"},
            {value: "9", label: "9"},
            {value: "10", label:"10"},
            {value: "11", label: "11"},
            {value: "12", label: "12"},
            {value: "14", label: "14"},
            {value: "16", label: "16"},
            {value: "18", label: "18"},
            {value: "20", label: "20"},
            {value: "22", label: "22"},
            {value: "24", label: "24"},
            {value: "26", label: "26"},
            {value: "28", label: "28"},
            {value: "30", label: "30"},
            {value: "32", label: "32"},
            {value: "34", label: "34"},
            {value: "36", label: "36"},
            {value: "38", label: "38"},
            {value: "40", label: "40"},
            {value: "42", label: "42"},
            {value: "44", label: "44"},
            {value: "46", label: "46"},
            {value: "48", label: "48"},
            {value: "50", label: "50"},
            {value: "52", label: "52"},
            {value: "54", label: "54"},
            {value: "56", label: "56"},
            {value: "58", label: "58"},
            {value: "60", label: "60"},
            {value: "62", label: "62"},
            {value: "64", label: "64"},
            {value: "66", label: "66"},
            {value: "68", label: "68"},
            {value: "70", label: "70"},
            {value: "72", label: "72"}];
            $scope.fontSizes = [
              {value: "12", label: "12"},
              {value: "14", label: "14"},
              {value: "16", label: "16"},
              {value: "18", label: "18"},
              {value: "20", label: "20"},
              {value: "22", label: "22"},
              {value: "24", label: "24"},
              {value: "26", label: "26"},
              {value: "28", label: "28"},
              {value: "30", label: "30"},
              {value: "32", label: "32"},
              {value: "34", label: "34"},
              {value: "36", label: "36"},
              {value: "38", label: "38"},
              {value: "40", label: "40"},
              {value: "42", label: "42"},
              {value: "44", label: "44"},
              {value: "46", label: "46"},
              {value: "48", label: "48"},
              {value: "50", label: "50"},
              {value: "52", label: "52"},
              {value: "54", label: "54"},
              {value: "56", label: "56"},
              {value: "58", label: "58"},
              {value: "60", label: "60"},
              {value: "62", label: "62"},
              {value: "64", label: "64"},
              {value: "66", label: "66"},
              {value: "68", label: "68"},
              {value: "70", label: "70"},
              {value: "72", label: "72"}];
            $scope.fontColors = [
                {value: "255", label: "红色"},
                {value: "65280", label: "绿色"},
                {value: "65535", label: "黄色"}];
            
            $scope.centeres = [
                {value: '1', label: "居中"},
                {value: '0', label: "不居中"}];
            $scope.stays = _.range(1, 256);

            $scope.speeds = _.range(1, 11);
            var nowTime = new Date();
            var year = nowTime.getFullYear(); //定义年的变量的初始值
            var origin = {
                //字体
                font: "宋体",
                //字体大小
                fontSize: 44,
                //字体颜色
                fontColor: "255",
                //进入方式
                enterType: '1',
                //退出方式
                leaveType: '1',
                //停留时间
                stayTime: 10,
                //动画时间
                moveTime: 10,
                //播放速度
                speed: 4,
                //开始时间
                startTime : year + '-01-01 00:00:00',
                //结束时间
                endTime :year+'-12-31 23:59:00',
                //行间距
                lineSpace: '12',
                //是否居中
                isMiddle : '1',
                //是否已经预览
                preview:false
        };

            $scope.$watch('model', function (model){
                if(!model){
                    $scope.model = angular.copy(origin);
                }
                if(model && model.ledid && model.progid && model.name){
                   //报js错误
                   //$scope.model = angular.copy(model);
                   $scope.model.conn = 0;
                   $scope.model.relationship = 0;
                   $scope.model.state = 1;
                   $scope.model.nblks = '0';
                   $scope.model.pblks = '暂无';
                   $scope.model.timetype = 0;
                   $scope.model.flag = '0';
                }
              if(model && model.fontSize){
                $scope.model.fontSize = $scope.model.fontSize+"";
              }
            });
            
            $scope.$watch('addFlag', function (addFlag){
                if (addFlag) {
                    $scope.isAdd = true;
                }
                if (!addFlag) {
                    $scope.isAdd = false;
                }
            });

            $rootScope.$on('jq-screen:activeX', function (e, activeX, ledid){
                origin.ledid = ledid;
                $scope.model = angular.copy(origin);
            });

            //发布
            $scope.onSubmit = function (){
                $scope.onSubmitClick({
                    $data: $scope.model
                });
            };




            //删除
            $scope.onDelete = function (){

                var isdelete=confirm("确定要删除这条信息");
                if(isdelete)
                {
                $scope.onDeleteClick({
                    $data: $scope.model
                });
                }
                else
                {

                }
        };

            //修改
            $scope.onEdit = function() {
                $scope.onEditClick({
                    $data: $scope.model
                });
            };
            //预览
            $scope.onNewPreview = function() {
                $scope.model.preview = true;
                $scope.model.isNew = true;
                $scope.onPreviewClick({
                    $data: $scope.model
                });
            };
            //预览
            $scope.onEditPreview = function() {
                $scope.model.preview = true;
                $scope.model.isNew = false;
                $scope.onPreviewClick({
                    $data: $scope.model
                });
            };
            //获取设备播放内容
            $scope.onNewReal = function(){
            	$scope.onRealClick({
                    $data: $scope.model
                });
            };
          //获取设备播放内容
            $scope.onEditReal = function(){
            	$scope.onRealClick({
                    $data: $scope.model
                });
            };
            //取消
            $scope.onCancel = function (){
                $scope.model = angular.copy(origin);
                $scope.onCancelClick();
            };

            $rootScope.$on('menu:mainMenuClick', function (e){
            	$scope.onCancel();
            });


        };

        return {
            restrict:'EA',
            replace: true,
            priority: 10,
            link: linker,
            scope: {
                insertTitleShow: '=?',
                model: '=?',
                addFlag: '=?',
                onSubmitClick: '&',
                onDeleteClick: '&',
                onCancelClick: '&',
                onEditClick: '&',
                onRealClick: '&',
                onPreviewClick: '&'
            },
            templateUrl: 'app/$directives/vms/form-yj-vms.html'
        };
    }];
    
});