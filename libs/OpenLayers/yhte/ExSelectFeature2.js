// var OpenLayers = require('OpenLayers');
// var jsts = require('./jsts');

OpenLayers.Control.DyLayerSelect = OpenLayers.Class(
    OpenLayers.Control.Button, 
    {
        type: OpenLayers.Control.TYPE_TOOL,
        
        _t: null,
        
        initialize: function (layer, options) {
            OpenLayers.Util.extend(this, options);
            
            OpenLayers.Control.prototype.initialize.apply(this,[options]);
            
            this.layer = layer;

            this.features = [];  //存储所有曾经被click选中的要素，区别于this.layer.features

            if(!this.targets){
                this.targets = [];
            }
            
            if (!(OpenLayers.Util.isArray(this.targets))) {
                this.targets = [this.targets];
            }
            
        },
        
        setMap: function(map) {
            OpenLayers.Control.prototype.setMap.apply(this,arguments);
            this.initTip();
        },
        
        initTip: function(){
            this.tip = OpenLayers.Util.createDiv(this.id);
            this.tip.className = 'feature-tip';
            this.tip.setAttribute("unselectable", "on", 0);
            this.tip.onselectstart = OpenLayers.Function.False;
            this.map.viewPortDiv.appendChild(this.tip);
        },
        
        hover: function(){
            var arg = arguments, self = this;
            self.currentFeature = null;
            self.tip.style.display = 'none';
            this.map.viewPortDiv.style.cursor = 'default';
            clearTimeout(this._t);

            var m = arg[0].xy;
            self.lonlat = self.map.getLonLatFromViewPortPx(m);
            var geometry = new OpenLayers.Geometry.Point(self.lonlat.lon,self.lonlat.lat);
            var geojson = new OpenLayers.Format.GeoJSON();

            this._t = setTimeout(function(){
                for(var j=0,l = self.targets.length; j < l; j++){
                    var layer = self.targets[j];

                    //根据当前缩放等级，固定一个像素值，将像素转换为实际距离
                    var bfr = 0.002*self.map.getScale();//固定缓冲像素为0.01pixels
                    var url = layer.queryURL + '&spatialRel=intersects&geometry='
                            + geometry.toString() + '&buffer='+bfr;

                    $.ajax({
                        url: url,
                        dataType:'JSONP',
                        context: layer,
                        success: function(data){ 
                            var features = geojson.read(data);
                            if (features[0]){
                                var feature = features[0]; //该处只做简单处理，可优化
                                feature.style = OpenLayers.Feature.Vector.style['SELECT'];

                                self.currentFeature = new OpenLayers.Feature.Vector(feature.geometry,
                                                                                    feature.attributes,
                                                                                    feature.style);
                                self.currentFeature.dyLyr = this;//选中的要素所在的动态图层
                                self.map.viewPortDiv.style.cursor = 'pointer';
                                if(!feature.lonlat){
                                    var centroid = feature.geometry.getCentroid();  //点要素也统一处理
                                    feature.lonlat = new OpenLayers.LonLat([centroid.x,centroid.y]);
                                    self.currentFeature.guid = centroid.x + '-' + centroid.y;
                                }

                                var pixel = self.map.getPixelFromLonLat(feature.lonlat);
                                self.tip.style.left = (pixel.x + 10) + 'px';
                                self.tip.style.top = (pixel.y - 10) + 'px';
                                self.tip.innerHTML = feature.attributes.TIP||feature.attributes.GXDWMC||'空';
                                self.tip.style.display = 'block';

                                //线、面要素的tip显示在鼠标附近是否更佳？
                            }
                            
                        }
                    });
                }
            },100);
        },

        _isdb:false,  //是否双击

        dblclick:function(){
            this._isdb = true;
        },

        click: function(){
            var ft = this.currentFeature;

            if(!ft){
                // 区分单击和双击，双击时屏蔽该单击事件
                this._isdb = false;
                var self = this;
                var onclick = function(){
                    if(self._isdb)return;
                    self.map.events.triggerEvent('feature:clicknone', {position: self.lonlat});
                }
                window.setTimeout(onclick, 500);
                return;
            }

            var centroid = ft.geometry.getCentroid(); 
            var guid = centroid.x + '-' + centroid.y;


            var feature = null;
            for(var i=0, len=this.features.length; i<len; ++i) {
                if(this.features[i]['guid'] == guid) {
                    feature = this.features[i];
                    break;
                }
            }

            if(feature){
                ft = feature;
            }else{
                this.features.push(ft);
            }

            var exsit = this.layer.getFeatureBy('guid',guid);   
            if(exsit){
                this.layer.removeFeatures([exsit]);
                this.map.removeTip();
                this.map.events.triggerEvent('feature:clickout', {feature: ft});
                //
                var tempfts = exsit.dyLyr.selectedFeatures;
                var newfts = [];
                _.each(tempfts, function(feature){
                    if(feature.guid == exsit.guid){
                        return;
                    }
                    newfts.push(feature);
                });
                exsit.dyLyr.selectedFeatures = newfts;
                this.layer.events.triggerEvent('featureChanged',{features:this.layer.features});
                return;
            }

            this.layer.addFeatures([ft]);

            if(!ft.dyLyr.selectedFeatures){
                ft.dyLyr.selectedFeatures = [];
            }else{
                ft.dyLyr.selectedFeatures.push(ft);
            }
            this.layer.events.triggerEvent('featureChanged',{features:this.layer.features});
            
            this.map.events.triggerEvent('feature:click', {feature: ft});
        },
        
        activate: function(){
            OpenLayers.Control.prototype.activate.apply(this);
            this.map.events.register('mousemove', this, this.hover);
            this.map.events.register('click', this, this.click);
            this.map.events.register('dblclick', this, this.dblclick);
        },
        
        deactivate: function(){
            OpenLayers.Control.prototype.deactivate.apply(this);
            this.map.events.unregister('mousemove', this, this.hover);
            this.map.events.unregister('click', this, this.click);
            this.map.events.unregister('dblclick', this, this.dblclick);
        },
        
        setTargets: function(targets){
            this.targets = targets;
        },
        
        CLASS_NAME: "OpenLayers.Control.DyLayerSelect"
    }
);

