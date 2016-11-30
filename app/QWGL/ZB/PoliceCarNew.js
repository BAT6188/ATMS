define(function (require, exports, module) {
    var controller = ['$scope', 'DictCache' ,'PoliceCar','Device','Query',
    function ($scope , DictCache , PoliceCar,Device ,Query) {
        $scope.Q = Query.data();

        //警用装备仓库
        DictCache("0032", function(dict){
            $scope.wareHouses = dict;
        });
        //警用装备leixing
        DictCache("0031", function(dict){
            $scope.types = dict;
        });
         //警用装备leixing
        DictCache("0035", function(dict){
            $scope.statuss = dict;
        });

        $scope.getData = function(){
            var q1 = $scope.Q.query();
            q1.typeCode = '7';
            Device.query(q1, function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                $scope.gps = data.results;
            });
            
            var q2 = $scope.Q.query();
            q2.typeCode = '8';
            Device.query(q2, function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                $scope.videos = data.results;
            });

            var q3 = $scope.Q.query();
            q3.typeCode = '10';
            Device.query(q3, function(data){
                if(!data.success){
                  alert(data.msg);
                  return;
                }
                $scope.radios = data.results;
            });
        };

        //保存警车信息
        $scope.save = function(){
            $scope.entity.status = {"code":"1","name":"空闲中","parent":{"code":"0035","name":"警用装备状态"},"status":{"code":"1","name":"有效"},"initFlag":"1"};

            PoliceCar.save($scope.entity, 
                function(data){
                    if(!data.success){
                      alert(data.msg);
                      return;
                    }
                    $scope.entity = {};
                    alert('添加成功!');
                });
        };

        $scope.getData();
    }];

    module.exports = controller;
});