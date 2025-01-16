$(function () {
  var current = location.pathname; // Get the current pathname
  $("#myDIV li a").each(function () {
    var $this = $(this);
    // if the current path matches the link's href, make it active
    if ($this.attr("href") === current) {
      $this.addClass("active");
    }
  });
});
$(document).ready(function () {
  $(".mob_bars").click(function () {
    $(".side-slide").animate({ right: "0px" }, 200);
  });

  $(".close_icon").click(function () {
    $(".side-slide").animate({ right: "-100%" }, 200);
  });

  $(".side-slide").click(function () {
    $(".side-slide").animate({ right: "-100%" }, 200);
  });
});
document.addEventListener("mousedown", () => {
  document.body.classList.add("using-mouse");
  document.body.classList.remove("using-keyboard");
});
