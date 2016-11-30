/**
 * @author 刘荣涛
 * 2013.6.16
 * 修改：许照云 2013.10.9
 */
OpenLayers.Layer.ExDyLayer2 = OpenLayers.Class(OpenLayers.Layer.Grid,{
    
    singleTile: true,
    ratio: 1,
    wrapDateLine: true,
    
    url:null,
    queryURL:null,
    where:null,//是否有where条件用于export
    
    features:[],
    
    initialize: function(name, url, options) {
        OpenLayers.Layer.Grid.prototype.initialize.apply(this, [
            name || this.name, url || this.url, {}, options
        ]); 
        
        this.where = options['where']||'1=2';
        this.outfields = options['outfields']||'*';
        this.format = options['format']||'GEOJSON';
        this.spatialRel = options['spatialRel']||'contains';

        this.buffer = options['buffer']||0; //新增该参数，待验证

        this.geometry = options['geometry']||0;
        
        this.exp = {
            where: this.where,
            outfields: this.outfields,
            format:this.format,
            spatialRel:this.spatialRel,
            buffer:this.buffer, //新增该参数，待验证
            geometry:this.geometry
        };
        this.features = [];
    },
    
    destroy: function(){
        OpenLayers.Layer.Grid.prototype.destroy.apply(this, arguments); 
        this.exp = null;
        this.features = null;
    },
    
    getURL: function (value) {
        if(!this.sr){
            this.exp['inSR']  = this.map.projection.split(':')[1];
            this.exp['outSR'] = this.exp['inSR'];
        }
        
        var bounds = this.adjustBounds(value);
        var geometry = bounds.left + "," + bounds.bottom + "," + bounds.right + "," + bounds.top;

        var size = this.getImageSize();
        
        this.exp['geometry'] = this.geometry || geometry;

        this.exp['extent'] = geometry; //即为bbox
        
        this.exp['size'] = size.w + "," + size.h;
       
        var url = this.url + "export?" + this.gen_get_param(this.exp);

        this.query();
        
        return url;
    },
    
    gen_get_param: function(data){
        var r = [];
        for(var key in data){
            var val = data[key];
            if(typeof val !== 'function' && typeof val !== 'object'){
                r.push(key + '=' + val);
            }
        }
        return r.join('&');
    },
    
    query:function(){
        if(this.jsonLoading){
            return;
        }
        
        this.jsonLoading = true;
        
        this.features = [];
        
        this.queryURL = this.url + "query?where=" + this.where
                        +"&outfields="+this.outfields
                        // +"&buffer="+this.buffer
                        // +"&geometry="+this.geometry
                        +"&inSR="+this.exp['inSR']
                        +"&outSR="+this.exp['outSR'];
                        
        var url = this.url + "query";
    },
    
    setWhere: function(val){
        this.where = val;
        this.exp['where'] = val;
        this.redraw();
    },

    setExp:function(options){

        this.where = options['where']||this.where||'1=2';
        this.outfields = options['outfields']||this.outfields||'*';
        this.format = options['format']||this.format||'GEOJSON';
        this.spatialRel = options['spatialRel']||this.spatialRel||'contains';

        this.buffer = options['buffer']||0; //新增该参数，待验证

        this.geometry = options['geometry']||0;
        
        this.exp = {
            where: this.where,
            outfields: this.outfields,
            format:this.format,
            spatialRel:this.spatialRel,
            buffer:this.buffer, //新增该参数，待验证
            geometry:this.geometry
        };
    },

    refresh:function(){
        // this.redraw();
        var lonlat = this.map.getExtent().getCenterLonLat();
        this.map.panTo(new OpenLayers.LonLat(lonlat.lon-0.000001, lonlat.lat));
    },

    /**
    *针对徐州项目，态势监控页面，获取表单数据，定制的方法
    *只做query请求，不export请求，不绘图
    */
    getFeatures: function(options,callback){
        if(!options){
            options = {};
        }
        var where = options['where'] || this.where;
        var outfields = options['outfields']||this.outfields;
        var format = options['format']||'GEOJSON';
        var spatialRel = options['spatialRel']||'contains';

        // var geometry = options['geometry']||'116,33,119,35'; //暂且只考虑该坐标

        var geometry = options['geometry']||'global';//请求所有坐标数据，特殊情况
        var buffer = options['buffer']||0;

        var startRow = options['startRow']||0;
        var endRow = options['endRow']||0;

        var url = this.url + 'query';

        var params = {
            where: where,
            geometry: geometry,
            buffer:buffer,
            spatialRel: spatialRel,
            outfields: outfields,
            inSR: this.exp['inSR'] || '4326',
            outSR: this.exp['outSR'] || '4326',
            startRow:startRow,
            endRow:endRow
        };

        $.ajax({
            url: url,
            dataType:'json',
            method: 'POST',
            data: params,
            context: this,
            success: function(data){
                this.events.triggerEvent('getFeaturesDown', {features: data.features});
                this.events.triggerEvent('featuresloaded', {features: data.features});
                var geojson = new OpenLayers.Format.GeoJSON();
                var features = geojson.read(data);

                // this.features = _.map(data.features, function (feature){
                //     return {
                //         attributes: feature.properties,
                //         geometry: {
                //             x: feature.geometry.coordinates[0],
                //             y: feature.geometry.coordinates[1]
                //         }
                //     }
                // });

                
                for(var i = 0, size = features.length; i < size; i++){
                    features[i].dyLyr = this;
                }
                
                if(typeof callback === 'function'){
                    callback.call(this, features);
                }
            },
            error: function(){
                console.log(arguments);
            }
        });
    },

    getTotal:function(where,callback){
        var url = this.url +'total';
        var params = {
            where:where
        };
        $.ajax({
            url: url,
            dataType:'json',
            method: 'POST',
            data: params,
            // context: this,
            success: function(data){
                if(typeof callback === 'function'){
                    callback(data);
                }
            },
            error: function(){
                console.log(arguments);
            }
        });
    },


    
    CLASS_NAME: "OpenLayers.Layer.ExDyLayer2"
});
