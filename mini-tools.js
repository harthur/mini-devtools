window.onerror = function(msg, url, line, col, err) {
  console.log("Got an error: " + msg +  url + line + col + err.stack);
}