define(function(require, exports, module){
  var controller = ['$scope', 'Message', '$http', '$routeParams', function($scope, Message, $http, $routeParams){
	 
	  $http.get('app/JCXHKZXT/SBFA/colors.json').success(function(data) {
          $scope.colors = data;
      });
	  $http.get('app/JCXHKZXT/SBFA/sbfa.json').success(function(data) {
          $scope.fas = data;
      }).then(function(data){
    	  $scope.editSb = function(sb){
    		  if($scope.fa.sbs===undefined){
    			  $scope.sb = undefined;
    		  }else{
    			  for(var i=0;i<$scope.fa.sbs.length;i++){
    				  $scope.fa.sbs[i].checked = false;
        		  }
    			  $scope.sb = $scope.fa.sbs[sb-1];
    			  $scope.sb.checked = true;
    		  }
    	  };
    	  $scope.editFa = function(fa){
    		  for(var i=0;i<$scope.fas.length;i++){
    			  $scope.fas[i].checked = false;
    		  }
    		  $scope.fa = $scope.fas[fa-1];
    		  $scope.fa.checked = true;
    		  $scope.editSb(1);
    	  };
    	  $scope.editFa(1);
      });
	  
	  $scope.addBh = function(){
		  var bh = $scope.fa.bhs.length+1;
		  $scope.fa.bhs.push({"bh": bh, "value": 0});
		  for(var i=0, iLen=$scope.fa.sbs.length; i<iLen;i++){
			  var sb = $scope.fa.sbs[i];
			  for(var j=0, jLen=sb.dzs.length; j<jLen;j++){
				  var dz = sb.dzs[j];
				  dz.bhs.push({"bh": bh, "sbId": 1})
			  }
		  }
		  $scope.fa.bhsLength = $scope.fa.bhs.length;
	  };
	  
	  $scope.removeBh = function(){
		  $scope.fa.bhs.splice($scope.fa.bhsLength-1, 1)
		  for(var i=0, iLen=$scope.fa.sbs.length; i<iLen;i++){
			  var sb = $scope.fa.sbs[i];
			  for(var j=0, jLen=sb.dzs.length; j<jLen;j++){
				  var dz = sb.dzs[j];
				  dz.bhs.splice(dz.bhs.bhsLength-1, 1);
			  }
		  }
		  $scope.fa.bhsLength = $scope.fa.bhs.length;
	  };
	  
	  $scope.addFa = function(){
		  var fabh = $scope.fas.length+1;
		  var fa = {"fa": fabh, 
					"fan": "方案" + fabh,
					"checked": true,
					"bhs": [
						{"bh": 1, "value": 0}, {"bh": 2, "value": 0}, {"bh": 3, "value": 0}, {"bh": 4, "value": 0},
						{"bh": 5, "value": 0}, {"bh": 6, "value": 0}, {"bh": 7, "value": 0}, {"bh": 8, "value": 0},
						{"bh": 9, "value": 0}, {"bh": 10, "value": 0}, {"bh": 11, "value": 0}, {"bh": 12, "value": 0},
						{"bh": 13, "value": 0}, {"bh": 14, "value": 0}, {"bh": 15, "value": 0}, {"bh": 16, "value": 0}
					],
					"bhsLength": 16
		  };
		  $scope.fas.push(fa);
		  $scope.editFa(fabh);
	  };
	  $scope.removeFa = function(){
		  $scope.fas.splice($scope.fas.length-1, 1)
		  $scope.editFa($scope.fas.length);
	  };
	  $scope.refreshFa = function(){
		  
	  };
	  
	  $scope.selectColor = function(sb, dz, bh, color){
		  for(var i=0,iLen=$scope.fa.sbs.length;i<iLen;i++){
			  if($scope.fa.sbs[i].sb===sb.sb){
				  var dzs = $scope.fa.sbs[i].dzs;
				  for(var j=0,jLen=dzs.length;j<jLen;j++){
					  if(dzs[j].dz===dz.dz){
						  var bhs = dzs[j].bhs; 
						  for(var k=0,kLen=bhs.length;k<kLen;k++){
							  if(bhs[k].bh === bh.bh){
								  bhs[k].sbId = color.id;
							  }
						  }
					  }
				  }
			  }
		  }
	  }
	  
	  $scope.addSb = function(){
		  if($scope.fa.sbs===undefined){
			  $scope.fa.sbs = [];
		  }
		  var sbbh = $scope.fa.sbs.length+1;
		  var sb = {
				"sb": sbbh,
				"sbn": "色步" + sbbh,
				"checked": true,
				"dzs": [{
				        	"dz": "1",
				        	"img":"app/JCXHKZXT/img/xx/left.png",
							"bhs": [
							        {"bh": 1, "sbId": 1}, {"bh": 2, "sbId": 1}, {"bh": 3, "sbId": 1}, {"bh": 4, "sbId": 1},
							        {"bh": 5, "sbId": 1}, {"bh": 6, "sbId": 1}, {"bh": 7, "sbId": 1}, {"bh": 8, "sbId": 1},
									{"bh": 9, "sbId": 1}, {"bh": 10, "sbId": 1}, {"bh": 11, "sbId": 1}, {"bh": 12, "sbId": 1},
									{"bh": 13, "sbId": 1}, {"bh": 14, "sbId": 1}, {"bh": 15, "sbId": 1}, {"bh": 16, "sbId": 1}
							] 
						},{
							"dz": "2",
							"img":"app/JCXHKZXT/img/xx/top.png",
							"bhs": [
							        {"bh": 1, "sbId": 1}, {"bh": 2, "sbId": 1}, {"bh": 3, "sbId": 1}, {"bh": 4, "sbId": 1},
									{"bh": 5, "sbId": 1}, {"bh": 6, "sbId": 1}, {"bh": 7, "sbId": 1}, {"bh": 8, "sbId": 1},
									{"bh": 9, "sbId": 1}, {"bh": 10, "sbId": 1}, {"bh": 11, "sbId": 1}, {"bh": 12, "sbId": 1},
									{"bh": 13, "sbId": 1}, {"bh": 14, "sbId": 1}, {"bh": 15, "sbId": 1}, {"bh": 16, "sbId": 1}
							] 
						},{
							"dz": "3",
							"img":"app/JCXHKZXT/img/xx/left.png",
							"bhs": [
							        {"bh": 1, "sbId": 1}, {"bh": 2, "sbId": 1}, {"bh": 3, "sbId": 1}, {"bh": 4, "sbId": 1},
									{"bh": 5, "sbId": 1}, {"bh": 6, "sbId": 1}, {"bh": 7, "sbId": 1}, {"bh": 8, "sbId": 1},
									{"bh": 9, "sbId": 1}, {"bh": 10, "sbId": 1}, {"bh": 11, "sbId": 1}, {"bh": 12, "sbId": 1},
									{"bh": 13, "sbId": 1}, {"bh": 14, "sbId": 1}, {"bh": 15, "sbId": 1}, {"bh": 16, "sbId": 1}
							] 
						},{
							"dz": "4",
							"img":"app/JCXHKZXT/img/xx/top.png",
							"bhs": [
							        {"bh": 1, "sbId": 1}, {"bh": 2, "sbId": 1}, {"bh": 3, "sbId": 1}, {"bh": 4, "sbId": 1},
									{"bh": 5, "sbId": 1}, {"bh": 6, "sbId": 1}, {"bh": 7, "sbId": 1}, {"bh": 8, "sbId": 1},
									{"bh": 9, "sbId": 1}, {"bh": 10, "sbId": 1}, {"bh": 11, "sbId": 1}, {"bh": 12, "sbId": 1},
									{"bh": 13, "sbId": 1}, {"bh": 14, "sbId": 1}, {"bh": 15, "sbId": 1}, {"bh": 16, "sbId": 1}
							] 
						},{
							"dz": "5",
							"img":"app/JCXHKZXT/img/xx/left.png",
							"bhs": [
							        {"bh": 1, "sbId": 1}, {"bh": 2, "sbId": 1}, {"bh": 3, "sbId": 1}, {"bh": 4, "sbId": 1},
									{"bh": 5, "sbId": 1}, {"bh": 6, "sbId": 1}, {"bh": 7, "sbId": 1}, {"bh": 8, "sbId": 1},
									{"bh": 9, "sbId": 1}, {"bh": 10, "sbId": 1}, {"bh": 11, "sbId": 1}, {"bh": 12, "sbId": 1},
									{"bh": 13, "sbId": 1}, {"bh": 14, "sbId": 1}, {"bh": 15, "sbId": 1}, {"bh": 16, "sbId": 1}
							] 
						},{
							"dz": "6",
							"img":"app/JCXHKZXT/img/xx/top.png",
							"bhs": [
							        {"bh": 1, "sbId": 1}, {"bh": 2, "sbId": 1}, {"bh": 3, "sbId": 1}, {"bh": 4, "sbId": 1},
									{"bh": 5, "sbId": 1}, {"bh": 6, "sbId": 1}, {"bh": 7, "sbId": 1}, {"bh": 8, "sbId": 1},
									{"bh": 9, "sbId": 1}, {"bh": 10, "sbId": 1}, {"bh": 11, "sbId": 1}, {"bh": 12, "sbId": 1},
									{"bh": 13, "sbId": 1}, {"bh": 14, "sbId": 1}, {"bh": 15, "sbId": 1}, {"bh": 16, "sbId": 1}
							] 
						},{
							"dz": "7",
							"img":"app/JCXHKZXT/img/xx/left.png",
							"bhs": [
							        {"bh": 1, "sbId": 1}, {"bh": 2, "sbId": 1}, {"bh": 3, "sbId": 1}, {"bh": 4, "sbId": 1},
									{"bh": 5, "sbId": 1}, {"bh": 6, "sbId": 1}, {"bh": 7, "sbId": 1}, {"bh": 8, "sbId": 1},
									{"bh": 9, "sbId": 1}, {"bh": 10, "sbId": 1}, {"bh": 11, "sbId": 1}, {"bh": 12, "sbId": 1},
									{"bh": 13, "sbId": 1}, {"bh": 14, "sbId": 1}, {"bh": 15, "sbId": 1}, {"bh": 16, "sbId": 1}
							] 
						},{
							"dz": "8",
							"img":"app/JCXHKZXT/img/xx/top.png",
							"bhs": [
							        {"bh": 1, "sbId": 1}, {"bh": 2, "sbId": 1}, {"bh": 3, "sbId": 1}, {"bh": 4, "sbId": 1},
									{"bh": 5, "sbId": 1}, {"bh": 6, "sbId": 1}, {"bh": 7, "sbId": 1}, {"bh": 8, "sbId": 1},
									{"bh": 9, "sbId": 1}, {"bh": 10, "sbId": 1}, {"bh": 11, "sbId": 1}, {"bh": 12, "sbId": 1},
									{"bh": 13, "sbId": 1}, {"bh": 14, "sbId": 1}, {"bh": 15, "sbId": 1}, {"bh": 16, "sbId": 1}
							] 
						},{
							"dz": "9",
							"img":"app/JCXHKZXT/img/xx/person.png",
							"bhs": [
							        {"bh": 1, "sbId": 1}, {"bh": 2, "sbId": 1}, {"bh": 3, "sbId": 1}, {"bh": 4, "sbId": 1},
									{"bh": 5, "sbId": 1}, {"bh": 6, "sbId": 1}, {"bh": 7, "sbId": 1}, {"bh": 8, "sbId": 1},
									{"bh": 9, "sbId": 1}, {"bh": 10, "sbId": 1}, {"bh": 11, "sbId": 1}, {"bh": 12, "sbId": 1},
									{"bh": 13, "sbId": 1}, {"bh": 14, "sbId": 1}, {"bh": 15, "sbId": 1}, {"bh": 16, "sbId": 1}
							] 
						},{
							"dz": "10",
							"img":"app/JCXHKZXT/img/xx/person.png",
							"bhs": [
							        {"bh": 1, "sbId": 1}, {"bh": 2, "sbId": 1}, {"bh": 3, "sbId": 1}, {"bh": 4, "sbId": 1},
									{"bh": 5, "sbId": 1}, {"bh": 6, "sbId": 1}, {"bh": 7, "sbId": 1}, {"bh": 8, "sbId": 1},
									{"bh": 9, "sbId": 1}, {"bh": 10, "sbId": 1}, {"bh": 11, "sbId": 1}, {"bh": 12, "sbId": 1},
									{"bh": 13, "sbId": 1}, {"bh": 14, "sbId": 1}, {"bh": 15, "sbId": 1}, {"bh": 16, "sbId": 1}
							] 
						},{
							"dz": "11",
							"img":"app/JCXHKZXT/img/xx/person.png",
							"bhs": [
							        {"bh": 1, "sbId": 1}, {"bh": 2, "sbId": 1}, {"bh": 3, "sbId": 1}, {"bh": 4, "sbId": 1},
									{"bh": 5, "sbId": 1}, {"bh": 6, "sbId": 1}, {"bh": 7, "sbId": 1}, {"bh": 8, "sbId": 1},
									{"bh": 9, "sbId": 1}, {"bh": 10, "sbId": 1}, {"bh": 11, "sbId": 1}, {"bh": 12, "sbId": 1},
									{"bh": 13, "sbId": 1}, {"bh": 14, "sbId": 1}, {"bh": 15, "sbId": 1}, {"bh": 16, "sbId": 1}
							] 
						},{
							"dz": "12",
							"img":"app/JCXHKZXT/img/xx/person.png",
							"bhs": [
							        {"bh": 1, "sbId": 1}, {"bh": 2, "sbId": 1}, {"bh": 3, "sbId": 1}, {"bh": 4, "sbId": 1},
									{"bh": 5, "sbId": 1}, {"bh": 6, "sbId": 1}, {"bh": 7, "sbId": 1}, {"bh": 8, "sbId": 1},
									{"bh": 9, "sbId": 1}, {"bh": 10, "sbId": 1}, {"bh": 11, "sbId": 1}, {"bh": 12, "sbId": 1},
									{"bh": 13, "sbId": 1}, {"bh": 14, "sbId": 1}, {"bh": 15, "sbId": 1}, {"bh": 16, "sbId": 1}
							] 
						}
					]
		  };
		  $scope.fa.sbs.push(sb);
		  $scope.editSb($scope.fa.sbs.length);
	  };
	  $scope.removeSb = function(){
		  $scope.fa.sbs.splice($scope.fa.sbs.length-1, 1);
		  $scope.editSb($scope.fa.sbs.length);
	  };
	  $scope.refreshSb = function(){
		  
	  };
  }];
  module.exports = controller;
});