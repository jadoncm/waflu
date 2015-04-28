// Code run to set up the server

module.exports = function (server) {

  // Rooms n shit
  server.rooms = {};

  server.createRoom = function(socket, name, callback) {
    if (socket.room) callback('already in a game');
    if (name in server.rooms) callback('name taken');

    server.rooms[name] = {
      host: socket,
      guest: null
    };
    socket.room = name;

    callback(null);
  }
  server.deleteRoom = function(socket, callback) {
    if (!socket.room) callback('not in a game');
    if (!(socket.room in server.rooms)) callback('nonexistent game');
    if (server.rooms[socket.room].host != socket) callback('not your game');

    var name = socket.room;
    socket.room = null;
    server.rooms[name].guest.room = null;
    delete server.rooms[name];

    callback(null, name);
  }
  server.joinRoom = function(socket, name, callback) {
    if (socket.room) callback('already in a game');

    var room = socket.rooms[name];
    if (room.guest != null) callback('game full');

    room.guest = socket;
    socket.room = name;

    callback(null);
  }
  server.leaveRoom = function(socket, callback) {
    if (!socket.room) callback('not in a game');
    if (!(socket.room in server.rooms)) callback('nonexistent game');
    if (server.rooms[socket.room].host == socket)
      this.deleteRoom(socket, callback);
    if (server.rooms[socket.room].guest != socket) callback('not your game');

    var name = socket.room;
    server.rooms[socket.room].guest = null;
    socket.room = null;

    callback(null, name);
  }
}