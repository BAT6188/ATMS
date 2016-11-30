define(function(require, exports, module){
    var controller = ['$scope', 'Dept', 'Restangular', function($scope, Dept, Rest){
      
      Rest.all('java/facet/queryFacet').post({}).then(function (data){
        $scope.facets = data.results;
      });

      Rest.all('java/department/list').post({}).then(function (data){
        $scope.depts = _.map(data.results, function(record){
          record.pid = record.parentDept ? record.parentDept.deptName : null;
          return record;
        });;
      });

      $Rest = Rest;

      $scope.$watch('facet', function(facet){
        console.log(facet);
      })

      setTimeout(function (){
        
        $('#file_upload').uploadify({
          'swf'      : 'libs/uploadify/uploadify.swf',
          'uploader' : '/java/common/upload',
          'buttonText': '浏览',
          'auto':false, 
          'onUploadComplete' : function(file) {
            console.log('The file ' + file.name + ' finished processing.');
          },
          'onUploadError' : function(file, errorCode, errorMsg, errorString) {
            console.log('The file ' + file.name + ' could not be uploaded: ' + errorString);
          },
          'onUploadProgress' : function(file, bytesUploaded, bytesTotal, totalBytesUploaded, totalBytesTotal) {
            $('#progress').html(totalBytesUploaded + ' bytes uploaded of ' + totalBytesTotal + ' bytes.');
          },
          'onUploadStart' : function(file) {
            console.log('Starting to upload ' + file.name);
          },
          'onUploadSuccess' : function(file, data, response) {
            console.log('The file ' + file.name + ' was successfully uploaded with a response of ' + response + ':' + data);
          }
        });

      },1000);

      $scope.upload = function (){
        $('#file_upload').uploadify('upload', '*');
      };

    }];

    module.exports = controller;
});