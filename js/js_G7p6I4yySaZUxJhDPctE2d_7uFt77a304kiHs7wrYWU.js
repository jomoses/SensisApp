Drupal.behaviors.googleAnalyticsET = {
  attach : function (context) {
    // make sure that the google analytics event tracking object exists
    // if not then exit and don't track
    if(!_gaq){
      return;
    }

    var settings = Drupal.settings.googleAnalyticsETSettings;

    var s = new Array();
    for(var i = 0; i < settings.selectors.length; i++) {
      s[i] = settings.selectors[i].selector;
    }

    jQuery.each(s,
      function(i, val) {
        jQuery(settings.selectors[i].selector).bind(settings.selectors[i].event,
          function(event) {
            trackEvent(jQuery(this), settings.selectors[i].category, settings.selectors[i].action, settings.selectors[i].label, settings.selectors[i].value, settings.selectors[i].noninteraction)
          }
        );
      }

    );
  }

}

/**
 * trackEvent does the actual call to _gaq.push with the _trackEvent type.
 *
 * trackEvent calls the push method from the _gaq object. It also preforms
 * any token replacements on the category, action, and opt_label parameters.
 *
 * @param $obj
 *   The jQuery object that the click event was called on.
 * @param category
 *   The name you supply for the group of objects you want to track.
 * @param action
 *   A string that is uniquely paired with each category, and commonly used
 *   to define the type of user interaction for the web object.
 * @param opt_label
 *   An optional string to provide additional dimensions to the event data.
 * @param opt_value
 *   An integer that you can use to provide numerical data about the user
 *   event.
 * @param opt_oninteraction
 *   A boolean that when set to true, indicates that the event hit will not
 *   be used in bounce-rate calculation.
 */
function trackEvent($obj, category, action, opt_label, opt_value, opt_noninteraction) {
  var href = $obj.attr('href') == undefined ? false : String($obj.attr('href'));

  category = category == '!text' ? String($obj.text()) : (category == '!href' ? href : (category == '!currentPage' ? String(window.location.href) : String(category)));
  action = action == '!text' ? String($obj.text()) : (action == '!href' ? href : (action == '!currentPage' ? String(window.location.href) : String(action)));
  opt_label = opt_label == '!text' ? String($obj.text()) : (opt_label == '!href' ? href : (opt_label == '!currentPage' ? String(window.location.href) : String(opt_label)));

  if (!category || !action) {
    return;
  }

  if (opt_label == '!test') {
    debugEvent($obj, category, action, opt_label, opt_value, opt_noninteraction);
  }
  else {
    _gaq.push(['_trackEvent', String(category), String(action), String(opt_label), Number(opt_value), Boolean(opt_noninteraction)]);
  }
}

/**
 * A simple debug function that matches the trackEvent function.
 */
function debugEvent($obj, category, action, opt_label, opt_value, opt_noninteraction) {
  alert(category + ' ' + action  + ' ' + opt_label + ' ' + opt_value);
}
;
/**
 * @file
 * Javascript behavior for twitter ticker
 */
(function($) {
  Drupal.behaviors.cap_twitter_ticker = {};
  Drupal.behaviors.cap_twitter_ticker.attach = function(context) {
    // Social bar actions
    $('.link-action').click(function(event){
      if ($(this).hasClass('close')) {
        event.preventDefault();
        cap_twitter_ticker_close();
        $(this).removeClass('close');
      }
      else {
        event.preventDefault();
        cap_twitter_ticker_open();
        $(this).addClass('close');
      }
      return false;
    });    
    
    // Close social bar behavior   
    function cap_twitter_ticker_close() {
      // Change baseline text
      $('.baseline').html(Drupal.settings.follow_us_label_short);
      
      // Replace arrow right by left
      $('.link-action img').attr('src', function(index, val){
        return val.replace('right', 'left');
      });
      
      // Let wrapper know it is wide
      $('#cap-ticker-social').removeClass('wide');
      $('#cap-ticker-social').addClass('small');
      
      // Close animation
      $('#cap-ticker-social').animate({
        'right': '-450px'
      }, 'fast'); 
    }
    
    // Open social bar behavior
    function cap_twitter_ticker_open() { 
      // Change baseline text
      $('.baseline').html(Drupal.settings.follow_us_label_complete);
                
      // Replace arrow left by right
      $('.link-action img').attr('src', function(index, val){
        return val.replace('left', 'right');
      });
      
      // Let wrapper know it is wide
      $('#cap-ticker-social').removeClass('small');
      $('#cap-ticker-social').addClass('wide');
      
      // Open animation
      $('#cap-ticker-social').animate({
        'right': '30px'
      }, 'fast');
    } 
    
    // Tweeter feeds animation.
    // Only in wide mode.
    if ($('.container').width() >= 1008) {
      initTweeterCarousel();
    }
    
    // Close ticker.
    $('.cap-ticker-cross').click(function(event){
      event.preventDefault();
      $('.cookie-authorization').css('margin-bottom','18px');
      $('.ticker-closed').css('display', 'block');
      $('.main-ticker').animate({
        'top': '50px'
      }, 'fast', 'linear', function(){
        $('.main-ticker').css('display', 'none'); 
      });
      $('.ticker-wrapper').animate({
        'height': '18px'
      }, 'fast', 'linear');
      return false;
    });
    
    // Open ticker
    $('.cap-ticker-open').click(function(event){
      event.preventDefault();
      $('.cookie-authorization').css('margin-bottom','53px');
      $('.ticker-wrapper').css('height', '53px');
      $('.main-ticker').css('top', '0');
      $('.main-ticker').css('display', 'block');
      $twitter_carousel.startAuto();
      return false;    
    });
    
    function initTweeterCarousel() {
      $('#cap-ticker-tweets').jcarousel({
        vertical : true,
        scroll : 1,
        start: 1,
        wrap: 'circular',
        buttonNextHTML: null,
        buttonPrevHTML: null, 
        auto: 5,
        initCallback: twitterJCarousel_initCallback
      });      
    }
    
    function twitterJCarousel_initCallback(carousel) {
      $twitter_carousel_stopped = false;
      $twitter_carousel = carousel;
      
      // Disable jcarousel resize timer as its not working as expected.
      $(window).unbind('resize.jcarousel', carousel.funcResize);
      clearTimeout(carousel.resizeTimer);
      carousel.funcResize = function() {};
      
      $('.cap-ticker-cross').click(function(){
        $twitter_carousel.stopAuto();
        $twitter_carousel.remove();
      });
      
      $(window).resize(function(){
        if ($('.container').width() < 768 && !$twitter_carousel_stopped) {
          $twitter_carousel.stopAuto();
          $twitter_carousel.remove();
          $('.cookie-authorization').css('margin-bottom','0');
          $twitter_carousel_stopped = true;
        }
        if ($('.container').width() >= 768 && $twitter_carousel_stopped) {
          $twitter_carousel.startAuto();        
        }
      });      
    }

  };
})(jQuery); ;
/**
 * @file
 * Attaches behaviors for the Edit form in Service content type.
 */

