/*

This datetimepicker is a simple angular wrapper of bootstrap datetimepicker(https://github.com/smalot/bootstrap-datetimepicker), which is the best I could found so far. 
It depends on the following stuffs:
1. bootstrap.css 2 or 3 
2. bootstrap-datetimepicker.css
3. jquery.js
4. bootstrap.js
5. bootstrap-datetimepicker.js
6. angular.js

Sample:
  <datetimepicker ng-model='date' today-btn='true' minute-step='30' ></datetimepicker>

Ron Liu
5/2/2014

*/

angular.module('angularjs-bootstrap-datetimepicker', [])

.directive('datetimepickerNew', ['$filter', function ($filter) {
  function _byDefault(value, defaultValue) {
    return _isSet(value) ? value : defaultValue;
    function _isSet(value) {
      return !(value === null || value === undefined || value === NaN || value === '');
    }
  }

  return {
    restrict: 'EAC',
    replace: true,
    scope: {
      ngModel: '=?',
      format: '=?',
      todayBtn: '@',
      weekStart: '@',
      minuteStep: '@',
      placeholder: '@',
      startView: '=?',
      minView: '=?',
      maxView: '=?',
      realDate: '=?',
      realDateString: '=?',
      startDate:'=?',
      endDate:'=?'
    },
    template: '<input type="text" placeholder="{{placeholder}}">',
    // template: '<div class="input-append add-on"><input type="text" placeholder="{{placeholder}}" class="form-control input-sm"></div>',

    link: function (scope, element, attrs) {
      var $element = $(element);

      scope.$watchCollection('[format,startView,minView,maxView]',function(){
        $element.datetimepicker1('remove');

        $element.datetimepicker1({
          format: _byDefault(scope.format, 'yyyy-mm-dd hh:ii:ss'),
          weekStart: _byDefault(scope.weekStart, '1'),
          todayBtn: _byDefault(scope.todayBtn, 'true') === 'true',
          minuteStep: parseInt(_byDefault(scope.minuteStep, '5')),
          autoclose: 1,
          todayHighlight: 1,
          startView: _byDefault(scope.startView, 2),
          minView: _byDefault(scope.minView, 0),
          maxView: _byDefault(scope.maxView, 4),
          forceParse: 1,
          showMeridian: 1,
          language: 'zh-CN'
        })
        .on('changeDate', function (ev) {
           scope.realDate = new Date($element.val());
           scope.realDateString = $filter('date')(scope.realDate , 'yyyy-MM-dd hh:mm:ss');
           scope.ngModel = $element.val();
           scope.$apply();
        });

        $element.datetimepicker1('update', $filter('date')(scope.realDate, 'yyyy-MM-dd hh:mm:ss'));

      })

      scope.$watch('ngModel', function (newValue, oldValue) {
        $element.datetimepicker1('update', newValue);
      });

      scope.$watch('startDate', function(){
          var startDate = angular.copy(scope.startDate);

          if (startDate instanceof Date) {
              startDate = startDate;
          } else if (typeof startDate === 'string') {
              startDate = startDate.replace(/\./g,'/');
              startDate = startDate.replace(/\-/g,'/');
              startDate = new Date(startDate);   //要求字符串格式一定为'2014/02/04 14:38:25'
              startDate = new Date(startDate.valueOf()+8*60*60*1000);
          } else {
              startDate = -Infinity;
          }
          
          var picker = $element.data('datetimepicker');
          picker.setStartDate(startDate);
      });

      scope.$watch('endDate', function(){
          var endDate = angular.copy(scope.endDate);

          if (endDate instanceof Date) {
              endDate = endDate;
          } else if (typeof endDate === 'string') {
              endDate = endDate.replace(/\./g,'/');
              endDate = endDate.replace(/\-/g,'/');
              endDate = new Date(endDate);   //要求字符串格式一定为'2014/02/04 14:38:25'
              endDate = new Date(endDate.valueOf()+8*60*60*1000);
          } else {
              endDate = Infinity;
          }
          
          var picker = $element.data('datetimepicker');
          picker.setEndDate(endDate);
      });

    }
  };
}]);