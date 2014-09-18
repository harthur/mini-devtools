$(document).ready(function() {
  console.log("loaded button");

  $(".link").hide();

  $(".button").click(function() {
    $(".chosen-tools").addClass("show");

    $(".link").delay(1000).fadeIn(500);
  });
});
