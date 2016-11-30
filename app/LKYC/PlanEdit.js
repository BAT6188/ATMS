define(function (require, exports, module) {
    var controller = ['$scope', 'DictCache','$routeParams','Restangular','Plan', function ($scope, DictCache,$routeParams, Rest, Plan) {
        $scope.weeks = [{code:'1',name:'周一'},{code:'2',name:'周二'},{code:'3',name:'周三'}
			,{code:'4',name:'周四'},{code:'5',name:'周五'},{code:'6',name:'周六'}
			,{code:'7',name:'周日'}];
        
        DictCache("0103", function(dict){
            $scope.statuses = dict;
        }, false);

        $scope.record = {
            //开始时间
            start : $routeParams.sd+" "+$routeParams.st,
            //结束时间
            end :$routeParams.ed+" "+$routeParams.et
        };
        
    	Rest.all('roadSetting').get($routeParams.id).then(function (data){
            if(!data.success){
              alert(data.msg);
            }
            $scope.entity = data.results;
            

            $scope.entity.startWeek = $scope.weeks[$scope.entity.startWeek*1-1];
            $scope.entity.endWeek = $scope.weeks[$scope.entity.endWeek*1-1];
            $scope.origin = angular.copy($scope.entity);
          });


        $scope.roadSectionId = $routeParams.roadSectionId;
        $scope.roadName = $routeParams.roadName;

      //保存
      $scope.save = function(){
    	  var startAry = $scope.record.start.split(' ');
    	  $scope.entity.startDate = startAry[0];
    	  var srartTimeAry = startAry[1].split(':');
    	  $scope.entity.startTime = srartTimeAry[0]+srartTimeAry[1];
    	  var endAry = $scope.record.end.split(' ');
    	  $scope.entity.endDate = endAry[0];
    	  var endTimeAry = endAry[1].split(':');
    	  $scope.entity.endTime = endTimeAry[0]+endTimeAry[1];
    	  
    	  $scope.entity.startWeek = $scope.entity.startWeek.code;
    	  $scope.entity.endWeek = $scope.entity.endWeek.code;
    	  $scope.entity.roadSectionId = $routeParams.roadSectionId;
    	  Plan.update($scope.entity, function(data){
          if(!data.success){
            alert(data.msg);
            return;
          }
          alert('更新成功!');
        });
      };

      //重置
      $scope.reset = function(){
    	  console.log($scope.entity);
    	  console.log($scope.origin);
        $scope.entity = angular.copy($scope.origin);
        console.log($scope.entity);
      };

    }];

    module.exports = controller;
})
