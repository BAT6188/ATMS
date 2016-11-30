define(function (require, exports, module) {
    var controller = ['$scope', 'Dept','DictCache', 'Violation', function ($scope, Dept,DictCache,Violation) {
      
      $scope.entity = {};
      // $scope.entity.parentDept = {};
      // $scope.entity.parentAreaDept = {};
      // $scope.parentDepts = [{'deptName':'全部'}];

      //获取管辖区域字典
      DictCache('0036', function(dicts){
          $scope.areass = dicts;
          $scope.entity.area = $scope.areass[0];
      });
      
      //部门类型显示与否绑定
      // $scope.typeShow = false;
      //switch 绑定模型
      // $scope.typeClass = true;

      Dept.query({},function(data){
        if(data.success && data.results && data.results.length>=1) {
          $scope.parentDepts = [{'deptName':'', 'deptCode':''}].concat(data.results);
        }
        // $scope.entity.parentDept = $scope.parentDepts[0]; 
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

      $scope.save = function(){
      // $scope.entity.parentAreaDept = {};
        // $scope.entity.parentAreaDept.deptCode = $scope.typeClass&&$scope.typeShow? $scope.entity.deptCode : $scope.entity.parentDept.deptCode;
        if($scope.entity && $scope.entity.parentDept && $scope.entity.parentDept.length>=1) {
            $scope.entity.parentDept = $scope.entity.parentDept[0];
        }
        if($scope.entity && $scope.entity.parentAreaDept && $scope.entity.parentAreaDept.length>=1) {
            $scope.entity.parentAreaDept = $scope.entity.parentAreaDept[0];
        }
        if(!$scope.entity.parentAreaDept || !$scope.entity.parentAreaDept.deptCode || $scope.entity.parentAreaDept.deptCode===''){
            alert('请选择所属大队/支队!');
            return;
         }
        if(!$scope.entity.parentDept || !$scope.entity.parentDept.deptCode || $scope.entity.parentDept.deptCode===''){
            alert('请选择上级部门!');
            return;
         }
        Dept.save($scope.entity, function(data){
          console.log(data);
          if(!data.success){
            alert(data.msg);
            return;
          }
          $scope.reset();
          alert('添加成功!');
        });
      };

      $scope.reset = function(){
        $scope.entity = {};
      };

    }];

    module.exports = controller;
})
