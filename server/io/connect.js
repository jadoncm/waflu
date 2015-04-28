// ALL CODE FOR WHEN A NEW CLIENT CONNECTS GOES IN THIS FILE

module.exports = function(server, socket) {
  
  socket.room = null;
  socket.name = socket.id;

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