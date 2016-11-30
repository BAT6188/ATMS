/**
 * Created by brance on 2016/4/19.
 */
app.directive('dialog', function factory() {
    return {
        priority: 100,
        template: '<div ng-show="visible">'+
            '    <h3>{{title}}</h3>'+
            '    <div class="body" ng-transclude></div>'+
            '    <div class="footer">'+
            '        <button ng-click="onOk()">OK</button>'+
            '        <button ng-click="onCancel()">Close</button>'+
            '    </div>'+
            '</div>',
        replace: true,
        transclude: true,
        restrict: 'E',
        scope: {
            title: "=",//引用dialog标签title属性的值
            visible: "@",//引用dialog标签visible属性的值
            onOk: "&",//以wrapper function形式引用dialog标签的on-ok属性的内容
            onCancel: "&"//以wrapper function形式引用dialog标签的on-cancel属性的内容
        },
        //scope:false,
        link: ['$scope', '$attrs', function ($scope, $attrs) {




            // directive scope title 通过@ 引用dialog标签title属性的值，所以这里能取到值
            console.log('>>>title:' + $scope.title);
            //>>>title:Hello carl scope.html:85


            // 通过$parent直接获取父scope变量页可以
            console.log('>>>parent username:' + $scope.$parent.username);
            //>>>parent username:carl


            // directive scope 没有定义username 变量,并且没有引用父scope username变量, 所以这里是undefined
            console.log('>>>child username:' + $scope.username);
            //>>>username:undefined




            // 接收由父controller广播count变更事件
            $scope.$on('CountStatusChange', function (event, args) {
                console.log("child scope on(监听) recieve count Change event :" + args.val);
            });


            // watch 父 controller scope对象
            $scope.$parent.$watch('person.Count', function (newVal, oldVal) {
                console.log('>>>>>>>child watch parent scope[Count]:' + oldVal + ' newVal:' + newVal);
            });


        }]
    };
});