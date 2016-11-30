define(function(require, exports, module){

    return ['PoliceTaskFeedback','$filter', function(PoliceTaskFeedback,$filter){

        var linker = function($scope,el,attrs) {
            $scope.newMsg = {
                'fileContent':'',
                'fileType':{},
                'filePath':''
            };
            //$scope.message;
           // $scope.message = [];
            //query
            var query = function(){
                //使用 service:FeedBack, 需要显视的注入 > line: 3
                if(!$scope.pTaskId || !$scope.police) return;
                PoliceTaskFeedback.query({'ptaskId':$scope.pTaskId,'policeNo':$scope.police.userId}, function(data){
                    if(!data.success){
                      alert(data.msg);
                      return;
                    }
                    $scope.total = data.total;
                    $scope.message = data.results;
                });
            };

            $scope.save  = function(){
                var police = $scope.police;
                var file = $scope.newMsg;
                if(!$scope.message){
                    $scope.message = [];
                }
                if(!police || !file) return;
                var feedback = {
                    'policeNo':police.userId,
                    'policeName':police.userName,
                    'ptaskId': $scope.pTaskId,
                    'feedbackTime': $filter('date')(new Date(), 'yyyy-MM-dd hh:mm:ss').toString(),
                    'fileContent':(file.fileContent) ? file.fileContent:null,
                    'fileType':(file.fileType) ? file.fileType: null,
                    'filePath':(file.filePath) ? file.filePath:null
                };

                PoliceTaskFeedback.save(feedback,function(data){
                    if(!data.success){
                        alert(data.msg);
                        return;
                    }
                    $scope.message.push(data.results);
                });
            };
            //单个删除
            $scope.remove = function(record,index){
                var ids = record.id+'';
                //alert(ids);
                PoliceTaskFeedback.remove({id: ids}, function(data){
                    if(!data.success){
                      alert(data.msg);
                      return;
                    }
                    $scope.message.splice(index,1);
                });
            };

            $scope.close = function (){
              $scope.onClose();
            };

/*            $scope.$watch('policeItem', function(){
                if($scope.policeItem !== 1) return
                query();
            });*/
/*            $scope.$watch('message', function(){
                if($scope.message){
                    console.log($scope.message.length);
                }
            });*/
        };

        return {
            restrict:'EA',
            link: linker,
            transclude: true,
            scope: {
               message: ' = data',
               police: ' = police',
               pTaskId: ' = ptask',
               policeItem: '=show',
               onClose: '&'
            },
            templateUrl: 'app/$directives/jq-police-message.html'
        };
    }];
    
});