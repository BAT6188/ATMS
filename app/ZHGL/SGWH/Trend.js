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
         	});
        });

		$scope.xaxis=  systemConfig.getSystemValue('MONTHS');
        $scope.series = [
        	{ name: '普通事故',data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4] },
        	{ name: '重大事故', data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3] },
        	{ name: '特大事故', data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2] }];

    }];

    module.exports = controller;
}); 