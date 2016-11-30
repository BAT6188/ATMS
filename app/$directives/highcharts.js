define(function(require, exports, module){
    return [function(){
      var linker = function(scope, el, attrs){        

        var refresh = function(){

        };

        if(attrs['type'] &&(attrs['type']==='pie')){
            refresh = function(){
                el.highcharts({
                    chart: {
                        plotBackgroundColor: null,
                        plotBorderWidth: null,
                        plotShadow: false,
                        height:attrs['chartheight']                      
                    },
                    title: {
                        text: attrs['title']
                    },
                    tooltip: {
                      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                color: '#000000',
                                connectorColor: '#000000',
                                format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                            }
                        }
                    },
                     series:scope.$eval(attrs['data']),
/*                    series: [{
                        type: 'pie',
                        name: '百分比',
                        data: scope.$eval(attrs['data'])
                    }]*/
                       credits: {
                            enabled: false
                        },
                });
                
                //这是一个问题
                setTimeout(function(){
                    $(window).resize();
                    console.log('resize');
                },100);
            };
        }

        if(attrs['type'] &&(attrs['type']==='column')){
            refresh = function(){
                el.highcharts({
                    chart: {
                        renderTo: 'container',
                        height:attrs['chartheight'],
                        type: 'column'  
                    },
                    title: {
                        text: attrs['title']
                    },
                    xAxis: {
                        categories: scope.$eval(attrs['xaxis'])
                    },
                    yAxis: {
                        title: {
                            text: attrs['ytitle']
                        },
                    },
                    colors: [
                           '#F28F43', 
                           '#492970', 
                           '#8bbc21', 
                           '#910000', 
                           '#1aadce', 
                           '#492970',
                           '#f28f43', 
                           '#77a1e5', 
                           '#c42525', 
                           '#a6c96a'
                        ],
                    plotOptions: {
                        column: {
                            cursor: 'pointer',
                            dataLabels: {
                                enabled: true,
                                // color: colors[0],
                                style: {
                                    fontWeight: 'bold'
                                },
                                formatter: function() {
                                    return this.y;
                                }
                            }                   
                        }
                    },
/*                    legend: {
                        enabled: false
                    },*/
                    tooltip: {
                        formatter: function() {
                            var s = this.x +':<b>'+ this.y ;
                            return s;
                        }
                    },
                    series: scope.$eval(attrs['data']),
                    exporting: {
                        enabled: false
                    },
                    credits: {
                        enabled: false
                    },
                });

                //这是一个问题
                setTimeout(function(){
                    $(window).resize();
                    console.log('resize');
                },100);
            };
        }

        if(attrs['type'] &&(attrs['type']==='line')){
            refresh = function(){
                el.highcharts({
                    chart: {
                        defaultSeriesType: attrs['type'],
                        marginRight: 130,
                        marginBottom: 25,
                        height:attrs['chartheight'] ,
                       /* 
                       黑色背景
                       backgroundColor: { linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 }, 
                              stops: [ [0, '#2a2a2b'], [1, '#3e3e40'] ] 
                        }, 
                        style: { fontFamily: "'Unica One', sans-serif" },
                        plotBorderColor: '#606063'   */
                        
                    },

                    title: {

                        text: attrs['title'],
                        x: -20 //center
                    },
                    xAxis: {
                        categories: scope.$eval(attrs['xaxis'])
                    },
                    yAxis: {
                        title: {
                            text: attrs['ytitle']
                        }/*,
                        plotLines: [{
                            value: 0,
                            width: 1,
                            color: '#808080'
                        }]*/
                    },

                    colors: ["#DDDF0D", "#55BF3B", "#DF5353", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee", "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
                    /*colors: [
                           '#F28F43', 
                           '#492970', 
                           '#8bbc21', 
                           '#910000', 
                           '#1aadce', 
                           '#492970',
                           '#f28f43', 
                           '#77a1e5', 
                           '#c42525', 
                           '#a6c96a'
                        ],*/
                    tooltip: {
                        formatter: function() {
                                return '<b>'+ this.series.name +'</b><br/>'+
                                this.x +': '+ this.y;
                        }
                    },
                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        x: -10,
                        y: 100,
                        borderWidth: 0
                    },
                    series: scope.$eval(attrs['data']),
                    legendBackgroundColor: 'rgba(0, 0, 0, 0.5)', 
                    background2: '#505053', 
                    dataLabelsColor: '#B0B0B3',
                     textColor: '#C0C0C0', 
                     contrastTextColor: '#F0F0F3', 
                     maskColor: 'rgba(255,255,255,0.3)',
                    credits: {
                        enabled: false
                    },
                });                
                
                //这是一个问题
                setTimeout(function(){
                    $(window).resize();
                    console.log('resize');
                },100);
            };
        }

/*        if(attrs['type'] &&(attrs['type']==='bar')){
            refresh = function(){
                el.highcharts({
                    chart: {
                        defaultSeriesType: attrs['type'],
                        marginRight: 130,
                        marginBottom: 25,
                        height:attrs['chartheight'] ,
                    },

                    title: {

                        text: attrs['title'],
                        x: -20 //center
                    },
                    xAxis: {
                        categories: scope.$eval(attrs['xaxis'])
                    },
                    yAxis: {
                        title: {
                            text: attrs['ytitle']
                        }
                    },

                    colors: ["#DDDF0D", "#55BF3B", "#DF5353", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee", "#55BF3B", "#DF5353", "#7798BF", "#aaeeee"],
                    tooltip: {
                        formatter: function() {
                                return '<b>'+ this.series.name +'</b><br/>'+
                                this.x +': '+ this.y;
                        }
                    },

                    legend: {
                        layout: 'vertical',
                        align: 'right',
                        verticalAlign: 'top',
                        x: -10,
                        y: 100,
                        borderWidth: 0
                    },
                    series: scope.$eval(attrs['data']),
                    legendBackgroundColor: 'rgba(0, 0, 0, 0.5)', 
                    background2: '#505053', 
                    dataLabelsColor: '#B0B0B3',
                     textColor: '#C0C0C0', 
                     contrastTextColor: '#F0F0F3', 
                     maskColor: 'rgba(255,255,255,0.3)',
                    credits: {
                        enabled: false
                    },
                });                
                
                //这是一个问题
                setTimeout(function(){
                    $(window).resize();
                    console.log('resize');
                },100);
            };
        }*/
        scope.$watch(attrs.data, refresh);

        refresh();
      };

      return {
        restrict: 'A',
        link: linker
      }
    }];
});