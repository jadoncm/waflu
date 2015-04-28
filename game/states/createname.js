'use strict';
function Createname() {}

Create.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '50px Arial', fill: '#ffffff', align: 'center'};
    $('#username-container').show();
    this.titleText = this.game.add.text(this.game.world.centerX, 300, 'Warrior, what is your name?', style);
    this.titleText.anchor.setTo(0.5, 0.5);
    this.startButton = this.game.add.button(this.game.world.centerX, 600, 'startButton', this.startClick, this);
    this.startButton.anchor.setTo(0.5, 0.5);
  },
  startClick: function(){
    console.log("button clicked");
    console.log($('#username').val());
    var name = $('#username').val();
    global.setname = name;
    socket.emit('set name', name);
  },
  update: function() {
    socket.on('set name succeed', function(){
      this.game.state.start('createchar');
    });
    socket.on('set name fail', function(){
      console.log('name already taken');
    });
  }
};

module.exports = Createname;