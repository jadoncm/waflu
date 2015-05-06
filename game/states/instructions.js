'use strict';

function Instructions() {}

Instructions.prototype = {
  preload: function() {

  },
  create: function() { 
      this.game.add.image(0, 0, 'instructions');

      this.play =
          this.game.add.button(this.game.width/2, 600, 'play',
                               function() { this.game.state.start('play'); }, this,
                               1, 0, 2, 1);
      this.play.anchor.set(0.5, 0.5);
  },
  update: function() {
  }
};

module.exports = Instructions;
