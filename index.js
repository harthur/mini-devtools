$(document).ready(function() {
  console.log("loaded");

  $(".button").click(function() {
    throw new Error("hello?");
  });
});