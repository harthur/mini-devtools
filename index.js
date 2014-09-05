$(document).ready(function() {
  console.log("loaded button");

  $(".button").click(function() {
    throw new Error("hello?");
  });
});