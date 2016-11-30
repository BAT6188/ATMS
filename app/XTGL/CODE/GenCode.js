define(function(require, exports, module){
    return ['$scope', 'Modal',  'Restangular',function($scope,Modal,  Restangular){


    $scope.jason =	 {		
			  packagePath:"net.yhte.atms.device",
			  module:"device",
			  javaClass:"TrafficMsg",
			  desc:"交通基础信息",
			  table:"T_TRAFFIC_MSG",
			  seq:"SEQ_TRAFFIC_MSG",
			  fields:[
			          /*{dataName:'id',dataDesc:'主键ID',dataType:'String',isQuery:true},
			          {dataName:'startTime',dataDesc:'开始时间',dataType:'Date'},
			          {dataName:'lng',dataDesc:'经度',dataType:'float'}*/
			          ]
			  };

	$scope.frontNum = 0;

	$scope.$watch('frontNum',function(){
		console.log($scope.frontNum);
		if($scope.frontNum == 6){
			$scope.getLoadUrl();
		}
	});
/*-------------------前台代码-----------------------*/
	//列表项
    Handlebars.registerHelper('td_str', function(field) { 
    	//可增加两个参数的
      	return '{{e.' + field + '}}';  
    });

    //格式化表单
    Handlebars.registerHelper('form_i', function(name,type) { 
    	//可增加两个参数的
    	switch(type){
    		case 'Input':
    			var str = '<input class="form-control input-sm" ng-model="record.' + name + '"' +' name ="'+name+'"'+'>';
    			break;
    		case 'Select':
		    	var str = '<select' +' name ="'+name+'"' + ' ng-options="c.name for c in options" ng-model="record.'  + name +'"' + ' class="form-control input-sm"></select>';
				break;
    		case 'Date':
    			var str = '<div datetimepicker-new ' +' name ="'+name+'"' +' class="form-control input-sm" placeholder="选择日期" ng-model="record.' + name + '" format="yyyy-mm-dd" min-view="month" start-view="month"></div>'
    			break;
    		case 'Textarea':
    			var str = '<textarea ' +' name ="'+name+'"' +' class="form-control input-sm" rows="3" ng-model="record.'+ name +'"></textarea>';
    			break;
    		default:
    			var str = '<input ' +' name ="'+name+'"' +' class="form-control input-sm" ng-model="record.' + name + '">';
    			break;
    	}

      	return new Handlebars.SafeString(str);  
    });


    //列表
	var template = function(jason,source,fileType,fileName){
		var template = Handlebars.compile(source);
		var content = template(jason);

	  	var name = fileName + '.' + fileType;

	  	//console.log($scope.jason.frontFolderName);
		CreateFile(name,content,'frontCode',null,null,$scope.jason.frontFolderName);
	};

	//获取页面jason值
	var getFields = function(){
/*		var fields = [
         {dataName:'id',dataDesc:'主键ID',dataType:'String',isQuery:true},
         {dataName:'startTime',dataDesc:'开始时间',dataType:'Date'},
         {dataName:'lng',dataDesc:'经度',dataType:'float'}
         ]*/
         var fields = [];
         //前台参数
		$scope.jason.java_name = $("#javaClass").val();

		//字段
		var ds = $("#fields>div:gt(0)");
		for(var i = 0 ;i<ds.length;i++){
			var data = {dataDesc:'',dataName:'',dataType:''};
			var t = ds[i];
			data.dataName = $(t).find('>div:eq(0)>input').val();
			data.dataDesc = $(t).find('>div:eq(1)>input').val();
			data.dataType = $(t).find('>div:eq(2)>select').val();
			data.formType = $(t).find('>div:eq(3)>select').val();

			var arr1 = $(t).find('>div:eq(4)>input:checked');
			if(arr1.length) data.required = arr1[0].checked;
			
			var arr2 = $(t).find('>div:eq(5)>input:checked');
			if(arr2.length) data.isQuery = arr2[0].checked;

			fields.push(data);
		}
		return fields;
	};


	$("#newRow").click( function () {
		var temp = $('#fields>div:eq(1)').clone();
		temp.find('input').val('');
		temp.appendTo($('#fields'));
	});

	//生成列表页面代码
	var listCode = function(){
		$scope.jason.fields = getFields();
		var jason = angular.copy($scope.jason);
		jason.title = "列表";
		$.ajax({ url: "app/XTGL/CODE/list-temp-html.html",
			 	 type:'get',
			 	 dataType:'html',
			 	error:function() {   
                	alert("request error!");   
              	},    
				success: function(data){
	        		template(jason,data,'html','list');
	     		}
	 	});


	 	$.ajax({ url: "app/XTGL/CODE/list-temp-js.html",
			 	 type:'get',
			 	 dataType:'text',
			 	error:function() {   
                	alert("request error!");   
              	},    
				success: function(data){
	        		template(jason,data,'js','list');
	     		}
	 	});
	};

	//生成新增页面代码
	var newCode = function(){
		$scope.jason.fields = getFields();
		var jason = angular.copy($scope.jason);
		jason.title = "新增";
		$.ajax({ url: "app/XTGL/CODE/new-temp-html.html",
		 	type:'get',
		 	dataType:'html',
		 	error:function() {   
            	alert("request error!");   
          	},    
			success: function(data){
        		template(jason,data,'html','new');
     		}
 		});


	 	$.ajax({ url: "app/XTGL/CODE/new-temp-js.html",
			 	 type:'get',
			 	 dataType:'text',
			 	error:function() {   
                	alert("request error!");   
              	},    
				success: function(data){
	        		template(jason,data,'js','new');
	     		}
	 	});
	};

	//生成编辑页面代码
	var editCode  = function(){
		$scope.jason.fields = getFields();
		var jason = angular.copy($scope.jason);
		jason.title = "编辑";
		$.ajax({ url: "app/XTGL/CODE/edit-temp-html.html",
		 	 type:'get',
		 	 dataType:'html',
		 	error:function() {   
            	alert("request error!");   
          	},    
			success: function(data){
        		template(jason,data,'html','edit');
     		}
 		});

	 	$.ajax({ url: "app/XTGL/CODE/edit-temp-js.html",
			 	 type:'get',
			 	 dataType:'text',
			 	error:function() {   
                	alert("request error!");   
              	},    
				success: function(data){
	        		template(jason,data,'js','edit');
	     		}
	 	});
	};


	//生成前端代码
	$scope.frontCode = function(){
		$scope.frontNum = 0;
		var unique = _.uniqueId();
		var date = new Date();
		var time = '' + date.getFullYear() + (date.getMonth()+1) + date.getDate() 
				  + date.getHours() + date.getMinutes() + date.getSeconds() + date.getMilliseconds();
		$scope.unique = time;
		listCode();
		newCode();
		editCode();
	};
	/*-------------------h后台代码-----------------------*/
	Handlebars.registerHelper('fullName', function(person) {
	  return person.firstName + " " + person.lastName;
	});
	
	Handlebars.registerHelper('Max', function(A,B) {
		  return A > B ? A : B;
	});
	
	Handlebars.registerHelper('lowerCase', function(name) {
		  return name.charAt(0).toLowerCase( ) + name.substr(1,name.length-1);
	});
	
	Handlebars.registerHelper('upperCaseAll', function(name) {
		  return name.toUpperCase();
	});
	
	Handlebars.registerHelper('upperFirstCase', function(name) {
		 return name.charAt(0).toUpperCase( ) + name.substr(1,name.length-1);
	});
	
	Handlebars.registerHelper('subFieldOneName', function(fields) {
		  return fields[0].dataName;
	});
	
	Handlebars.registerHelper('converseType', function(type) {
		if(type == "String"){
			type = "VARCHAR";
		}else if(type == "Date"){
			type = "TIMESTAMP";
		}else if(type == "float"){
			type = "NUMERIC";
		}
		  return type;
	});
	
	Handlebars.registerHelper('converseTypeTable', function(type) {
		if(type == "String"){
			type = "VARCHAR2(64)";
		}else if(type == "Date"){
			type = "Date";
		}else if(type == "Integer" || type == "float"){
			type = "NUMBER";
		}
		  return type;
	});
	
	Handlebars.registerHelper('join', function(context, options) {
		 var data, i, j, result, s, sep, _i, _ref;
		 result = [];
		 sep = options.hash['sep'] || ',';
		 s = options.hash['start'] ^ 0;
		 data = null;
		 j = context.length;
		 for (i = _i = s, _ref = j - 1; s <= _ref ? _i <= _ref : _i >= _ref; i = s <= _ref ? ++_i : --_i) {
		 if (options.data) {
		 data = Handlebars.createFrame(options.data || {});
		 data.index = i;
		 if (i === j - 1) {
		 data.last = true;
		 } else {
		 data.last = false;
		 }
		 }
		 result.push(options.fn(context[i], {
		 data: data
		 }));
		 }
		 return result.join(sep);
	});
	
	Handlebars.registerHelper('joinNew', function(context, options) {
		 var data, i, j, result, s, sep, _i, _ref;
		 result = [];
		 sep = options.hash['sep'] || '';
		 s = options.hash['start'] ^ 0;
		 data = null;
		 j = context.length;
		 for (i = _i = s, _ref = j - 1; s <= _ref ? _i <= _ref : _i >= _ref; i = s <= _ref ? ++_i : --_i) {
		 if (options.data) {
		 data = Handlebars.createFrame(options.data || {});
		 data.index = i;
		 if (i === j - 1) {
		 data.last = true;
		 } else {
		 data.last = false;
		 }
		 }
		 result.push(options.fn(context[i], {
		 data: data
		 }));
		 }
		 return result.join(sep);
	});

	$scope.poqbClick = function(){
		$scope.jason.fields = getFields();
		$scope.showTemplatePo();
		$scope.showTemplateQb();
	};
	
	$scope.itfClick = function(){
		$scope.jason.fields = getFields();
		$scope.showTemplateInt();
	};
	
	$scope.jarClick = function(){
		$scope.jason.fields = getFields();
		$scope.showTemplateBiz();
		$scope.showTemplateDao();
		$scope.showTemplateXml();
	};
	
	$scope.webClick = function(){
		$scope.jason.fields = getFields();
		$scope.showTemplateController();
		$scope.showTemplateService();
		$scope.showTemplateRda();
	};

	$("#btn_table").click(function(){
		 showTemplateTable();
	  });

	var backTemplate = function(source,name,sign){
		var template = Handlebars.compile(source);
		var content = template($scope.jason).split("<textarea>")[1].split("</textarea>")[0];
		CreateFile(name,content,sign,$scope.jason.packagePath,$scope.jason.module);
	};

	//po
   	$scope.showTemplatePo = function(){
		$.ajax({ url: "app/XTGL/CODE/po.html",
				 	 type:'get',
				 	 dataType:'text',
				 	error:function() {   
	                	alert("request error!");   
	              	},    
					success: function(data){
						var poName = $scope.jason.javaClass;
						name = poName+".java";
		        		backTemplate(data,name,'po');
		     		}
		});
	};

	//qb
	$scope.showTemplateQb = function(){
		$.ajax({ url: "app/XTGL/CODE/qb.html",
				 	 type:'get',
				 	 dataType:'text',
				 	error:function() {   
	                	alert("request error!");   
	              	},    
					success: function(data){
						var poName = $scope.jason.javaClass;
						name = poName+"QB.java";
		        		backTemplate(data,name,'qb');
		     		}
		});
	};

	//controller
	$scope.showTemplateController = function(){
		$.ajax({ url: "app/XTGL/CODE/controller.html",
				 	 type:'get',
				 	 dataType:'text',
				 	error:function() {   
	                	alert("request error!");   
	              	},    
					success: function(data){
						var poName = $scope.jason.javaClass;
						name = poName + "Controller.java";;
		        		backTemplate(data,name,'controller');
		     		}
		});
	};

	//Service
	$scope.showTemplateService = function (){
		$.ajax({ url: "app/XTGL/CODE/service.html",
				 	 type:'get',
				 	 dataType:'text',
				 	error:function() {   
	                	alert("request error!");   
	              	},    
					success: function(data){
						var poName = $scope.jason.javaClass;
						name =  poName+"Service.java";
		        		backTemplate(data,name,'service');
		     		}
		});
	};

	//Rda
	$scope.showTemplateRda = function (){
		$.ajax({ url: "app/XTGL/CODE/rda.html",
				 	 type:'get',
				 	 dataType:'text',
				 	error:function() {   
	                	alert("request error!");   
	              	},    
					success: function(data){
						var poName = $scope.jason.javaClass;
						name =   poName+"Rda.java";
		        		backTemplate(data,name,'rda');
		     		}
		});
	};

	//Interface
	$scope.showTemplateInt = function (){
		$.ajax({ url: "app/XTGL/CODE/int.html",
			 	 type:'get',
			 	 dataType:'text',
			 	error:function() {   
                	alert("request error!");   
              	},    
				success: function(data){
					var poName = $scope.jason.javaClass;
					name = "I"+poName+".java";
	        		backTemplate(data,name,'itf');
	     		}
		});
	};

	//Biz
	$scope.showTemplateBiz =function (){
		$.ajax({ url: "app/XTGL/CODE/biz.html",
			 	 type:'get',
			 	 dataType:'text',
			 	error:function() {   
                	alert("request error!");   
              	},    
				success: function(data){
					var poName = $scope.jason.javaClass;
					name = poName+"Biz.java";
	        		backTemplate(data,name,'biz');
	     		}
		});
	};

	//Dao
	$scope.showTemplateDao = function(){
		$.ajax({ url: "app/XTGL/CODE/dao.html",
			 	 type:'get',
			 	 dataType:'text',
			 	error:function() {   
                	alert("request error!");   
              	},    
				success: function(data){
					var poName = $scope.jason.javaClass;
					name = poName+"Dao.java";
	        		backTemplate(data,name,'dao');
	     		}
		});
	};

	//XML
	$scope.showTemplateXml = function(){
		$.ajax({ url: "app/XTGL/CODE/xml.html",
			 	 type:'get',
			 	 dataType:'text',
			 	error:function() {   
                	alert("request error!");   
              	},    
				success: function(data){
					var poName = $scope.jason.javaClass;
					name = poName+"Mapper.xml";
	        		backTemplate(data,name,'xml');
	     		}
		});
	};

	//创建文件
	function CreateFile(name,content,sign,packagePath,module){		
		$.ajax({
			   type:"post", //请求方式
			   dataType:'json',
			   url:"/limin/file/writeFile", //发送请求地址
			   data: //发送给数据库的数据
			   		{content:content,
				   		name:name,
				   		sign:sign,
				   		uniqueName: $scope.unique,
				   		packagePath:packagePath,
				   		module:module
				   	} 
			   ,
			   //请求成功后的回调函数有两个参数
			   success:function(data){
			    if(sign == "frontCode"){
			    	$scope.frontNum++;
			    	$scope.$apply();
			    }
			    $scope.frontCodeJava = data.results;
			   }
		});
	}

	$scope.getLoadUrl = function(){
		$.ajax({
			   type:"post", //请求方式
			   dataType:"json",
			   url:"/limin/file/zipFile", //发送请求地址
			   data: //发送给数据库的数据
			   		{	names:'list.html,list.js,new.html,new.js,edit.html,edit.js',
			   			folderName:$scope.frontCodeJava
				   	} 
			   ,
			   //请求成功后的回调函数有两个参数
			   success:function(data){
			    if(data.success){
			    	var file = data.results;
			    	var  url = '/limin/file/downloaddata.do?fileName='+file
			    	window.location = url;
			    }
			   },
			   error:function(data){
			   	console.log(data);
			   	alert(data);
			   }
		});
	};

	/*下载*/
	$scope.load = function(url){
		var url="http://172.16.65.152/isms/frontCode.zip";
	    //var down = window.RestangularProvider.configuration.baseUrl+url;
	    window.open(url);
	};

	}];

});


