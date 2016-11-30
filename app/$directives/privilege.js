define(function(require, exports, module) {
  return ['Auth', function(Auth) {
    var linker = function(scope, el, attrs) {
      //*********根据权限操作标签_start
      var setPrivilege = function() {
        if (attrs['privilege']) {
          var privCode = PRIVILEGES.getPrivCode(attrs['privilege']);
          if (privCode && (Auth.getPrivilege(privCode))) {
            if (attrs['effect']) {
              if (attrs['effect'] === 'hide') {
                $(el).hide();
              }
              if (attrs['effect'] === 'disabled') {
                $(el).attr("disabled", "disabled");
              }
            }
          }
        }
      };
      //*********根据权限操作标签_end

      scope.$watch('when', function() {
        if (scope.when) {
          setPrivilege();
        }
      });
    };

    return {
      restrict : 'A',
      link : linker,
      scope : {
        when : '=?'
      }
    };
  }];
});
