define(function(require, exports, module) {
    var controller = ['$scope', '$http', '$routeParams',
    function($scope, $http, $routeParams) {

        $scope.isHome = true;
        var params = {};

        $scope.init = function() {
            //初始化
            params = {
                "inter_id" : 1,
                "intersection" : {
                    "0" : ["LO", "SO", "RO"],
                    "1" : ["LO", "SO", "RO"],
                    "2" : ["LO", "SO", "RO"],
                    "3" : ["LO", "SO", "RO"]
                },
                "image_size" : [400, 400],
                "lane_width" : 20
            };
            $(".signalMap").attr("src", "../signalMap?params=" + JSON.stringify(params));
            $http.get('app/JCXHKZXT/SSDTJK/signal.json').success(function(data) {
                _.each(data, function(item, i) {
                    setTimeout(function() {
                        params = {
                            "inter_id" : 1,
                            "intersection" : item.intersection,
                            "image_size" : [400, 400],
                            "lane_width" : 20
                        };
                        $(".signalMap").attr("src", "../signalMap?params=" + JSON.stringify(params));
                        if (data.length === i + 1) {
                            $scope.init();
                        }
                    }, item.time);
                });
            });
        };

        $scope.startLight = function() {
            $scope.init();
        }

        Date.prototype.format = function(format) {
            var o = {
                "M+" : this.getMonth() + 1, //month
                "d+" : this.getDate(), //day
                "h+" : this.getHours(), //hour
                "m+" : this.getMinutes(), //minute
                "s+" : this.getSeconds(), //second
                "q+" : Math.floor((this.getMonth() + 3) / 3), //quarter
                "S" : this.getMilliseconds() //millisecond
            }
            if (/(y+)/.test(format))
                format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
            if (new RegExp("(" + k + ")").test(format))
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            return format;
        }

        $http.get('app/JCXHKZXT/SBFA/colors.json').success(function(data) {
            $scope.colors = data;
        });
        $http.get('app/JCXHKZXT/SBFA/sbfa.json').success(function(data) {
            $scope.fas = data;
        }).then(function(data) {
            $scope.fa = $scope.fas[0];
            $scope.sb = $scope.fa.sbs[0];

            $scope.sj = [];
            var count = 0;
            for (var i = 0; i < $scope.fa.bhs.length; i++) {
                count += $scope.fa.bhs[i].value;
                $scope.sj.push(count);
            }

            $scope.entry = {
                qyh : '0',
                qylkh : '12',
                lkmc : '一环南路蓬莱路',
                ljzt : '联机',
                kzfs : '单点多',
                xhjcj : '宝康',
                lksj : new Date().format("yyyy-MM-dd hh:mm:ss"),
                fwqsj : new Date().format("yyyy-MM-dd hh:mm:ss"),
                szqc : '92',
                bzqyxsj : count,
                sbbh : '11'
            };
            $http.get('app/JCXHKZXT/XHJGL/xhjList.json').success(function(data) {
                $scope.xhjs = data;
                _.each(data, function(item){
                    if(item.no===$routeParams.no) {
                        $scope.entry.xhj = item.no;
                        $scope.name = item.name;
                    }
                });
            });

            $scope.auto = function() {
                $('#auto').hide();
                $('#cancel').show();
            };
            $scope.cancel = function() {
                $('#auto').show();
                $('#cancel').hide();
            };
        });

        $scope.$on('$destroy', function() {
            $scope.init = function() {
                return;
            }
        });

    }];

    module.exports = controller;
});

