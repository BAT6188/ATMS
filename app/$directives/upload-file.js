define(function(require, exports, module){
  return ['$timeout', function ($timeout){
    var i = 0;

    var linker = function($scope,element,attrs) {
      $scope.uploading = false;
      $scope.noFile = true;//标记是否选择的文件

      var elId = 'fileToUpload-' + i;

      var onFileChange = $scope.onFileChange = function (){
        $scope.fileUrl = $inputFile.val();
        $scope.noFile = false;
        $scope.$apply();
      };

      var $inputFile = $(element).find('.input-file').attr('id', elId).on('change', onFileChange);

      $scope.select = function (){
        $inputFile.click();
      };

      $scope.upload = function (){
        $scope.uploading = true;
        $.ajaxFileUpload({
          url : attrs.upload,
          secureuri : false,
          fileElementId : elId,
          dataType : 'json', 
          success: function (data, status){
            $scope.uploading = false;
            if(data.success){
              $scope.fileUrl = data.results.server + '/' + data.results.url;
              $scope.filePath = data.results.server + '/' + data.results.url;
              $scope.fileName = data.results.name;
              
              $scope.onSuccess({
                $url: angular.copy($scope.fileUrl)
              });

              $scope.$apply();
            }
          },
          error: function (data){
            $scope.uploading = false;
            $scope.onError();
          }
        });
      };

      $scope.$on('$destroy', function (){
        $inputFile.unbind('change', onFileChange);
      });

    };

    return {
      restrict:'EA',
      replace: true,
      scope: {
        fileUrl: '=?',
        filePath: '=?',
        fileName: '=?',
        onSuccess: '&',
        onError: '&'
      },
      templateUrl:'app/$directives/upload-file.html',
      link: linker
    };
  }];
});