define(function(require, exports, module){

    return ['$parse', '$filter', function($parse, $filter){
        var linker = function(scope,element,attrs) {

            var $input = element.find('input');
            // var $datetimeDIV = element.find('div');

            //设置初始值（默认值）
            if(scope.maskInput && scope.maskInput === 'false'){
                scope.maskInput = false;
            }else{
                scope.maskInput = true;
            }

            if(scope.pickDate && scope.pickDate === 'false'){
                scope.pickDate = false;
            }else{
                scope.pickDate = true;
            }

            if(scope.pickTime && scope.pickTime === 'false'){
                scope.pickTime = false;
            }else{
                scope.pickTime = true;
            }

            if(scope.pick12HourFormat && scope.pick12HourFormat === 'false'){
                scope.pick12HourFormat = false;
            }else if(scope.pick12HourFormat === undefined){
                scope.pick12HourFormat = false;
            }else{
                scope.pick12HourFormat = true;
            }

            if(scope.pickSeconds && scope.pickSeconds === 'false'){
                scope.pickSeconds = false;
            }else{
                scope.pickSeconds = true;
            }

            if(scope.format === undefined){
                scope.format ='yyyy-MM-dd hh:mm:ss';
            }
            if(scope.ngModel === undefined){
                scope.ngModel = '';
            }

            

            scope.startDate =scope.startDate || -Infinity;
            scope.endDate = scope.endDate || Infinity;

            var myDate = new Date();

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

                var picker = element.data('datetimepicker');
                picker.setStartDate(startDate);
            });

            scope.$watch('endDate', function(){
                var endDate = angular.copy(scope.endDate);

                if (endDate instanceof Date) {
                    endDate = endDate;
                } else if (typeof endDate === 'string') {
                    endDate = endDate.replace('.','/');
                    endDate = endDate.replace('-','/');
                    endDate = new Date(endDate);   //要求字符串格式一定为'2014/02/04 14:38:25'
                    endDate = new Date(endDate.valueOf()+8*60*60*1000);
                } else {
                    endDate = -Infinity;
                }

                var picker = element.data('datetimepicker');
                picker.setEndDate(endDate);
            });


            var options = {
                // showMeridian: true,
                // minuteStep: 1,
                autoclose: true,
                todayBtn: true,
                format: scope.format,
                language: scope.language || 'zh-CN',
                timesize: scope.timesize,
                nosecond:scope.nosecond,
                minuteno:scope.minuteno,
                maskInput:scope.maskInput,
                pickDate:scope.pickDate,
                pickTime:scope.pickTime,
                pick12HourFormat:scope.pick12HourFormat,
                pickSeconds:scope.pickSeconds,
                startDate:scope.startDate, //作限制
                endDate:scope.endDate 
                
            };

            //设置初始值
            $input.val($filter('date')(scope.ngModel, scope.format));
        
            // // 双向绑定


            scope.$watch('ngModel', function(){

                $input.val($filter('date')(scope.ngModel, options.format));
                // $input.val(scope.ngModel);

                // element.data('datetimepicker').setLocalDate(new Date(scope.ngModel));
            });

            element.datetimepicker(options).on('changeDate', function(e) {
                // var ngModel = $parse(attrs.ngModel);
                // if(ngModel){
                    // var v = ngModel.assign(scope, $filter('date')(e.date.valueOf()-8*60*60*1000, 'yyyy-MM-dd HH:mm:ss'));
                    // console.log(scope);


                    // scope.ngModel = $filter('date')(e.localDate, options.format);  //此处scope.format为undefined,why？？


                    scope.ngModel = $input.val();
                    scope.$apply();


                    // console.log(attrs.ngModel);  //attrs.ngModel?scope.ngModel?区别
                // }
            });

            scope.clear = function(){
                var ngModel = $parse(attrs.ngModel);
                if(ngModel){
                    ngModel.assign(scope, null);
                    $input.val('');

                    // scope.datetime = '';
                }
            };

            // var sp = $('<span class="input-group-btn">');
            // var ClearBtn = $('<button class="btn btn-sm btn-default">')
            //     .append($('<i class="fa fa-times" tooltip="清除">'))
            //     .appendTo(sp).click(function(){
            //         var ngModel = $parse(attrs.ngModel);
            //         if(ngModel){
            //             ngModel.assign(scope, null);
            //             $input.val('');
            //             // element.val("");
            //         }
            //     });
            // element.after(sp).parent().addClass('input-group');


        };

        return {
            restrict:'EA',
            scope: {
              format:'@',
              language:'@',
              startDate:'=?',
              endDate:'=?',
              ngModel: '=',
              timesize:'@',
              nosecond:'@',
              minuteno:'@',
              // datetime:'=ngModel',
              placeholder:'@',
              maskInput:'@',
              pickDate:'@',
              pickTime:'@',
              pick12HourFormat:'@pickTwelveHourFormat',
              pickSeconds:'@',
              onlybtn:'@'
            },
            // transclude: true,
            templateUrl:'app/$directives/datetimepicker.html',
            link: linker
        };
    }];
});