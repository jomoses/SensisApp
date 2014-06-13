/**
 * @file
 * A JavaScript file for the country choice system in the footer.
 *
 * In order for this JavaScript to be loaded on pages, see the instructions in
 * the README.txt next to this file.
 */
(function($) {
  Drupal.behaviors.country_choice = {};  
  Drupal.behaviors.country_choice.attach = function(context) {
    
    $('#country-choise-select').change(function(event){
      // Prevent default click action.
      event.preventDefault();
      document.location.href = "http://" + $('#country-choise-select option:selected').val();
    });
    
    var $block_countries = $("#block-cap-custom-footer-countries");
    
    $block_countries.unbind('click').click( function() {
      // Check whether it is already loading.
      if(!$block_countries.hasClass('toggle')) {
        $block_countries.addClass('toggle');
        // builds the url to add one to the sharing counter of the current node.
        var url = Drupal.settings.basePath + 'country_choice';
        $.ajax({
          url: url,
          async: true,
          success: function(data) {
            // Append the content received then display it with a slidedown animation.
            $("#footer").append(data);
            
            // Put things back the way they were before the popup poped up.
            $(".footer-popup-closing-button").click( function() {
                $("#footer-menu-popup-wrapper").remove();
                $block_countries.removeClass('toggle');
            });
          }
        });
      }
    });
  }
})(jQuery);
;
// Insert Facebook & Twitter API scripts.
(function(d, s) {
  var js = d.getElementsByTagName(s);
  var fjs = js[js.length - 1];
  if (!d.getElementById("facebook-jssdk")) {
/*    js = d.createElement(s);
    js.id = "facebook-jssdk";
    js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
    fjs.parentNode.insertBefore(js, fjs.nextSibling);*/
    window.fbAsyncInit = function() {
          FB.init({
              appId      : '178166639000331', // App ID from the App Dashboard
              status     : true, // check the login status upon init?
              cookie     : true, // set sessions cookies to allow your server to access the session?
              xfbml      : true  // parse XFBML tags on this page?
          });
    };
    (function(d, debug){
       var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
       if (d.getElementById(id)) {return;}
       js = d.createElement('script'); js.id = id; js.async = true;
       js.src = "//connect.facebook.net/en_US/all" + (debug ? "/debug" : "") + ".js";
       ref.parentNode.insertBefore(js, ref);
    }(document, /*debug*/ false));
  }
  if (!d.getElementById("twitter-wjs")) {
    js = d.createElement(s);
    js.id = "twitter-wjs";
    js.src = "//platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs.nextSibling);
  }
}(document, "script"));
;
/*!
Megamenu.js

Manage megamenu display.
*/

(function ($) {
  Drupal.behaviors.megamenu = {
    attach: function (context, settings) {
      // Bind a click event on a Megamenu element.
      $(".megamenu-parent").unbind("click").click(function (event) {
        // Prevent default click action.
        event.preventDefault();
        // Go to the top of the screen.
        $("html, body").animate({ scrollTop: 0 }, "fast");

        var submenu = $(this);
        var displaying_content = false;
        var machine_name = submenu.attr("data-machine-name");
        var href_megamenu = submenu.attr("href");

        // If the current submenu has allready 'opened' class: do nothing.
        if (submenu.hasClass("opened")) {
          slideUpAnimate();
        }
        else {
          if (machine_name != "") {
            // Remove all the class 'active' of the Megamenu.
            $(".megamenu-parent").removeClass("opened");
            submenu.addClass("opened");
            // Hide the previous displayed content.
            $("#megamenu-content-container").slideUp('slow', function() {
              $("#megamenu-content-html").html('');
              $("#megamenu-content-html").hide();
              // If this megamenu is not allready loaded.
              if (!submenu.hasClass("megamenu-loaded")) {
                // Display the ajax loader.
                $("#megamenu-content").css('min-height', '80px');
                $("#megamenu-loading").show();
                $("#megamenu-content-container").slideDown('slow', function() {
                  // Call the menu item megamenu/% to get the sublinks.
                  $.ajax({
                    url: href_megamenu,
                    async: false,
                    // If successed: add the content returned to the div wrapper.
                    success: function(data) {
                      displaying_content = true;
                      // Hide the ajax loader.
                      $("#megamenu-loading").hide();
                      submenu.addClass("megamenu-loaded");
                      // Append the content received then display it with a slidedown animation.
                      $("#megamenu #megamenu-content-hidden").append(data);
                      slideDownAnimate(machine_name, true);
                    }
                  });
                });
              }
              else {
                slideDownAnimate(machine_name);
              } 
            });
          }
        }
      });

      // Catch the click on a close cross button.
      $("#megamenu #megamenu-content-container .close-cross-button img").click(function () {
        slideUpAnimate();
      });
    }
  };

  // Hide the megamenu.
  slideUpAnimate = function () {
    // Hide the previous displayed content.
    $("#megamenu-content-container").slideUp('slow', function() {
      // Remove all the class 'active' of the Megamenu.
      $(".megamenu-parent").removeClass("opened");
    });
  }

  // Show the megamenu required.
  slideDownAnimate = function (machine_name, ajax_requested) {
    var content_to_display = $("#megamenu #megamenu-content-hidden #megamenu-" + machine_name).html();
    if (content_to_display != null) {
      $("#megamenu-content-html").html(content_to_display);
      if (!ajax_requested) {
        $("#megamenu-content").css('min-height', '1px');
      }
      $("#megamenu-content-container").show();
      $("#megamenu-content-html").slideDown('slow');
    }
    else {
      slideUpAnimate();
    }
  };
})(jQuery);;
/*!
message.js

Manage to display messages on select menu-item change.
*/
(function ($) {
  Drupal.behaviors.navigationMessage = {
    attach: function (context, settings) {
      var menuItem = $("#edit-menu-item-id").val();
      if (menuItem != '') {
        $("#edit-menu-item-id").change(function () {
          var message = Drupal.t(
            "/!\ Beware: you have changed the associated menu item." + "\n" + "\n" + 
            "If you want to change the associated URL you have to do the following steps:" + "\n" + 
            "  1/ In 'URL pass settings', clear the field," + "\n" + 
            "  2/ Check 'Generate automatic URL alias'," + "\n" + 
            "  3/ Submit the modification." + "\n" + "\n" +  
            "Do you want to continue?"
            );
          if (!confirm(message)) {
            $("#edit-menu-item-id").val(menuItem);
          }
        });
      }
    }
  }
})(jQuery);;
(function ($) {

  Drupal.behaviors.addthis = {
    attach: function(context, settings) {
      $.getScript(
        Drupal.settings.addthis.widget_url,
        function(data, textStatus) {
          addthis.init();
        }
      );
      if (context != window.document && window.addthis != null) {
        window.addthis.ost = 0;
        window.addthis.ready();
      }
    }
  };

}(jQuery));
;
