'use strict';

var Particle = function(game, x, y, material) {
    Phaser.Sprite.call(this, game, x, y, 'circle');

    this.game.physics.p2.enable(this);
    this.body.setMaterial(material);
};

Particle.prototype = Object.create(Phaser.Sprite.prototype);
Particle.prototype.constructor = Particle;

Particle.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

module.exports = Particle;
