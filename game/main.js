'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 800, Phaser.AUTO, 'fluwa');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('createchar', require('./states/createchar'));
  game.state.add('createname', require('./states/createname'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('play_alt', require('./states/play_alt'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};