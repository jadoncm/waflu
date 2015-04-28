// ALL CODE FOR WHEN A NEW CLIENT CONNECTS GOES IN THIS FILE

module.exports = function(server, socket) {
  
  socket.room = null;
  socket.name = socket.id;

  socket.emitAllNames = function(broadcast) {
    var names = {};
    for (var key in server.sockets) {
      s = server.sockets[key];
      names[s.id] = s.name;
    }
    if (typeof broadcast == 'undefined')
      this.emit('all names', names);
    else 
      this.broadcast.emit('all names', names);
    console.log('all names: ' + this.id);
  }
  socket.emitAllNames(true);

  socket.on('disconnect', function () {
    server.deleteRoom(socket, function() {
      server.leaveRoom(socket, function() {});
    });

    console.log('user disconnected: ' + socket.id);
  });

  socket.on('error', function (err) {
    console.dir(err);
  });

  console.log('new user connected: ' + socket.id);
}