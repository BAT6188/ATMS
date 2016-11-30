define(function(require, exports, module){
    var app = angular.module('App.filters', []);

    //事故类型
    app.filter('accidentType', function(){
        var types = [{index: '0', label: '一般'}, {index: '1', label: '严重'}];
        return function(input){
            if(input === types[0].index){
                input = types[0].label;
            }else if(input === types[1].index){
                input = types[1].label;
            }
            return input;
        };
    });
   
    app.filter('filterDevStatus', function(){
        return function(input){
            if(input === '1'){
                input = 'label-danger';
            }else if(input === '2'){
                input = 'label-default';
            }else if(input === '3'){
                input = 'label-warning';
            }else if(input === '4'){
                input = 'label-warning';
            }else if(input === '5'){
                input = 'label-success';
            }
            return input;
        };
    });

    //点位方向;
    app.filter('StateFilter', function(){
        return function(code){
            var state;
            if(code === '1' ){
                state = '畅通';
            }else if(code === '3'){
                state = '正常';
            }
            else if(code === '4'){
                state = '拥堵';
            }
            return state;
        };
    });

    app.filter('filterDeviceStatus', function(){
        return function(input){
            if(input === '1'){
                input = 'label-success';
            }else if(input === '2'){
                input = 'label-danger';
            }else if(input === '3'){
                input = 'label-warning';
            }else if(input === '4'){
                input = 'label-default';
            }else if(input === '5'){
                input = 'label-default';
            }else if(input === '6'){
                input = 'label-info';
            }else{
                input = 'label-default';
            }
            return input;
        };
    });

    //policeTask 2013-12-30
    app.filter('pTaskState', function(){
        return function(input){

            if(input === 1 || input === '1'){
                input = 'label-danger';
            }else if(input === 2 || input === '2'){
                input = 'label-warning';
            }else if(input === 3 || input === '3'){
                input = 'label-success';
            }
            return input;
        };
    });

    //事故等级
    app.filter('accidentLevel', function(){
        return function(input,b){
            var c =false;
            if(b){
                c = true;
            }

            if(input === 1){
                input = '一般';
                b = 'label-primary';
            }else if(input === 2){
                input = '重大';
                b = 'label-warning';
            }else if(input === 3){
                input = '特大';
                b = 'label-danger';
            }

            if(c){
                return b;
            }
            return input;
        };
    });

    //事故形态
    app.filter('accidentForm', function(){
        return function(input,b){
            var c =false;
            if(b){
                c = true;
            }

            if(input === 1){
                input = '正面碰撞';
                b = 'label-primary';
            }else if(input === 2){
                input = '侧面碰撞';
                b = 'label-warning';
            }else if(input === 3){
                input = '尾随相撞';
                b = 'label-danger';
            }else if(input === 4){
                input = '对面刮擦';
                b = 'label-info';
            }else if(input === 5){
                input = '同向刮擦';
                b = 'label-success';
            }else if(input === 6){
                input = '碾压';
                b = 'label-success';
            }else{
                input = '其他';
                b = 'label-default';
            }

            if(c){
                return b;
            }
            return input;
        };
    });

    //人员分类
    app.filter('personType', function(){
        return function(input,b){
            var c =false;
            if(b){
                c = true;
            }

            if(input === 1){
                input = '驾驶人';
                b = 'label-success';
            }else if(input === 2){
                input = '乘车人';
                b = 'label-warning';
            }else if(input === 3){
                input = '骑车人';
                b = 'label-danger';
            }else if(input === 4){
                input = '行人';
                b = 'label-info';
            }

            if(c){
                return b;
            }
            return input;
        };
    });

    //事故类型
    app.filter('accidentType', function(){
        return function(input,b){
            var c =false;
            if(b){
                c = true;
            }

            if(input === 1){
                input = '人车事故';
                b = 'label-success';
            }else if(input === 2){
                input = '车车事故';
                b = 'label-warning';
            }else if(input === 3){
                input = '人非事故';
                b = 'label-danger';
            }else if(input === 4){
                input = '车非事故';
                b = 'label-info';
            }else if(input === 5){
                input = '单车事故';
                b = 'label-info';
            }else if(input === 6){
                input = '其他';
                b = 'label-info';
            }

            if(c){
                return b;
            }
            return input;
        };
    });

    //身体状况
    app.filter('pCondition', function(){
        return function(input,b){
            var c =false;
            if(b){
                c = true;
            }

            if(input === 1){
                input = '健康';
                b = 'label-success';
            }else if(input === 2){
                input = '轻伤';
                b = 'label-warning';
            }else if(input === 3){
                input = '重伤';
                b = 'label-danger';
            }else if(input === 4){
                input = '死亡';
                b = 'label-info';
            }

            if(c){
                return b;
            }
            return input;
        };
    });

    app.filter('tqStatus', function(){
        return function(code){
            var b;
            if(code === '1'){
                b = 'btn-warning';
            }else if(code === '2'){
                b = 'btn-primary';
            }else if(code === '3'){
                b = 'btn-info';
            }else if(code === '4'){
                b = 'btn-success';
            }else if(code === '5'){
                b = 'btn-default';
            }
            return b;
        };
    });
    
    app.filter('weekFilter', function(){
        return function(code){
            var b;
            if(code === '1'){
                b = '星期一';
            }else if(code === '2'){
                b = '星期二';
            }else if(code === '3'){
                b = '星期三';
            }else if(code === '4'){
                b = '星期四';
            }else if(code === '5'){
                b = '星期五';
            }
            else if(code === '6'){
                b = '星期六';
            }else if(code === '7'){
                b = '星期日';
            }
            return b;
        };
    });
    
    //态势监控，客户端分页
    app.filter('paginator', function(){
        return function(array, page, size){
            if(!array){
                return;
            }
            var start = size * (page - 1);
            return array.slice(start, start + size);
        };
    });

    //兼容通州
    app.filter('dictFilterByCode', [function(){
        return function(input, dicts){
            for (var i = 0; i < dicts.length; i++) {
                var item = dicts[i];
                if(item.code === input){
                    return item.name;
                }
            };
            return null;
        };
    }]);

    app.filter('dateFilter', [function(){
        return function(input){
            if(input && input.length > 10){
                return input.substring(0, 10);
            }
        }
    }]);
    
    app.filter('timeFilter', [function(){
        return function(input){
            if(input){
                return input.substring(0, 2)+':'+input.substring(2, 4)	;
            }
        }
    }]);
    
    app.filter('colorFilter', [function(){
        return function(input, colors){
        	for (var i = 0, length=colors.length; i < length; i++) {
        		var color = colors[i];
        		if(input===color.id){
        			return color.url;
        		}
        	}
        }
    }]);
    
    app.filter('isMainFilter', function(){
        return function(code){
            var b;
            if(code === 0){
            	b = '否';
            }else if(code === 1){
            	b = '是';
            }
            return b;
        };
    });
        
    //道路预案是否有效
    app.filter('FilterIsUsing', function(){
        return function(code){
            var isUsing;
            if(code === '0' ){
            	isUsing = '无效';
            }else if(code === '1'){
            	isUsing = '有效';
            }
            return isUsing;
        };
    });
    
    module.exports = app;
});