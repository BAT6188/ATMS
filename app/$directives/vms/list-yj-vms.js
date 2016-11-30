define(function(require, exports, module){

    return ['$rootScope','Restangular', function($rootScope,Restangular){
         var _xml = 
             '<?xml version="1.0" encoding="gb2312" ?>'+
             '<OprMsg ClientType="0" License="admin" MsgType="5">'+
               '<LedId>21</LedId>'+
                 '<Prog type="2" grade="0" exclusive="0" id="20131107163438257">'+
                   '<PicturePath>001.jpg</PicturePath>'+
                   '<RtfPath>001.rtf</RtfPath>'+
                   '<Enter>1</Enter>'+
                   '<Leave>1</Leave>'+
                   '<Speed>18</Speed>'+
                   '<StayTime>18</StayTime>'+
                   '<Blocks Conn="0" />'+
                   '<TimeSet type="0">'+
                     '<TimePiece begintime="2013-11-07 00:00:00" endtime="2013-11-07 23:59:59" />'+
                   '</TimeSet>'+
                 '</Prog>'+
                 '<Prog type="0" grade="0" exclusive="0" id="2013120908510379">'+
                   '<PicturePath>路口车多，按线行驶.bmp</PicturePath>'+
                   '<RtfPath>路口车多，按线行驶.rtf</RtfPath>'+
                   '<Enter>1</Enter>'+
                   '<Leave>1</Leave>'+
                   '<Speed>4</Speed>'+
                   '<StayTime>10</StayTime>'+
                   '<Blocks Conn="0" />'+
                   '<TimeSet type="0">'+
                     '<TimePiece begintime="2013-12-06 00:00:00" endtime="2014-12-31 23:59:00" />'+
                   '</TimeSet>'+
                 '</Prog>'+
                 '<Prog type="0" grade="0" exclusive="0" id="20140325142717781">'+
                   '<PicturePath>滴酒不沾，出行平安（新）.bmp</PicturePath>'+
                   '<RtfPath>滴酒不沾，出行平安（新）.rtf</RtfPath>'+
                   '<Enter>1</Enter>'+
                   '<Leave>1</Leave>'+
                   '<Speed>4</Speed>'+
                   '<StayTime>10</StayTime>'+
                   '<Blocks Conn="0" />'+
                   '<TimeSet type="0">'+
                     '<TimePiece begintime="2013-12-06 00:00:00" endtime="2014-12-31 23:59:00" />'+
                   '</TimeSet>'+
                 '</Prog>'+
               '</OprMsg>';

        var linker = function($scope, $el, $attrs) {
            $scope.isLogin = false;
            var progs = [];
            
            var parseXML = function (xml){
              // xml = _xml;
              if (!xml || xml === '') {
                return;
              }
              //progs.length = 0;
              progs = [];
              var ledid = '';
              var analysisXml;
              try {
                analysisXml = $.parseXML(xml);
              } catch(e) {
                console.log('exception:' + e);
                return;
              }
              if ($(analysisXml).find('LedId').text() - 0) {
                   ledid = $($.parseXML(xml)).find('LedId').text() - 0;
              }
              $($.parseXML(xml)).find('Prog').each(function (i, el){
                //路网图001.jpg，列表不需要显示
                var $prog = $(el),
                    $timePiece = $prog.find('TimePiece');
                if($prog.find('RtfPath').text().replace(/\.rtf$/,'')!='001') {
                    var prog = {
                        ledid: ledid,
                        type: $prog.attr('type')-0,
                        grade: $prog.attr('grade')-0,
                        exclusive: $prog.attr('exclusive')-0,
                        progid: $prog.attr('id')-0,
                        picturePath: $prog.find('PicturePath').text(),
                        name: $prog.find('RtfPath').text().replace(/\.rtf$/,''),
                        enter: $prog.find('Enter').text()-0,
                        leave: $prog.find('Leave').text()-0,
                        stay: $prog.find('StayTime').text()-0,
                        speed: $prog.find('Speed').text()-0,
                        begintime: $timePiece.attr('begintime'),
                        endtime: $timePiece.attr('endtime')
                    };
                    progs.push(prog);
                }
              });
            };
            
            $rootScope.$on('jq-screen:activeX', function (e, activeX, ledid){
                if(!activeX) {
                  return;
                }
                $el.find('#msgDiv').html('');

                $scope.isLogin = true;
                setTimeout(function(){
                    $scope.ledid = ledid;
                    Restangular.all('playlist/list').post({cmsId:$scope.ledid}).then(function(data){
                        var progs =[];
                        var noprogs=[];
                        for(var i=0;i<data.results.length;i++)
                        {
                            if(data.results[i].valid==1)
                                progs.push(data.results[i]);
                            else
                                noprogs.push(data.results[i]);
                        }
                        $scope.progs=progs;
                        $scope.noprogs=noprogs;
//                        $scope.$apply();
                    });
                },100);
            });

            $rootScope.$on('jq-screen:unLogin', function (e){
                $el.find('#msgDiv').html('错误描述：连接银江诱导屏服务器出错！');
                $scope.isLogin = false;
            });

            $rootScope.$on('list-yj-vms:reload', function (e, activeX){
//                $scope.progs.length = 0;
//                activeX.getOcx().getonproglst($scope.ledid);
//                var str = activeX.getOcx().strResult;
//                parseXML(str);
//                $scope.progs = progs;
//                $scope.$apply();

                Restangular.all('playlist/list').post({cmsId:$scope.ledid}).then(function(data){
                    var progs =[];
                    var noprogs=[];
                    for(var i=0;i<data.results.length;i++)
                    {
                        if(data.results[i].valid==1)
                            progs.push(data.results[i]);
                        else
                            noprogs.push(data.results[i]);
                    }
                    $scope.progs=progs;
                    $scope.noprogs=noprogs;
//                    $scope.$apply();
                });

                $scope.onSynchronization();


            });




            $scope.kaip = function(){

                $scope.onKaiPing();
            }
            //关屏
            $scope.youclose=function(){
                $scope.onYouClose();
            }


            $scope.onSearch = function (){
                $scope.onNewSearch();
            }




            $scope.newClick = function (){
                $scope.onNewClick();
            };
            //同步
            $scope.synchronizationClick = function (){
                $scope.onSynchronizationClick();
            };

            $scope.itemClick = function (prog){
                var item = angular.copy(prog);
                $scope.onItemClick({
                    $item: item
                });
            };
            $scope.getImgFromLed = function(){
                $scope.onImgFromled({
                    $item: $scope.ledid
                });
            };
            
            $scope.itemUp = function (prog){
                $scope.onItemUp({
                    $item: prog
                });
            };
            
            $scope.itemDown = function (prog){
                $scope.onItemDown({
                    $item: prog
                });
            };
            
            $scope.itemTop = function (prog){
                $scope.onItemTop({
                    $item: prog
                });
            };
            
            $scope.itemBottom = function (prog){
                $scope.onItemBottom({
                    $item: prog
                });
            };




            //置为有效
            $scope.setEnable = function(prog){
                prog.size=$scope.progs.length;
                $scope.onSetEnable({
                    $item: prog
                });
            };

            //置为失效
            $scope.setDisable = function(prog){
                $scope.onSetDisable({
                    $item: prog
                });
            };

        };

        return {
            restrict:'EA',
            replace: true,
            link: linker,
            scope: {
                onKaiPing: '&',
                onNewClick: '&',
                onYouClose: '&',
                onNewSearch: '&',
                onItemClick: '&',
                onImgFromled: '&',
                onItemUp: '&',
                onItemDown: '&',
                onItemTop: '&',
                onSynchronizationClick:'&',
                onSynchronization:'&',
                onItemBottom: '&',
                onSetEnable: '&',
                onSetDisable: '&',
                progs: '=?',
                isclose: '=?'
            },
            templateUrl: 'app/$directives/vms/list-yj-vms.html'
        };
    }];
    
});