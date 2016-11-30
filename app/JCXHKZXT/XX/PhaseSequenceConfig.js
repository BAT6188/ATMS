define(function(require, exports, module) {
    var controller = ['$scope', 'Message', '$http', '$routeParams',
    function($scope, Message, $http, $routeParams) {
        $scope.data = [];
        $scope.total = $scope.data.length;
        $scope.page = 1;
        $scope.size = 10;
        $scope.maxSize = 3;
        $scope.selectedData = [];

        $scope.select = function(record) {
            _.each($scope.data, function(item) {
                item.checked = false;
            });
            record.checked = true;
            $scope.selectedData = record;
        };

        $http.get('app/JCXHKZXT/XX/xx.json').success(function(data) {
            $scope.data = data;
            var tid = $routeParams.id || '00';
            _.each($scope.data, function(item, i) {
                if (item.id === tid) {
                    item.checked = true;
                    $scope.selectedData = item;
                } else {
                    item.checked = false;
                }
            });
            $scope.total = data.length;
        });

        $scope.upload = function() {
            setTimeout(function() {
                Messenger().post({
                    message : '相序方案成功上传到数据库！',
                    type : 'success',
                    showCloseButton : true
                });
            }, 1000);
        }

        $scope.download = function() {
            setTimeout(function() {
                Messenger().post({
                    message : '数据库数据成功下载到相序方案！',
                    type : 'success',
                    showCloseButton : true
                });
            }, 1000);
        }
    }];

    module.exports = controller;
});

