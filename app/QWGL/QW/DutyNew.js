define(function (require, exports, module) {

    var controller = ['$scope', '$location', 'Duty', 'DictCache', 'Modal', '$window','Query','$location','User',
    function ($scope, $location, Duty, DictCache, Modal, $window, Query, $location, User) {
        
        $scope.state = 'info';

        $scope.backState = function(){
            $scope.state = $scope.prevState||$scope.state;
        };

        $scope.gotoState = function(state){
            $scope.prevState = $scope.state;
            $scope.state = state;
        };

        DictCache('0014', function(dicts){
            $scope.types = dicts;
        });

        DictCache('0015', function(dicts){
            $scope.levels = dicts;
        });

        User.query({},function(data){
            if(!data.success){
              alert(data.msg);
              return;
            }
            $scope.users = data.results;
        });

        $scope.record = {
            name: '测试数据',
            frequence: {code: 1, name: ''},
            status: {code: 1, name: ''},
            startTime: '2014-01-07 14:48:58',
            endTime: '2014-01-07 14:49:27',
            desc: '这是一条测试数据',
            posts: [],
            type:{
                code:'1',
                name:'警用汽车'
            },
            level:{
                code:'1',
                name:'一级'
            }
        };

        $scope.next = function(){
            $scope.gotoState('calendar');
            console.log($scope.record);
        };

        var modal = null;

        var whenPostsSelected = function(posts){
            _.each(posts, function(post){
                $scope.record.posts.push(post);
                post.model = post;
            });
            console.log('whenPostsSelected');
        };

        //选择岗位
        $scope.selectPosts = function(date, allDay, jsEvent, view){
            $window.date = date;
            modal = Modal('./PostSelector');
            modal.result.then(whenPostsSelected,function(){
                console.log(arguments);
            });
        };

        var whenPolicesSelected = function(polices){
            _.each(polices, function(police){
                $scope.selectPost.polices.push(police);
            });
        };
        $scope.changeState = function(state){
            $scope.state = state;
            /*        if(element){
                    $(element.currentTarget).addClass('legendActive');
                    $(element.currentTarget).siblings().removeClass(); 
                }*/
                //$event.addClass('yhteHighlight');
            }
        //编辑岗位
        $scope.editPost = function(event, jsEvent, view){
            $scope.changeState('postDetail');
            $scope.selectPost = event.model;
            console.log($scope.selectPost);
/*            $scope.selectPost = event.model;
            $window.selPost = event.model;
            modal = Modal('./PoliceSelector');
            modal.result.then(whenPolicesSelected,function(){
                console.log(arguments);
            });*/
        };

        //删除岗位
        $scope.delPost = function(){
            var bool = confirm('确认删除该岗位吗?');
            if(bool){
                var posts = $scope.record.posts;
                for(var i = 0,size = posts.length; i < size; i++){
                    if($scope.selectPost === posts[i]){
                        console.log(posts);
                        posts.splice(i, 1);
                        console.log(posts);
                        $scope.selectPost = null;
                        $scope.gotoState('calendar');
                        return;
                    }
                }
            }
        };

        //
        $scope.savePost = function(){
            if($scope.record.principal){
                var principal = {
                    name : $scope.record.userName,
                    id : $scope.record.userId
                };
                $scope.record.principal = principal;
            }

            Duty.save($scope.record, function(data){
                if(!data.success){
                    alert(data.msg);
                    return;
                }
                alert('保存成功,将跳转到编辑页面');
                $location.path('QWGL.QW.Duty/'+data.results.id+'/Edit');
            });
        };

        var cleanPost = function(record){
            var posts = [];
            for(var i=0,size=record.posts.length;i<size;i++){
                var post = record.posts[i];
                posts.push(_.pick(post, 'name', 'planEndTime', 'planStartTime', 'polices', 'postId', 'allDay', 'pid'));
            }
            record.posts = posts;
        };
            //编辑岗位查看和添加新岗位切换
        $scope.editViewChange = function(){
            $scope.editView = !$scope.editView;
            if($scope.editView){
                $('#pList').removeClass().addClass('col-md-5');
            }else{
                $('#pList').removeClass().addClass('col-md-12');
            }
        };
        //------------------------编辑岗位----------------------
        //警员查询Q
        $scope.Q = Query.data();

        // 全选功能
        $scope.checks = [];
        var selecteds = [];

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
            selecteds = [];
            if(i === true){
                initCheck(true);
            }
            for(var i = 0; i < $scope.checks.length; i++){
                if($scope.checks[i] && !_.contains($scope.selectPost,$scope.policeList[i])){
                    selecteds.push($scope.policeList[i]);
                }
            }
            $scope.selectPost.polices = $scope.selectPost.polices.concat(selecteds);
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
        _query();
    }];

    module.exports = controller;
});