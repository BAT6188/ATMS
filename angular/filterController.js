/**
 * Created by brance on 2016/4/20.
 */
angular.module('Filter',[]).controller('FilterController',function($scope){
    $scope.users = [{
                        id: 1,
                        name: 'Adam',
                        friends: [{name: 'John', age: 21, sex: 'M'}, {name: 'Brad', age: 32, sex: 'M'},{name: 'Johny', age: 61, sex: 'M'}, {name: 'Bryud', age: 12, sex: 'M'}]
                    }];


})
    .filter('AgeFilter',function(){
        return function (items){
            var results = [];
            for(i=0;i<items.length;i++){
                if(items[i].age > 30){
                    results.push(items[i]);
                }
            }
            return results;
        }
    });
    /*.filter('myFilter',function(){
        return function(friends, searchText, username) {
            var searchRegx = new RegExp(searchText, "i");
            if ((searchText == undefined) || (username.search(searchRegx) != -1)) {
                return friends;
            }
            var result = [];
            for(i = 0; i < friends.length; i++) {
                if (friends[i].name.search(searchRegx) != -1 ||
                    friends[i].age.toString().search(searchText) != -1) {
                    result.push(friends[i]);
                }
            }
            return result;
        }

    });*/