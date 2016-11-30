define(function(require, exports, module){

    return ['FeedBack', function(FeedBack){

        var linker = function($scope,el,attrs) {
            //query
            $scope.query = function(){
                //使用 service:FeedBack, 需要显视的注入 > line: 3
                FeedBack.query({'pTaskId':1,'userId':'2'}, function(data){
                    console.log(q);
                    if(!data.success){
                      alert(data.msg);
                      return;
                    }
                    $scope.total = data.total;
                    $scope.records = data.results;
                });
            };

            $scope.submit = function(){
                console.log($scope.police);
                if(!$scope.police) return
                $scope.newMsg = {
                    'policeNo':police.userId,
                    'policeName':police.userName,
                    'feedbackTime': new Date()
                };
                console.log($scope.newMsg);
/*                FeedBack.save($scope.newMsg, function(data){
                    console.log(q);
                    if(!data.success){
                      alert(data.msg);
                      return;
                    }
                    $scope.query();
                });*/
            };

        };

        return {
            restrict:'EA',
            link: linker,
            transclude: true,
            scope: {
               message:' = data',
               police:' = police'
            },
            templateUrl: 'app/JCZH/ZHDD/directives/jq-police-message.html'
        };
    }];
    
});