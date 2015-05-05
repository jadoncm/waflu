'use strict';

var Painter = function(game, parent) {
    Phaser.Group.call(this, game, parent);

    this.pp = 100*this.game.STAT_MAG;
    
};

Particle.prototype = Object.create(Phaser.Group.prototype);
Particle.prototype.constructor = Particle;

module.exports = Painter;