OpenLayers.Control.ExSelectFeature2 = OpenLayers.Class(
    OpenLayers.Control.Panel, {

    buffer: 50,
    isBufferDraw:false,//表示缓冲区是否绘制

    handler:new OpenLayers.Handler(this,null,{
        keyMask: OpenLayers.Handler.MOD_CTRL
    }),

    initialize: function(layer,options) {
        this.handler.activate();

        if(!this.targets){
            this.targets = [];
        }
        
        if (!(OpenLayers.Util.isArray(this.targets))) {
            this.targets = [this.targets];
        }
            
        OpenLayers.Control.Panel.prototype.initialize.apply(this, [options]);
        
        this.resultLayer =  layer;  //此时该图层的样式继承了layer的样式

        //作为绘制缓冲区的图层（线缓冲）
        this.bufferLayer = new OpenLayers.Layer.Vector("bufferLayer",{displayInLayerSwitcher:false});

        var layer = this.vector = new OpenLayers.Layer.Vector("edit",{displayInLayerSwitcher:false});  
        
        var onFeatureadded = function(event){

            // this.activateControl(this.dySelCtl);
            
            //删除结果图层上的数据
            this.resultLayer.removeAllFeatures();
            this.bufferLayer.removeAllFeatures();
            layer.removeAllFeatures();
            layer.addFeatures([event.feature],{silent:true});
            // layer.addFeatures([event.feature]);

            this.isBufferDraw = false;
            var feature = event.feature;
            var geometry = feature.geometry;

            var geojson = new OpenLayers.Format.GeoJSON();
            var self = this;

            if(geometry.CLASS_NAME == "OpenLayers.Geometry.LineString"){
                _.each(this.targets, function(layer){
                    var url = layer.queryURL + '&spatialRel=intersects&geometry='
                            + geometry.toString() + '&buffer='+self.buffer ;
                    $.ajax({
                        url: url,
                        dataType:'JSONP',
                        success: function(data){
                            if(!self.isBufferDraw){ //确保多个动态图层，但缓冲区只绘制一遍。
                                bufferFeature = new OpenLayers.Format.WKT().read(data.bufferArea);
                                bufferFeature.style = OpenLayers.Feature.Vector.style['default'];
                                self.bufferLayer.addFeatures([bufferFeature]); 
                                self.isBufferDraw = true;
                            }
                            
                            var features = geojson.read(data);
                            _.each(features, function(feature){
                                feature.style = OpenLayers.Feature.Vector.style['SELECT'];

                                var centroid = feature.geometry.getCentroid();  //点要素也统一处理
                                feature.guid = centroid.x + '-' + centroid.y;
                                feature.dyLyr = layer;
                            });
                            self.resultLayer.addFeatures(features);
                            layer.selectedFeatures = features; //动态图层被选中图层
                            self.resultLayer.events.triggerEvent('featureChanged',{features:features});
                        }
                    });   
                });
                

            }else if(geometry.CLASS_NAME == "OpenLayers.Geometry.Polygon"){
                _.each(this.targets, function(layer){
                    var url = layer.queryURL + '&spatialRel=intersects&geometry='
                            + geometry.toString();
                    $.ajax({
                        url: url,
                        dataType:'JSONP',
                        success: function(data){
                            var features = geojson.read(data);
                            _.each(features, function(feature){
                                feature.style = OpenLayers.Feature.Vector.style['SELECT'];

                                var centroid = feature.geometry.getCentroid();  //点要素也统一处理
                                feature.guid = centroid.x + '-' + centroid.y;
                                feature.dyLyr = layer; //该要素所在动态图层
                            });
                            self.resultLayer.addFeatures(features);
                            layer.selectedFeatures = features; //动态图层被选中图层
                            self.resultLayer.events.triggerEvent('featureChanged',{features:features});
                        }
                    });
                });
            }  

        };
        
        layer.events.register('featureadded', this, onFeatureadded);

        var self = this;
        
        this.dySelCtl =  new OpenLayers.Control.DyLayerSelect(this.resultLayer,{
            displayClass: 'olControlDrawFeaturePoint',
            eventListeners:{
                "activate":function(){
                    // console.log(self.handler);
                    // console.log(self.handler.checkModifiers(self.dySelCtl.events.listeners.activate[0]));
                    // if(self.handler.checkModifiers()){
                        self.resultLayer.removeAllFeatures({silent:true});
                        self.bufferLayer.removeAllFeatures({silent:true});
                        self.vector.removeAllFeatures({silent:true});
                    // }
                }
            }
        });

        
        this.pathCtl = new OpenLayers.Control.DrawFeature(layer, OpenLayers.Handler.Path, {
            displayClass: 'olControlDrawFeaturePath',
            handlerOptions: {citeCompliant: this.citeCompliant}
        });
        
        this.polygonCtl = new OpenLayers.Control.DrawFeature(layer, OpenLayers.Handler.Polygon, {
            displayClass: 'olControlDrawFeaturePolygon',
            handlerOptions: {citeCompliant: this.citeCompliant}
        });
        
        var controls = [
            this.dySelCtl,
            this.pathCtl,
            this.polygonCtl
           ,new OpenLayers.Control.DrawFeature(layer, OpenLayers.Handler.RegularPolygon, {
               displayClass: 'olControlDrawFeatureRegularPolygon',
               handlerOptions: {citeCompliant: this.citeCompliant,sides: 400}
           })
        ];
        
        this.addControls(controls);
    },

    clear:function(){
        this.resultLayer.removeAllFeatures();
        this.bufferLayer.removeAllFeatures();
        this.vector.removeAllFeatures();
    },
    
    setTargets: function(targets){
        this.targets = targets;
        this.dySelCtl.setTargets(targets);
    },
    
    setMap: function(map){
        OpenLayers.Control.Panel.prototype.setMap.apply(this, arguments);
        map.addLayer(this.vector);
        map.addLayer(this.bufferLayer);
        map.setLayerIndex(this.vector, 0);
        // this.map = map;
    },

    select: function (features, layer){
        _.each(features, function(feature){
            feature.style = OpenLayers.Feature.Vector.style['SELECT'];

            var centroid = feature.geometry.getCentroid();  //点要素也统一处理
            feature.guid = centroid.x + '-' + centroid.y;
            feature.dyLyr = layer;
        });
        this.resultLayer.addFeatures(features);
    },
    
    draw: function() {
        var div = OpenLayers.Control.Panel.prototype.draw.apply(this, arguments);
        if (this.defaultControl === null) {
            this.defaultControl = this.controls[0];
        }
        return div;
    },

    
    CLASS_NAME: "OpenLayers.Control.EditingToolbar"
});    
