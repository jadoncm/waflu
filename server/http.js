module.exports = function (config) {
  var app = require('express')(),
      http = require('http').Server(app),
      fs = require('fs'),
      jade = require('jade');

  function setup() {
    function compileViews() { // jade-compiles all the views for use
      server.view = {};

      fs.readdirSync(__dirname+'/views').forEach(function (name) {
        name = name.split('.');
        name.pop();
        name = name.join('.');
        server.view[name] = jade.compileFile(__dirname+'/views/'+name+'.jade');
      });
    }
    compileViews();
  }
  var server = this;
  setup();

  // app.get('/', function (req, res) {
  //   res.sendFile(__dirname + '/index.html');
  // });
  app.get('/console', function (req, res) {
    res.send(server.view['console']());
  });
  app.get('/assets/star.png', function (req, res) {
    res.sendFile(__dirname + '/star.png');
  });

  http.listen(config.httpport, function () {
    console.log('http listening on:' + config.httpport);
  });
}