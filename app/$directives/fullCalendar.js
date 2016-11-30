define(function(require, exports, module){

    return ['$filter', function($filter){
      var linker = function(scope, el, attrs){
        var calendar;

        var agendaDayClick = attrs.agendaDayClick.replace(/\(.*\);*/,'');

        calendar = el.fullCalendar({
          monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
          monthNamesShort: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
          dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
          dayNamesShort: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
          today: ["今天"],
          buttonText: {
              today: '今天',
              month: '月',
              week: '周',
              day: '日'
          },
          firstDay: 1,
          height: 480,
          timeFormat: {
            agenda: 'H:mm{ - H:mm}', 
            '': 'H:mm{ - H:mm}'
          },
          titleFormat: {
            month: 'yyyy MMMM',
            week: 'yyyy MMMM d',
            day: 'yyyy MMM d'
          },
          allDayText: '全天',
          axisFormat: 'H:mm',
          slotEventOverlap: false,
          selectable: true,
          selectHelper: true,
          editable: true,
          header: {
            right: 'prev,next today',
            center: 'title',
            left: 'month agendaWeek agendaDay'
          },
          dayClick: function(date, allDay, jsEvent, view) {
            if(view.name === 'agendaDay'){
              scope[agendaDayClick].apply(this, [date, allDay, jsEvent, view]);
              return;
            }
            calendar.fullCalendar( 'changeView',  'agendaDay');
            calendar.fullCalendar( 'gotoDate', date );
          },
          eventDrop: function(event, jsEvent, ui, view){
            event.model.planStartTime = $filter('date')(event._start, 'yyyy-MM-dd HH:mm:ss');
            event.model.planEndTime = $filter('date')(event._end, 'yyyy-MM-dd HH:mm:ss');
            scope.$digest();
          },
          eventResize: function(event, jsEvent, ui, view){
            event.model.planStartTime = $filter('date')(event._start, 'yyyy-MM-dd HH:mm:ss');
            event.model.planEndTime = $filter('date')(event._end, 'yyyy-MM-dd HH:mm:ss');
            scope.$digest();
          },
          eventDataTransform: function(eventData){
            if(!calendar) {
              return;
            }
            console.log('eventDataTransform');
            var model = eventData.model||eventData;
            eventData.title = model.name;
            eventData.start = model.start || model.planStartTime;
            eventData.end = model.end || model.planEndTime;
            return eventData;
          },
          eventClick: function( event, jsEvent, view ){
            var eventClick = attrs.eventClick.replace(/\(.*\);*/,'');
            scope[eventClick].apply(this, [event, jsEvent, view]);
          },
          events: scope.$eval(attrs.events)
        });

        scope.$watchCollection(attrs.events, function(){
          calendar.fullCalendar('refetchEvents');
          console.log(calendar.fullCalendar( 'clientEvents'));
          console.log(attrs.events + 'changed');
        });
      };

      return {
        restrict: 'A',
        link: linker
      };
    }];

});