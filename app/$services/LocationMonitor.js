define(function(require, exports, module){
    return ['$rootScope', function($rootScope){

        var foo = function(){

            this.confirmLeave = function(callback){
                var off1 = $rootScope.$on('$locationChangeStart', function(e){
                    if (!window.confirm("确定要离开这个视图吗?")) { 
                      e.preventDefault();
                    }else if(typeof callback === 'function'){
                        try{
                            callback.apply(null, arguments);
                        }catch(e){
                            console.log(e);
                        }
                    }
                    off1();
                });
            };

            this.beforeLeave = function(callback){
                if(typeof callback !== 'function'){
                    return;
                }
                var off1 = $rootScope.$on('$locationChangeStart', function(){
                    try{
                        callback.apply(null, arguments);
                    }catch(e){
                        console.log(e);
                    }
                    off1();
                });
            };
        };

        return new foo();
    }];
});