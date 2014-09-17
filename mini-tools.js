var errors = [];

window.onerror = function(msg, url, line, col, err) {
  errors.push({msg: msg, url: url, line: line});
  miniTools.updateErrorBox();
}

document.addEventListener("DOMContentLoaded", function() {
  miniTools.createUI();
  miniTools.updateErrorBox();
});


var miniTools = {

  updateErrorBox: function() {
    var countText = "";
    var color = "#0d0";

    if (errors.length) {
      countText = errors.length;
      color = "#d00";
    }
    this.countElem.textContent = countText;
    this.countElem.style.background = color;

    // update error messages list
    clearChildren(this.errorsElem);

    errors.forEach(function(error) {
      var elem = this.createMessageElem(error);
      this.errorsElem.appendChild(elem);
    }.bind(this));
  },


  /*****************************
   * Pre-made UI code
   *****************************/

  createMessageElem: function(error) {
    var div = document.createElement("div");
    div.textContent = error.msg;

    var span = document.createElement("span");
    span.textContent = fileName(error.url) + ":" + error.line;
    setStyle(span, {
      "margin-left": "0.4em",
      "color": "grey"
    })

    div.appendChild(span);

    setStyle(div, {
      padding: "0.4em",
      "border-bottom": "1px solid #CCC"
    })

    return div;
  },

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
      "box-shadow": "0px -1px 2px #eee",
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
      "color": "white",
      "cursor": "pointer"
    })

    bar.appendChild(count);

    var errors = document.createElement("div");
    errors.className = "mini-tools-errors";
    this.errorsElem = errors;

    setStyle(errors, {
      width: "200px",
      "max-height": "400px",
      background: "white",
      "z-index": 99999,
      position: "absolute",
      border: "3px solid #BBB",
      "border-radius": "2px",
      "box-shadow": "-2px -2px 5px #CCC",
      "font-family": "Helvetica Neue, sans-serif"
    });
    errors.hidden = true;

    this.initPopup();

    document.body.appendChild(bar);
    document.body.appendChild(errors);
  },

  initPopup: function() {
    this.countElem.addEventListener("click", function(event) {
      this.reflowErrorsPopup();

      if (this.errorsElem.hidden == true) {
        this.errorsElem.hidden = false;
      }
      else {
        this.errorsElem.hidden = true;
      }
    }.bind(this))

    window.addEventListener("resize", function() {
      if (!errors.hidden) {
        this.reflowErrorsPopup();
      }
    }.bind(this));
  },

  reflowErrorsPopup: function() {
    var offset = getOffset(this.countElem);

    setStyle(this.errorsElem, {
      left: offset.left + "px",
      top: (offset.top - 108) + "px"
    });
  }
}

function fileName(url) {
  return url.replace(/.*\//, "")
}

function clearChildren(elem) {
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
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
