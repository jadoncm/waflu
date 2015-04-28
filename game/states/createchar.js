'use strict';
function Createchar() {}

Createchar.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '50px Arial', fill: '#ffffff', align: 'center'};
    $('#username-container').hide();
    this.titleText = this.game.add.text(this.game.world.centerX, 300, 'What did you look like?', style);
    this.titleText.anchor.setTo(0.5, 0.5);
  },
  update: function() {
  }
};

module.exports = Createchar;