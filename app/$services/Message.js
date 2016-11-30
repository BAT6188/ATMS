define(function(require, exports, module){
    return [function(){
            var Klass = function(){

                var parent = $('body');
                var $Message = $('<div class="iPopover"/>');
                var $title = $('<div class="popover-title"/>');
                var $content = $('<div class="popover-content"/>');
                var $btn = $('<div class="popover-btns">').append($('<button class="btn btn-primary btn-sm btnYes">').html('确定'))
                              .append($('<button class="btn btn-sm btnNo">').html('取消'));
                $Message.append($title).append($content).appendTo(parent);
         

                this.alert = function(title, content ,color,style){
                    if($Message.find('.popover-btns')){
                      $btn.remove();
                    }
                    if(!style) style = {};
                    $Message.css({'border-color':color ||'#0088CC',
                                'width': style.width || '250px',
                                'height':style.height || '110px',
                                'top':style.top || '50px',
                                'right':style.right || '0px'});
                    $title.html(title).css({'background-color':color || '#0088CC'});
                    $content.html(content);
                    $Message.show();
                    setTimeout(function(){
                      $Message.fadeOut(100);
                    },3000);
                };

                this.confirm = function(title, content,style,yesCallback, noCallback){
                    if(!style) style = {};
                    $Message.css({'border-color':style.color ||'#0088CC',
                                'width': style.width || '600px',
                                'height':style.height || '110px',
                                'top':style.top || '50px',
                                'right':style.right || '0px'});
                    $title.html(title).css({'background-color':style.color ||'#0088CC'});
                    $Message.append($btn);
                    $title.html(title);
                    $content.html(content);
                    $btn.find('.btnYes').unbind();
                    $btn.find('.btnYes').bind('click',function(){
                        if(typeof yesCallback !== 'function') return;
                        yesCallback.apply(null,arguments);
                        $Message.hide();
                    });
                    $btn.find('.btnNo').unbind();
                    $btn.find('.btnNo').bind('click', function(){
                        if(typeof noCallback !== 'function') return;
                        noCallback.apply(null,arguments);
                        $Message.hide();
                    });
                    $Message.show();
                };

                this.hide = function(){
                    $Message.hide();
                };

                this.success = function(title, content,style){
                    this.alert(title, content,'#5BB75B',style);
                };

                this.error = function(title, content ,style){
                    this.alert(title, content,'#DA4F49',style);
                };

                this.warning = function(title, content,style){
                    this.alert(title, content,'#F0AD4E');
                };
            };

            return new Klass();
       }];
});