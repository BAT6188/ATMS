var PRIVILEGES = (function() {
	var PRIVS = {
		'登记人权限' : 'ZHDD_DJR',
		'调度员权限' : 'ZHDD_DDY',
		'指挥长权限' : 'ZHDD_ZHZ',
		'指挥调度_支队' : 'ZHDD_ZD',
		'指挥调度_大队' : 'ZHDD_DD'
	};

	return {
		/**
		 * 获取权限值
		 * @param privName 
		 */
		getPrivCode : function(privName) {
			return PRIVS[privName];
		},
		/**
		 * 判断权限值是否存在
		 * @param privCode
		 * @return 存在true/不存在false
		 */
		hasPrivValue : function(privCode) {
			for (var key in PRIVS) {
				if (PRIVS[key] && PRIVS[key] == privCode) {
					return true;
				}
			}
			return false;
		}
	};
})();
