define(function(require, exports, module){
  return [function (){
    var i = 0;
    var days = ['周日','周一','周二','周三','周四','周五','周六'];
    var date = new Date();
    var day = days[date.getDay()];
    var dateStr = (date.getMonth()+1) +'/'+ date.getDate() + ' '+date.getFullYear();;

    var linker = function($scope,element,attrs) {
      $scope.types = [
        {name:'晴',code:'iconfont-sunny'},
        {name:'阴',code:'iconfont-cloud'},
        {name:'雨',code:'iconfont-rainy'}
      ];

      $scope.weather = {
        type:{name:'晴',code:'iconfont-sunny'},
        low: '22',
        high:'34',
        date: dateStr + " " + day
      };
    };

    return {
      restrict:'EA',
      replace: true,
      scope: {
        
      },
      templateUrl:'app/$directives/weather.html',
      link: linker
    };
  }];
});