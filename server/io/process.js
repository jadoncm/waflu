// ALL CODE FOR HANDLING SOCKETIO MESSAGES GOES IN THIS FILE
// (though can partition into multiple files)

module.exports = function(server, socket) {
  var util = require('../util'),
      ObjectID = require('mongodb').ObjectID;

  

  socket.on('disconnect', function () {
    console.log('user disconnected: ' + socket.id);
  });
}