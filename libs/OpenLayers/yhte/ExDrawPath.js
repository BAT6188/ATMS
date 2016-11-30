
OpenLayers.Control.ExDrawPath = OpenLayers.Class(OpenLayers.Control, {
    
    /**
     * APIProperty: pathStyle
     * {Object} 轨迹线样式
     */
    pathStyle: OpenLayers.Util.extend(
                OpenLayers.Util.extend({},
                    OpenLayers.Feature.Vector.style['default']), 
                {
                  fillOpacity: 1,  
                  strokeColor: "#0f0",
                  strokeWidth: 4,
                  strokeDashstyle:"dash"
                }),

    /**
     * APIProperty: sourceData 原始数据
     * {array<object>}对象组成的数组 对象包含x,y属性，要求是地理坐标（小坐标） 
     */
    sourceData:[],

    layer:null,

    /**
     * APIProperty: features 该控件在指定图层上添加的要素
     * {array<object>}对象为openlayers的feature对象 
     */
    lineFeature:null, 

    pointFeatures:[],

    /**
     * Constructor: OpenLayers.Control.ExMeasure
     * 
     * Parameters:
     * options - {Object} 
     */
    initialize: function(layer,options) {
        this.layer = layer;
        OpenLayers.Control.prototype.initialize.apply(this, [options]);12
        this.transData();
    },


    transData:function(){
        this.lineFeature = null;
        this.pointFeatures = [];

        var n = this.sourceData.length;
        var ptgeoms = [];
        for(var i=0;i<n;i++){
            var xy = this.sourceData[i];
            var ptgeom = new OpenLayers.Geometry.Point(xy.x,xy.y);
            ptgeoms.push(ptgeom);

            var pointStyle = OpenLayers.Util.extend(
                                  OpenLayers.Util.extend({},
                                      OpenLayers.Feature.Vector.style['default']), 
                                  {
                                    fillOpacity: 0,  
                                    strokeColor: "green",
                                    strokeWidth: 2,
                                    fillColor:"green",
                                    pointRadius:10,
                                    label:(i+1).toString()
                                  });

            var ft = new OpenLayers.Feature.Vector(ptgeom,{},pointStyle);
            this.pointFeatures.push(ft);
        }

        this.lineFeature = new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.LineString(ptgeoms),{},this.pathStyle);
    },
    
    
    
    /**
     * Method: activate
     * Activates the control.
     * Parameters:
     * {Boolean} The control was effectively activated.
     */
    activate: function () {
        this.deactivate();
        this.transData();
        this.layer.addFeatures([this.lineFeature]);
        this.layer.addFeatures(this.pointFeatures);
        return OpenLayers.Control.prototype.activate.apply(
            this, arguments
        );
        
    },
    
    /**
     * APIMethod: deactivate
     */
    deactivate: function() {
        //要素要清除features
        if(this.lineFeature){
            this.layer.removeFeatures([this.lineFeature]);
        }
        if(this.pointFeatures.length>0){
            this.layer.removeFeatures(this.pointFeatures);
        }
        
        return OpenLayers.Control.prototype.deactivate.apply(
            this, arguments
        );
        
    },
    
    setMap: function(map) {
        OpenLayers.Control.prototype.setMap.apply(this,arguments);
        // map.addLayer(this.layer);

         //自定义
    },

    redraw:function(sourceData){
        //重新绘制features,sourceData可能更新
        this.sourceData = sourceData;
        // this.transData();
        this.deactivate();
        this.activate();
    },

    setSourceData:function(data){
        this.sourceData = data;
    },

    
    CLASS_NAME: "OpenLayers.Control.ExDrawPath"
});
