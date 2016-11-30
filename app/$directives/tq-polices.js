define(function(require, exports, module){
    return ['$parse', '$filter','Query', 'PoliceGps',function($parse, $filter,Query,PoliceGps){

      var linker = function($scope,element,attrs) {

        $scope.Q = Query.data();
        $scope.checks = [];

        $scope.polices = [];

        $scope.select = function(index){
            $scope.checks[index] = !$scope.checks[index];
            $scope.allChecked = _.every($scope.checks);
            // console.log($scope.allChecked);
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

        $scope.$watch('post',function(){
          if($scope.post){
            $scope.x = $scope.post.geometry.x || null;
            $scope.y = $scope.post.geometry.y || null;
            // console.log($scope.post.geometry);
          }
          _query();
        });

        var _query = function(){
            var q = $scope.Q.query();
            q.lng = $scope.x;
            q.lat = $scope.y;

            console.log(q);
            $scope.allChecked = false;

            PoliceGps.listByDept(q,function(data){
              $scope.total = data.total || $scope.total; //后台total有问题
              $scope.data = data.results;
              initCheck(false);
            });

        };

        $scope.pChange = function(page){
            $scope.Q.page = page;
            _query();
        };

        $scope.query = function(){
            $scope.pChange(1);
        };

        $scope.close = function (){
          $scope.policeShow = false;
          $scope.checks= [];
        };

        $scope.addPolices = function(){
          for(var i = 0, size = $scope.checks.length; i < size; i++){
              if($scope.checks[i]){
                  $scope.polices.push($scope.data[i]);
              }
          }
        };


      };

      return {
        restrict:'EAC',
        replace: true,
        scope: {
          deptCode:'=?',       //部门编号
          polices:'=?checks',    //选中项，向外暴露           
          // onItemClick:'&',   //单击选中向实际处理
          data:'=?' ,     //结果集，向外暴露(全部警员)
          policeShow:'=?',
          post:'=?'
        },
        templateUrl:'app/$directives/tq-polices.html',
        link: linker
      };
    }];
});