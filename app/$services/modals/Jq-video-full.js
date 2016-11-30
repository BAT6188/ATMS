define(function() {
    return ['$scope', '$modalInstance', 'param', '$rootScope',
    function($scope, $modalInstance, param, $rootScope) {

        var activeX = null;
        window.setTimeout(function() {
            if (param && param.activeX) {
                activeX = param.activeX;
            }
            var w = $('#container').css('width');
            var h = $('#container').css('height');
            w = w.slice(0, -2);
            w = parseInt(w) - 100;
            h = h.slice(0, -2);
            h = parseInt(h) - 50;
            $('.modal-dialog').width(w).height(h);
            $('#FULLVD').height(h - 100);
            $scope.move2full();
        }, 1000);

        $scope.move2full = function() {
            if(!activeX) {
                return;
            }
            activeX.move2full();
        };

        //关闭窗口
        $scope.close = function() {
            $modalInstance.close();
        };

    }];

});
