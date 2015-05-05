'use strict';

var particles = {};

var Particle = function(game, x, y, id, color, material, fluidCG, warriorCG, arrowCG) {
    Phaser.Sprite.call(this, game, x, y);

    this.game.physics.p2.enable(this, false);
    
    this.color = color;

    this.id = id;
    particles[id] = this;
    this.particles = particles;
    this.body.setMaterial(material);
    this.body.setCircle(this.game.PARTICLE_SIZE);
    this.body.setCollisionGroup(fluidCG);
    this.body.collides(fluidCG, this.collideParticle, this);
    this.body.collides(warriorCG, this.collideWarrior, this);
    this.body.collides(arrowCG, this.collideArrow, this);
    this.body.damping = 0.5;
    this.selected = false;
    this.taggedToKill = false;

    this.connections = {};

    this.health = Math.floor(this.color.s*this.game.STAT_MAG);
    this.attack = Math.floor(this.color.h*this.game.STAT_MAG);

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

Particle.prototype.inBox = function () {
    if (this.body.x > this.game.PAINT_BORDER &&
        this.body.x < this.game.PLAY_WIDTH - this.game.PAINT_BORDER &&
        this.body.y > this.game.PAINT_BORDER &&
        this.body.y < this.game.PLAY_HEIGHT - this.game.PAINT_BORDER)
            return true;
    return false;
}

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
    if (!(body2.sprite.id in this.connections) && 
        !(this.id in body2.sprite.connections)) {
	   this.connections[body2.sprite.id] = this.game.physics.p2.createSpring(body1, body2, 16, 8, 0.3);
    }
}

Particle.prototype.deleteSpring = function(spriteid) {
    this.game.physics.p2.removeSpring(this.connections[spriteid]);
    delete this.connections[spriteid];
}
Particle.prototype.delete = function() {
    for (var spriteid in this.connections) {
        this.deleteSpring(spriteid);
        if (spriteid in particles) {
            var sprite = particles[spriteid];
            if (this.id in sprite.connections) {
                sprite.deleteSpring(this.id);
            }
        }
    }
    delete particles[this.id];
    this.destroy(true);
}

Particle.prototype.loseHealth = function(damage) {
    this.health -= damage;
    if (this.health <= 0)
	this.destroy();
    else
	this.updateColor();
}

module.exports = Particle;
