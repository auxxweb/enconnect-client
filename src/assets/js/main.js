

  $(".navbar-toggler").click(function () {
    if ($(this).hasClass("collapsed")) {
      $(".navbar").removeClass("navbar-active");
    } else {
      $(".navbar").addClass("navbar-active");
    }
  });


  $(document).scroll(function () {
    if ($(document).scrollTop() >= 50) {
      $(".navbar").addClass("navbar-active");
    } else {
      $(".navbar").removeClass("navbar-active");
    }
  
    if (checkScreenSize() == true) {
      if ($(".navbar-collapse").hasClass("show")) {
        $(".navbar").addClass("navbar-active");
      }
    }
  });
  
  function checkScreenSize() {
    var newWindowWidth = $(window).width();
    if (newWindowWidth < 481) {
      return true;
    } else {
      return false;
    }
  }
  (function ($) {
    "use strict";
     // Back to top button
     $(window).scroll(function () {
      if ($(this).scrollTop() > 300) {
          $('.back-to-top').fadeIn('slow');
      } else {
          $('.back-to-top').fadeOut('slow');
      }
  });
  $('.back-to-top').click(function () {
      $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
      return false;
  });
})(jQuery);

  AOS.init();

  