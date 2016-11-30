define(function(require, exports, module){
    return ['StatTS', '$http', 'Auth', function(StatTS, $http, Auth){
        var data;
        
        var Klass = function (){
            var deptCode = null;

            var req = null;

            this.get = function(type, callback){
                if (!deptCode || !req) {
                    return;
                }
                if(data){
                    callback.call(null, data[type]);
                }else{
                    req.$promise.then(function(val){
                        // if(!data) return;
                        data = val.results;
                        callback.call(null, data[type]);
                    });
                }
            };
            
            this.init = function(){
                deptCode = Auth.getDeptCode();
                req = StatTS.status({"deptCode": (deptCode === '320300000000') ? null : deptCode});
            };
            
            this.destroy = function(){
                deptCode = null;
                req = null;
            };
        }

        return new Klass();
    }];
});