'use strict';

var Particle = function(game, x, y, id, player, material, myCollisionGroup, otherCollisionGroup) {
    Phaser.Sprite.call(this, game, x, y);

    this.game.physics.p2.enable(this, false);
    
    this.id = id;
    this.body.setMaterial(material);
    this.body.setCircle(8);
    this.body.setCollisionGroup(myCollisionGroup);
    this.body.collides(otherCollisionGroup, this.collideOpponent, this);
    this.body.collides(myCollisionGroup, this.collideOwn, this);
    this.body.damping = 0.5;

    this.connections = [];
};

Particle.prototype = Object.create(Phaser.Sprite.prototype);
Particle.prototype.constructor = Particle;

Particle.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

Particle.prototype.collideOpponent = function(body1, body2) {
    console.log("collide");
}

Particle.prototype.collideOwn = function(body1, body2) {
    if (body1.sprite.id < body2.sprite.id) {
	this.connections.push({
	    sprite: body2.sprite,
	    spring: this.game.physics.p2.createSpring(body1, body2, 16, 8, 0.3)
	});
    }
}

module.exports = Particle;
