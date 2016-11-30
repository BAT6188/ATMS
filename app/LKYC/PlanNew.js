define(function (require, exports, module) {
    var controller = ['$scope', 'DictCache','$routeParams','Plan', function ($scope, DictCache,$routeParams, Plan) {
    	
    	var nowTime = new Date();
        var year = nowTime.getFullYear(); //定义年的变量的初始值
        var endyear = year;

        var m=nowTime.getMonth()+1;
        var d=nowTime.getDate();
        var y=nowTime.getFullYear();


        var starm;
        var stard;
        var endm;
        var endd;
        if(m<10)
        {
            starm='0'+m;
        }
        else
        {
            starm=m;
        }

        if(d<10)
        {
            stard='0'+d;
        }
        else
        {
            stard=d;
        }

        if(m==1||m==3||m==5||m==7||m==8||m==10||m==12)
        {
            if(d==31)
            {
                endd=1;
                if(m==12)
                {
                    endm=1;
                    endyear=endyear+1;
                }else
                    endm=m+1;
            }
            else
            {
                endd=d+1;
                endm=m;
            }
        }

        else if(m==4||m==6||m==9||m==11)
        {
            if(d==30)
            {
                endd=1;
                endm=m+1;
            }
            else
            {
                endd=d+1;
                endm=m;
            }

        }
        else if(m==2)
        {
            if(isLeapYear(y))
            {
                if(d==29)
                {
                    endd=1;
                    endm=m+1;
                }
                else
                {
                    endd=d+1;
                    endm=m;
                }
            }

            else
            {
                if(d==28)
                {
                    endd=1;
                    endm=m+1;
                }
                else
                {
                    endd=d+1;
                    endm=m;
                }
            }
        }


        if(endm<10)
        {
            endm='0'+m;
        }

        if(endd<10)
        {
            endd='0'+d;
        }


        function isLeapYear (Year) {
            if (((Year % 4)==0) && ((Year % 100)!=0) || ((Year % 400)==0)) {
                return (true);
            } else { return (false); }
        }

      $scope.record = {
    		//开始时间
              start : year +'-'+starm+'-'+stard+' 00:00',
              //结束时间
              end :endyear+'-'+endm+'-'+endd+' 00:00'
      };
      
      $scope.entity = { isUsing: 1,roadSectionId:$routeParams.roadSectionId};


      $scope.roadSectionId=$routeParams.roadSectionId;
      $scope.roadName=$routeParams.roadName;

      
      $scope.weeks = [{code:'1',name:'周一'},{code:'2',name:'周二'},{code:'3',name:'周三'}
      								,{code:'4',name:'周四'},{code:'5',name:'周五'},{code:'6',name:'周六'}
      								,{code:'7',name:'周日'}];
      $scope.entity.startWeek = $scope.weeks[0];
      $scope.entity.endWeek = $scope.weeks[6];
      
      DictCache("0103", function(dict){
          $scope.statuses = dict;
          $scope.entity.status = dict[0];
      }, false);

      //保存
      $scope.save = function(){
    	  var startAry = $scope.record.start.split(' ');
    	  $scope.entity.startDate = startAry[0];
    	  var srartTimeAry = startAry[1].split(':');
    	  $scope.entity.startTime = srartTimeAry[0]+srartTimeAry[1];
    	  var endAry = $scope.record.end.split(' ');
    	  $scope.entity.endDate = endAry[0];
    	  var endTimeAry = endAry[1].split(':');
    	  $scope.entity.endTime = endTimeAry[0]+endTimeAry[1];
    	  
    	  $scope.entity.startWeek = $scope.entity.startWeek.code;
    	  $scope.entity.endWeek = $scope.entity.endWeek.code;
    	  Plan.save($scope.entity, function(data){
          if(!data.success){
            alert(data.msg);
            return;
          }
          $scope.reset();
          alert('添加成功!');
        });
      };

      //重置
      $scope.reset = function(){
    	  $scope.record = { 
          		//开始时间
                  start : year + '-01-01 00:00',
                  //结束时间
              end :endyear+'-01-01 00:00'
                  };
          $scope.entity = { isUsing: 1};
      };

    }];

    module.exports = controller;
})
