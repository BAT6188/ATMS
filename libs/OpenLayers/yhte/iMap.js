(function($){
    function setPOS(ctrl, pos){//设置光标位置函数
        if(ctrl.setSelectionRange)
        {
            ctrl.focus();
            ctrl.setSelectionRange(pos,pos);
        }
        else if (ctrl.createTextRange) {
            var range = ctrl.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
    };

    var Ol = OpenLayers;//简化
    
    $.fn.iMap = function(options){
        var el = $(this), self = this, dom = el.get(0), map = null, layers = [],
            bases = options.bases || [], 
            extent =  options.extent ;
        
        for(var i = 0, size = bases.length; i < size; i++){
            var op = bases[i], url = null, layer = null;
            if(op.indexOf('pgis@') === 0){
                url = op.split('@');
                layer = new Ol.Layer.PGisLayer("pgis" + i,  [ url[1] ], {
                            zoomOffset : 4
                        });
            }else if(op.indexOf('gmap@') === 0){
                url = op.split('@');
                layer = new Ol.Layer.GMapLayer('gmap' + i, [url[1]]);
            }
            layers.push(layer);
        }
        
        //OpenLayers.Map对象引用
        this.map = map = new Ol.Map(dom, {
            layers: layers,
            projection: "EPSG:"+MAP_SR,
            size: new OpenLayers.Size(options.width||400,options.height||400)
        });

        // map.zoomToExtent(extent); // 地图范围
        //map.setCenter([117.18347189778, 34.263669244681], 4);
        map.setCenter([12279722, 2275182], 14);
        
        this.clientLayer = new Ol.Layer.Vector("client",{displayInLayerSwitcher:false});

        this.exSelector = new Ol.Control.ExSelectFeature2(this.clientLayer);
        
        var onChange = function(event){
            var val = parseInt($(this).val());
            self.exSelector.buffer = isNaN(val) ? this.buffer : val;
        };
        
        this.bufferInput = $('<input>').addClass('buffer-input').appendTo($(map.viewPortDiv)).keyup(onChange).click(function(event){
            self.exSelector.pathCtl.deactivate();
            self.exSelector.pathCtl.activate();
            setPOS($(this).get(0), 100);
        });

        var onActive = function(){
            this.bufferInput.show().val(this.exSelector.buffer);
        };
        
        this.exSelector.pathCtl.events.register('activate', this, onActive);
        
        var onDeactive = function(){
            this.bufferInput.hide();
        };
        
        this.exSelector.pathCtl.events.register('deactivate', this, onDeactive);
        
        map.addControls([this.exSelector, new Ol.Control.MousePosition()]);
        
        map.addLayer(this.clientLayer);
        
        this.addLayer = function(options){
            var layer = new Ol.Layer.ExDyLayer2('dylayer' + map.layers.length ,options.url,options);
            map.addLayer(layer);
            map.setLayerIndex(this.clientLayer,map.layers.length-1);
            
            if(!this.exSelector.targets){
                this.exSelector.targets = [];
            }
            var targets = this.exSelector.targets;
            targets.push(layer);
            
            this.exSelector.setTargets(targets);

            return layer;
        };

        this.setExSelectorTarget = function(dlayer){
            this.exSelector.targets = null;//置空
            this.exSelector.targets = [];//置空
            this.exSelector.setTargets([dlayer]); //exSelector只作用于一个图层
        };

        this.resetTargets = function(targets){ //resetExSelectorTargets
            if(!this.exSelector.targets){
                this.exSelector.targets = [];
            }
            this.exSelector.setTargets(targets);
        };

        this.addLayer = function (layer){
            map.addLayer(layer);
            map.setLayerIndex(this.clientLayer,map.layers.length - 1);
        };
        
        this.centerAt = function(){
            map.setCenter.apply(map,arguments);
        };
        
        return this;
    };
    
    var OLFV = Ol.Feature.Vector;
    
    //用于被选中元素
    OLFV.style['SELECT'] = $.extend({}, OLFV.style['default'],
        {
            strokeColor: "#00FF00",
            fillOpacity: 0.4, 
            pointRadius: 8,
            strokeWidth: 2
        }
    );
    
    //用于量距
    OLFV.style['MEASURE'] = $.extend({}, OLFV.style['default'],
        {
            strokeWidth: 3,
            strokeOpacity: 1,
            strokeColor: "#666666",
            strokeDashstyle: "dash"
        }
    );
    
})(jQuery);
