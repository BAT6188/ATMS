define(function(require, exports, module){
    return [function(){
        var data = {
            'page': 1,
            'pageSize': 10,
            'maxSize': 5
        };

        var Klass = function(){
            this.data = function(){
                var dat = angular.copy(data);
                dat.query = function(){
                    var r = {
                        page: dat.page,
                        limit: dat.pageSize
                    };

                    for(var key in dat){
                        if(key === 'maxSize' || key === 'pageSize'){
                            continue;
                        }
                        r[key] = dat[key];
                    }

                    return r;
                };
                return dat;
            };
        };

        return new Klass();
    }];
});