(function ($) {
  Drupal.behaviors.front_service = {};
  Drupal.behaviors.front_service.attach = function (context, settings) {
    // Hide list of services.
    // This is done in JS in order to let user see this list
    // if they disable Javascript.
    $('.see_all_service ul.servics_lists').hide();

    // Listener on the title to display the list.
    $('.see_all_service h3').bind('click', function() {
      $('.see_all_service ul.servics_lists').slideToggle();
    });
  };

})(jQuery);
;
/*!
 * jCarousel - Riding carousels with jQuery
 *   http://sorgalla.com/jcarousel/
 *
 * Copyright (c) 2006 Jan Sorgalla (http://sorgalla.com)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * Built on top of the jQuery library
 *   http://jquery.com
 *
 * Inspired by the "Carousel Component" by Bill Scott
 *   http://billwscott.com/carousel/
 */

(function(g){var q={vertical:!1,rtl:!1,start:1,offset:1,size:null,scroll:3,visible:null,animation:"normal",easing:"swing",auto:0,wrap:null,initCallback:null,setupCallback:null,reloadCallback:null,itemLoadCallback:null,itemFirstInCallback:null,itemFirstOutCallback:null,itemLastInCallback:null,itemLastOutCallback:null,itemVisibleInCallback:null,itemVisibleOutCallback:null,animationStepCallback:null,buttonNextHTML:"<div></div>",buttonPrevHTML:"<div></div>",buttonNextEvent:"click",buttonPrevEvent:"click", buttonNextCallback:null,buttonPrevCallback:null,itemFallbackDimension:null},m=!1;g(window).bind("load.jcarousel",function(){m=!0});g.jcarousel=function(a,c){this.options=g.extend({},q,c||{});this.autoStopped=this.locked=!1;this.buttonPrevState=this.buttonNextState=this.buttonPrev=this.buttonNext=this.list=this.clip=this.container=null;if(!c||c.rtl===void 0)this.options.rtl=(g(a).attr("dir")||g("html").attr("dir")||"").toLowerCase()=="rtl";this.wh=!this.options.vertical?"width":"height";this.lt=!this.options.vertical? this.options.rtl?"right":"left":"top";for(var b="",d=a.className.split(" "),f=0;f<d.length;f++)if(d[f].indexOf("jcarousel-skin")!=-1){g(a).removeClass(d[f]);b=d[f];break}a.nodeName.toUpperCase()=="UL"||a.nodeName.toUpperCase()=="OL"?(this.list=g(a),this.clip=this.list.parents(".jcarousel-clip"),this.container=this.list.parents(".jcarousel-container")):(this.container=g(a),this.list=this.container.find("ul,ol").eq(0),this.clip=this.container.find(".jcarousel-clip"));if(this.clip.size()===0)this.clip= this.list.wrap("<div></div>").parent();if(this.container.size()===0)this.container=this.clip.wrap("<div></div>").parent();b!==""&&this.container.parent()[0].className.indexOf("jcarousel-skin")==-1&&this.container.wrap('<div class=" '+b+'"></div>');this.buttonPrev=g(".jcarousel-prev",this.container);if(this.buttonPrev.size()===0&&this.options.buttonPrevHTML!==null)this.buttonPrev=g(this.options.buttonPrevHTML).appendTo(this.container);this.buttonPrev.addClass(this.className("jcarousel-prev"));this.buttonNext= g(".jcarousel-next",this.container);if(this.buttonNext.size()===0&&this.options.buttonNextHTML!==null)this.buttonNext=g(this.options.buttonNextHTML).appendTo(this.container);this.buttonNext.addClass(this.className("jcarousel-next"));this.clip.addClass(this.className("jcarousel-clip")).css({position:"relative"});this.list.addClass(this.className("jcarousel-list")).css({overflow:"hidden",position:"relative",top:0,margin:0,padding:0}).css(this.options.rtl?"right":"left",0);this.container.addClass(this.className("jcarousel-container")).css({position:"relative"}); !this.options.vertical&&this.options.rtl&&this.container.addClass("jcarousel-direction-rtl").attr("dir","rtl");var j=this.options.visible!==null?Math.ceil(this.clipping()/this.options.visible):null,b=this.list.children("li"),e=this;if(b.size()>0){var h=0,i=this.options.offset;b.each(function(){e.format(this,i++);h+=e.dimension(this,j)});this.list.css(this.wh,h+100+"px");if(!c||c.size===void 0)this.options.size=b.size()}this.container.css("display","block");this.buttonNext.css("display","block");this.buttonPrev.css("display", "block");this.funcNext=function(){e.next()};this.funcPrev=function(){e.prev()};this.funcResize=function(){e.resizeTimer&&clearTimeout(e.resizeTimer);e.resizeTimer=setTimeout(function(){e.reload()},100)};this.options.initCallback!==null&&this.options.initCallback(this,"init");!m&&g.browser.safari?(this.buttons(!1,!1),g(window).bind("load.jcarousel",function(){e.setup()})):this.setup()};var f=g.jcarousel;f.fn=f.prototype={jcarousel:"0.2.8"};f.fn.extend=f.extend=g.extend;f.fn.extend({setup:function(){this.prevLast= this.prevFirst=this.last=this.first=null;this.animating=!1;this.tail=this.resizeTimer=this.timer=null;this.inTail=!1;if(!this.locked){this.list.css(this.lt,this.pos(this.options.offset)+"px");var a=this.pos(this.options.start,!0);this.prevFirst=this.prevLast=null;this.animate(a,!1);g(window).unbind("resize.jcarousel",this.funcResize).bind("resize.jcarousel",this.funcResize);this.options.setupCallback!==null&&this.options.setupCallback(this)}},reset:function(){this.list.empty();this.list.css(this.lt, "0px");this.list.css(this.wh,"10px");this.options.initCallback!==null&&this.options.initCallback(this,"reset");this.setup()},reload:function(){this.tail!==null&&this.inTail&&this.list.css(this.lt,f.intval(this.list.css(this.lt))+this.tail);this.tail=null;this.inTail=!1;this.options.reloadCallback!==null&&this.options.reloadCallback(this);if(this.options.visible!==null){var a=this,c=Math.ceil(this.clipping()/this.options.visible),b=0,d=0;this.list.children("li").each(function(f){b+=a.dimension(this, c);f+1<a.first&&(d=b)});this.list.css(this.wh,b+"px");this.list.css(this.lt,-d+"px")}this.scroll(this.first,!1)},lock:function(){this.locked=!0;this.buttons()},unlock:function(){this.locked=!1;this.buttons()},size:function(a){if(a!==void 0)this.options.size=a,this.locked||this.buttons();return this.options.size},has:function(a,c){if(c===void 0||!c)c=a;if(this.options.size!==null&&c>this.options.size)c=this.options.size;for(var b=a;b<=c;b++){var d=this.get(b);if(!d.length||d.hasClass("jcarousel-item-placeholder"))return!1}return!0}, get:function(a){return g(">.jcarousel-item-"+a,this.list)},add:function(a,c){var b=this.get(a),d=0,p=g(c);if(b.length===0)for(var j,e=f.intval(a),b=this.create(a);;){if(j=this.get(--e),e<=0||j.length){e<=0?this.list.prepend(b):j.after(b);break}}else d=this.dimension(b);p.get(0).nodeName.toUpperCase()=="LI"?(b.replaceWith(p),b=p):b.empty().append(c);this.format(b.removeClass(this.className("jcarousel-item-placeholder")),a);p=this.options.visible!==null?Math.ceil(this.clipping()/this.options.visible): null;d=this.dimension(b,p)-d;a>0&&a<this.first&&this.list.css(this.lt,f.intval(this.list.css(this.lt))-d+"px");this.list.css(this.wh,f.intval(this.list.css(this.wh))+d+"px");return b},remove:function(a){var c=this.get(a);if(c.length&&!(a>=this.first&&a<=this.last)){var b=this.dimension(c);a<this.first&&this.list.css(this.lt,f.intval(this.list.css(this.lt))+b+"px");c.remove();this.list.css(this.wh,f.intval(this.list.css(this.wh))-b+"px")}},next:function(){this.tail!==null&&!this.inTail?this.scrollTail(!1): this.scroll((this.options.wrap=="both"||this.options.wrap=="last")&&this.options.size!==null&&this.last==this.options.size?1:this.first+this.options.scroll)},prev:function(){this.tail!==null&&this.inTail?this.scrollTail(!0):this.scroll((this.options.wrap=="both"||this.options.wrap=="first")&&this.options.size!==null&&this.first==1?this.options.size:this.first-this.options.scroll)},scrollTail:function(a){if(!this.locked&&!this.animating&&this.tail){this.pauseAuto();var c=f.intval(this.list.css(this.lt)), c=!a?c-this.tail:c+this.tail;this.inTail=!a;this.prevFirst=this.first;this.prevLast=this.last;this.animate(c)}},scroll:function(a,c){!this.locked&&!this.animating&&(this.pauseAuto(),this.animate(this.pos(a),c))},pos:function(a,c){var b=f.intval(this.list.css(this.lt));if(this.locked||this.animating)return b;this.options.wrap!="circular"&&(a=a<1?1:this.options.size&&a>this.options.size?this.options.size:a);for(var d=this.first>a,g=this.options.wrap!="circular"&&this.first<=1?1:this.first,j=d?this.get(g): this.get(this.last),e=d?g:g-1,h=null,i=0,k=!1,l=0;d?--e>=a:++e<a;){h=this.get(e);k=!h.length;if(h.length===0&&(h=this.create(e).addClass(this.className("jcarousel-item-placeholder")),j[d?"before":"after"](h),this.first!==null&&this.options.wrap=="circular"&&this.options.size!==null&&(e<=0||e>this.options.size)))j=this.get(this.index(e)),j.length&&(h=this.add(e,j.clone(!0)));j=h;l=this.dimension(h);k&&(i+=l);if(this.first!==null&&(this.options.wrap=="circular"||e>=1&&(this.options.size===null||e<= this.options.size)))b=d?b+l:b-l}for(var g=this.clipping(),m=[],o=0,n=0,j=this.get(a-1),e=a;++o;){h=this.get(e);k=!h.length;if(h.length===0){h=this.create(e).addClass(this.className("jcarousel-item-placeholder"));if(j.length===0)this.list.prepend(h);else j[d?"before":"after"](h);if(this.first!==null&&this.options.wrap=="circular"&&this.options.size!==null&&(e<=0||e>this.options.size))j=this.get(this.index(e)),j.length&&(h=this.add(e,j.clone(!0)))}j=h;l=this.dimension(h);if(l===0)throw Error("jCarousel: No width/height set for items. This will cause an infinite loop. Aborting..."); this.options.wrap!="circular"&&this.options.size!==null&&e>this.options.size?m.push(h):k&&(i+=l);n+=l;if(n>=g)break;e++}for(h=0;h<m.length;h++)m[h].remove();i>0&&(this.list.css(this.wh,this.dimension(this.list)+i+"px"),d&&(b-=i,this.list.css(this.lt,f.intval(this.list.css(this.lt))-i+"px")));i=a+o-1;if(this.options.wrap!="circular"&&this.options.size&&i>this.options.size)i=this.options.size;if(e>i){o=0;e=i;for(n=0;++o;){h=this.get(e--);if(!h.length)break;n+=this.dimension(h);if(n>=g)break}}e=i-o+ 1;this.options.wrap!="circular"&&e<1&&(e=1);if(this.inTail&&d)b+=this.tail,this.inTail=!1;this.tail=null;if(this.options.wrap!="circular"&&i==this.options.size&&i-o+1>=1&&(d=f.intval(this.get(i).css(!this.options.vertical?"marginRight":"marginBottom")),n-d>g))this.tail=n-g-d;if(c&&a===this.options.size&&this.tail)b-=this.tail,this.inTail=!0;for(;a-- >e;)b+=this.dimension(this.get(a));this.prevFirst=this.first;this.prevLast=this.last;this.first=e;this.last=i;return b},animate:function(a,c){if(!this.locked&& !this.animating){this.animating=!0;var b=this,d=function(){b.animating=!1;a===0&&b.list.css(b.lt,0);!b.autoStopped&&(b.options.wrap=="circular"||b.options.wrap=="both"||b.options.wrap=="last"||b.options.size===null||b.last<b.options.size||b.last==b.options.size&&b.tail!==null&&!b.inTail)&&b.startAuto();b.buttons();b.notify("onAfterAnimation");if(b.options.wrap=="circular"&&b.options.size!==null)for(var c=b.prevFirst;c<=b.prevLast;c++)c!==null&&!(c>=b.first&&c<=b.last)&&(c<1||c>b.options.size)&&b.remove(c)}; this.notify("onBeforeAnimation");if(!this.options.animation||c===!1)this.list.css(this.lt,a+"px"),d();else{var f=!this.options.vertical?this.options.rtl?{right:a}:{left:a}:{top:a},d={duration:this.options.animation,easing:this.options.easing,complete:d};if(g.isFunction(this.options.animationStepCallback))d.step=this.options.animationStepCallback;this.list.animate(f,d)}}},startAuto:function(a){if(a!==void 0)this.options.auto=a;if(this.options.auto===0)return this.stopAuto();if(this.timer===null){this.autoStopped= !1;var c=this;this.timer=window.setTimeout(function(){c.next()},this.options.auto*1E3)}},stopAuto:function(){this.pauseAuto();this.autoStopped=!0},pauseAuto:function(){if(this.timer!==null)window.clearTimeout(this.timer),this.timer=null},buttons:function(a,c){if(a==null&&(a=!this.locked&&this.options.size!==0&&(this.options.wrap&&this.options.wrap!="first"||this.options.size===null||this.last<this.options.size),!this.locked&&(!this.options.wrap||this.options.wrap=="first")&&this.options.size!==null&& this.last>=this.options.size))a=this.tail!==null&&!this.inTail;if(c==null&&(c=!this.locked&&this.options.size!==0&&(this.options.wrap&&this.options.wrap!="last"||this.first>1),!this.locked&&(!this.options.wrap||this.options.wrap=="last")&&this.options.size!==null&&this.first==1))c=this.tail!==null&&this.inTail;var b=this;this.buttonNext.size()>0?(this.buttonNext.unbind(this.options.buttonNextEvent+".jcarousel",this.funcNext),a&&this.buttonNext.bind(this.options.buttonNextEvent+".jcarousel",this.funcNext), this.buttonNext[a?"removeClass":"addClass"](this.className("jcarousel-next-disabled")).attr("disabled",a?!1:!0),this.options.buttonNextCallback!==null&&this.buttonNext.data("jcarouselstate")!=a&&this.buttonNext.each(function(){b.options.buttonNextCallback(b,this,a)}).data("jcarouselstate",a)):this.options.buttonNextCallback!==null&&this.buttonNextState!=a&&this.options.buttonNextCallback(b,null,a);this.buttonPrev.size()>0?(this.buttonPrev.unbind(this.options.buttonPrevEvent+".jcarousel",this.funcPrev), c&&this.buttonPrev.bind(this.options.buttonPrevEvent+".jcarousel",this.funcPrev),this.buttonPrev[c?"removeClass":"addClass"](this.className("jcarousel-prev-disabled")).attr("disabled",c?!1:!0),this.options.buttonPrevCallback!==null&&this.buttonPrev.data("jcarouselstate")!=c&&this.buttonPrev.each(function(){b.options.buttonPrevCallback(b,this,c)}).data("jcarouselstate",c)):this.options.buttonPrevCallback!==null&&this.buttonPrevState!=c&&this.options.buttonPrevCallback(b,null,c);this.buttonNextState= a;this.buttonPrevState=c},notify:function(a){var c=this.prevFirst===null?"init":this.prevFirst<this.first?"next":"prev";this.callback("itemLoadCallback",a,c);this.prevFirst!==this.first&&(this.callback("itemFirstInCallback",a,c,this.first),this.callback("itemFirstOutCallback",a,c,this.prevFirst));this.prevLast!==this.last&&(this.callback("itemLastInCallback",a,c,this.last),this.callback("itemLastOutCallback",a,c,this.prevLast));this.callback("itemVisibleInCallback",a,c,this.first,this.last,this.prevFirst, this.prevLast);this.callback("itemVisibleOutCallback",a,c,this.prevFirst,this.prevLast,this.first,this.last)},callback:function(a,c,b,d,f,j,e){if(!(this.options[a]==null||typeof this.options[a]!="object"&&c!="onAfterAnimation")){var h=typeof this.options[a]=="object"?this.options[a][c]:this.options[a];if(g.isFunction(h)){var i=this;if(d===void 0)h(i,b,c);else if(f===void 0)this.get(d).each(function(){h(i,this,d,b,c)});else for(var a=function(a){i.get(a).each(function(){h(i,this,a,b,c)})},k=d;k<=f;k++)k!== null&&!(k>=j&&k<=e)&&a(k)}}},create:function(a){return this.format("<li></li>",a)},format:function(a,c){for(var a=g(a),b=a.get(0).className.split(" "),d=0;d<b.length;d++)b[d].indexOf("jcarousel-")!=-1&&a.removeClass(b[d]);a.addClass(this.className("jcarousel-item")).addClass(this.className("jcarousel-item-"+c)).css({"float":this.options.rtl?"right":"left","list-style":"none"}).attr("jcarouselindex",c);return a},className:function(a){return a+" "+a+(!this.options.vertical?"-horizontal":"-vertical")}, dimension:function(a,c){var b=g(a);if(c==null)return!this.options.vertical?b.outerWidth(!0)||f.intval(this.options.itemFallbackDimension):b.outerHeight(!0)||f.intval(this.options.itemFallbackDimension);else{var d=!this.options.vertical?c-f.intval(b.css("marginLeft"))-f.intval(b.css("marginRight")):c-f.intval(b.css("marginTop"))-f.intval(b.css("marginBottom"));g(b).css(this.wh,d+"px");return this.dimension(b)}},clipping:function(){return!this.options.vertical?this.clip[0].offsetWidth-f.intval(this.clip.css("borderLeftWidth"))- f.intval(this.clip.css("borderRightWidth")):this.clip[0].offsetHeight-f.intval(this.clip.css("borderTopWidth"))-f.intval(this.clip.css("borderBottomWidth"))},index:function(a,c){if(c==null)c=this.options.size;return Math.round(((a-1)/c-Math.floor((a-1)/c))*c)+1}});f.extend({defaults:function(a){return g.extend(q,a||{})},intval:function(a){a=parseInt(a,10);return isNaN(a)?0:a},windowLoaded:function(){m=!0}});g.fn.jcarousel=function(a){if(typeof a=="string"){var c=g(this).data("jcarousel"),b=Array.prototype.slice.call(arguments, 1);return c[a].apply(c,b)}else return this.each(function(){var b=g(this).data("jcarousel");b?(a&&g.extend(b.options,a),b.reload()):g(this).data("jcarousel",new f(this,a))})}})(jQuery);
;
/**
 * @file
 * A JavaScript file for the remote control system.
 *
 * In order for this JavaScript to be loaded on pages, see the instructions in
 * the README.txt next to this file.
 */
