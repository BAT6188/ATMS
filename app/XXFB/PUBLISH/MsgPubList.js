define(function (require, exports, module) {
    var controller = ['$scope', '$modal', 'Modal', 'DictCache', 'Message', 'Query', 'Restangular', 
    function ($scope, $modal, Modal, DictCache, Message, Query, Rest) {
        //信息来源
        DictCache("0114", function(dict){
            $scope.sources = dict;
        });

        //信息类型
        DictCache("0111", function(dict){
            $scope.types = dict;
        });

        //发送目标
        DictCache("0112", function(dict){
            $scope.targets = dict;
        });

        //发送状态
        DictCache("0113", function(dict){
            $scope.statuses = dict;
        });

        //切换查询方式
        $scope.advance = function(){
            $scope.showAdvance = !$scope.showAdvance;
            // $scope.Q.startOwnTime = null
            // $scope.Q.endOwnTime = null;
        };
        
        $scope.Q = Query.data();

        // 全选功能
        $scope.checks = [];

        $scope.select = function(index){
            $scope.checks[index] = !$scope.checks[index];
            $scope.allChecked = _.every($scope.checks);
        };

        var initCheck = function(bool){
            var checks = [];
            for(var i = 0; i < $scope.total; i++){
                checks.push(bool);
            }
            $scope.checks = checks;
        };

        // $scope.selectAll = function(){
          // $scope.allChecked = !$scope.allChecked;
          // initCheck($scope.allChecked);
        // };

        // 查询功能
        var _query = function(){
            var q = $scope.Q.query();
            $scope.allChecked = false;
            
            Rest.all('').one('msgPub').one('list').post('', q).then(function(data) {
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                $scope.total = data.total;
                $scope.records = data.results;
                initCheck(false);
            }, function(e) {
                console.log(e);
            }); 
        };

        _query();

        $scope.pChange = function(page){
            $scope.Q.page = page;
            _query();
        };

        $scope.query = function(){
            $scope.pChange(1);
        };

        //查看详情
        $scope.infoModal = function(record){
            if(!(record && record.id)) {
              Message.warning('提示信息', '信息下发ID不存在！');
              return;
            }
            $('#imgTrs').empty();
            if(record.imgNum)
            {
              var view = '';
              for (var i = 1; i <= record.imgNum; i++){
                //奇数
                if(i%2)
                {
                  view += '<tr>' +
                    '<td colspan="2">' +
                      '<div style="background: #f5f5f5; width: 100%; height: 100%; text-align: center;">' +
                        '<img width="250px" height="150px" style="vertical-align:middle; border:0;" ' +
                         'src="../java/msgPub/'+record.id+'/img/'+i+'" />' +
                      '</div>' +
                   '</td>';
                }
                else
                {
                   view += '<td colspan="2">' +
                     '<div style="background: #f5f5f5; width: 100%; height: 100%; text-align: center;">' +
                       '<img width="250px" height="150px" style="vertical-align:middle; border:0;" ' +
                         'src="../java/msgPub/'+record.id+'/img/'+i+'" />' +
                     '</div>' +
                  '</td>' +
                '</tr>';
                }
              }
              if(record.imgNum%2)
              {
                view += '<td colspan="2">' +
                  '</td>' +
                '</tr>';
              }
              $('#imgTrs').html(view);
            }
            $scope.checkRecord = record;
            $('#infoModal').modal();
        };

    }];

    module.exports = controller;
});