define(function(require, exports, module){

    return [function(){

        var linker = function($scope,el,attrs) {
            $scope.items = [
                {'title':'警力','name':'police','code':'1','style':'fa-user yhte-ico-success','url':''},
                {'title':'视频','name':'deviceVideo','code':'2','style':'fa-video-camera','url':'../giserver/configs/deviceVideo'}//,
                //{'title':'信号机','name':'deviceSignal','code':'3','style':'fa-rss-square','url':'../giserver/configs/deviceSignal'}
            ];

            $scope.selectedItem = $scope.items[0]; 
            $scope.$parent.$parent.tipType = $scope.selectedItem.name;

            $scope.onClick = function (item,event){
                $(el).find('ul li i').removeClass('yhte-ico-primary');
                $scope.selectedItem = item;
                // $scope.$parent.$parent.tipType = $scope.selectedItem.name;
                $(event.target).addClass('yhte-ico-primary');
                $scope.view({
                    $viewCode: item.code
                });
            };
        };

        return {
            restrict:'EA',
            link: linker,
            replace: true,
            scope: {
                selectedItem:'=selectedItem',
                view: '&onItemClick'
            },
            templateUrl: 'app/$directives/jq-nearby-catalog.html'
        };
    }];
    
});