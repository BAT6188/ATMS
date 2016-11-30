define(function(require, exports, module){
  
  var controller = ['$scope', '$rootScope', '$location','specialDuty', function ($scope, $rootScope, $location,specialDuty){
    $scope.step = 0;

    //岗位列表
    $scope.posts = [];

    //初始设置
    $scope.record = {
      parentStaskId: '0',//值为0说明这是支队任务
      status: {code: '0'},//未处理
      principalPhone: '110',//责任人电话,向前兼容
      principal: {id: '110', name: '110'},//责任人
      points: []
    };

    $scope.$watch('record', function (record){
      console.log(record);
    },true);

    $scope.onSaveClick = function (){
      console.log($scope.record);
      var msg = JSON.stringify($scope.record, null, 2);
      alert(msg);
    };

  }];

  module.exports = controller;
});