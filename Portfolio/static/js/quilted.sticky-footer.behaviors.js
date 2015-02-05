(function ($) {

  $(window).load(function() {
    Drupal.behaviors.stickyFooter.attach(false, Drupal.settings);
  });

  /**
   * Override Omega's Media Query Class handler.
   */
  Drupal.behaviors.omegaMediaQueryClasses.handler = function (name, mql) {
    $.event.trigger('responsivelayout', {current: name});

    if (mql.matches) {
      $('body').removeClass(name + '-inactive').addClass(name + '-active');
    }
    else {
      $('body').removeClass(name + '-active').addClass(name + '-inactive');
    }
  }

  Drupal.behaviors.stickyFooterBreakpoint = {
    attach: function (context, settings) {
      $(window).on('resize', function(evt, newBreakpoint) {
        Drupal.behaviors.stickyFooter.attach(context, settings);
      });

      // Content resize can be manually triggered when something changes the length of the content (such as a hide/show).
      $('body').on('contentResize', function(evt, newBreakpoint) {
        Drupal.behaviors.stickyFooter.attach(context, settings);
      });
    }
  };

  Drupal.behaviors.stickyFooter = {
    attach: function (context, settings) {
      if ($('html.lt-ie9').length > 0) {
        return;
      }

      var currentBreakpoint = Drupal.behaviors.stickyFooter.currentBreakpoint(settings);

      switch (currentBreakpoint) {
        case 'wide':
        case 'normal':
          Drupal.behaviors.stickyFooter.recalculateSidebarOnTheSide();
          break;
        case 'narrow':
          Drupal.behaviors.stickyFooter.recalculateSidebarOnBottom();
          break;
        case 'mobile':
          Drupal.behaviors.stickyFooter.recalculateSidebarOnBottom();
          break;
      }
    },

    currentBreakpoint: function(settings) {
      var omegaSettings = settings.omega || {};
      var mediaQueries = omegaSettings.mediaQueries || {};

      var currentBreakpoint;
      $.each(mediaQueries, function (index, value) {
        var mql = window.matchMedia(value);

        if (mql.matches == true) {
          currentBreakpoint = index;
        }
      });

      return currentBreakpoint;
    },

    unset: function() {
      var wrapper = $('.l-page');
      var content = $('.l-content');
      var sidebar = $('.l-region--sidebar-first');

      content.height('inherit');
      sidebar.height('inherit');
      wrapper.css('padding-bottom', '');
      sidebar.css('padding-bottom', '');
    },

    recalculateSidebarOnTheSide: function() {
      Drupal.behaviors.stickyFooter.recalculate('side');
    },

    recalculateSidebarOnBottom: function() {
      Drupal.behaviors.stickyFooter.recalculate('bottom');
    },

    recalculateSidebarOnTop: function() {
      Drupal.behaviors.stickyFooter.recalculate('top');
    },


    recalculate: function(sidebarPosition, equalizeColumns) {
      var sidebarPosition = (typeof sidebarPosition !== 'undefined') ? sidebarPosition : 'side';
      var equalizeColumns = (typeof equalizeColumns !== 'undefined') ? equalizeColumns : true;

      var winHeight = $(window).outerHeight(true);
      var footerHeight = $('.l-footer').outerHeight(true);
      var mainPadding = parseInt($('.l-main').css('padding-top')) + parseInt($('.l-main').css('padding-bottom'));
      var content = $('.l-content');
      var sidebar = $('.l-region--sidebar-first');
      var wrapper = $('.l-page');

      // Unset the height of the content.
      content.height('inherit');
      sidebar.height('inherit');
      wrapper.css('padding-bottom', 0);

      var contentHeight = content.outerHeight(true);
      var sidebarHeight = sidebar.outerHeight(true);

      // If the height of the content is smaller than the white background,
      // then make the white background the full height.
      var contentTop = content.offset().top;
      var extendedContentHeight = winHeight - footerHeight - contentTop - mainPadding;

      // Fix the main section padding bottom to exactly match the footer.
      // Also apply to sidebar in case the sidebar is longer.
      var paddingBottom = parseInt(footerHeight);
      wrapper.css('padding-bottom', paddingBottom + 'px');

      if (equalizeColumns == true) {
        // Handle the case where the sidebar is on the top
        if (sidebarPosition === 'top') {
          if (contentHeight < extendedContentHeight) {
            content.height(extendedContentHeight);
          }
        }
        // Handle the case where the sidebar is on the bottom
        else if (sidebarPosition === 'bottom') {
          // If the content height is shorted than it should be to touch the footer.
          if (contentHeight < extendedContentHeight) {
            // If there is a sidebar and it is too short to touch the footer, it should be extended to the footer.
            // The content should not be touched
            if (sidebar.length > 0) {
              if (extendedContentHeight - contentHeight > sidebarHeight) {
                content.height('inherit');
                sidebar.height(extendedContentHeight - contentHeight);
              }
            }
            // If there is no sidebar, just extend the content.
            else {
              content.height(extendedContentHeight);
            }
          }
        }
        // Default is sidebar to the side of the main content
        else {
          // If the content height is shorter than it should be to touch the footer.
          if (contentHeight < extendedContentHeight) {
            // If the sidebar is longer than the minimum to touch the footer, equalize the content.
            if (extendedContentHeight < sidebarHeight) {
              content.height(sidebarHeight);
            }
            // If the sidebar is not long enough to touch the footer, extend the sidebar and the content.
            // @TODO: This might not need to be nested as an else?
            else {
              sidebar.height(extendedContentHeight);
              content.height(extendedContentHeight);
            }
          }
          // Otherwise the content hight is already long enough to touch the footer
          else {
            // Then equalize the columns
            if (contentHeight < sidebarHeight) {
              content.height(sidebarHeight);
            }
            else {
              sidebar.height(contentHeight);
            }
          }
        }
      }
    }
  };

})(jQuery);
