var errors = [];

window.onerror = function(msg, url, line, col, err) {
  errors.push({msg: msg, url: url, line: line});

  updateErrors();
}

document.addEventListener("DOMContentLoaded", function() {
  miniTools.createUI();
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


var miniTools = {

/*****************************
 * Pre-made UI code
 *****************************/

  createUI: function() {
    var bar = document.createElement("div");
    this.barElem = bar;

    setStyle(bar, {
      position: "fixed",
      left: "0",
      bottom: "0",
      height: "30px",
      width: "100%",
      "background-color": "#CCC",
      "z-index": 9999,
      "border-top": "1px solid #BBB",
      "box-shadow": "0px -1px 2px #eee"
      "font-family": "Helvetica Neue, sans-serif"
    });

    var count = document.createElement("div");
    count.className = "mini-tools-error-count";
    this.countElem = count;

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

    var errors = document.createElement("div");
    errors.className = "mini-tools-errors";
    this.errorsElem = errors;

    setStyle(errors, {
      width: "200px",
      height: "100px",
      background: "white",
      "z-index": 99999,
      position: "absolute",
      border: "3px solid #BBB",
      "border-radius": "2px",
      "box-shadow": "-2px -2px 5px #CCC"
    });
    errors.hidden = true;

    count.addEventListener("click", function(event) {
      console.log("errors click");

      this.reflowErrorsPopup();

      if (errors.hidden == true) {
        console.log("was none");
        errors.hidden = false;
      }
      else {
        console.log("was ", errors.style.display);
        errors.hidden = true;
      }
    }.bind(this))

    window.addEventListener("resize", function() {
      if (!errors.hidden) {
        this.reflowErrorsPopup();
      }
    }.bind(this));

    document.body.appendChild(bar);
    document.body.appendChild(errors);
  },

  reflowErrorsPopup: function() {
    var offset = getOffset(this.countElem);

    setStyle(this.errorsElem, {
      left: offset.left + "px",
      top: (offset.top - 108) + "px"
    });
  }
}

function setStyle(elem, styles) {
  for (var name in styles) {
    elem.style.setProperty(name, styles[name]);
  }
}

function getOffset(elem) {
  var rect = elem.getBoundingClientRect();
  return {
    top: rect.top  + window.pageYOffset,
    left: rect.left + window.pageXOffset
  };
}
