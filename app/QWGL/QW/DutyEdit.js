define(function(require, exports, module){

  var controller = ['$scope', '$routeParams', 'Query','Duty', 'DictCache', '$window', 'Modal','User', 'Dept', 'Message',
  function($scope, $routeParams, Query, Duty, DictCache, $window, Modal,User,Dept, Message){

    $scope.state = 'calendar';
    $scope.selectPost = {};
    var modal = null;

    //类型
    DictCache('0014', function(dicts){
      $scope.types = dicts;
    });

    //等级
    DictCache('0015', function(dicts){
      $scope.levels = dicts;
    });

    $scope.events = [];

    //处理岗位
    $scope.handlePosts = function(){
      $scope.events.length = 0;
        //if($scope.record.posts.length === 0) return
        for(i = 0, size = $scope.record.posts.length; i<size;i++){
            $scope.record.posts[i].allDay = false;
            $scope.record.posts[i].model = angular.copy($scope.record.posts[i]);
            delete $scope.record.posts[i].id;
            $scope.events.push($scope.record.posts[i]);
        }
        var events = $scope.events;
        $scope.record.posts = events;
    };

    //请求勤务数据列表
    Duty.get({id: $routeParams.id}, function(data){
      if(!data.success){
        alert(data);
        return;
      }
      
      $scope.record = data.results;
      
      if(!$scope.record.posts){
        $scope.record.posts = [];
      }
      $scope.handlePosts();
    });

    //负责人数据
    User.query({},function(data){
        if(!data.success){
          alert(data.msg);
          return;
        }
        $scope.users = data.results;
    });



    //切换基本信息和排班
    $scope.changeState = function(state){
        $scope.state = state;
    }

    //选中岗位
    var whenPostsSelected = function(posts){
        _.each(posts, function(post){
            post.model = angular.copy(post);
            $scope.events.push(post);
        });
        // $scope.$apply();
        console.log('whenPostsSelected');
        //console.log($scope.record.posts);
    };

    //选择岗位
    $scope.selectPosts = function(date, allDay, jsEvent, view){
        $window.date = date;
        modal = Modal('./PostSelector');
        modal.result.then(whenPostsSelected,function(){
            console.log(arguments);
        });
    };


    
    //选中警员
/*    var whenPolicesSelected = function(polices){
        _.each(polices, function(police){
            $scope.selectPost.polices.push(police);
        });
    };*/

    //编辑岗位
    $scope.editPost = function(event, jsEvent, view){
        $scope.changeState('postDetail');
        $scope.selectPost = event.model;
        console.log($scope.selectPost);
        $scope.$apply();
        /*$window.selPost = event.model;
        modal = Modal('./PoliceSelector');
        modal.result.then(whenPolicesSelected,function(){
            console.log(arguments);
        });*/
    };

    //更新勤务信息
    $scope.updateDuty = function(){
        //$scope.savePost();
        console.log($scope.selectPost);
        //var post  = _.find($scope.record.posts, function(p){ return $scope.selectPost.pid === p.pid; });
        //post = $scope.selectPost;
        for(var i=0;i<$scope.record.posts.length;i++){
            var temp = $scope.record.posts[i];
            if($scope.selectPost.pid === temp.pid){
                temp = $scope.selectPost;
                i = $scope.record.posts.length;
            }
        }
        if($scope.record.principal){
            var principal = {
                name : $scope.record.userName,
                id : $scope.record.userId
            };
            $scope.record.principal = principal;
        }
        cleanDutyPost($scope.record);
        Duty.update($scope.record, function(data){
            if(!data.success){
                alert(data.msg);
                return;
            }
            $scope.record = data.results;
            $scope.handlePosts();
            alert('保存成功');
        });
    };

    //提取岗位所需字段
    var cleanDutyPost = function(record){
        var posts = [];
        for(var i=0,size=record.posts.length;i<size;i++){
            var post = record.posts[i];
            posts.push(_.pick(post, 'name', 'planEndTime', 'planStartTime', 'polices', 'pid', 'allDay'));
        }
        record.posts = posts;
    };

    //编辑岗位查看和添加新警员切换
    $scope.editViewChange = function(){
        $scope.editView = !$scope.editView;
        if($scope.editView){
            $('#pList').removeClass().addClass('col-md-5');
        }else{
            $('#pList').removeClass().addClass('col-md-12');
        }
    };


    //------------------------编辑岗位 编辑警员----------------------
        //警员查询Q
        $scope.Q = Query.data();

        // 全选功能
        $scope.checks = [];
       // $scope.selecteds = [];
        Dept.query({},function(data){
            $scope.deptments = [{'deptName':'全部'}].concat(data.results);
        });
        $scope.select = function(index){
            $scope.checks[index] = !$scope.checks[index];
            $scope.$$childTail.allChecked = _.every($scope.checks);
        };

        $scope.selectAll = function(){
            initCheck($scope.$$childTail.allChecked);
        };

        var initCheck = function(bool){
            var checks = [];
            for(var i = 0; i < $scope.total; i++){
                checks.push(bool);
            }
            $scope.checks = checks;
        };

        // 查询功能
        var _query = function(){
            var q = $scope.Q.query();

            $scope.allChecked = false;

            Duty.police(q, function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                $scope.total = data.total;
                initCheck(false);
                $scope.policeList = data.results;
            });

        };

        $scope.pChange = function(page){
            $scope.Q.page = page;
            _query();
        };

        $scope.query = function(){
            $scope.pChange(1);
        };

        //添加警员
        $scope.getPolice = function(i){
            var selecteds = $scope.selectPost.polices;
            if(i === true){
                initCheck(true);
                $scope.selectPost.polices = $scope.policeList;
                return;
            }
            
/*            for(var i = 0; i < $scope.checks.length; i++){
                if($scope.checks[i] && !_.contains($scope.selectPost.polices,$scope.policeList[i])){
                    selecteds.push($scope.policeList[i]);
                }
            }*/
            for(var i = 0, size = $scope.checks.length; i < size; i++){
                //遍历所有警员数据
                if($scope.checks[i]){
                    //警员被选中
                    var isContain = false;
                    _.each(selecteds, function(item){
                        if(item.userId === $scope.policeList[i].userId){
                            isContain = true;
                        }
                    });
                    if(!isContain) selecteds.push($scope.policeList[i]); 
                }
            }
            console.log($scope.selectPost.polices.length);
        };

        //删除选中警员
        $scope.dropPolice = function(i){
            if(i === true) {
                $scope.selectPost.polices= [];
                return;
            }
            $scope.selectPost.polices.splice(i,1);
            console.log($scope.selectPost.polices.length);
        };

/*        //保存岗位信息
        $scope.savePost = function(){
            console.log($scope.selectPost);
            $scope.updateDuty();
            if($scope.editView) $scope.editViewChange()
        };*/

        $scope.removePost = function(){
             Message.confirm('提示', '确认删除 ' + $scope.selectPost.name + ' 这个岗位吗?', {}, _removePost, onNo);
        };

        //删除岗位
        var _removePost = function(){
            console.log('remove');
            for(var i = 0 ;i < $scope.record.posts.length; i++){
                if($scope.selectPost.pid === $scope.record.posts[i].pid){
                    console.log($scope.selectPost.pid);
                    $scope.record.posts.splice(i,1);
                    i = $scope.record.posts.length;
                    $scope.selectPost = {};
                    console.log($scope.record.posts.length);
                }
            }
            $scope.updateDuty();

            $scope.state = 'calendar';
        };

        var onNo = function(){
          console.log("onNo");

        };
        //确认人员到岗
        $scope.confirmStart = function(police){
            var startTime = new Date();
            var _data = {
                //岗位编号
                mark: '1',
                recordId: police.recordId +''
            };
            Duty.updatePoliceStatus(_data,function(data){
                if(!data.success){
                    alert(data.msg);
                    return;
                }
                police.actualStartTime = data.results.actualStartTime;
                console.log(police);
            });
        };

         //确认人员离岗
        $scope.confirmEnd = function(police){
            var endTime = new Date();
            var _data = {
                mark: 2,
                recordId: police.recordId 
            };
            Duty.updatePoliceStatus(_data,function(data){
                if(!data.success){
                    alert(data.msg);
                    return;
                }

                police.actualEndTime = data.results.actualEndTime;
                console.log(police);
            });
        };
        _query();
  }];

  module.exports = controller;
});