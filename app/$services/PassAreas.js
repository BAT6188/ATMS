define(function(require, exports, module){
    return ['$http', function($http){
        var Klass = function(url){
            //url代表行政区域的动态图层url地址
            //默认值为'../giserver/configs/xz_area'
            if(!url){
                url = '../giserver/configs/xz_area';
            }

            this.getUrl = function(){
                return url;
            };

            this.getAreas = function(lineString,callback){
                //linestring为wkt对象、或OL的geometry对象

                if(typeof(lineString) !== 'string'){  //将OL的geometry对象转化为string格式
                    lineString = lineString.toString();
                }

                // LINESTRING(117.08850473246 34.414245656185,117.26916952981 34.418151922074,117.35315424641 34.40252685852)

                var params = {
                    buffer:  0,
                    geometry: lineString,
                    inSR:  '4326',
                    outSR: '4326',
                    outfields: '*',
                    spatialRel:  'intersects',
                    callback:null
                };

                $http({
                    url: url+'/query', 
                    params: params,
                    method: 'GET'
                }).success(function(data){

                    var areaIDs = [];
                    var names = [];
                    for(var i=0;i<data.features.length;i++){
                        var id = data.features[i].properties.ID;
                        var name = data.features[i].properties.NAME;
                        areaIDs.push(id);
                        names.push(name);
                    }


                    if(typeof(callback) === 'function'){
                        callback(areaIDs,names,data.features)
                    }

                });    
            };
            
        };

        return Klass;
    }];
});