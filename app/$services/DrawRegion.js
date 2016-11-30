define(function(require, exports, module){
    return ['$http','Auth', function($http,Auth){
        //根据部门data_code,得知gid
        //用户登录 进入页面
        //map为非Imap
        var Klass = function(map){

            if (sessionStorage._login) {
                var _login = sessionStorage._login;
                try {
                  _login = JSON.parse(_login);
                  var regionId = _login.dept?_login.dept.deptCode:0; //部门修改，有待调整
                } catch(e) {
                  console.log(e);
                }
            }


            var where ="id = '" + regionId +"'";  //实际
            // var where ='gid =' +3;//泉山

            var options = {
                url: '../giserver/configs/xz_area/',
                where: where
            };

            this.getLayer = function(){
                return xz_areaLyr;
            };

            this.clear = function(){
                map.removeLayer(xz_areaLyr);
            };

            this.setWhere = function(){
                xz_areaLyr.setWhere(where);
            };

            //显示执勤区
            this.draw = function(callback){
                
                var xz_areaLyr = new OpenLayers.Layer.ExDyLayer2('xz_area',options.url,options);
                map.addLayer(xz_areaLyr);

                // xz_areaLyr.events.on({"query_loaded":function(data){
                //     console.log(data);
                // }});

                // xz_areaLyr.setWhere(where);

                //用于居中
                var url = options.url+'query';
                var params = {
                    where : where,
                    geometry: '100,30,130,40',
                    inSR:  '4326',
                    outSR: '4326'
                };
                $http({
                        url: url, 
                        params: params,
                        method: 'GET'
                    }).success(function(data){
                        var geojson = new OpenLayers.Format.GeoJSON();
                        var features = geojson.read(data);
                        // if(features.length > 0){
                        //     map.zoomToExtent(features[0].geometry.getBounds());
                        // }

                        // var pt = features[0].geometry.getCentroid();
                        // var lonlat = new OpenLayers.LonLat(pt.x, pt.y);
                        // map.setCenter(lonlat,2); //该区域居中

                        if(typeof callback === 'function'){
                            callback(features);
                        }
                    });  
            };

        };

        return Klass;
    }];
});