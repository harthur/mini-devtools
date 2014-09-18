var errors = [];

window.onerror = function(msg, url, line, col, err) {
  errors.push({msg: msg, url: url, line: line});
  miniTools.updateErrors();
}

var miniTools = {
  onContentLoad: function() {
    this.createUI();
    this.updateErrors();
    this.initInspector();
  },

  onLoad: function() {
    var loaded = performance.timing.loadEventEnd || Date.now();
    var navigated = performance.timing.navigationStart;
    var loadTime = loaded - navigated;

    this.updateLoadTime(loadTime);
  },

  updateLoadTime: function(loadTime) {
    var seconds = loadTime / 1000;
    this.timeElem.textContent = seconds + "s";
  },

  updateErrors: function() {
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

  /*********************
   * Pre-made setup code
   *********************/
  toggle: function() {
    if (this.initialized) {
      this.destroy();
    }
    else {
      this.init();
    }
  },

  init: function() {
    this.onContentLoad = this.onContentLoad.bind(this);
    this.onLoad = this.onLoad.bind(this);

    if (document.readyState == "interactive"
       || document.readyState == "complete") {
      this.onContentLoad();
    }
    else {
      document.addEventListener("DOMContentLoaded", this.onContentLoad);
    }
    if (document.readyState == "complete") {
      this.onLoad();
    }
    else {
      window.addEventListener("load", this.onLoad);
    }
    this.initialized = true;
  },

  destroy: function() {
    document.removeEventListener("DOMContentLoaded", this.onContentLoad);
    window.removeEventListener("load", this.onLoad);
    this.initialized = false;
  },

  initInspector: function() {
    var prevElem;
    function inspectDoc(event) {
      var elem = document.elementFromPoint(event.clientX, event.clientY);

      if (elem == prevElem) {
        return;
      }
      elem.style.outline = "1px dotted black";
      if (prevElem) {
        prevElem.style.outline = "none";
      }
      prevElem = elem;

      miniTools.nodeInfoElem.textContent = getSelectorFor(elem);
    }

    this.inspectButtonElem.addEventListener("click", function() {
      if (!this.inspecting) {
        document.addEventListener("mousemove", inspectDoc);
        this.inspecting = true;
      }
      else {
        document.removeEventListener("mousemove", inspectDoc);
        this.inspecting = false;
        this.nodeInfoElem.textContent = "";
        this.inspectButtonElem.style.outline = "none";
      }
    }.bind(this))
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
    });

    return div;
  },

  createUI: function() {
    // create the mini tools bar
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

    // create the error display
    var count = document.createElement("div");
    count.className = "mini-tools-error-count";
    this.countElem = count;

    setStyle(count, {
      display: "inline-block",
      width: "20px",
      height: "20px",
      "margin-top": "4px",
      "margin-left": "10px",
      "border-radius": "3px",
      "border": "1px solid #555",
      "text-align": "center",
      "color": "white",
      "cursor": "pointer",
      "vertical-align": "middle"
    })

    bar.appendChild(count);

    var errors = document.createElement("div");
    errors.className = "mini-tools-errors";
    this.errorsElem = errors;

    setStyle(errors, {
      width: "260px",
      "max-height": "400px",
      background: "white",
      "z-index": 99999,
      position: "absolute",
      border: "3px solid #BBB",
      "border-radius": "2px",
      "box-shadow": "-2px -2px 5px #CCC",
      "font-family": "Helvetica Neue, sans-serif",
      "overflow": "hidden"
    });
    errors.hidden = true;

    this.initPopup();

    // create load time indicator
    var timing = document.createElement("div");
    timing.className = "mini-tools-timing";
    setStyle(timing, {
      display: "inline-block",
      height: "20px",
      "margin-top": "3px",
      "margin-left": "10px",
      "vertical-align": "middle"
    })
    this.timingElem = timing;

    var load = document.createElement("load");
    load.textContent = "load: ";
    timing.appendChild(load);

    var time = document.createElement("span");
    setStyle(time, {
      "font-family": "monospace",
      "font-size": "123%",
      "color": "blue"
    })
    this.timeElem = time;
    timing.appendChild(time);

    bar.appendChild(timing);

    // create the inspector button
    var inspector = document.createElement("div");
    setStyle(inspector, {
      display: "inline-block",
      "float": "right",
      "margin-right": "10px",
      "margin-top": "4px"
    });

    var nodeInfo = document.createElement("div");
    setStyle(nodeInfo, {
      display: "inline-block",
      "text-align": "right",
      "margin-right": "10px",
      "vertical-align": "middle",
      "font-family": "monospace"
    });
    this.nodeInfoElem = nodeInfo;
    inspector.appendChild(nodeInfo);

    var inspectButton = document.createElement("div");
    setStyle(inspectButton, {
      display: "inline-block",
      "vertical-align": "middle",
      "margin-right": "10px",
      "cursor": "pointer",
    });
    inspectButton.textContent = "⊞";
    this.inspectButtonElem = inspectButton;
    inspector.appendChild(inspectButton);

    bar.appendChild(inspector);

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
      bottom: 30 + "px"
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

function getSelectorFor(elem) {
  var selector = elem.nodeName.toLowerCase();
  if (elem.id) {
    selector += elem.id;
  }
  for (var i = 0; i < elem.classList.length; i++) {
    selector += "." + elem.classList[i];
  }
  return selector;
}

miniTools.toggle();
