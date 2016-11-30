/**
 * Created by brance on 2016/6/17.
 */

    'use strict';

var app = angular.module('myApp',[]);

app.controller('Ctrl',['$scope','noteService',function($scope,noteService){

    //define controller methods;

    $scope.getNotes = function(){

        return noteService.getNotes();
    }


    $scope.addNote = function(noteTitle){

        if(noteTitle != ''){

            noteService.addNote(noteTitle);
        }
    }

    $scope.deleteNote = function(id){

        noteService.deleteNote(id);
    }

    $scope.resetForm = function(){
        $scope.noteTitle = '';
    }

}]);

app.service('noteService',function(){

    var data = [
        {id:1, title:'Note 1'},
        {id:2, title:'Note 2'},
        {id:3, title:'Note 3'},
        {id:4, title:'Note 4'},
        {id:5, title:'Note 5'},
        {id:6, title:'Note 6'},
        {id:7, title:'Note 7'},
        {id:8, title:'Note 8'}
    ];

    function getNotes(){
        return data;
    }

    function addNote(noteTitle){

        var currentIndex = data.length +1;

        //if(typeof note === 'object' && note != null){
            data.push({
                id:currentIndex,
                title:noteTitle
            });
        //}
    }

    function deleteNote(id){

        var oldNotes = data;

        data = [];

        angular.forEach(oldNotes,function(el){

            if(el.id != id){
                data.push(el);
            }
        });
    }

    return {
        getNotes:getNotes,
        addNote:addNote,
        deleteNote:deleteNote

    }

});

app.directive('myNotebook',function(){

    return{
        restrict:'EA',
        scope:{
            notes:'=',
            ondelete:'&'
        },

        templateUrl:'noteBook.html',

        controller:function($scope,$attrs){

            $scope.deleteNote = function(id){

                $scope.ondelete({id:id});

            }
        }
    }
});

app.directive('myNote',function(){

    return {
        restrict:'EA',
        scpoe:{
            note:'=',
            delete:'&deleteNote'
        },
        link: function(scope,element,attrs){

            var $el = $(element);

            $el.hide().fadeIn('slow');

            $('.thumbnails').sortable({
                placeholder:'ui-state-highlight',
                forcePlaceholderSize: true
            });

        }

    }

});