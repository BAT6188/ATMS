define(function(require, exports, module){
    var i = 0;
    return ['$rootScope', function($rootScope){
      var linker = function($scope, el, attrs){
        //添加 ztree 样式
        el.addClass('ztree').attr('id', 'ztree' + i);
        i++;

        var treeObj, //保存 tree 对象的引用
        refresh = function(){//当setting或zNodes属性变化时重构树
          if(!$scope.zNodes || !$scope.setting){
            return;
          }

          if(treeObj) {
            treeObj.destroy();
          }

          if(attrs.checkedNodes){
            if(!$scope.setting.check){
              angular.extend($scope.setting, {
                    check: {enable:true}
                  });
            }

            if(!$scope.setting.callback) {
              $scope.setting.callback ={};
            }
            angular.extend($scope.setting.callback, {
              onCheck: function(){
                $scope.checkedNodes = treeObj.getCheckedNodes(true);
                $scope.$apply();
              }
            });
          }

          if(attrs.selectedNodes){
            if(!$scope.setting.callback) {
              $scope.setting.callback ={};
            }
            angular.extend($scope.setting.callback, {
              onClick: function(){
                $scope.selectedNodes = treeObj.getSelectedNodes();
                $scope.$apply();
              }
            });
          }
          

          treeObj = $.fn.zTree.init($(el), $scope.setting, $scope.zNodes);
          //将Tree对象的引用添加到内部$scope上，进而传递到通过tree-obj属性绑定的外部$scope上
          $scope.treeObj = treeObj;
          $rootScope.$broadcast('z-tree:init', $scope.treeObj);
        };

        //监视内部 $scope 属性 zNodes 的变化，zNode是 用 $watchCollection
        $scope.$watchCollection('zNodes', refresh);
        //监视内部 $scope 属性 setting 的变化
        $scope.$watch('setting', refresh);
      };

      return {
        restrict: 'EA',
        scope: {
          setting: '=',//通过z-tree的setting属性绑定parent $scope的属性
          zNodes: '=ngModel',//通过z-tree的ng-model属性绑定parent $scope的属性
          treeObj: '=?',//=? 意味是可选的
          checkedNodes: '=?',
          selectedNodes: '=?'
        },
        link: linker
      };
    }];

});