$(function() {
  $('.homepage-thumbs .thumb').hover(function(thumb) {

    // If not mobile...
    if (!window.matchMedia('all and (max-width: 740px)').matches) {
      var thumb = $(this);
      var teaser = thumb.find('.teaser');

      // Center the teaser text within the thumbnail.
      teaser.css({
        'padding-top': (thumb.innerHeight() - teaser.innerHeight())/2,
        'padding-bottom': (thumb.innerHeight() - teaser.innerHeight())/2
      });

      // Show the teaser text and make it a button.
      teaser.toggle();
      teaser.toggleClass('js-hover');
      teaser.click(function() {
        window.location = $(this).find('a').attr('href');
      })
    }

  })
});
