define(function(require, exports, module){
  return ['Dept', function(Dept){
    
    var linker = function ($scope, el, attrs){

      $scope.select = function (record){
        record.checked = !record.checked;
        var data = _.filter($scope.records, function(record){
            return record.checked;
        });
        $scope.selecteds = data;
      };

      var query = function (){
        Dept.query({}, function (data){
          if(!data.success){
            alert(data.msg);
            return;
          }
          $scope.records = data.results;
          if($scope.tqData.childIds) {
            _.each($scope.records, function (record){
              _.each($scope.tqData.childIds, function(id){
                if(id === record.deptId){
                  record.checked = true;
                }
              });
            });
            var data = _.filter($scope.records, function(record){
                return record.checked;
            });
            $scope.selecteds = data;
          }
        });
      };
      
      $scope.apply = function (){
        $scope.onApply();
      };

      $scope.$watch('tqData', function (){
        if($scope.tqData){
          query();
        }
      })

    };

    return {
      restrict:'EA',
      link: linker,
      scope: {
        onApply: '&',
        tqData: '=',
        selecteds: '=?'
      },
      templateUrl: 'app/JCZH/TQRW/directives/tq-dd-list.html'
    };
  }];
});