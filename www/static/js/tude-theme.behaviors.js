(function ($) {
  // Store helper functions for Fattitude.
  var Fattitude = Fattitude || {};

  /**
   * Return the current breakpoint.
   */
  Fattitude.getBreakpoint = function(settings) {
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
  };

  /**
   * Trigger a callback every time the breakpoint changes.
   */
  Fattitude.onBreakpointChange = function(settings, callback) {
    var breakpoint = '';
    $(window).on('resize', function() {
      newBreakpoint = Fattitude.getBreakpoint(settings);
      if (breakpoint != newBreakpoint) {
        breakpoint = newBreakpoint;
        callback(breakpoint);
      }
    });
  };

  /**
   * The recommended way for producing HTML markup through JavaScript is to write
   * theming functions. These are similiar to the theming functions that you might
   * know from 'phptemplate' (the default PHP templating engine used by most
   * Drupal themes including Omega). JavaScript theme functions accept arguments
   * and can be overriden by sub-themes.
   *
   * In most cases, there is no good reason to NOT wrap your markup producing
   * JavaScript in a theme function.
   */
  Drupal.theme.prototype.tudeThemeExampleButton = function (path, title) {
    // Create an anchor element with jQuery.
    return $('<a href="' + path + '" title="' + title + '">' + title + '</a>');
  };

  /**
   * Behaviors are Drupal's way of applying JavaScript to a page. In short, the
   * advantage of Behaviors over a simple 'document.ready()' lies in how it
   * interacts with content loaded through Ajax. Opposed to the
   * 'document.ready()' event which is only fired once when the page is
   * initially loaded, behaviors get re-executed whenever something is added to
   * the page through Ajax.
   *
   * You can attach as many behaviors as you wish. In fact, instead of overloading
   * a single behavior with multiple, completely unrelated tasks you should create
   * a separate behavior for every separate task.
   *
   * In most cases, there is no good reason to NOT wrap your JavaScript code in a
   * behavior.
   *
   * @param context
   *   The context for which the behavior is being executed. This is either the
   *   full page or a piece of HTML that was just added through Ajax.
   * @param settings
   *   An array of settings (added through drupal_add_js()). Instead of accessing
   *   Drupal.settings directly you should use this because of potential
   *   modifications made by the Ajax callback that also produced 'context'.
   */
  Drupal.behaviors.tudeThemeExampleBehavior = {
    attach: function (context, settings) {
      // By using the 'context' variable we make sure that our code only runs on
      // the relevant HTML. Furthermore, by using jQuery.once() we make sure that
      // we don't run the same piece of code for an HTML snippet that we already
      // processed previously. By using .once('foo') all processed elements will
      // get tagged with a 'foo-processed' class, causing all future invocations
      // of this behavior to ignore them.

      $('.some-selector', context).once('foo', function () {
        // Now, we are invoking the previously declared theme function using two
        // settings as arguments.
        var $anchor = Drupal.theme('tudeThemeExampleButton', settings.myExampleLinkPath, settings.myExampleLinkTitle);

        // The anchor is then appended to the current element.
        $anchor.appendTo(this);
      });
    }
  };

  Drupal.behaviors.tudeThemeScroll = {
    attach: function (context, settings) {
      this.getHeights();

      // Update the scroll effect when the breakpoint changes.
      Fattitude.onBreakpointChange(settings, function(breakpoint) {
        this.getHeights();
        this.setPositions();
      }.bind(this));

      $(window).scroll(this.setPositions.bind(this));
    },

    /**
     * Retrieve the heights of page elements involved in the scroll effect.
     * These are set in the CSS and differ for each breakpoint.
     */
    getHeights: function() {
      this.heights = {
        donate: $('.l-region--branding').height(),
        logo: $('.header-wrapper').height(),
      }
    },

    /**
     * Set the position of elements involved in the scroll effect
     * based on how far the user has scrolled.
     */
    setPositions: function() {
      var heights = this.heights;
      var scrolled = $(window).scrollTop();

      var parallax_speed = .8; // For parallax scroll over logo.

      if (scrolled < 0) {
        // Do nothing.
      } else if (scrolled <= heights.logo) {
        // Donate bar is sticky at the top. Header scrolls a little slower.
        $('.not-logged-in .block--tude-general-header-donate-block').css('top', 0);
        $('.not-logged-in .l-region--header').css('top', heights.donate - scrolled*parallax_speed + 'px');
      } else {
        // Prevent the header from peeking out the bottom of the nav bar.
        $('.not-logged-in .l-region--header').css('top', heights.donate - scrolled + 'px');

        // Donate bar now disappears at normal speed.
        $('.not-logged-in .block--tude-general-header-donate-block').css('top', heights.logo - scrolled + 'px');
      }
    }
  };

  Drupal.behaviors.tudeThemeColumnfy = {
    attach: function (context, settings) {
      this.makeColumns(Fattitude.getBreakpoint(settings));
      Fattitude.onBreakpointChange(settings, this.makeColumns.bind(this));
    },

    makeColumns: function(breakpoint) {
      var column_counts = {
        'wide': 7,
        'normal': 6,
        'narrow': 5,
        'mobile': 2
      }

      // If column containers already exist, destory them.
      $('.view-supporters .view-content .column .views-row').unwrap();

      // Sort the items into new column containers.
      var wrapper = $('.view-supporters .view-content');
      var items = wrapper.children('.views-row');
      var columns = column_counts[breakpoint];
      var items_per_column = Math.ceil(items.length/columns);

      for (var i = 0; i < columns; i++) {
        column = $('<div></div>').addClass('column column-' + i).appendTo(wrapper);
        for (var j = items_per_column*i; j < items_per_column*(i+1); j++) {
          $(items[j]).remove().clone().appendTo(wrapper.find('.column-' + i)).show();
        }
      }
    }
  };

})(jQuery);
