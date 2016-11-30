(function($){
  //求解脚本路径
  var path = (function(){
    var scripts = document.getElementsByTagName("script");
    for(var i=0, len = scripts.length;i < len; i++){
      var src = scripts[i].src, re = /activex.js[\?.]*/, j = src.search(re);
      if(j != -1){
        return src.substring(0, j);
      }
    }
  })();
  
  //iframe 模板
  var iframe_tpl = '<iframe frameborder="0">';
    
  $.fn.activeX = function(type){
    var el = $(this), sel = this, defaults = $.fn.activeX.defaults,
      config = defaults[type||'VD'],
      iframe =  $(iframe_tpl).appendTo(el);

    this.type = type;

    this.load = function(){
      sel.ocx = null;
      sel.classid = config.id || sel.classid;
      iframe.css({width:'100%',height:'100%',padding:'0px'})
        .attr('src', path + 'ocx.html?classid=' + sel.classid + '&events=' + config.events.join(',') + '&type='+type+"&width="+config.css.width+"&height="+config.css.height);
    };

    this.reload = function(klass){
      if(klass){
        config = defaults[klass||'VD'];
        this.type = klass;
      }
      load();
    };

    this.destroy = function(){
      iframe.attr('src', '').remove();
      sel.unbind();
      sel.ocx = null;
      sel.inner = null;
      sel.type = null;
      sel.classid = null;
      __event = null;
      __onload = null;
    };
    
    this.getOcx = function() {
     sel.inner = iframe.get(0).contentWindow;
      sel.ocx = sel.inner.document.getElementById('ocx');
      return sel.ocx;
    };

    //设置ocx插件原始大小
    this.setOcxSize = function(width, height) {
      if (width) {
          config.css.width = width;
      }
      if (height) {
         config.css.height = height;
      }
    };

    //动态改变ocx插件大小
    this.setCurrentOcxSize = function(w, h) {
        w = w || '100%';
        h = h || '100%';
        var ocx = iframe.get(0).contentWindow.document.getElementById('ocx');
        if(ocx) {
            $(ocx).css('width', w);
            $(ocx).css('height', h);
        }
    };

    //全屏
    this.move2full = function() {
        var fullDiv = $('#FULLVD');
        var ocx = iframe.get(0).contentWindow.document.getElementById('ocx');
        if(fullDiv && ocx) {
            var w = $('#container').css('width');
            var h = $('#container').css('height');
            w = w.slice(0, -2);
            w = parseInt(w) - 150;
            h = h.slice(0, -2);
            h = parseInt(h) - 150;
            $(ocx).css('width', w);
            $(ocx).css('height', h);
            $(iframe).appendTo(fullDiv);
        }
    };

    //还原
    this.move2current = function() {
        $(iframe).appendTo(el);
    };

    __event = function(event, p1, p2, p3){
      sel.inner = iframe.get(0).contentWindow;
      sel.ocx = sel.inner.document.getElementById('ocx');
      el.trigger(event, [sel.type, p1, p2, p3]);
    };

    __onload = function(){
      el.trigger('iframeLoaded');
    };

    // load();

    return this;
  };

  $.fn.activeX.defaults = {
    VD:{
      id:'82490EEB-771D-4572-8901-2554D4F61D27',
      css: {width:'100%',height:'100%',padding:'0px'},
      events: []
    },
    SC:{
        id:'82490EEB-771D-4572-8901-2554D4F61D27',
        css: {width:'100%',height:'100%',padding:'0px'},
        events: []
      }
//    SC:{
//      id:'82490EEB-771D-4572-8901-2554D4F61D27',
//      css: {width:'100%',height:'100%',padding:'0px'},
//      events: []
//    }
  };

})(jQuery);