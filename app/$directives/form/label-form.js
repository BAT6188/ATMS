define(function(require, exports, module) {
    return [
    function() {

      var linker = function($scope, $element, $attrs) {
              var attrs = $attrs;            
              //创建 labe warp  span DOM节点
              var label = angular.element("<label>" + attrs.label + "</label>");
              var formGroup = angular.element("<div class=\"form-group\"></div>");
              var span = angular.element("<span class=\"help-block\">该字段必填!</span>");
              

              /*console.log(attrs);*/
              if(attrs.groupClass){ //需要添加类是否符合规范
                formGroup.addClass(attrs.groupClass);
              }

              if(attrs.name && attrs.required && attrs.formName){
                $scope.showHb = attrs.formName +'.' + attrs.name + '.' + '$error.required';
                span.attr('ng-show',$scope.showHb);
                //console.log($($scope.showHb);
              } 


              $element.wrap(formGroup);
              $element.before(label);
              $element.after(span);

              label = formGroup = span  = null;
      };
        
      return {
          restrict : 'EA',
          replace : true,
          link : linker,
          scope: {
           /* labelTitle: '@',
            len: '@',
            inputModel: '=?'*/
          }/*,
          templateUrl : 'app/$directives/form/label-input.html'*/
      };
    }];
});
