var fs = require('fs');

module.exports = {
  formJSON: function (serial) {
    if (Object.prototype.toString.call(serial) == "[object Object]")
      return serial;
    
    var json = {};

    for (var i = 0; i < serial.length; i ++)
      json[serial[i].name] = serial[i].value;

    return json;
  }
}