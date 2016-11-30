define(function(require, exports, module) {

    return ['Status', '$rootScope',
    function(Status, $rootScope) {

        var linker = function($scope, $el, $attrs) {
            $scope.$watch('type', function(type) {
                if (type) {
                    Status.get(type, function(data) {
                        if (type === 'roadSectionState') {
                            _.each(data, function(item) {
                                switch(item.statusCode) {
                                    case "1":
                                        item.icon = 2;
                                        break;
                                    case "3":
                                        item.icon = 1;
                                        break;
                                    case "4":
                                        item.icon = 5;
                                        break;
                                }
                            });
                        } else if (type === 'police' || type === "policeCar") {
                            _.each(data, function(item) {
                                switch(item.statusCode) {
                                    case "0":
                                        item.icon = 3;
                                        break;
                                    case "1":
                                        item.icon = 2;
                                        break;
                                    case "2":
                                        item.icon = 1;
                                        break;
                                }
                            });
                        } else if (type === 'policeTask') {
                            _.each(data, function(item) {
                                switch(item.statusCode) {
                                    case "1":
                                        item.icon = 5;
                                        break;
                                    case "2":
                                        item.icon = 1;
                                        break;
                                    case "3":
                                        item.icon = 2;
                                        break;
                                }
                            });
                        } else if (type === 'deviceVideo' || type === 'deviceSignal' || type === 'deviceMsgPublish' || type === 'monitor' || type === 'igate') {
                            _.each(data, function(item) {
                                switch(item.statusCode) {
                                    case "1":
                                        item.icon = 2;
                                        break;
                                    case "2":
                                        item.icon = 5;
                                        break;
                                    case "3":
                                        item.icon = 4;
                                        break;
                                    case "4":
                                        item.icon = 1;
                                        break;
                                    case "5":
                                        item.icon = 3;
                                        break;
                                }
                            });
                        }
                        $scope.status = data;
                        $scope.layer.status = $scope.status;
                    });
                }
            })

          $rootScope.$on('navbar:change',function(e, msg){
            if (msg.type) {
              var type = msg.type;
              Status.get(type, function(data) {
                if (type === 'roadSectionState') {
                  _.each(data, function(item) {
                    switch(item.statusCode) {
                      case "1":
                        item.icon = 2;
                        break;
                      case "3":
                        item.icon = 1;
                        break;
                      case "4":
                        item.icon = 5;
                        break;
                    }
                  });
                } else if (type === 'police' || type === "policeCar") {
                  _.each(data, function(item) {
                    switch(item.statusCode) {
                      case "0":
                        item.icon = 3;
                        break;
                      case "1":
                        item.icon = 2;
                        break;
                      case "2":
                        item.icon = 1;
                        break;
                    }
                  });
                } else if (type === 'policeTask') {
                  _.each(data, function(item) {
                    switch(item.statusCode) {
                      case "1":
                        item.icon = 5;
                        break;
                      case "2":
                        item.icon = 1;
                        break;
                      case "3":
                        item.icon = 2;
                        break;
                    }
                  });
                } else if (type === 'deviceVideo' || type === 'deviceSignal' || type === 'deviceMsgPublish' || type === 'monitor' || type === 'igate') {
                  _.each(data, function(item) {
                    switch(item.statusCode) {
                      case "1":
                        item.icon = 2;
                        break;
                      case "2":
                        item.icon = 5;
                        break;
                      case "3":
                        item.icon = 4;
                        break;
                      case "4":
                        item.icon = 1;
                        break;
                      case "5":
                        item.icon = 3;
                        break;
                    }
                  });
                }
                $scope.status = data;
                $scope.layer.status = $scope.status;
              });
            }
          });
        };

        return {
            restrict : 'EA',
            link : linker,
            scope : {
                type : '=',
                layer : '=?'
            },
            templateUrl : 'app/$directives/status-label.html'
        };
    }];

}); 