/**
*包装常用样式
*/
OpenLayers.ExStyles = function(options){
        //有待优化和简化

        //警员样式
        this.centPtStyle = OpenLayers.Util.extend(
          OpenLayers.Util.extend({},
              OpenLayers.Feature.Vector.style['default']), 
              {
                graphic:true,
                externalGraphic: '/atms/resources/img/police_b.png', 
                graphicWidth:32,
                graphicHeight:32,
                graphicOpacity:1,
                graphicZIndex:0
            });
        //警车样式
        this.policeCarStyle = OpenLayers.Util.extend(
          OpenLayers.Util.extend({},
              OpenLayers.Feature.Vector.style['default']), 
              {
                graphic:true,
                externalGraphic: '/atms/resources/img/car_b.png', 
                graphicWidth:32,
                graphicHeight:32,
                graphicOpacity:1,
                graphicZIndex:0
            });
        //警情样式
        this.alarmStyle = OpenLayers.Util.extend(
          OpenLayers.Util.extend({},
              OpenLayers.Feature.Vector.style['default']), 
              {
                graphic:true,
                externalGraphic: '/atms/resources/img/marker.png', 
                graphicWidth:32,
                graphicHeight:32,
                graphicOpacity:1,
                graphicZIndex:0
            });

        this.trackStyle = OpenLayers.Util.extend(
            OpenLayers.Util.extend({},
                OpenLayers.Feature.Vector.style['default']), 
            {
              fillOpacity: 1,  
              strokeColor: "#0f0",
              strokeWidth: 4,
              strokeDashstyle:"dash"
            });

        this.getTrkPtLyrStlMp = function(){
          var templateD = OpenLayers.Util.extend(
                              OpenLayers.Util.extend({},
                                  OpenLayers.Feature.Vector.style['default']), 
                              {
                                fillOpacity: 0,  
                                strokeColor: "green",
                                strokeWidth: 2,
                                fillColor:"green",
                                pointRadius:10,
                                label:"${getLabel}"  //由要素的attribute:"label"决定
                              });

          var templateS = OpenLayers.Util.extend(
                              OpenLayers.Util.extend({},
                                  OpenLayers.Feature.Vector.style['default']), 
                              {
                                fillOpacity: 0,  
                                strokeColor: "blue",
                                strokeWidth: 2,
                                fillColor:"blue",
                                pointRadius:10,
                                label:"${getLabel}"  //由要素的attribute:"label"决定
                              });

          var context = {
            getLabel:function(feature){
              return feature.attributes.label;
            }
          };

          var defau = new OpenLayers.Style(templateD, {context: context});
          var selet = new OpenLayers.Style(templateS, {context: context});
          var styleMap = new OpenLayers.StyleMap({
              "default": defau,
              "select":selet
          });

          return styleMap
        };

        
        //周边资源
        this.getBfrLyrStlMp = function(){
          var context = {
            color: function(feature) {
              if(feature.attributes.type == 'signal'){
                return "#5CB85C";
              }else if(feature.attributes.type == 'video'){
                return "#D9534F";
              }else if(feature.attributes.type =='policeCond'){
                return "#5BC0DE";
              }
            },
            label:function(feature){
              return feature.attributes.index;
            }
          };

          var template = OpenLayers.Util.extend(
            OpenLayers.Util.extend({},
                OpenLayers.Feature.Vector.style['default']), 
              {
                fillOpacity: 1, 
                fillColor:"${color}",  //success
                strokeColor: "white",
                strokeWidth: 2.5,
                pointRadius:10,
                label:"${label}",
                fontColor:"white",
                fontSize:10,
                labelOutlineWidth:1
            });

            var style = new OpenLayers.Style(template, {context: context});
            var styleMap = new OpenLayers.StyleMap({
                "default": style
            });
            return styleMap;
        };



        //居中时突出显示
        this.tempPtStyle = OpenLayers.Util.extend(
              OpenLayers.Util.extend({},
                  OpenLayers.Feature.Vector.style['default']), 
              {
                fillOpacity: 0, 
                strokeColor: "red",
                strokeWidth: 2.5,
                pointRadius:10
            });
        //执勤区域样式
        this.centAreaShowStyle = OpenLayers.Util.extend(
                OpenLayers.Util.extend({},
                    OpenLayers.Feature.Vector.style['default']), 
                {
                  fillOpacity: 0.0, 
                  fillColor:"#cccccc",
                  strokeColor: "red",
                  strokeWidth: 2,
                  pointRadius:10,
                  strokeDashstyle:"dash"
              });

    var tempCentAreaStyle = OpenLayers.Util.extend(
        OpenLayers.Util.extend({},
            OpenLayers.Feature.Vector.style['default']), 
        {
          fillOpacity: 0.1,  
          strokeColor: "green",
          strokeWidth: 2,
          fillColor:"yellow",
          pointRadius:10,
          strokeDashstyle:"dash"
      });
      var centAreaShowStyle = OpenLayers.Util.extend(
        OpenLayers.Util.extend({},
            OpenLayers.Feature.Vector.style['default']), 
        {
          fillOpacity: 0.2, 
          fillColor:"green",
          strokeColor: "red",
          strokeWidth: 2,
          pointRadius:10,
          strokeDashstyle:"dash"
      });
      var centPtStyle = OpenLayers.Util.extend(
        OpenLayers.Util.extend({},
            OpenLayers.Feature.Vector.style['default']), 
        {
          fillOpacity: 0, 
          strokeColor: "red",
          strokeWidth: 2.5,
          pointRadius:14
      });


      //基础样式集合
      var styleCollections = {'default' : OpenLayers.Util.extend({},
                                OpenLayers.Feature.Vector.style['default']),
                              'select' : OpenLayers.Util.extend({},
                                  OpenLayers.Feature.Vector.style['select']),
                              'temporary' : OpenLayers.Util.extend({},
                                  OpenLayers.Feature.Vector.style['temporary']),
                              'delete' : OpenLayers.Util.extend({},
                                  OpenLayers.Feature.Vector.style['delete'])
                              };

      //图标路径集合
      var graphics = ['../../app/img/car_b.png',
                      '../../app/img/car_r.png',
                      '../../app/img/cycle_b.png',
                      '../../app/img/cycle_r.png',
                      '../../app/img/police_b.png',
                      '../../app/img/police_r.png',
                      '../../app/img/police_y.png'];

    this.temp_style = centPtStyle;

    this.getStyleMapStat = function(){

        var context = {
          getHeight: function(feature) {
            return feature.attributes["total"];
          },
          getLabel:function(feature){
            return '总数：'+feature.attributes.total;
          }
        };

        var template = OpenLayers.Util.extend(
          OpenLayers.Util.extend({},
              OpenLayers.Feature.Vector.style['default']), 
            {
              graphic:true,
              externalGraphic: '../../app/img/stat.png',  //get请求会报错undefined？？？
              graphicWidth:32,
              graphicHeight:"${getHeight}",
              graphicOpacity:1
              // label:'${getLabel}',
              // labelXOffset:15,
              // labelYOffset:-30,
              // fontSize:10
          });

          var style = new OpenLayers.Style(template, {context: context});
          var styleMap = new OpenLayers.StyleMap({
              "default": style
          });
          return styleMap;
    };

    this.getStyleMapDevice = function(){
      var context = {
        getGraphic: function(feature) {
              if(feature.attributes.DEVICE_TYPE === '1'){
                return "/atms/resources/img/pt_signal.png";
              }else if(feature.attributes.DEVICE_TYPE === '2'){
                return "/atms/resources/img/pt_video.png";
              }else if(feature.attributes.DEVICE_TYPE ==='3'){
                return "/atms/resources/img/pt_screen.png";
              }
            }
      };

      var template = OpenLayers.Util.extend(
          OpenLayers.Util.extend({},
              OpenLayers.Feature.Vector.style['default']), 
            {
              graphic:true,
              graphicWidth:32,
              externalGraphic:"${getGraphic}",
              graphicOpacity:1
              // label:'${getLabel}',
              // labelXOffset:15,
              // labelYOffset:-30,
              // fontSize:10
          });

          var style = new OpenLayers.Style(template, {context: context});
          var styleMap = new OpenLayers.StyleMap({
              "default": style
          });
          return styleMap;
    };


    //通过template模板获取样式
    this.getStyleMap1 = function(){

        var context = {
            getCarGraphic: function(feature) {
              var status = feature.attributes.status;
              var type = feature.attributes.type;
              if(status == '正常'){
                if(type == 'car'){
                  return graphics[0];
                }else if(type == 'motor'){
                  return graphics[2];
                }
              }else if(status == '异常'){ //'异常'
                if(type == 'car'){
                  return graphics[1];
                }else if(type == 'motor'){
                  return graphics[3];
                }
              }
            },

            getPoliceGraphic:function(feature){
              var status = feature.attributes.status;
              if(status=='在岗'){
                  return graphics[4];
              }else if(status=='越界'){
                  return graphics[5];
              }else{ //即将离开
                  return graphics[6];
              }
            },

            getLabel:function(feature){
              return feature.attributes.name;
            }

        };

        var templateCar = OpenLayers.Util.extend(
          OpenLayers.Util.extend({},
              OpenLayers.Feature.Vector.style['default']), 
            {
              graphic:true,
              externalGraphic: "${getCarGraphic}",  //get请求会报错undefined？？？
              graphicWidth:32,
              graphicHeight:32,
              graphicOpacity:1
          });



          var templatePoliceD = OpenLayers.Util.extend(
            OpenLayers.Util.extend({},
                OpenLayers.Feature.Vector.style['default']), 
              {
                graphic:true,
                externalGraphic: "${getPoliceGraphic}",  //get请求会报错undefined？？？
                graphicWidth:32,
                graphicHeight:32,
                graphicOpacity:1
            });

          var templatePoliceS = OpenLayers.Util.extend(
            OpenLayers.Util.extend({},
                OpenLayers.Feature.Vector.style['default']), 
              {
                graphic:true,
                externalGraphic: "${getPoliceGraphic}",  //get请求会报错undefined？？？
                graphicWidth:40,
                graphicHeight:40,
                graphicOpacity:0.9,
                label:'${getLabel}',
                labelXOffset:15,
                labelYOffset:-15
                // labelOutlineColor:'#ee9900'
            });

          var styleCar = new OpenLayers.Style(templateCar, {context: context});

          var stylePoliceD = new OpenLayers.Style(templatePoliceD, {context: context});
          var stylePoliceS = new OpenLayers.Style(templatePoliceS, {context: context});

          var styleMapCar = new OpenLayers.StyleMap(styleCar);

          var styleMapPolice = new OpenLayers.StyleMap({
              "default": stylePoliceD,
              "select": stylePoliceS
          });

          return [styleMapCar,styleMapPolice];
    };


    this.getStyleMap4 = function(imgSrc){ 
      // '../../app/img/marker.png'
      var styleMap = new OpenLayers.StyleMap({
            "default": new OpenLayers.Style({
                graphic : true,
                graphicOpacity : 1,
                externalGraphic : imgSrc,
                graphicWidth : 32,
                graphicHeight: 32
            }),
            "select": new OpenLayers.Style({
                graphic : true,
                graphicOpacity : 0.9,
                externalGraphic : imgSrc,
                graphicWidth:40,
                graphicHeight:40
            })
        });

      return styleMap;
    };



    this.getStyleMapCluster = function(){
      var style = new OpenLayers.Style({
                    pointRadius: "${radius}",
                    fillColor: "${color}",
                    fillOpacity: 0.8,
                    strokeColor: "white",
                    strokeOpacity: 1,
                    label:'${label}',
                    // labelXOffset:"${xoffset}",
                    labelYOffset:"${xoffset}",
                    fontSize:12,
                    fontColor: "white"
                    // fontFamily: "sans-serif",
                    // fontWeight: "bold"
                }, {
                    context: {
                        radius: function(feature) {
                            var pix = 10;
                            if(feature.attributes.total) {
                                pix = feature.attributes.total + 10;
                            }
                            return pix;
                        },
                        xoffset: function(feature) {
                            var pix = 10;
                            if(feature.attributes.total) {
                                pix = feature.attributes.total + 10;
                            }
                            return pix;
                        },
                        label: function(feature){
                          var datas = feature.attributes.datas;
                          var label='';
                          var total = feature.attributes.total;
                          for(var i=0;i<datas.length;i++){
                            label = label +"\n"+datas[i].model.name+"："+datas[i].count +"/" +total;
                          }
                          return label;
                        },
                        color:function(feature){
                          var colors = {"police":"#3276B1",
                                        "policeCar":"#39B3D7",
                                        "policeTask":"#47A447",
                                        "device":"#F0AD4E"
                                        };
                          return colors[feature.attributes.type];
                        }
                    }
                });

      var styleMap = new OpenLayers.StyleMap({
                  "default": style,
                  "select": {
                      fillColor: "#8aeeef",
                      strokeColor: "#32a8a9"
                  }
              });

      return styleMap;
    };



  return this;
};
