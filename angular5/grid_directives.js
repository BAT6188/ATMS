/**
 * Created by brance on 2016/6/18.
 */


//<grid-screen resource="/api/data.json">
 //   <grid-columns>
 //   <grid-column title="Product" filed="product"></grid-column>
 //   <grid-column title="Description" filed="description"></grid-column>
 //   <grid-column title="Cost" filed="cost"></grid-column>
 //   </grid-columns>
 //   <grid with-inline-editor></grid>
//</grid-screen>

//domain object:editor,edit,columns,rows.
var app = angular.module('app',[]);
app.directive('gridScreen',function($http){
    return{
        restrict:'E',
        link:function(scope,elem,attrs){

            $http.get('/api/data.json').success(function(response){

            });
            console.log('linked gridScreen');
        }
    }
})

.directive('gridColumns',function(){
    return{
        restrict:'E',
        link:function(scope,elem,attrs){

            console.log('linked gridColumns');
        }
    }
})

.directive('gridColumn',function(){
    return{
        restrict:'E',
       /* link:{
            pre:function(scope,elem,attrs){

                console.log('linked gridColumn:pre',attrs.title);
            },
            post:function(scope,elem,attrs){

                console.log('linked gridColumn:post',attrs.title);
            }
        },*/
        link:function(scope,elem,attrs){

            console.log('linked gridColumn',attrs.title);
        }
    }
})

.directive('grid',function(){
    return{
        restrict:'E',
        link:function(scope,elem,attrs){

            console.log('linked grid');
        }
    }
})

.directive('withInlineEditor',function(){
    return{
        restrict:'E',
        link:function(scope,elem,attrs){

            console.log('linked withInlineEditor');
        }
    }
});
