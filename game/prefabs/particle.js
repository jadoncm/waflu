'use strict';

var Particle = function(game, x, y, id, color, material, fluidCG, warriorCG, arrowCG) {
    Phaser.Sprite.call(this, game, x, y);

    this.game.physics.p2.enable(this, false);
    
    this.color = color;
    Phaser.Color.RGBtoHSV(this.color.r, this.color.g, this.color.b, this.color);

    this.id = id;
    this.body.setMaterial(material);
    this.body.setCircle(this.game.PARTICLE_SIZE);
    this.body.setCollisionGroup(fluidCG);
    this.body.collides(fluidCG, this.collideParticle, this);
    this.body.collides(warriorCG, this.collideWarrior, this);
    this.body.collides(arrowCG, this.collideArrow, this);
    this.body.damping = 0.5;
    this.selected = false;

    this.connections = [];

    this.health = this.color.s*this.game.STAT_MAG;
    this.attack = this.color.h*this.game.STAT_MAG;

    this.body.damping = 1;
    var timer = this.game.time.create();
    timer.add(200, function () {
        this.body.damping = 0.5;
    }, this);
    timer.start();
};

Particle.prototype = Object.create(Phaser.Sprite.prototype);
Particle.prototype.constructor = Particle;

Particle.prototype.update = function() {
  // write your prefab's specific update code here
  
};

Particle.prototype.updateColor = function() {
    this.color.s = this.health/this.game.STAT_MAG;
    this.color.h = this.attack/this.game.STAT_MAG;
    Phaser.Color.HSVtoRGB(this.color.h, this.color.s, this.color.v, this.color);
}

Particle.prototype.hitWarrior = function(particleBody, warriorBody) {
    var particle = particleBody.sprite;
    var warrior = warriorBody.sprite;
    warrior.loseHealth(particle.attack);
    particle.destroy();
}

Particle.prototype.hitArrow = function(particleBody, arrowBody) {
    var particle = particleBody.sprite;
    var arrow = arrowBody.sprite;
    particle.loseHealth(arrow.attack);
    arrow.destroy();
}

Particle.prototype.collideParticle = function(body1, body2) {
    if (body1.sprite.id < body2.sprite.id) {
	this.connections.push({
	    sprite: body2.sprite,
	    spring: this.game.physics.p2.createSpring(body1, body2, 16, 8, 0.3)
	});
    }
}

Particle.prototype.loseHealth = function(damage) {
    this.health -= damage;
    if (this.health <= 0)
	this.destroy();
    else
	this.updateColor();
}

module.exports = Particle;
