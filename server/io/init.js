// Code run to set up the server

module.exports = function (server) {

  console.log('initializing server');

  // Rooms n shit
  server.rooms = {};

  server.createRoom = function(socket, name, callback) {
    if (socket.room) {
      callback('already in a game'); return;
    }
    if (name in server.rooms) {
      callback('name taken'); return;
    }
    if (!name) {
      callback('name invalid'); return;
    }

    server.rooms[name] = {
      host: socket.id,
      guest: null
    };
    socket.room = name;

    callback(null);
  }
  server.deleteRoom = function(socket, callback) {
    if (!socket.room) {
      callback('not in a game'); return;
    }
    if (!(socket.room in server.rooms)) {
      callback('nonexistent game'); return;
    }
    if (server.rooms[socket.room].host != socket.id) {
      callback('not your game'); return;
    }

    var name = socket.room;
    socket.room = null;
    if (server.rooms[name].guest != null)
      server.rooms[name].guest.room = null;
    delete server.rooms[name];

    callback(null, name);
  }
  server.joinRoom = function(socket, name, callback) {
    if (socket.room) {
      callback('already in a game'); return;
    }
    if (!(name in server.rooms)) {
      callback('nonexistent room'); return;
    }

    var room = server.rooms[name];
    if (room.guest != null) {
      callback('game full'); return;
    }

    room.guest = socket.id;
    socket.room = name;

    callback(null);
  }
  server.leaveRoom = function(socket, callback) {
    if (!socket.room) {
      callback('not in a game'); return;
    }
    if (!(socket.room in server.rooms)) {
      callback('nonexistent game'); return;
    }
    if (server.rooms[socket.room].host == socket.id) {
      callback('delete room instead'); return;
    }
    if (server.rooms[socket.room].guest != socket.id) {
      callback('not your game'); return;
    }

    var name = socket.room;
    server.rooms[socket.room].guest = null;
    socket.room = null;

    callback(null, name);
  }
  server.startGame = function (socket, callback) {
    if (!socket.room) {
      callback('not in a game'); return;
    }
    var host = server.rooms[socket.room].host,
        guest = server.rooms[socket.room].guest;
    if (host != socket.id) {
      callback('only host can start game'); return;
    }
    if (!guest) {
      callback('need 2 players'); return;
    }
    if (typeof server.rooms[socket.room].started != 'undefined') {
      callback('game already started'); return;
    }

    server.sockets[host].join(socket.room);
    server.sockets[guest].join(socket.room);
    server.rooms[socket.room].started = true;

    callback(null);
  }
  server.endGame = function (socket, callback) {
    if (!socket.room) {
      callback('not in a game'); return;
    }
    if (typeof server.rooms[socket.room].started == 'undefined') {
      callback('game not started'); return;
    }

    var host = server.rooms[socket.room].host,
        guest = server.rooms[socket.room].guest;
    server.sockets[host].leave(socket.room);
    server.sockets[guest].leave(socket.room);
    delete server.rooms[socket.room].started;

    callback(null);
  }
}