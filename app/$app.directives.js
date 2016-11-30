define(function(require, exports, module){
    var app = angular.module('App.directives', []);

    var highcharts = require('./$directives/highcharts');
    var fullCalendar = require('./$directives/fullCalendar');
    var datetimepicker = require('./$directives/datetimepicker');
    var bootstrapSwitch = require('./$directives/bootstrapSwitch');
    var zTree = require('./$directives/zTree');
    var privilege = require('./$directives/privilege');
    
    app.directive('highcharts', highcharts);
    app.directive('fullCalendar', fullCalendar);
    app.directive('datetimepicker',datetimepicker);
    app.directive('yhteSwitch', bootstrapSwitch);
    app.directive('zTree', zTree);
    app.directive('privilege', privilege);

    var msgSender =  require('./$directives/msg-sender');
    app.directive('msgSender',msgSender);

    var appNavbar =  require('./$directives/app-navbar');
    app.directive('appNavbar',appNavbar);
    
    var jqInfo = require('./JCZH/ZHDD/directives/jq-info');
    app.directive('atmsJqInfo', jqInfo);

    var JqEdit = require('./JCZH/ZHDD/directives/jq-edit');
    app.directive('atmsJqEdit', JqEdit);

    var atmsJqNearbyCatalog = require('./$directives/jq-nearby-catalog');
    app.directive('atmsJqNearbyCatalog', atmsJqNearbyCatalog);

    var jqNearbyPolices = require('./$directives/jq-nearby-polices');
    app.directive('atmsJqNearbyPolices', jqNearbyPolices);

    var jqNearby = require('./$directives/jq-nearby');
    app.directive('atmsJqNearby', jqNearby);

    var jqSelectedPolices = require('./JCZH/ZHDD/directives/jq-selected-polices');
    app.directive('atmsJqSelectedPolices', jqSelectedPolices);

    var jqPoliceInfo = require('./$directives/jq-police-info');
    app.directive('atmsJqPoliceInfo', jqPoliceInfo);

    var jqPoliceMessage = require('./$directives/jq-police-message');
    app.directive('atmsJqPoliceMessage', jqPoliceMessage);

    var jqPoliceCall = require('./$directives/jq-police-call');
    app.directive('atmsJqPoliceCall', jqPoliceCall);

    var jqVideo = require('./$directives/jq-video');
    app.directive('atmsJqVideo', jqVideo);

    var jqSignal = require('./$directives/jq-signal');
    app.directive('atmsJqSignal', jqSignal);

    var jqScreen = require('./$directives/jq-screen');
    app.directive('atmsJqScreen', jqScreen);

    var jqEvaluate = require('./JCZH/ZHDD/directives/jq-evaluate');
    app.directive('atmsJqEvaluate', jqEvaluate);

    var tqInfo = require('./JCZH/TQRW/directives/tq-info');
    app.directive('tqInfo', tqInfo);

    var tqDdList = require('./JCZH/TQRW/directives/tq-dd-list');
    app.directive('tqDdList', tqDdList);

    var tqInfoEdit = require('./JCZH/TQRW/directives/tq-info-edit');
    app.directive('tqInfoEdit', tqInfoEdit);

    var tqInfoNew = require('./JCZH/TQRW/directives/tq-info-new');
    app.directive('tqInfoNew', tqInfoNew);

    var tqInfoRead = require('./JCZH/TQRW/directives/tq-info-read');
    app.directive('tqInfoRead', tqInfoRead);

    var tqDuty = require('./JCZH/TQRW/directives/tq-duty');
    app.directive('tqDuty', tqDuty);

    var tqPost = require('./JCZH/TQRW/directives/tq-post');
    app.directive('tqPost', tqPost);

    var tqStaskPoints = require('./JCZH/TQRW/directives/tq-stask-points');
    app.directive('tqStaskPoints', tqStaskPoints);

    var tqStaskPoint = require('./JCZH/TQRW/directives/tq-stask-point');
    app.directive('tqStaskPoint', tqStaskPoint);

    var yhteMap = require('./$directives/yhte-map');
    app.directive('yhteMap', yhteMap);

    var freePolice = require('./$directives/free-polices');
    app.directive('atmsFreePolices', freePolice);

    var layersSwitcher = require('./$directives/map/layers-switcher');
    app.directive('layersSwitcher', layersSwitcher);
    
    var statusLabel =  require('./$directives/status-label');
    app.directive('statusLabel',statusLabel);

    var mapCenter = require('./$directives/map/map-center');
    app.directive('mapCenter', mapCenter);

    var tsList =  require('./$directives/map/ts-list');
    app.directive('tsList',tsList);

    var featureTip =  require('./$directives/map/feature-tip');
    app.directive('featureTip',featureTip);

    var tipEvent =  require('./$directives/tip-event');
    app.directive('tipEvent',tipEvent);

    var vmsPanel =  require('./$directives/vms/panel');
    app.directive('vmsPanel',vmsPanel);

    var formYjVms =  require('./$directives/vms/form-yj-vms');
    app.directive('formYjVms',formYjVms);

    var listYjVms =  require('./$directives/vms/list-yj-vms');
    app.directive('listYjVms',listYjVms);
    
    var roadTip =  require('./$directives/tips/road-tip');
    app.directive('roadTip', roadTip);

    var step1 =  require('./JCZH/TQRW/directives/step-1');
    app.directive('tqCreateStep1', step1);

    var step2 =  require('./JCZH/TQRW/directives/step-2');
    app.directive('tqCreateStep2', step2);

    var step3 =  require('./JCZH/TQRW/directives/step-3');
    app.directive('tqCreateStep3', step3);

    var step4 =  require('./JCZH/TQRW/directives/step-4');
    app.directive('tqCreateStep4', step4);

    var yhteTqPost =  require('./JCZH/TQRW/directives/post');
    app.directive('yhteTqPost', yhteTqPost);

    var yhteTqPoint =  require('./JCZH/TQRW/directives/point');
    app.directive('yhteTqPoint', yhteTqPoint);

    var yhteTqPosts =  require('./JCZH/TQRW/directives/posts');
    app.directive('yhteTqPosts', yhteTqPosts);

    var yhteTqPoints =  require('./JCZH/TQRW/directives/points');
    app.directive('yhteTqPoints', yhteTqPoints);

    var signalMap =  require('./$directives/signal-map');
    app.directive('signalMap', signalMap);

    var tqPolices =  require('./$directives/tq-polices');
    app.directive('tqPolices', tqPolices);

    var calculateTimecounter = require('./$directives/calculate-timecounter');
    app.directive('atmsCalculateTimecounter', calculateTimecounter);

    var wechatSender = require('./$directives/wechat-sender');
    app.directive('atmsWechatSender', wechatSender);
    
    var uploadFile = require('./$directives/upload-file');
    app.directive('uploadFile', uploadFile);

    var weather = require('./$directives/weather');
    app.directive('weather', weather);

    var roadAlarm = require('./$directives/road-alarm');
    app.directive('atmsRoadAlarm', roadAlarm);

    var bkAlarm = require('./$directives/bk-alarm');
    app.directive('atmsBkAlarm', bkAlarm);

    var track = require('./$directives/track');
    app.directive('atmsTrack', track);

    var imgPreview = require('./$directives/img-preview');
    app.directive('atmsImgPreview', imgPreview);

    var labelForm = require('./$directives/form/label-form');
    app.directive('atmsLabelForm', labelForm);

    app.directive('goBack', ['$rootScope', function($rootScope){
        //存储上一视图，下一视图路径
        var prev, next, reg = /#\/.*/;
        //监听 event:$locationChangeSuccess
        $rootScope.$on('$locationChangeSuccess', function(e, n, o){
            //参数：n 新path；参数：o 旧path；
            prev = o.match(reg)[0];
            next = n.match(reg)[0];
        });

        var linker = function(scope,element,attrs) {
            //为元素添加 href 属性
            attrs.$set('href', prev);
        };

        return {
            restrict:'A',
            link: linker
        };
    }]);

    app.directive('hoverShow', [function(){

        var linker = function(scope,el,attrs) {
            var hovers = el.find('.hover-show-item').hide();

            el.on('mouseover', function(){
                hovers.show();
            });

            el.on('mouseout', function(){
                hovers.hide();
            });
        };

        return {
            restrict:'AC',
            link: linker
        };
    }]);

    app.directive('selectpicker2', [function(){
      return {
        restrict: 'A',
        require: '?ngModel',
        scope: {
          opts: '=',
          showname:'@',
          val :'@'
        },
        link: function ($scope, $el, $attrs, ngModel){
          if(!ngModel) return;

          ngModel.$render = function() {
            console.log('$render');
          };

          $scope.$watch('opts', function (opts){
            if(!opts) return;

            angular.forEach(opts, function (e){
              $('<option>').attr('value',($scope.val) ? e[$scope.val] : e[$scope.showname])
                 .data("objs", e)
                 .html(e[$scope.showname])
                 .appendTo($el);
            });

            $($el).selectpicker();

            if(ngModel.$modelValue){
              $($el).selectpicker('val', _.pluck(ngModel.$modelValue, $scope.val));
              $($el).selectpicker('refresh');
            }

            $($el).change(function(){
              var selectObjs = [];
              var datas = $($el).find('option:selected');
              angular.forEach(datas,function(e){
                selectObjs.push($(e).data('objs'));
              });
              ngModel.$setViewValue(selectObjs);
              console.log(ngModel.$modelValue);
            });

          });

        }
      };
    }]);

    app.directive('selectpicker', [function(){

        var linker = function($scope, $el, $attrs) {

            $scope.isInit = false;
            $scope.$watch('opts', function (){
                if(!$scope.opts){
                    return;
                }

                angular.forEach($scope.opts,function(e){
                    if($scope.showname){
                        var keys = $scope.showname.split(',');
                        var s =  [];
                        angular.forEach(keys,function(k){
                            s.push(e[k]);
                        });
                        s = s.join(' ');
                    }
                    
                    if($scope.val){
                        var v = e[$scope.val];
                    }
                    
                   // var n = ($scope.val) ? e[$scope.val] : e[$scope.showname]);

                    var opt = $('<option>').attr('value',(v) ? v : s)
                                 .data("objs", e)
                                 .html(s);
                    opt.appendTo($el);
                });

                $($el).selectpicker();

                $($el).change(function(){
                    var selectObjs = [];
                    var datas = $($el).find('option:selected');
                    if(datas.length > 1){
                        angular.forEach(datas,function(e){
                            selectObjs.push($(e).data('objs'));
                        });
                    }else if(datas.length === 1){
                        selectObjs.push(datas.data('objs'));
                    }
                    $scope.objs = selectObjs;
                    $scope.$apply();
                });

                if ($scope.selectedVal) {
                    $($el).selectpicker('val', $scope.selectedVal);
                }
                $scope.isInit = true;
            });

            $scope.$watch('selectedVal', function (){
                if(!$scope.selectedVal) {
                    return;
                }
                if($scope.isInit) {
                    $($el).selectpicker('val', $scope.selectedVal);
                }
            });

        };

        return {
            restrict:'AC',
            link: linker,
            scope: {
                opts: '=',
                objs:'=?',
                //选中的值，相当于val
                selectedVal:'=',
                showname:'@',
                val :'@'
            }
        };
    }]);

    app.directive('calendar', ['$parse', function ($parse){
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function(scope, element, attrs, ngModel){
                var parse = $parse(attrs.ngModel);
                var setting = {
                    step: 10,
                    lang: 'ch',
                    datepicker: true,
                    timepicker: true,
                    format: 'Y-m-d H:i',
                    allowTimes: [],
                    validateOnBlur: false
                };
                if(attrs['step']){
                    setting.step = parseInt(attrs['step']);
                }
                if(attrs['date'] === 'false'){
                    setting.datepicker = false;
                    setting.format = 'H:i';
                }
                if(attrs['time'] === 'false'){
                    setting.timepicker = false;
                    setting.format = 'Y-m-d';
                    setting.closeOnDateSelect = true;
                }

                element.calendar(setting);

                function tog(v){return v?'addClass':'removeClass';}

                window.setTimeout(function() {
                    element.on('mousemove', function (e) {
                        $(this)[tog((this.offsetWidth - 18 < e.clientX - this.getBoundingClientRect().left) && element.hasClass('clearable'))]('onX');
                    }).on('click', function (e) {
                        if ((this.offsetWidth - 18 < e.clientX - this.getBoundingClientRect().left) && element.hasClass('clearable')) {
                            $(this).removeClass('onX').val('');
                            element.removeClass('clearable');
                            parse.assign(scope, null);
                            element.calendar('destroy');
                        }else{
                            element.calendar(setting);
                            element.calendar('show');
                        }
                    });
                }, 0);

                element.on('change', function(){
                    var val = element.val();
                    parse.assign(scope, val);
                    element[tog(val)]('clearable');
                })

                scope.$watch(function(){
                    return parse(scope);
                }, function(value){
                    if(!setting.timepicker && value){
                        value = value.substring(0, 10);
                        parse.assign(scope, value);
                        element.val(value);
                    }
                    if(value && $('xdsoft_datetimepicker').css('display') === 'block'){
                        element.val(value);
                    }
                })
            }
        }
    }]);

  /**
   * 动态加载js文件文件
   * @param url
   * @param callback
   */
  function addScript(url,callback){
    var elt = document.createElement("script");
    elt.src = url;
    elt.anysc = true;
    if(elt.onload==null){
      elt.onload = function(){
        typeof callback=='function'&&callback();
      }
    }
    if(elt.onreadystatechange==null){
      elt.onreadystatechange = function(){
        if(elt.readyState=="loaded" || elt.readyState=="complete"){
          typeof callback=='function'&&callback();
        }
      }
    }
    document.getElementsByTagName("body")[0].appendChild(elt);
  }

    app.directive('ueditor', ['Message', '$rootScope', function (Message, $rootScope){
      return {
        restrict: 'EA',
//        require: 'ngModel',
        scope: {
          height: '@?',
          width: '@?'

        },


        link: function(scope, element, attr){
          var _self = this,
            _initContent,
            editor,
            editorReady = false,
            baseURL = "/atms/libs/ueditor/"; //写你的ue路径

          var fexUE = {
            initEditor: function () {
              var _self = this;
              if (typeof UE != 'undefined') {
                editor = new UE.ui.Editor({
                  initialContent: _initContent,
                  toolbars: [
                    ["source","lineheight","forecolor","fontfamily","fontsize","justifyleft","justifycenter"]
                  ],
                  initialFrameHeight:scope.height || 120,
                  initialFrameWidth:scope.widht || 400,
                  autoHeightEnabled:false,
                  wordCount:false,
                  elementPathEnabled: false
                });


                editor.render(element[0]);
                editor.ready(function () {
                  editorReady = true;
//                  _self.setContent(_initContent);

                  editor.addListener('contentChange', function () {
                    scope.$apply(function () {
//                      ctrl.$setViewValue(editor.getContent());
                    });
                  });

                  $rootScope.$broadcast('editor:init', editor);
                });
              } else {
                addScript(baseURL + 'ueditor.config.js');
                addScript(baseURL + 'ueditor.all.js', function(){
                  _self.initEditor();
                })
              }
            },
            setContent: function (content) {
              if (editor && editorReady) {
                editor.setContent(content);
              }
            }
          };

          /**
           * 当Model改变值得时候赋值。
           */
//          ctrl.$render = function () {
//            _initContent = ctrl.$isEmpty(ctrl.$viewValue) ? '' : ctrl.$viewValue;
//            fexUE.setContent(_initContent);
//          };

          fexUE.initEditor();

        }
      }
    }]);

  app.directive('xtable', [function(){
        return {
            restrict: 'AC',
            link: function(scope, element, attrs){

                /*window.setTimeout(function(){
                    element.resizableColumns();
                }, 100);*/

                var selectAll;
                element.addClass('table table-condensed table-striped table-responsive table-bordered');

                if(!element.hasClass('table-rowselected')){
                    element.addClass('table-hover');
                }

                if(!attrs.ngTable) return;

                var items = null;
                scope.$watch(function(){
                    if(attrs.ngTable){
                        return scope.$eval(attrs.ngTable).data;
                    }
                }, function(value){
                    if(value){
                        scope.checkboxes = { 'checked': false, items: {} };
                        items = value;

                        scope.$watch('checkboxes.checked', function(value) {
                            _.forEach(items, function(item, index) {
                                if(eval(attrs.disable) && typeof eval(attrs.disable !== 'undefined')){

                                }else{
                                    scope.checkboxes.items[index] = value;
                                }
                            });
                        }, true);

                        scope.$watch('checkboxes.items', function(values) {
                            if (!items) {
                                return;
                            }
                            var checked = 0, unchecked = 0,
                                total = items.length;
                            _.forEach(items, function(item, index) {
                                checked   +=  (scope.checkboxes.items[index]) || 0;
                                unchecked += (!scope.checkboxes.items[index]) || 0;
                            });
                            if (((unchecked === 0) || (checked === 0)) && total !== 0) {
                                scope.checkboxes.checked = (checked === total);
                            }

                            selectAll = element.find('input[name=filter-checkbox]');

                            selectAll.prop("indeterminate", (checked !== 0 && unchecked !== 0));
                            selectAll.on('click', function(e){
                                var value = selectAll.prop('checked');
                                _.forEach(items, function(item, index) {
                                    if(eval(attrs.disable) && typeof eval(attrs.disable !== 'undefined')){

                                    }else{
                                        scope.checkboxes.items[index] = value;
                                    }
                                });
                            });
                        }, true);

                        window.setTimeout(function(){
                            var fixedTable = element.parent().prev();
                            if(fixedTable.hasClass('fht-thead')){
                                selectAll = fixedTable.find('input[name=filter-checkbox]');
                                selectAll.on('change', function(e){
                                    _.forEach(items, function(item, index) {
                                        if(eval(attrs.disable) && typeof eval(attrs.disable !== 'undefined')){

                                        }else{
                                            scope.checkboxes.items[index] = $(e.target).prop('checked');
                                        }
                                    });
                                    var itemCheckboxes = element.find('input[type=checkbox]');
                                    for(var i = 1; i < itemCheckboxes.length; i++){
                                        if(eval(attrs.disable) && typeof eval(attrs.disable !== 'undefined')){

                                        }else{
                                            $(itemCheckboxes[i]).prop('checkbox', $(e.target).prop('checked'));
                                        }
                                    }
                                    scope.$apply();
                                });
                            }
                            _.each(items, function(v, k){
                                if(v.checked){
                                    scope.checkboxes.items[k] = v.checked;
                                }
                            });
                        }, 0)
                    }
                });

                scope.$eval(attrs.ngTable).selectedItems = function(){
                    var results = [];
                    _.each(scope.checkboxes.items, function(item, index){
                        if(item && items[index]){
                            results.push(items[index]);
                        }
                    })
                    return results;
                };
            }
        }
    }]);

});