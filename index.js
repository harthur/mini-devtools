$(document).ready(function() {
  console.log("loaded button");

  $(".button").click(function() {
    throw new Error("this is a super super super super super bad error");
  });
});