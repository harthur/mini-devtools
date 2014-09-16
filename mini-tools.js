var errors = [];

window.onerror = function(msg, url, line, col, err) {
  errors.push({msg: msg, url: url, line: line});

  updateErrors();
}

document.addEventListener("DOMContentLoaded", function() {
  createUI();
  updateErrors();
  console.log("loaded");
});

function updateErrors() {
  var count = document.querySelector(".mini-tools-error-count");
  if (errors.length) {
    count.textContent = errors.length;
    count.style.background = "#d00";
  }
  else {
    count.textContent = "";
    count.style.background = "#0d0";
  }
}

/*****************************
 * Pre-made UI code
 *****************************/
function createUI() {
  var bar = document.createElement("div");

  setStyle(bar, {
    position: "fixed",
    left: "0",
    bottom: "0",
    height: "30px",
    width: "100%",
    "background-color": "#CCC",
    "z-index": "9999",
    "border-top": "1px solid #BBB",
    "font-family": "Helvetica Neue, sans-serif"
  });

  var count = document.createElement("div");
  count.className = "mini-tools-error-count";

  setStyle(count, {
    width: "20px",
    height: "20px",
    "margin-top": "4px",
    "margin-left": "10px",
    "border-radius": "3px",
    "border": "1px solid #555",
    "text-align": "center",
    "color": "white"
  })

  bar.appendChild(count);

  document.body.appendChild(bar);
}

function setStyle(elem, styles) {
  for (var name in styles) {
    console.log(name, styles[name]);
    elem.style.setProperty(name, styles[name]);
  }
}
