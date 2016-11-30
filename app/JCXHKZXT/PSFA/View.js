define(function(require, exports, module){
  var controller = ['$scope', 'Message', '$http', '$routeParams', function($scope, Message, $http, $routeParams){
	  $scope.name = $routeParams.name;
	  $scope.jzfx = [{code:1, name:'东'}, {code:2, name:'西'}, {code:3, name:'南'}, {code:4, name:'北'}];
	  
	  $http.get('app/JCXHKZXT/XX/xx.json').success(function(data) {
          $scope.xx = data;
      });
	  
	  $scope.chagne = function(){
		  $http.get('app/JCXHKZXT/PSFA/psfa.json').success(function(data) {
	          $scope.fas = data;
	          if($scope.fa===undefined)
	        	  $scope.fa = $scope.fas[0];
	          else
	        	  $scope.fa = $scope.fas[$scope.fa.bh-1];
	          
	          for(var i=0;i<$scope.xx.length;i++){
	        	  if($scope.xx[i].id==$scope.fa.xxbh){
	        		  $scope.fa.xx = $scope.xx[i];
	        	  }
	          }
	      });
	  };
	  $scope.chagne();
	  
	  $scope.upload = function() {
		  window.setTimeout(function(){
	          Messenger().post({
	              message : '配时方案成功上传！',
	              type : 'success',
	              showCloseButton : true
	          });
		  }, 2000);
      }
	  
      $scope.download = function() {
    	  window.setTimeout(function(){
    		  Messenger().post({
                  message : '配时方案成功下载！',
                  type : 'success',
                  showCloseButton : true
              });
    	  }, 2000);
      }
  }];
  module.exports = controller;
});