(function($) {
  Drupal.behaviors.campaign_anchor = {};
  Drupal.behaviors.campaign_anchor.attach = function(context, settings) {
     $('#campaign-list-experts').find('a').click(function(e){
      e.preventDefault();
      var anchor = $(this).attr('rel');
      // Get header's height:
      var header_height = ($('#zone-header-second').size()>0) ? $('#zone-header-second').height() : 0;
      // Add arrow height:
      header_height += ($('#zone-header-second #header-comma').size()>0) ? $('#zone-header-second #header-comma').outerHeight() : 0;
      // If header is not sticky, add again to header_height to ensure never overlap title,
      // even after if header be sticky on scroll:
      header_height += (!$('#zone-header-second').hasClass('sticky')) ? $('#zone-header-second').height() : 0;
      // Start animation:
      $('html,body').stop().animate({
        'scrollTop': $("#" + anchor).offset().top - header_height
      }, settings.scrollDelay);
    });
     
     $(document).ready(function(){
       var anchor = window.location.hash.substring(1);
       // Get header's height:
       var header_height = ($('#zone-header-second').size()>0) ? $('#zone-header-second').height() : 0;
       if (header_height == 0) {
         header_height = 94;
       }
       // Add arrow height:
       header_height += ($('#zone-header-second #header-comma').size()>0) ? $('#zone-header-second #header-comma').outerHeight() : 0;
       // If header is not sticky, add again to header_height to ensure never overlap title,
       // even after if header be sticky on scroll:
       header_height += (!$('#zone-header-second').hasClass('sticky')) ? $('#zone-header-second').height() : 0;
       //Start animation
       if (anchor != '') {
         $('html,body').stop().animate({
           'scrollTop': $("#" + anchor).offset().top - header_height
         }, settings.scrollDelay);
       }
     });
  }
})(jQuery);;
(function ($) {
  $(".form-submit").click(function() {
    var form_id = $(this).closest('form').attr("id");
    if(form_id == 'comment-form') {
      var category = 'BlogComments';
      var action = 'Comments';
      var title_full = $(this).closest('article.node-blog-article').find('h2.hentry-title').text();
      var label = $.trim(title_full);
    } else if(form_id == 'comment-form--2') {
      var category = 'BlogComments';
      var action = 'Comments';
      var title_full = $(this).closest('article.node-blog-article').find('h2.hentry-title').text();
      var label = $.trim(title_full);
    } else {
      var category = 'Form';
      var action = 'FormSubmit';
      var title_full = $(this).closest('article.node-webform').find('h1.header-title').text();
      var label = $.trim(title_full);
    }
    _gaq.push(['_trackEvent', category, action, label]);
    // TODO : remove this line and the following when finished with this file.
    //alert('Form submit, data pushed to GA : _trackEvent '+ category +' '+ action +' '+ label);
  });
  $(".voverlay").click(function() {
    var title_full = $(this).attr('title');
    var title_only = $.trim(title_full);
    var category = 'Video';
    var action = 'Play';
    var label = title_only;
    _gaq.push(['_trackEvent', category, action, label]);
    // TODO : remove this line and the following when finished with this file.
    //alert('Resource Video, data pushed to GA : _trackEvent '+ category +' '+ action +' '+ label);
  });
  
  $("article.node-resource-cap_push_header_medium_block-media a").click(function() {
    var title_full = $(this).find('.information h1').text();
    var title_only = $.trim(title_full);
    var category = 'Video';
    var action = 'Play';
    var label = title_only;
    _gaq.push(['_trackEvent', category, action, label]);
    // TODO : remove this line and the following when finished with this file.
    //alert('Resource Video, data pushed to GA : _trackEvent '+ category +' '+ action +' '+ label);
  });
  
  $(".push-block-attached-file").click(function() {
    var title_parts = $(this).attr('title').split("-");
    var title_only = $.trim(title_parts['0']);
    var category = 'Download';
    var action = 'PDF';
    var label = title_only;
    _gaq.push(['_trackEvent', category, action, label]);
    // TODO : remove this line and the following when finished with this file.
    //alert('Resource PDF Download, data pushed to GA : _trackEvent '+ category +' '+ action +' '+ label);
  });
  
  $("div.doc-link a").click(function() {
    var title_full = $(this).closest('article.view-mode-teaser_simplified').find('a.link-title').text();
    var label = $.trim(title_full);
    var category = 'Download';
    var action = 'PDF';
    _gaq.push(['_trackEvent', category, action, label]);
    // TODO : remove this line and the following when finished with this file.
    //alert('Resource Video, data pushed to GA : _trackEvent '+ category +' '+ action +' '+ label);
  });
  
  $(".similar-job-offer a").click(function() {
    var container_inners = $(this).find('.job-title').text();
    var title_only = $.trim(container_inners);
    var category = 'TrackLink';
    var action = 'JobLink';
    var label = title_only;
    _gaq.push(['_trackEvent', category, action, label]);
    // TODO : remove this line and the following when finished with this file.
    //alert('Job Offer Push Block Clicked, data pushed to GA : _trackEvent '+ category +' '+ action +' '+ label);
  });
  
  $(".views-row a").click(function() {
    var container_inners = $(this).find('.job-title').text();
    var title_only = $.trim(container_inners);
    var category = 'TrackLink';
    var action = 'JobLink';
    var label = title_only;
    _gaq.push(['_trackEvent', category, action, label]);
    // TODO : remove this line and the following when finished with this file.
    //alert('Job Offer Push Block Clicked, data pushed to GA : _trackEvent '+ category +' '+ action +' '+ label);
  });
  
  $(".tile-job-offer a").click(function() {
    var container_inners = $(this).find('.job-title').text();
    var title_only = $.trim(container_inners);
    var category = 'TrackLink';
    var action = 'JobLink';
    var label = title_only;
    _gaq.push(['_trackEvent', category, action, label]);
    // TODO : remove this line and the following when finished with this file.
    //alert('Job Offer Push Block Clicked, data pushed to GA : _trackEvent '+ category +' '+ action +' '+ label);
  });
  
  $(".job-offer-apply a").click(function() {
    var category = 'TrackLink';
    var action = 'JobApply';
    var title_full = $(this).closest('article.node-job-offer').find('h1.job-offer-title').text();
    var label = $.trim(title_full);
    _gaq.push(['_trackEvent', category, action, label]);
    // TODO : remove this line and the following when finished with this file.
    //alert('Job Offer Apply Button Clicked, data pushed to GA : _trackEvent '+ category +' '+ action +' '+ label);
  });
  
  $("ul.file-buttons li.file-type-pdf a").live('click', function () {
    var category = 'Download';
    var action = 'PDF';
    var title_full = $(this).closest('.node-resource-full-document').find('header.resource-header div.span10 h1').text();
    var label = $.trim(title_full);
    _gaq.push(['_trackEvent', category, action, label]);
    // TODO : remove this line and the following when finished with this file.
    //alert('Resource PDF Download, data pushed to GA : _trackEvent '+ category +' '+ action +' '+ label);
  });
  
  $("div.file-buttons li.file-type-pdf a").live('click', function () {
    var category = 'Download';
    var action = 'PDF';
    var title_full = $(this).closest('.view-mode-carousel_full_content').find('.style13').text();
    var label = $.trim(title_full);
    _gaq.push(['_trackEvent', category, action, label]);
    // TODO : remove this line and the following when finished with this file.
    //alert('Resource PDF Download, data pushed to GA : _trackEvent '+ category +' '+ action +' '+ label);
  });
  
  $("ul.file-buttons li.file-type-epub a").live('click', function () {
    var category = 'Download';
    var action = 'ePub';
    var title_full = $(this).closest('.node-resource-full-document').find('header.resource-header div.span10 h1').text();
    var label = $.trim(title_full);
    _gaq.push(['_trackEvent', category, action, label]);
    // TODO : remove this line and the following when finished with this file.
    //alert('Resource PDF Download, data pushed to GA : _trackEvent '+ category +' '+ action +' '+ label);
  });
  
  $("div.file-buttons li.file-type-epub a").live('click', function () {
    var category = 'Download';
    var action = 'ePub';
    var title_full = $(this).closest('.view-mode-carousel_full_content').find('.style13').text();
    var label = $.trim(title_full);
    _gaq.push(['_trackEvent', category, action, label]);
    // TODO : remove this line and the following when finished with this file.
    //alert('Resource PDF Download, data pushed to GA : _trackEvent '+ category +' '+ action +' '+ label);
  });
  
  $("ul.file-buttons li.file-type-mobi a").live('click', function () {
    var category = 'Download';
    var action = 'mobi';
    var title_full = $(this).closest('.node-resource-full-document').find('header.resource-header div.span10 h1').text();
    var label = $.trim(title_full);
    _gaq.push(['_trackEvent', category, action, label]);
    // TODO : remove this line and the following when finished with this file.
    //alert('Resource PDF Download, data pushed to GA : _trackEvent '+ category +' '+ action +' '+ label);
  });
  
  $("div.file-buttons li.file-type-mobi a").live('click', function () {
    var category = 'Download';
    var action = 'mobi';
    var title_full = $(this).closest('.view-mode-carousel_full_content').find('.style13').text();
    var label = $.trim(title_full);
    _gaq.push(['_trackEvent', category, action, label]);
    // TODO : remove this line and the following when finished with this file.
    //alert('Resource PDF Download, data pushed to GA : _trackEvent '+ category +' '+ action +' '+ label);
  });
  
  //Calling From Resource List Pages
  $(".span375 a").click(function() {
    var href = $(this).attr('href');
    if (href.indexOf('video') > -1) {
      var category = 'Video';
      var action = 'Play';
      var label = $.trim($(this).text());
      _gaq.push(['_trackEvent', category, action, label]);
      // TODO : remove this line and the following when finished with this file.
      //alert('Resource PDF Download, data pushed to GA : _trackEvent '+ category +' '+ action +' '+ label);
    }
  });
  
  $("aside.node-resource-cap_push_header_gigantic_bloc-media").click(function() {
    var title_full = $(this).find('p.style04').text();
    var title_only = $.trim(title_full);
    var category = 'Video';
    var action = 'Play';
    var label = title_only;
    _gaq.push(['_trackEvent', category, action, label]);
    // TODO : remove this line and the following when finished with this file.
    //alert('Resource Video, data pushed to GA : _trackEvent '+ category +' '+ action +' '+ label);
  });
  
  $("article.node-resource-cap_push_header_slim_bloc_horizontal-media").click(function() {
    var title_full = $(this).find('p.style04').text();
    var title_only = $.trim(title_full);
    var category = 'Video';
    var action = 'Play';
    var label = title_only;
    _gaq.push(['_trackEvent', category, action, label]);
    // TODO : remove this line and the following when finished with this file.
    //alert('Resource Video, data pushed to GA : _trackEvent '+ category +' '+ action +' '+ label);
  });
  
  $("article.node-resource-cap_push_header_slim_bloc_vertical-media").click(function() {
    var title_full = $(this).find('p.style04').text();
    var title_only = $.trim(title_full);
    var category = 'Video';
    var action = 'Play';
    var label = title_only;
    _gaq.push(['_trackEvent', category, action, label]);
    // TODO : remove this line and the following when finished with this file.
    //alert('Resource Video, data pushed to GA : _trackEvent '+ category +' '+ action +' '+ label);
  });
  
  $("article.node-resource-cap_push_header_tiny_bloc_vertical-media").click(function() {
    var title_full = $(this).find('div.information').text();
    var title_only = $.trim(title_full);
    var category = 'Video';
    var action = 'Play';
    var label = title_only;
    _gaq.push(['_trackEvent', category, action, label]);
    // TODO : remove this line and the following when finished with this file.
    //alert('Resource Video, data pushed to GA : _trackEvent '+ category +' '+ action +' '+ label);
  });
  
  $("aside.node-resource-cap_push_header_tiny_bloc_horizontal-media").click(function() {
    var title_full = $(this).find('div.information').text();
    var title_only = $.trim(title_full);
    var category = 'Video';
    var action = 'Play';
    var label = title_only;
    _gaq.push(['_trackEvent', category, action, label]);
    // TODO : remove this line and the following when finished with this file.
    //alert('Resource Video, data pushed to GA : _trackEvent '+ category +' '+ action +' '+ label);
  });
  
  $("article.node-resource-cap_push_header_big_bloc-media").click(function() {
    var title_full = $(this).find('div.information').text();
    var title_only = $.trim(title_full);
    var category = 'Video';
    var action = 'Play';
    var label = title_only;
    _gaq.push(['_trackEvent', category, action, label]);
    // TODO : remove this line and the following when finished with this file.
    //alert('Resource Video, data pushed to GA : _trackEvent '+ category +' '+ action +' '+ label);
  });
  
  $("article.node-resource-teaser_simplified-media a").click(function() {
    var title_full = $(this).text();
    var title_only = $.trim(title_full);
    var category = 'Video';
    var action = 'Play';
    var label = title_only;
    _gaq.push(['_trackEvent', category, action, label]);
    // TODO : remove this line and the following when finished with this file.
    //alert('Resource Video, data pushed to GA : _trackEvent '+ category +' '+ action +' '+ label);
  });
  
  $("h3.style13 a").live('click', function () {
      var title_full = $(this).text();
      var title_only = $.trim(title_full);
      var category = 'Video';
      var action = 'Play';
      var label = title_only;
      _gaq.push(['_trackEvent', category, action, label]);
      // TODO : remove this line and the following when finished with this file.
      //alert('Resource Video, data pushed to GA : _trackEvent '+ category +' '+ action +' '+ label);
  });
  
  $("a.image").live('click', function () {
      var title_full = $(this).find('img').attr('title');
      var title_only = $.trim(title_full);
      var category = 'Video';
      var action = 'Play';
      var label = title_only;
      _gaq.push(['_trackEvent', category, action, label]);
      // TODO : remove this line and the following when finished with this file.
      //alert('Resource Video, data pushed to GA : _trackEvent '+ category +' '+ action +' '+ label);
  });
  
  //The following are "follow me" buttons.
  $(".ga-track-follow-fb").click(function() {
    _gaq.push(['_trackSocial', 'Facebook', 'Follow']);
  });
  $(".ga-track-follow-tw").click(function() {
    _gaq.push(['_trackSocial', 'Twitter', 'Follow']);
  });
  $(".ga-track-follow-gg").click(function() {
    _gaq.push(['_trackSocial', 'Google+', 'Follow']);
  });
  $(".ga-track-follow-li").click(function() {
    _gaq.push(['_trackSocial', 'LinkedIn', 'Follow']);
  });
  $(".ga-track-follow-yt").click(function() {
    _gaq.push(['_trackSocial', 'YouTube', 'Follow']);
  });
  $(".ga-track-follow-ss").click(function() {
    _gaq.push(['_trackSocial', 'SlideShare', 'Follow']);
  });
  
})(jQuery);;
