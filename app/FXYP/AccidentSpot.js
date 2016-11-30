define(function (require, exports, module) {
    var controller = ['$scope', 'DictCache','Query',
     function ($scope, DictCache,Query) {
        var acc = [
        			{
						no: 1,					//黑点对象编号
						name: '何山路-冰河路' ,				//(*)路口/路段名称								
						lng: 32.880 ,					//(*)经度
						lat:120.0001  ,					//(*)纬度
						normal:	6,					//一般事故次数
						large:	4,					//重大事故次数
						extra:	3,					//特大事故次数  
						accidents:[]		
					},
					{
						no: 2,					//黑点对象编号
						name: '何山路' ,				//(*)路口/路段名称								
						lng: 32.880 ,					//(*)经度
						lat:120.0001  ,					//(*)纬度
						normal:	5,					//一般事故次数
						large:	3,					//重大事故次数
						extra:	2,					//特大事故次数  
						accidents:[]		//事故数组  
					},
					{
						no: 3,					//黑点对象编号
						name: '东环高架' ,				//(*)路口/路段名称								
						lng: 32.880 ,					//(*)经度
						lat:120.0001  ,					//(*)纬度
						normal:	15,					//一般事故次数
						large:	13,					//重大事故次数
						extra:	2,					//特大事故次数  
						accidents:[]		//事故数组  
					},
					{
						no: 4,					//黑点对象编号
						name: '北环快速路' ,				//(*)路口/路段名称								
						lng: 32.880 ,					//(*)经度
						lat:120.0001  ,					//(*)纬度
						normal:	9,					//一般事故次数
						large:	3,					//重大事故次数
						extra:	4,					//特大事故次数  
						accidents:[]		//事故数组  
					},
					{
						no: 5,					//黑点对象编号
						name: '宝带西路' ,				//(*)路口/路段名称								
						lng: 32.880 ,					//(*)经度
						lat:120.0001  ,					//(*)纬度
						normal:	25,					//一般事故次数
						large:	3,					//重大事故次数
						extra:	12,					//特大事故次数  
						accidents:[]		//事故数组  
					},
					{
						no: 6,					//黑点对象编号
						name: '人民路-干将路' ,				//(*)路口/路段名称								
						lng: 32.880 ,					//(*)经度
						lat:120.0001  ,					//(*)纬度
						normal:	8,					//一般事故次数
						large:	3,					//重大事故次数
						extra:	2,					//特大事故次数  
						accidents:[]		//事故数组  
					},
					{
						no: 7,					//黑点对象编号
						name: '旺米街' ,				//(*)路口/路段名称								
						lng: 32.880 ,					//(*)经度
						lat:120.0001  ,					//(*)纬度
						normal:	45,					//一般事故次数
						large:	13,					//重大事故次数
						extra:	2,					//特大事故次数  
						accidents:[]		//事故数组  
					},
					{
					no: 8,					//黑点对象编号
					name: '马涧路' ,				//(*)路口/路段名称								
					lng: 32.880 ,					//(*)经度
					lat:120.0001  ,					//(*)纬度
					normal:	25,					//一般事故次数
					large:	13,					//重大事故次数
					extra:	2,					//特大事故次数  
					accidents:[]		//事故数组  
					}
				];

		$scope.items = [];
        DictCache("0036", function(dict){
          	$scope.regions = dict;
	          	angular.forEach($scope.regions,function(e){
	          	var num = Math.floor(Math.random()*100);
	          	e.count = num;
	          	e.accSpot = acc;
         	});
        });

        $scope.first = true;
        $scope.listShow = true;
       	$scope.rule = {
			period : '2年',	//时间段
			normal:	5,					//一般事故次数
			large:	3,					//重大事故次数
			extra:	2,					//特大事故次数
			crossingDis:50,				//路口范围
			roadDis:300,				//路段范围
		};

		$scope.region = function(e){
			$scope.regionDetail = true;
			$scope.regionData = e;
			$scope.first = false;
		};

		$scope.records = [
			{
				no: 1,					//黑点对象编号
				name: '何山路-冰河路' ,				//(*)路口/路段名称								
				lng: 32.880 ,					//(*)经度
				lat:120.0001  ,					//(*)纬度
				normal:	6,					//一般事故次数
				large:	4,					//重大事故次数
				extra:	3,					//特大事故次数  
				accidents:[
							]		
			},
						{
				no: 2,					//黑点对象编号
				name: '何山路' ,				//(*)路口/路段名称								
				lng: 32.880 ,					//(*)经度
				lat:120.0001  ,					//(*)纬度
				normal:	5,					//一般事故次数
				large:	3,					//重大事故次数
				extra:	2,					//特大事故次数  
				accidents:[]		//事故数组  
			},
						{
				no: 3,					//黑点对象编号
				name: '东环高架' ,				//(*)路口/路段名称								
				lng: 32.880 ,					//(*)经度
				lat:120.0001  ,					//(*)纬度
				normal:	15,					//一般事故次数
				large:	13,					//重大事故次数
				extra:	2,					//特大事故次数  
				accidents:[]		//事故数组  
			},
						{
				no: 4,					//黑点对象编号
				name: '北环快速路' ,				//(*)路口/路段名称								
				lng: 32.880 ,					//(*)经度
				lat:120.0001  ,					//(*)纬度
				normal:	9,					//一般事故次数
				large:	3,					//重大事故次数
				extra:	4,					//特大事故次数  
				accidents:[]		//事故数组  
			},
						{
				no: 5,					//黑点对象编号
				name: '宝带西路' ,				//(*)路口/路段名称								
				lng: 32.880 ,					//(*)经度
				lat:120.0001  ,					//(*)纬度
				normal:	25,					//一般事故次数
				large:	3,					//重大事故次数
				extra:	12,					//特大事故次数  
				accidents:[]		//事故数组  
			},
						{
				no: 6,					//黑点对象编号
				name: '人民路-干将路' ,				//(*)路口/路段名称								
				lng: 32.880 ,					//(*)经度
				lat:120.0001  ,					//(*)纬度
				normal:	8,					//一般事故次数
				large:	3,					//重大事故次数
				extra:	2,					//特大事故次数  
				accidents:[]		//事故数组  
			},
						{
				no: 7,					//黑点对象编号
				name: '旺米街' ,				//(*)路口/路段名称								
				lng: 32.880 ,					//(*)经度
				lat:120.0001  ,					//(*)纬度
				normal:	45,					//一般事故次数
				large:	13,					//重大事故次数
				extra:	2,					//特大事故次数  
				accidents:[]		//事故数组  
			},
						{
				no: 8,					//黑点对象编号
				name: '马涧路' ,				//(*)路口/路段名称								
				lng: 32.880 ,					//(*)经度
				lat:120.0001  ,					//(*)纬度
				normal:	25,					//一般事故次数
				large:	13,					//重大事故次数
				extra:	2,					//特大事故次数  
				accidents:[]		//事故数组  
			},
						{
				no: 9,					//黑点对象编号
				name: '太湖大道-建林路出口' ,				//(*)路口/路段名称								

				lng: 32.880 ,					//(*)经度
				lat:120.0001  ,					//(*)纬度
				normal:	11,					//一般事故次数
				large:	13,					//重大事故次数
				extra:	2,					//特大事故次数  
				accidents:[]		//事故数组  
			},
						{
				no: 10,					//黑点对象编号
				name: '朝红路' ,				//(*)路口/路段名称								
				lng: 32.880 ,					//(*)经度
				lat:120.0001  ,					//(*)纬度
				normal:	5,					//一般事故次数
				large:	3,					//重大事故次数
				extra:	2,					//特大事故次数  
				accidents:[]		//事故数组  
			},
						{
				no: 1,					//黑点对象编号
				name: '狮山路' ,				//(*)路口/路段名称								
				lng: 32.880 ,					//(*)经度
				lat:120.0001  ,					//(*)纬度
				normal:	5,					//一般事故次数
				large:	3,					//重大事故次数
				extra:	2,					//特大事故次数  
				accidents:[]		//事故数组  
			},
		];
		$scope.chartBarData = [
					{ name: '普通事故', data: [] },
					{ name: '重大事故', data: [] }, 
					{ name: '特大事故', data: [] }]; 
		$scope.chartBarXAxis = [];
		$scope.charData = function(){
			angular.forEach($scope.records,function(e){
				if(e){
					$scope.chartBarXAxis.push(e.name || '');
					$scope.chartBarData[0].data.push(e.normal || 0);
					$scope.chartBarData[1].data.push(e.large || 0);
					$scope.chartBarData[2].data.push(e.extra || 0);
				}
			})
		};
		$scope.charData();

    }];

    module.exports = controller;
}); 