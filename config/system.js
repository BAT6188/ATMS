var systemConfig = (function() {
	var SYS = {
		//银江诱导屏配置
		'SCREEN_YJ_SERVER_IP' : '10.38.196.201',
		'SCREEN_YJ_SERVER_PORT' : 1234,
		'SCREEN_YJ_SERVER_USERNAME' : 'admin',

		//大华视频配置
		'VIDEO_DH_SERVER_IP' : '10.38.134.157',
		'VIDEO_DH_SERVER_PORT' : '9000',
		'VIDEO_DH_SERVER_USERNAME' : 'ly',
		'VIDEO_DH_SERVER_PASSWORD' : 'ly123',
		
		//websocket的IP和端口
		'WEBSOCKET_SERVER_IP' : '172.16.60.38',
		'WEBSOCKET_SERVER_PORT' : '9092',

		"PEAK" :['6时','7时','8时','17时','18时','19时'],
		//5分钟
		"MINUTE5":['0分','5分','10分','15分','20分','25分','30分','35分','40分','45分','50分','55分'],
		//24小时
		"HOURS":['0时','1时','2时','3时','4时','5时','6时','7时','8时','9时','10时','11时',
				 '12时','13时','14时','15时','16时','17时','18时','19时','20时','21时','22时',
				 '23时'],
		//31天
		"DAYS":['1日','2日','3日','4日','5日','6日','7日','8日','9日','10日',
				'11日','12日','13日','14日','15日','16日','17日','18日','19日','20日',
				'21日','22日','23日','24日','25日','26日','27日','28日','29日','30日','31日'],
		//12月
		"MONTHS":['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
		
		//网络访问诱导屏前缀
		'VMS_PREFIX_URL' : 'http://10.10.17.181:8888',

        //设备程序网络访问图片地址
        'VMS_PIC_URL' : 'http://10.10.17.181:8888',

        //到岗提醒，距离警情地点20米
		'PTASK_CONFIRM_DISTANCE' : 20
	};

	var VIDEOERROR = (function() {
		var errors = {
			'4' : '连接远端失败',
			'10' : '未知通道',
			'11' : '设备离线',
			'1010' : '操作超时',
			'1011' : '同步调用错误',
			'3501' : '创建窗口失败',
			'3502' : '无此窗口ID',
			'1001521' : '云台内部控制错误'
		};
		return {
			/**
			 * 获取当前错误编码描述
			 */
			getErrorDesc : function(code) {
				if (code) {
					if (!errors.hasOwnProperty(code)) {
						return code;
					}
					return errors[code];
				}
				return '暂无';
			}
		};
	})();

	return {
		/**
		 * 获取系统配置参数值
		 * @param privName
		 */
		getSystemValue : function(key) {
			if (key) {
				if (SYS.hasOwnProperty(key)) {
					return SYS[key];
				}
			}
			return;
		},

		/**
		 * 获取系统配置参数值
		 * @param privName
		 */
		getVideoError : function() {
			return VIDEOERROR;
		}
	};
})();

//布控报警上传图片的访问地址
var JCBK_PIC_URL = 'http://172.16.65.181/bukong/';