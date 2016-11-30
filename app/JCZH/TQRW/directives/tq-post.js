define(function(require, exports, module){
  return ['Duty', function (Duty){

    var linker = function ($scope, el, attrs){

      $scope.selectPosts = function (){
        $('#freePolices').modal();
        $scope.selecteds = $scope.post.polices;
      };

      $('#freePolices').on('hidden.bs.modal', function (e) {
        $scope.savePosts();
      })

      $scope.savePosts = function(){
        $scope.post.polices = $scope.selecteds;  //可采用watch的方法，实时保存

        for(var i=0;i<$scope.duty.posts.length;i++){
          if($scope.duty.posts[i].pid === $scope.post.pid){
            $scope.duty.posts[i] = $scope.post;
          }
        }

        Duty.update($scope.duty, function(data){
          if(!data.success){
            alert(data.msg);
            return;
          }
        });
      };


      //删除岗位已选警员中的某个警员
      $scope.removePolice = function(record){
        var data = _.filter($scope.post.polices, function(police){
          if(police.userId !== record.userId){
            return police;
          }
        });
        $scope.post.polices = data;
        $scope.selecteds = data;

        _.each($scope.polices,function(police){
          if(police.userId === record.userId){
            police.checked = false;
            return
          }
        });
      };

    };

    return {
      restrict:'EA',
      link: linker,
      scope: {
        duty:'=?',
        tqData: '=?',
        post: '=?',
        polices: '=?',//所有空闲警员
        selecteds:'=?' //选中的警员
      },
      templateUrl: 'app/JCZH/TQRW/directives/tq-post.html'
    };
  }];
});