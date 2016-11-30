(function() {
  var a, config;

  a = angular.module('validator.rules', ['validator']);
  
  var urlRegex = "^((https|http|ftp|rtsp|mms)?://)"  
         + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" //ftp的user@  
         + "(([0-9]{1,3}\.){3}[0-9]{1,3}" // IP形式的URL- 199.194.52.184  
         + "|" // 允许IP和DOMAIN（域名） 
         + "([0-9a-z_!~*'()-]+\.)*" // 域名- www.  
         + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\." // 二级域名  
         + "[a-z]{2,6})" // first level domain- .com or .museum  
         + "(:[0-9]{1,4})?" // 端口- :80  
         + "((/?)|" // a slash isn't required if there is no file name  
         + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$/";  
  
  var strRegex = /^[0-9]+$/; 
  

  config = function($validatorProvider) {

      var arr = [4, 5, 6, 38, 50, 64, 100, 200];
      _.forEach(arr, function(item){
          $validatorProvider.register('length' + item, {
              validator: function(value, scope, element, attrs, $injector){
                  if(value){
                      value += '';
                      var len = value.match(/[^ -~]/g) == null ? value.length : value.length + value.match(/[^ -~]/g).length;
                      if(len <= item){
                          return [1];
                      }else{
                          return false;
                      }
                  }else{
                      return [1];
                  }
              },
              error: '超过最大长度限制！'
          });
      });

      _.each(validations,function(item){
        $validatorProvider.register(item[0], {
          invoke: item[1],
          validator: item[2],
          error: item[3]
        });
      });

      // $http.get('config/validation.json').success(function(results){
      //   if(results.length > 0){
      //     _.each(results, function(item){
      //       console.log(item);
      //         // record.active = false;
      //     });
      //   }

      // });


  };

  config.$inject = ['$validatorProvider'];

  a.config(config);

}).call(this);
