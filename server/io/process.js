// ALL CODE FOR HANDLING SOCKETIO MESSAGES GOES IN THIS FILE
// (though can partition into multiple files)

module.exports = function(server, socket) {
  var util = require('../util'),
      ObjectID = require('mongodb').ObjectID;


  socket.on('all names', function() {
    socket.emitAllNames();
  });
  socket.on('set name', function (name) {
    function fail(err) {
      socket.emit('set name fail', err);
      console.log('set name fail: ' + socket.id + ' | ' + name);
    }
    function succeed() {
      socket.name = name;
      socket.emit('set name succeed');
      socket.broadcast.emit('change name', socket.id, name);
      console.log('set name succeed: ' + socket.id + ' | ' + name);
    }

    if (!name) {
      fail('name invalid'); return;
    }

    var okay = true;
    for (var key in server.sockets) {
      s = server.sockets[key];
      if (s.name == name) okay = false;
    }
    if (okay) succeed();
    else fail('name taken');
  });
  socket.on('create game', function (name) {
    function fail(err) {
      socket.emit('create game fail', err);
      console.log('create game fail: ' + 
                  socket.id + ' | ' + name + ' b/c ' + err);
    }
    function succeed() {
      socket.emit('create game succeed');
      socket.broadcast.emit('new game', name, socket.id);
      console.log('create game succeed: ' + socket.id + ' | ' + name);
    }

    server.createRoom(socket, name, function (err) {
      if (err) fail(err);
      else succeed();
    });
  });
  socket.on('delete game', function () {
    function fail(err) {
      socket.emit('delete game fail', err);
      console.log('delete game fail: ' + socket.id + ' b/c ' + err);
    }
    function succeed() {
      socket.emit('delete game succeed');
      socket.broadcast.emit('deleted game', name);
      console.log('delete game succeed: ' + socket.id);
    }

    server.deleteRoom(socket, function (err, name) {
      if (err) fail(err);
      else succeed();
    });
  });
  socket.on('join game', function (name) {
    function fail(err) {
      socket.emit('join game fail', err);
      console.log('join game fail: ' + socket.id + ' b/c ' + err);
    }
    function succeed() {
      socket.emit('join game succeed');
      socket.broadcast.emit('updated game', name, socket.id);
      console.log('join game succeed: ' + socket.id);
    }

    server.joinRoom(socket, name, function (err) {
      if (err) fail(err);
      else succeed();
    });
  });
  socket.on('leave game', function () {
    function fail(err) {
      socket.emit('leave game fail', err);
      console.log('leave game fail: ' + socket.id + ' b/c ' + err);
    }
    function succeed(name) {
      socket.emit('leave game succeed');
      socket.broadcast.emit('updated game', name, null);
      console.log('leave game succeed: ' + socket.id);
    }

    server.leaveRoom(socket, function (err, name) {
      if (err) fail(err);
      else succeed(name);
    });
  });
  socket.on('all games', function () {
    socket.emit('all games', server.rooms);
    console.log('all games: ' + socket.id);
  });
}