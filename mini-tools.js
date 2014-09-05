var errors = [];

window.onerror = function(msg, url, line, col, err) {
  errors.push({msg: msg, url: url, line: line});
  console.log("Got an error: " + msg +  url + line + col + err ? err.stack : "");
}

document.addEventListener("DOMContentLoaded", function() {
  var bar = document.createElement("div");
  var style = bar.style;
  style.setProperty("position", "fixed");
  style.setProperty("left", 0);
  style.setProperty("bottom", 0);
  style.setProperty("height", "30px");
  style.setProperty("width", "100%");
  style.setProperty("background-color", "#CCC");
  style.setProperty("z-index", 9999);

  document.body.appendChild(bar);
  console.log("loaded");
});
