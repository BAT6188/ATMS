/**
 * Created by brance on 2016/5/10.
 */


(function(ng){

    'use strict';

    window.app = ng.module('myApp',[]);

    app.service('Data',function(){

        var data = [
            {'id':1,'title':'Note 1'},
            {'id':2,'title':'Note 2'},
            {'id':3,'title':'Note 3'},
            {'id':4,'title':'Note 4'},
            {'id':5,'title':'Note 5'}
        ];

        function addNote(noteTitle){
            var id = data.length +1;
            data.push({id :id,'title':noteTitle});
        }

        function deleteNote(note){
            data.pop();
        }
    });

})(angular);