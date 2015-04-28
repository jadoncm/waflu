// ALL CODE FOR HANDLING SOCKETIO MESSAGES GOES IN THIS FILE
// (though can partition into multiple files)

module.exports = function(server, socket) {
  var util = require('../util'),
      ObjectID = require('mongodb').ObjectID;


  socket.on('create game', function (name) {
    function fail(err) {
      socket.emit('create game fail', err);
      console.log('create game fail: ' + 
                  socket.id + ' | ' + name + ' b/c ' + err);
    }
    function succeed() {
      socket.emit('create game succeed');
      console.log('create game succeed: ' + socket.id + ' | ' + name);
    }

    server.createRoom(socket, name, function (err) {
      if (err) fail(err);
      else {
        socket.broadcast.emit('new game', name, socket);
      }
    });
  });
  socket.on('delete game', function () {
    function fail(err) {
      socket.emit('delete game fail', err);
      console.log('delete game fail: ' + socket.id + ' b/c ' + err);
    }
    function succeed() {
      socket.emit('delete game succeed');
      console.log('delete game succeed: ' + socket.id);
    }

    server.deleteRoom(socket, function (err, name) {
      if (err) fail(err);
      else {
        socket.broadcast.emit('deleted game', name);
      }
    });
  });
  socket.on('join game', function (name) {
    function fail(err) {
      socket.emit('join game fail', err);
      console.log('join game fail: ' + socket.id + ' b/c ' + err);
    }
    function succeed() {
      socket.emit('join game succeed');
      console.log('join game succeed: ' + socket.id);
    }

    server.joinRoom(socket, name, function (err) {
      if (err) fail(err);
      else {
        socket.broadcast.emit('updated game', name, socket);
      }
    });
  });
  socket.on('leave game', function () {
    function fail(err) {
      socket.emit('leave game fail', err);
      console.log('leave game fail: ' + socket.id + ' b/c ' + err);
    }
    function succeed() {
      socket.emit('leave game succeed');
      console.log('leave game succeed: ' + socket.id);
    }

    server.leaveRoom(socket, function (err, name) {
      if (err) fail(err);
      else {
        socket.broadcast.emit('updated game', name, null);
      }
    });
  });
  socket.on('all games', function () {
    socket.emit('all games', server.rooms);
    console.log('all games: ' + socket.id);
  });
}