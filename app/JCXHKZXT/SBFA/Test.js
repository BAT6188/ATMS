define(function(require, exports, module){
  var controller = ['$scope', 'Message', '$http', '$routeParams', function($scope, Message, $http, $routeParams){
	 
	  Date.prototype.format =function(format){
	        var o = {
	        		"M+" : this.getMonth()+1, //month
	        		"d+" : this.getDate(),    //day
	        		"h+" : this.getHours(),   //hour
	        		"m+" : this.getMinutes(), //minute
	        		"s+" : this.getSeconds(), //second
	        		"q+" : Math.floor((this.getMonth()+3)/3),  //quarter
	        		"S" : this.getMilliseconds() //millisecond
	        }
	        if(/(y+)/.test(format)) 
	        	format=format.replace(RegExp.$1, (this.getFullYear()+"").substr(4- RegExp.$1.length));
	        for(var k in o)if(new RegExp("("+ k +")").test(format))
	        	format = format.replace(RegExp.$1,
	        RegExp.$1.length==1? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
	        return format;
	    }
	  
	  $http.get('app/JCXHKZXT/SBFA/colors.json').success(function(data) {
          $scope.colors = data;
      });
	  $http.get('app/JCXHKZXT/SBFA/sbfa.json').success(function(data) {
          $scope.fas = data;
      }).then(function(data){
    	  $scope.fa = $scope.fas[0];
    	  $scope.sb = $scope.fa.sbs[0];
    	  
    	  $scope.sj = [];
    	  var count = 0;
    	  for(var i=0;i<$scope.fa.bhs.length;i++){
    		  count += $scope.fa.bhs[i].value;
    		  $scope.sj.push(count);
    	  }
    	  
    	  $scope.entry = {
    			  qyh : '0',
    			  qylkh : '12',
    			  lkmc : '一环南路蓬莱路',
    			  ljzt : '联机',
    			  kzfs : '单点多',
    			  xhjcj : '宝康',
    			  lksj : new Date().format("yyyy-MM-dd hh:mm:ss"),
    			  fwqsj : new Date().format("yyyy-MM-dd hh:mm:ss"),
    			  szqc : '92',
    			  bzqyxsj : count,
    			  sbbh : '11'
    	  };
    	  $http.get('app/JCXHKZXT/XHJGL/xhjList.json').success(function(data) {
              $scope.xhjs = data;
              $scope.entry.xhj = $scope.xhjs[0].no; 
          });
    	  
    	  $scope.auto = function(){
    		  $('#auto').hide();
    		  $('#cancel').show();
    	  };
    	  $scope.cancel = function(){
    		  $('#auto').show();
    		  $('#cancel').hide();
    	  };
      });
  }];
  module.exports = controller;
});