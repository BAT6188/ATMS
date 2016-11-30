define(function() {'user strict';
    return ['$scope', '$modalInstance', 'param', '$rootScope',
    function($scope, $modalInstance, param, $rootScope) {

        var initWechat = function(record) {
            var temp = {};
            temp.title = '施工占道提醒';
            var content = '';
            if (record.roadDesc) {
                content += '施工路段-描述：' + record.roadDesc + '\n';
            }
            if (record.startTime) {
                content += '开始时间：' + record.startTime + '\n';
            }
            if (record.endTime) {
                content += '结束时间：' + record.endTime;
            }
            temp.content = content;
            temp.type = {
                code : '1',
                name : '施工占道'
            };
            temp.pics = [];
            if (record && record.imgUrl) {
                if(record.imgUrl) {
                    var path = record.imgUrl;
                    var name = path.substring(path.lastIndexOf('/') + 1);
                    // var prefix = JCBK_PIC_URL;
                    // path = prefix + path.substring(path.lastIndexOf('/') + 1);
                    temp.pics.push({
                        'path' : path,
                        'name' : name
                    });
                }
            }
            // temp.pics.push({
                // 'path' : 'http://127.0.0.1:8081/22.jpg',
                // 'name' : '22.jpg'
            // });
            $rootScope.$broadcast('wechat:feature', temp);
        };
        window.setTimeout(function() {
            if (param && param.record) {
                initWechat(param.record);
            }
        }, 1000);

        //关闭窗口
        $scope.close = function() {
            $modalInstance.close();
        };

    }];

});
