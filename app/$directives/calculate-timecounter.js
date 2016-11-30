define(function(require, exports, module) {

    return [
    function() {

        var linker = function($scope, el, attrs) {

            var TIMECOUNTER = (function() {
                var d = 0, h = 0, m = 0, s = 0 ,timer;
                var _self = el.find('#timecounterShowtime');

                var second = function() {
                    if (s > 0 && (s % 60) === 0) {
                        m += 1;
                        s = 0;
                    }
                    if (m > 0 && (m % 60) === 0) {
                        h += 1;
                        m = 0;
                    }
                    if (h > 0 && (h % 24) === 0) {
                        d += 1;
                        h = 0;
                    }
                    t = d + "天" + h + ":" + m + ":" + s;
                    _self.html(t);
                    s += 1;
                };

                return {
                    startCalc : function() {
                        timer = setInterval(second, 1000);
                    },
                    stopCalc : function() {
                        if(timer) {
                            clearInterval(timer);
                        }
                    }
                };
            })();

            $scope.startclock = function() {
                TIMECOUNTER.startCalc();
            };

            $scope.startclock();

            $scope.$on('$destroy', function() {
                TIMECOUNTER.stopCalc();
            });

        };

        return {
            restrict : 'EA',
            link : linker,
            scope : {},
            templateUrl : 'app/$directives/calculate-timecounter.html'
        };
    }];

});
