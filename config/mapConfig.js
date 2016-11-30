//地图默认显示的地理区域范围 'XZ'即为徐州
//GeoSetup.setLocation('XZ','PGIS');
GeoSetup.setLocation('HK','GMAP');
//地图的坐标系统
var MAP_SR = '4326';
//底图瓦片服务地址
//var base_url = 'pgis@http://172.16.60.46:9001/rest/pub/1/tiles';
var base_url = 'gmap@http://172.16.60.46:9001/rest/pub/2/tile';
  // var base_url = 'pgis@http://192.168.2.106:9001/tiles';
// var base_url = 'pgis@http://172.16.64.24:9001/tiles';
// var base_url = 'pgis@http://192.168.2.106:9001/tiles';
// var base_url = 'pgis@http://192.168.99.123:9001/tiles';

var policeTarckColors = ['#0000CC','#330033','#990099','#CC0000','#FF6600','#333333'];
var carTarckColors = ['#FFFF00','#FF9999','#FF3399','#CC33FF','#99FF00','#6699FF'];
var TrackPointNum = 10;