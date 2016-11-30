define(function (require, exports, module) {
    var controller = ['$scope','$routeParams', 'Dept','DictCache', 'Violation', function ($scope, $routeParams, Dept,DictCache, Violation) {
        //获取管辖区域字典
        DictCache('0036', function(dicts){
            $scope.areass = dicts;
        });
        
        var deptId = $routeParams.id;

        var origin;
        
        //部门类型显示与否绑定
        // $scope.typeShow = false;
        //switch 绑定模型
        // $scope.typeClass = true;

        Dept.query({},function(data){
            if(data.success && data.results && data.results.length>=1) {
              $scope.parentDepts = [{'deptName':'', 'deptCode':''}].concat(data.results);
            }
      // $scope.$watch('entity.parentDept', function(){
        // if($scope.entity.parentDept.deptCode === "0001"){
          // $scope.typeShow = true;
        // }else{
          // $scope.typeShow = false;
        // }
      // });
        });

        Violation.listDaduiList({},function(data){
            if(!data.success){
              alert(data.msg);
              return;
            }
            $scope.depts = [{'deptName':'', 'deptCode':''}].concat(data.results);
        });

        Dept.get({id: deptId}, function(data){
          if(!data.success){
            alert(data.msg);
            return;
          }
          origin = data.results;
          // console.log(origin);
          $scope.entity = angular.copy(origin);
          if($scope.entity && $scope.entity.parentDept && $scope.entity.parentDept.deptCode) {
              $scope.selectedDeptCode = $scope.entity.parentDept.deptCode;
          }
          if($scope.entity && $scope.entity.parentAreaDept && $scope.entity.parentAreaDept.deptCode) {
              $scope.selectedAreaDeptCode = $scope.entity.parentAreaDept.deptCode;
          }
        });

        $scope.save = function(){
          if($scope.entity.initFlag==='1'){
            alert('系统初始,不能修改!');
            return;
          }
          // $scope.entity.parentAreaDept.deptCode = $scope.typeClass&&$scope.typeShow? $scope.entity.deptCode : $scope.entity.parentDept.deptCode;
          if(angular.equals($scope.entity, origin)){
            alert('数据没有修改!');
            return;
          }
          if($scope.entity && $scope.entity.parentDept && $scope.entity.parentDept.length>=1) {
            $scope.entity.parentDept = $scope.entity.parentDept[0];
          }
          if($scope.entity && $scope.entity.parentAreaDept && $scope.entity.parentAreaDept.length>=1) {
            $scope.entity.parentAreaDept = $scope.entity.parentAreaDept[0];
          }
          if (!$scope.entity.parentAreaDept || !$scope.entity.parentAreaDept.deptCode || $scope.entity.parentAreaDept.deptCode === '') {
            alert('请选择所属大队/支队!');
            return;
          }
          if (!$scope.entity.parentDept || !$scope.entity.parentDept.deptCode || $scope.entity.parentDept.deptCode === '') {
            alert('请选择上级部门!');
            return;
          }
          Dept.update($scope.entity, function(data){
            if(!data.success){
              alert(data.msg);
              return;
            }
            origin = data.results;
            $scope.entity = angular.copy(origin);
            alert('更新成功!');
          })
        };

        $scope.reset = function(){
          $scope.entity = angular.copy(origin);
        };
    }];

    module.exports = controller;
})
