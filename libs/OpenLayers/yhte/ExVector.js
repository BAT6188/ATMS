OpenLayers.Layer.ExVector = OpenLayers.Class(OpenLayers.Layer.Vector,{
    initialize: function(name,options){
        OpenLayers.Layer.Vector.prototype.initialize.apply(
            this, [name,options]);
        this.vectors = [];
    },

    refresh: function(it){
        if(it === -1){
            clearInterval(this.it);
            return;
        }
        var self = this;
        this.it = setInterval(function(){
            //地图加载完成且可显示时
            if(self.visibility && self.added){
                self.fetch();
            }
        }, it);
        self.fetch();
    },

    afterAdd: function(){
        OpenLayers.Layer.Vector.prototype.afterAdd.apply(
            this, arguments);
        
        console.log('afterAdd ', this.name);

        this.added = true;

        // this.fetch();
    },

    onDataBack: function(){

    },

    _onDataBack: function(results){

        this.vectors.length = 0;
        for(var i = 0, size = results.length; i < size; i++){
            this.vectors.push(this.genFeature(results[i]));
        }
        this.removeAllFeatures();
        this.addFeatures(this.vectors);
        this.onDataBack.call(null, results, this.vectors);
    },

    genFeature: function(data){
        
        if(data.longitude && data.latitude){
            var geometry = new OpenLayers.Geometry.Point(data.longitude, data.latitude);
        }else if(data.position){
            var transtor = new OpenLayers.Format.GeoJSON();  //新建转换器
            var geometry = transtor.read(data.position)[0].geometry; 
        }


        // var geometry = new OpenLayers.Geometry.Point(data.longitude, data.latitude);
        var feature = new OpenLayers.Feature.Vector(geometry, data);
        feature.layer = this;
        return feature;
    },

    setCollection: function(collection){
        this.collection = collection;
    },

    setFilter: function(filter){
        this.filter = filter;
    },

    fetch: function(){
        if(!this.collection) return;

        this.collection.get(this.filter, $.proxy(this._onDataBack, this));
    },

    destroy: function(){
        OpenLayers.Layer.Vector.prototype.destroy.apply(this, arguments); 
        clearInterval(this.it);
        this.collection = null;
        this.filter = null;
        this.added = null;
        this.vectors = null;
    }
    
});