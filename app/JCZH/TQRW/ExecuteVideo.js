define(function(require, exports, module) {

    var controller = ['Device', '$scope', '$routeParams', 'specialDuty', 'Buffer', 'Restangular',
    function(Device, $scope, $routeParams, specialDuty, Buffer, Rest) {

        $scope.size = 10;
        $scope.page = 1;
        $scope.isHideVideo = true;

        var session = JSON.parse(sessionStorage._login).sessionId;

        socket.emit('subscribe',{
            clientType:'video',
            id: $routeParams.id + session +'signalVideosExec'
        });

        socket.on('videoDispatch:' + $routeParams.id + session+'signalVideosExec', function(data) {
            // console.log(data);
            $scope.selected = data.videos;
            $scope.total = $scope.selected.config.videos.length;
            $scope.$apply();
            // console.log($scope.total, $scope.selected);
            if($scope.isHideVideo) {
                $scope.isHideVideo = false;
            }
            initData();
        });

        var initData = function() {
            /*var data = {
                "id" : 271,
                "action" : "signalVideosCast",
                "videos" : {
                    "id" : "1583",
                    "name" : "淮海路-中山路",
                    "lng" : 117.180416,
                    "lat" : 34.265044,
                    "config" : {
                        "yzw" : {
                            "name" : "东西方向",
                            "code" : "c"
                        },
                        "videos" : [{
                            "id" : "2148214@009@001$1$0$0",
                            "name" : "淮海路*中山路-东-西-03（Z-C-07）",
                            "lng" : 117.18003570758823,
                            "lat" : 34.264888315289674,
                            "config" : ""
                        }, {
                            "id" : "2148215@009@001$1$0$0",
                            "name" : "淮海路*中山路-东-西-02（Z-C-07）",
                            "lng" : 117.18006541749477,
                            "lat" : 34.26493585114012,
                            "config" : ""
                        }]
                    },
                    "$$hashKey" : "02K"
                },
                "session" : "890450AE5676EA72D47A9CD5D631DC81"
            };
            $scope.selected = data.videos;
            $scope.total = data.videos.config.videos.length;*/

            if(!$scope.selected || !$scope.selected.config || !$scope.selected.config.videos) {
                return;
            }
            _.each($scope.selected.config.videos, function(item) {
                if (item && item.id) {
                    item.properties = {
                        "DEVICE_TYPE" : "2",
                        "ID" : item.id
                    };
                }
            });
            $scope.roadVideos = {
                'regionCode' : 271,
                'videos' : $scope.selected.config.videos
            };
            $scope.$apply();
        };
    }];

    module.exports = controller;
}); 