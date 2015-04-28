'use strict';

var Particle = function(game, x, y, player, material, myCollisionGroup, otherCollisionGroup) {
    Phaser.Sprite.call(this, game, x, y, 'circle');

    this.game.physics.p2.enable(this, false);

    if (player === "player1")
	this.tint = 0xFF0000;
    else
	this.tint = 0x00FF00;

    this.body.setMaterial(material);
    this.body.setCircle(8);
    this.body.setCollisionGroup(myCollisionGroup);
    this.body.collides(otherCollisionGroup, this.collideOpponent, this);
    this.body.collides(myCollisionGroup);
};

Particle.prototype = Object.create(Phaser.Sprite.prototype);
Particle.prototype.constructor = Particle;

Particle.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

Particle.prototype.collideOpponent = function(body1, body2) {
    console.log("collide");
}

module.exports = Particle;
