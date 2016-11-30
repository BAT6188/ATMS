define(function(require, exports, module){
  return ['DictCache', 'specialDuty', 'Duty', function(DictCache, specialDuty, Duty){
    
    var linker = function ($scope, el, attrs){
      //字典数据等
      DictCache('0015', function(dicts){
        $scope.levels = dicts;
      });

      $scope.record = {
        name: '新任务',
        startPoint: '新区出口',
        endPoint: '市政府',
        startTime: '2014-01-08 15:31:26',
        endTime: '2014-01-08 15:51:26',
        lineDesc: '',//路线描述
        sncs: [],
        monitors: [],
        principal:{id:81,name:""},
        principalPhone:"110120119",
        level: {code: '1'},
        status: {code: '1'},//任务状态, 未执行
        desc: '新区出口 >> 西环高架 >> 干将西路 >> 市政府'//任务描述
      };

      $scope.duty = {
        frequence: {code: 1, name: ''},
        status: {code: 1, name: ''},
        posts: []
      };

      //保存特勤任务
      $scope.save = function(){
        specialDuty.save($scope.record, function(data){
          if(!data.success){
            alert(data.msg);
            return;
          }
          
          var record = $scope.record = data.results;

          angular.extend($scope.duty, {
            name: '特勤任务>>' + record.name,
            type: {code: 4},
            level: record.level,
            startTime: record.startTime,
            endTime: record.endTime,
            desc: '特勤任务>>' + record.name + ', ' + record.desc
          });

          Duty.save($scope.duty, function(data){
            if(!data.success){
              alert(data.msg);
              return;
            }

            //更新特勤
            record.dutyId = data.results.id;
            specialDuty.update(record, function(data){
              if(!data.success){
                alert(data.msg);
                return;
              }
              console.log(data.results.id);
              //$location.path('JCZH.TQRW.PecialDuties/'+data.results.id+'/Edit');
            });

          });

        });
      };

      //绘制路线
      $scope.editRoute = function (){
        $scope.onCreateRoute();
      };
    };

    return {
      restrict:'EA',
      link: linker,
      scope: {
        onCreateRoute: '&',
        record: '=data'
      },
      templateUrl: 'app/JCZH/TQRW/directives/tq-info.html'
    };
  }];
});