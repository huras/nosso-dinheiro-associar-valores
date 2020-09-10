class TxtReader {
  static loadTextFile(fileName, callbackFunction) {
    var req = new XMLHttpRequest();
    req.onreadystatechange = function () {
      if (req.readyState === 4 && req.status !== 200) {
        alert("loading failed ");
      }
    };
    req.onload = function () {
      var fileContent = null;
      fileContent = req.responseText;

      if (callbackFunction !== null && callbackFunction !== undefined) {
        callbackFunction(fileContent);
      }
    };

    req.open("GET", fileName, true);
    req.setRequestHeader("Content-Type", "text/xml");
    req.send();
  };
}