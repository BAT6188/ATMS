define(function(require, exports, module){

  var app = angular.module('App.resources', ['ngResource'], ['$provide', function($provide){
    var params = null;

    var get_url_params = function(key){
      if(!params){
        params={};
        _.each(window.location.search.replace(/\?/,'').split(/&/), function(param){
            var kv = param.split(/=/);
            params[kv[0]] = kv[1];
        });
      }
      return params[key];
    };

    $provide.factory('Dict', ['$resource', '$location', function($resource, $location){
        var env = get_url_params('env')||'java';

//        var resource = $resource('/' + env + '/dicts/:action/:id', {id:'@id'}, 
        var resource = $resource('/java/dicts/:action/:id', {id:'@id'}, 
          {
            update: {method: 'PUT'},
            query: {method: 'POST', params: {action: 'list'}},
              getParents: {method: 'POST', params: {action: 'root'}},
              getChildrenByParent: {method: 'POST', params: 'parent'}
          }
        );

        return resource;

    }]);

    //布控
    $provide.factory('Dispatch', ['$resource', function($resource){
        var env = get_url_params('env')||'java';
        
        var resource = $resource('/' + env + '/bukong/:action/:id', {id:'@dispId'}, 
          {
            update: {method: 'PUT'},
            query: {method: 'POST', params: {action: 'list'}},
            /*dispatchSP: {method: 'POST', params: {action: 'dispatchSP'}},*/
            dispatchSP:{url: '/' + env + '/bukong/:action',method: 'POST', params: {action: 'dispatchSP'}},
            removeDispatch:{url: '/' + env + '/bukong/:action',method: 'POST', params: {action: 'removeDispatch'}}
          }
        );

        return resource;

    }]);

     //布控
    $provide.factory('Alarm', ['$resource', function($resource){
        var env = get_url_params('env')||'java';
        
        var resource = $resource('/' + env + '/alarm/:action/:id', {id:'@id'}, 
          {
            update: {method: 'PUT'},
            query: {method: 'POST', params: {action: 'list'}}
          }
        );

        return resource;

    }]);
    $provide.factory('Device', ['$resource', function($resource){
        var env = get_url_params('env')||'java';
        
        var resource = $resource('/' + env + '/deviceNew/:action/:id', {id:'@id'}, 
          {
            update: {method: 'PUT'},
            query: {method: 'POST', params: {action: 'list'}}
          }
        );

        return resource;

    }]);
    
    $provide.factory('Duty', ['$resource', function($resource){
        var env = get_url_params('env')||'java';
        
        var resource = $resource('/' + env + '/dutyTask/:action/:id', {id:'@id'}, 
          {
            update: {method: 'PUT'},
            query: {method: 'POST', params: {action: 'list'}},
            police:{method: 'POST', params: {action: 'findFreePolices'}},
            get:{method: 'POST'},
            //updatePoliceStatus:{method: 'PUT', params: {action: 'scheduleRecord',id:'@recordId'}}
            updatePoliceStatus:{url: '/' + env + '/dutyTask/:action/:id',method: 'PUT', params: {action: 'scheduleRecord',id:'@recordId'}}
          }
        );

        return resource;

    }]);
    
    //设备状态
    $provide.factory('DeviceStatus', ['$resource', function($resource){
        var env = get_url_params('env')||'java';
        
        var resource = $resource('/' + env + '/devStatusRec/:action/:ttt/:id', {id:'@id'}, 
          {
            update: {method: 'PUT'},
            query: {method: 'POST', params: {action: 'list'}},
            realTime: {method: 'POST', params: {action: 'list', ttt:'realTime'}},
            history: {method: 'POST', params: {action: 'list', ttt:'history'}}
          }
        );

        return resource;

    }]);
    //设备维修
    $provide.factory('DeviceRepair', ['$resource', function($resource){
        var env = get_url_params('env')||'java';
        
        var resource = $resource('/' + env + '/deviceRepair/:action/:id', {id:'@id'}, 
          {
            update: {method: 'PUT'},
            query: {method: 'POST', params: {action: 'list'}}
          }
        );

        return resource;

    }]);

    //设备
    $provide.factory('Facility', ['$resource', function($resource){
        var env = get_url_params('env')||'java';
        
        var resource = $resource('/' + env + '/facility/:action/:id', {id:'@id'}, 
          {
            update: {method: 'PUT'},
            query: {method: 'POST', params: {action: 'list'}}
          }
        );

        return resource;

    }]);

    //警车
    $provide.factory('PoliceCar', ['$resource', function($resource){
        var env = get_url_params('env')||'java';
        
        var resource = $resource('/' + env + '/policeCar/:action/:ttt/:id', {id:'@id'}, 
          {
            update: {method: 'PUT'},
            query: {method: 'POST', params: {action: 'list'}},
            records:{method: 'POST', params: {action: 'list',ttt:'record',id:'@equipId'}},
            changeState:{method: 'POST', params: {action: 'changeState',id:'@equipId'}},
            returnEquip:{method: 'POST', params: {action: 'return',id:'@equipId'}}
           // changeState:{url: '/' + env + '/policeCar/:id/changeState',method: 'POST', params: {id:'@equipId'}}
          }
        );  

        return resource;

    }]);

    //特勤
    $provide.factory('specialDuty', ['$resource', function($resource){
        var env = get_url_params('env')||'java';

        var resource = $resource('/' + env + '/stask/:id/:action/:deptIds', {id: '@id'}, 
          {
            update: {method: 'PUT'},
            query: {method: 'POST', params: {action: 'list'}},
            dispatch:{method: 'POST', params: {action: 'dispatch',deptIds:'@deptIds'}}
          }
        );

        return resource;

    }]);
    $provide.factory('User', ['$resource', function($resource){
        var env = get_url_params('env')||'java';

        var resource = $resource('/' + env + '/user/:action/:id', {id: '@userId'}, 
          {
            update: {method: 'PUT'},
            query: {method: 'POST', params: {action: 'list'}},
            queryNoDept: {method: 'POST', params: {action: 'listNoDept'}}
          }
        );

        return resource;

    }]);
    
    //诱导消息管理
    $provide.factory('MsgPublish', ['$resource', function($resource){
        var env = get_url_params('env')||'java';
        
        var resource = $resource('/' + env + '/msgPublish/:action/:id', {id:'@id'}, 
          {
            update: {method: 'PUT'},
            query: {method: 'POST', params: {action: 'list'}}
          }
        );

        return resource;

    }]);
    
    //诱导屏管理
    $provide.factory('Cms', ['$resource', function($resource){
        var env = get_url_params('env')||'java';
        
        var resource = $resource('/' + env + '/cms/:action/:id', {id:'@id'}, 
          {
            update: {method: 'PUT'},
            query: {method: 'POST', params: {action: 'list'}}
          }
        );

        return resource;

    }]);
    
    //诱导屏播放列表管理
    $provide.factory('PlayList', ['$resource', function($resource){
        var env = get_url_params('env')||'java';
        
        var resource = $resource('/' + env + '/msg/:action/:id', {id:'@id'}, 
          {
            update: {method: 'PUT'},
            query: {method: 'POST', params: {action: 'list'}},
            updateIndex: {method: 'POST', params: {action: 'updateIndex'}}
          }
        );

        return resource;

    }]);
    
   //海口诱导屏播放列表管理
    $provide.factory('HKPlayList', ['$resource', function($resource){
        var env = get_url_params('env')||'java';
        
        var resource = $resource('/' + env + '/playlist/:action/:id', {id:'@id'}, 
          {
            update: {method: 'PUT'},
            query: {method: 'POST', params: {action: 'list'}},
            updateIndex: {method: 'PUT', params: {action: 'updateIndex'}}
          }
        );

        return resource;

    }]);
    
    //诱导屏与路段对应关系管理
    $provide.factory('CmsRoadRelation', ['$resource', function($resource){
      var env = get_url_params('env')||'java';
      
      var resource = $resource('/' + env + '/relation/:action/:id', {id:'@id'}, 
        {
          update: {method: 'PUT'},
          query: {method: 'POST', params: {action: 'list'}}
        }
      );

      return resource;
    }]);
    
    //路况预测管理
    $provide.factory('Plan', ['$resource', function($resource){
        var env = get_url_params('env')||'java';

        var resource = $resource('/' + env + '/roadSetting/:action/:id', {id: '@settingId'}, 
          {
            update: {method: 'PUT'},
            query: {method: 'POST', params: {action: 'list'}}
          }
        );

        return resource;

    }]);
    
    //角色管理
    $provide.factory('Role', ['$resource', function($resource){
      var env = get_url_params('env')||'java';
      
      var resource = $resource('/' + env + '/role/:action/:id', {id:'@id'}, 
        {
          update: {method: 'PUT'},
          query: {method: 'POST', params: {action: 'list'}},
          getUser: {method: 'POST', params: {action: 'user'}},
          getDep: {method: 'POST', params: {action: 'dept'}}
        }
      );

      return resource;
    }]);
    
    //权限管理
    $provide.factory('Pri', ['$resource', function($resource){
      var env = get_url_params('env')||'java';
      
      var resource = $resource('/' + env + '/pri/:action/:id', {id:'@id'}, 
        {
          update: {method: 'PUT'},
          query: {method: 'POST', params: {action: 'list'}},
          assign: {method: 'POST', params: {action:'assign'}}
        }
      );

      return resource;
    }]);
    
    $provide.factory('Post', ['$resource', function($resource){
      var env = get_url_params('env')||'java';

      var resource = $resource('/' + env + '/post/:action/:id', {id: '@id'}, 
        {
          update: {method: 'PUT'},
          query: {method: 'POST', params: {action: 'list'}}
        }
      );

      return resource;
    }]);

    $provide.factory('PoliceTask', ['$resource', function($resource){
      var env = get_url_params('env')||'java';

      var resource = $resource('/'+env+'/policeTask/:action/:id', {id:'@id'}, 
        {
          update: {method: 'PUT'},
          query: {method: 'POST', params: {action: 'list'}},
          save: {method: 'POST', withCredentials: true},
          merge:{method: 'POST',params:{action: 'merge',id: '@kkkk'}},
          split:{method: 'POST',params:{action: 'split',id: '@kkkk'}},
          getScreenModel: {method: 'POST', params: {action: 'analysisXml4Screen', infoXML: '@infoXML'}}
        }
      );

      return resource;
    }]);

   $provide.factory('PoliceTaskFeedback', ['$resource', function($resource){
      var env = get_url_params('env')||'java';

      var resource = $resource('/'+env+'/policeTask/feedback/:action/:id/', {id:'@id'}, 
        {
          update: {method: 'PUT'},
          query: {method: 'POST', params: {action: 'list'}},
          save: {method: 'POST', withCredentials: true},
          removeByPid: {method: 'POST', params: {action: 'removeByPid' }},
        }
      );

      return resource;
    }]);

    $provide.factory('Evaluate', ['$resource', function($resource){
      var env = get_url_params('env')||'java';

      var resource = $resource('/'+env+'/policeTask/evaluate/:action/:id', {id:'@id'}, 
        {
          update: {method: 'PUT'},
          query: {method: 'POST', params: {action: 'list'}},
          save: {method: 'POST', withCredentials: true}
        }
      );

      return resource;
    }]);
    
    $provide.factory('PoliceTaskSetPolice', ['$resource', function($resource){
      var env = get_url_params('env')||'java';

      var resource = $resource('/'+env+'/policeTask/setPolice/:action/:id', {id:'@id'}, 
        {
          update: {method: 'PUT'},
          query: {method: 'POST', params: {action: 'list'}},
          save: {method: 'POST', withCredentials: true}
        }
      );

      return resource;
    }]);

    $provide.factory('Dept', ['$resource', '$location', function($resource, $location){
      var env = get_url_params('env')||'java';

      var resource = $resource('/' + env + '/department/:action/:id', {id:'@deptId'}, 
        {
          update: {method: 'PUT'},
          query: {method: 'POST', params: {action: 'list'}}
        }
      );

      return resource;
    }]);

    $provide.factory('PoliceGps', ['$resource', function($resource){
      var env = get_url_params('env')||'java';

      var resource = $resource('/' + env + '/policeGps/:isHistory/:action/:id', {id:'@policeNo'}, 
        {
          update: {method: 'PUT'},
          get: {method: 'POST'},
          query: {method: 'POST', params: {action: 'list'}},
          getHistoryData: {method: 'POST', params: {action: 'list', isHistory: 'history'}},
          getHistoryDataByPoliceNo: {method: 'POST', params: {isHistory: 'history'}},

          listByDept:{method: 'POST', params: {action: 'listByDept'}}
        }
      );

      return resource;
    }]);

    $provide.factory('PoliceCarGps', ['$resource', function($resource){
      var env = get_url_params('env')||'java';

      var resource = $resource('/' + env + '/carGps/:isHistory/:action/:id', {id:'@carNo'}, 
        {
          update: {method: 'PUT'},
          get: {method: 'POST'},
          query: {method: 'POST', params: {action: 'list'}},
          getHistoryData: {method: 'POST', params: {action: 'list', isHistory: 'history'}},
          getHistoryDataByPoliceNo: {method: 'POST', params: {isHistory: 'history'}}
        }
      );

      return resource;
    }]);

    $provide.factory('StatTS', ['$resource', function($resource){
      var env = get_url_params('env')||'java';

      var resource = $resource('/' + env + '/rtAnalysis/:action/:id', {id:'@id'}, 
        {
          get: {method: 'POST'},
          query: {method: 'POST', params: {action: 'list'}},
          status: {method: 'POST', params: {action: 'status'}}
        }
      );

      return resource;
    }]);

    //事故管理
    $provide.factory('Accident', ['$resource', function($resource){
      var env = get_url_params('env')||'java';
      
      var resource = $resource('/' + env + '/accident/:isDownload/:action/:id', {id:'@id'}, 
        {
          update: {method: 'PUT'},
          query: {method: 'POST', params: {action: 'list'}},
          count:{method: 'POST', params: {action: 'analysisByCount'}},
          person:{method: 'POST', params: {action: 'analysisByPerson'}},
          type:{method: 'POST', params: {action: 'analysisByType'}},
          time:{method: 'POST', params: {action: 'analysisByTime'}},
          area:{method: 'POST', params: {action: 'analysisByArea'}},
          dept:{method: 'POST', params: {action: 'analysisByDept'}},
          factor:{method: 'POST', params: {action: 'analysisByFactor'}}
        }
      );
      return resource;
    }]);

     //日志管理
    $provide.factory('Log', ['$resource', function($resource){
      var env = get_url_params('env')||'java';
      
      var resource = $resource('/' + env + '/systemLog/:action/:id', {id:'@id'}, 
        {
          update: {method: 'PUT'},
          query: {method: 'POST', params: {action: 'list'}}
        }
      );
      return resource;
    }]);
    
    //菜单管理
    $provide.factory('Menu', ['$resource', function($resource){
      var env = get_url_params('env')||'java';
      
      var resource = $resource('/' + env + '/menu/:action/:id', {id:'@menuId'}, 
        {
          update: {method: 'PUT'},
          query: {method: 'POST', params: {action: 'list'}},
          tree: {method: 'POST', params: {action: 'tree',id:0}}
        }
      );
      return resource;
    }]);

    //登录登出
    $provide.factory('DL', ['$resource', function($resource){
      var env = get_url_params('env')||'java';
      
      var resource = $resource('/' + env + '/:action', {id:'@id'}, 
        {
          login: {method: 'POST', params: {action: 'login'}},
          logout: {method: 'POST', params: {action: 'logout'}},
          login4Alarm: {url: '/' + env + '/login/:sessionid', 
              method: 'GET', params: {sessionid: '@sessionid'}}
        }
      );
      return resource;
    }]);
    
    //GPS
    $provide.factory('GPS', ['$resource', function($resource){
      var env = get_url_params('env')||'java';
      
      var resource = $resource('/' + env + '/staskGps/:action', {},
        {
          sendMsg: {method: 'POST', params: {action: 'sendMsg'}}
        }
      );
      return resource;
    }]);
    
    //车辆查询
    $provide.factory('VehicleQuery', ['$resource', function($resource){
      var env = get_url_params('env')||'java';
      
      var resource = $resource('/' + env + '/trafficRecord/:action/:id', {id:'@id'},
        {
        update: {method: 'PUT'},
          query: {method: 'POST', params: {action: 'list'}},
          exportData: {method: 'POST', params: {action: 'exportdata'}},
          exportImg: {method: 'POST', params: {action: 'exportimg'}}
        }
      );
      return resource;
    }]);
    
    //点位管理
    $provide.factory('Point', ['$resource', function($resource){
      var env = get_url_params('env')||'java';
      
      var resource = $resource('/' + env + '/point/:action/:id', {id:'@id'},
        {
          findTreeList: {method: 'POST', params: {action: 'findTreeList'}}
        }
      );
      return resource;
    }]);

    //路段
    $provide.factory('RoadSection', ['$resource', function($resource) {
      var env = get_url_params('env') || 'java';

      var resource = $resource('/' + env + '/roadsec/:action/:id', {
        id : '@id'
      }, {
        query : {
          method : 'POST',
          params : {
            action : 'list'
          }
        }
      });
      return resource;
    }]);

    //流量
    $provide.factory('FacetFlow', ['$resource', function($resource){
      var env = get_url_params('env')||'java';
      
      var resource = $resource('/' + env + '/facetFlow/:action/:id', {id:'@id'}, 
        {
          queryFacetDayPeakHour:{url: '/' + env + '/facetFlow/:action',method: 'POST', params: {action: 'queryFacetDayPeakHour'}},
          flowCompareTime:{url: '/' + env + '/facetFlow/:action',method: 'POST', params: {action: 'flowCompareTime'}},
          flowCompareFacet:{url: '/' + env + '/facetFlow/:action',method: 'POST', params: {action: 'flowCompareFacet'}},
        }
      );

      return resource;
    }]);

    //违法记录
    $provide.factory('Violation', ['$resource', function($resource){
      var env = get_url_params('env')||'java';
      
      var resource = $resource('/' + env + '/violation/:action/:id', {id:'@id'}, 
        {
          query: {method: 'POST', params: {action: 'list'}},
          listCljg: {method: 'POST', params: {action: 'listCljg'}},
          listByCfzl:{method: 'POST', params: {action: 'listByCfzl'}},
          listByXxly:{method: 'POST', params: {action: 'listByXxly'}},
          listByJdslb:{method: 'POST', params: {action: 'listByJdslb'}},
          listCompareTime:{method: 'POST', params: {action: 'listCompareTime'}},
          listClWfCs:{method: 'POST', params: {action: 'listClWfCs'}},
          listWfjl:{method: 'POST', params: {action: 'listWfjl'}},
          listJsrWfCs:{method: 'POST', params: {action: 'listJsrWfCs'}},
          listByQueryBean:{method: 'POST', params: {action: 'listByQueryBean'}},
          listLdWfCs:{method: 'POST', params: {action: 'listLdWfCs'}},
          listWfjl:{method: 'POST', params: {action: 'listWfjl'}},
          listRoadMsg:{method: 'POST', params: {action: 'listRoadMsg'}},
          listWfxwNew:{method: 'POST', params: {action: 'listWfxwNew'}},
          listDaduiList:{method: 'POST', params: {action: 'listDaduiList'}},
          listVioAnalyse:{method: 'POST', params: {action: 'listVioAnalyse'}},
        }
      );

      return resource;
    }]);

    //违法记录
    $provide.factory('Facet', ['$resource', function($resource){
      var env = get_url_params('env')||'java';
      
      var resource = $resource('/' + env + '/facet/:action/:id', {id:'@id'}, 
        {
          update: {method: 'PUT'},
          queryFacet: {method: 'POST', params: {action: 'queryFacet'}},
          findFacet: {method: 'POST'}
        }
      );

      return resource;
    }]);

  }]);

});