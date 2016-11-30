define(function(require, exports, module){
    return ['$http', function($http){
        var Klass = function(value){
            var url = value;
            
            this.getUrl = function(){
                return url;
            };

            this.buffer = function(params){
                return $http({
                    url: url .replace(/\/$/, '') + '/query', 
                    params: params,
                    method: 'GET'
                });    
            };
            
        };

        return Klass;
    }];
});