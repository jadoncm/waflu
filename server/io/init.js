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
      host: socket,
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
    if (server.rooms[socket.room].host != socket) {
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

    room.guest = socket;
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
    if (server.rooms[socket.room].host == socket) {
      callback('delete room instead'); return;
    }
    if (server.rooms[socket.room].guest != socket) {
      callback('not your game'); return;
    }

    var name = socket.room;
    server.rooms[socket.room].guest = null;
    socket.room = null;

    callback(null, name);
  }
}