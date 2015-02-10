$(function() {
  $('.homepage-thumbs .thumb').hover(function(thumb) {
    var thumb = $(this);
    var teaser = thumb.find('.teaser');

    teaser.css({
      top: (thumb.innerHeight() - teaser.innerHeight())/2
    });

    teaser.toggle();
  })
});
