'use strict';

var Particle = require('../prefabs/particle');

var Painter = function(game, parent, material, fluidCG, warriorCG, arrowCG) {
    Phaser.Group.call(this, game, parent);

    this.pp = 100*this.game.STAT_MAG;
    this.color = Phaser.Color.createColor(255, 255, 255);
    this.fluidCG = fluidCG;
    this.warriorCG = warriorCG;
    this.arrowCG = arrowCG;

    this.initParticles();
};

Painter.prototype = Object.create(Phaser.Group.prototype);
Painter.prototype.constructor = Painter;

Painter.prototype.initParticles = function() {
    this.particles = this.game.add.group();
    this.selectedParticles = [];
    this.graphics = this.game.add.graphics();
    var blurX = this.game.add.filter('BlurX');
    blurX.blur = 20;
    var blurY = this.game.add.filter('BlurY');
    blurY.blur = 20;
    var threshold = this.game.add.filter('Threshold');
    threshold.threshold = 0.5;

    this.graphics.filters = [blurX, blurY, threshold];

    this.selectedGraphics = this.game.add.graphics();
};

Painter.prototype.update = function() {
    this.graphics.clear();
    this.graphics.beginFill(0x000000, 1);
    this.graphics.drawRect(0, 0, this.game.PLAY_WIDTH, this.game.PLAY_HEIGHT);
    this.particles.forEach(function(particle) {
	if (particle.inBox() && particle.body.velocity.x < 3 && particle.body.velocity.y < 3 && !particle.taggedToKill) {
	    particle.taggedToKill = true;
	    particle.killTimer = this.game.time.create();
	    particle.killTimer.add(this.game.KILL_TIME, function () {
		particle.destroy(true);
	    }, this);
	    particle.killTimer.start();
	    return;
	}

	this.graphics.beginFill(
	    Phaser.Color.getColor(particle.color.r, particle.color.g, particle.color.b),
	    1
	);
	this.graphics.drawEllipse(particle.x, particle.y, this.game.PARTICLE_SIZE, this.game.PARTICLE_SIZE);

	var sprite;
	var maxDist = 32;
	for (var i = 0; i < particle.connections.length; i++) {
	    sprite = particle.connections[i].sprite;
	    if (Math.sqrt(Math.pow(sprite.x - particle.x, 2) + Math.pow(sprite.x - particle.x, 2)) > maxDist) {
		this.game.physics.p2.removeSpring(particle.connections[i].spring);
		particle.connections.splice(i, 1);
	    }
	}
    }, this, true);

    this.selectedGraphics.clear();
    this.selectedGraphics.lineStyle(2, 0xFFFFFF);
    for (var i = 0; i < this.selectedParticles.length; i++) {
	var particle = this.selectedParticles[i];
	this.selectedGraphics.arc(particle.x, particle.y, this.game.PARTICLE_SIZE, 0, 2*Math.PI);
    }
}

Painter.prototype.velocityF = function(xDiff, yDiff) {
    var norm = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
    if (norm < 3) {
	return {x: 0, y: 0};
    } else {
	return {x: xDiff / norm * Math.min(norm, this.game.MAX_VELOCITY), y: yDiff / norm * Math.min(norm, this.game.MAX_VELOCITY)}
    }
};

Painter.prototype.move = function() {
    var mousePos = this.game.input.mousePointer.position;

    for (var i = 0; i < this.selectedParticles.length; i++) {
	// velocityF makes the velociuty scaling with pointer position nonlinear - bounded total velocity
	var addedVelocity = this.velocityF(this.selectedParticles[i].x - mousePos.x, this.selectedParticles[i].y - mousePos.y);

	this.selectedParticles[i].body.velocity.x -= addedVelocity.x;
	this.selectedParticles[i].body.velocity.y -= addedVelocity.y;
    }
};

Painter.prototype.add = function(x, y, color) {
    this.particles.add(
        new Particle(this.game, x, y,
                     this.particles.total + 1, this.color,
                     this.paintMaterial, this.fluidCG, this.warriorCG, this.arrowCG)
    );
}

Painter.prototype.select = function(particle) {
    particle.selected = true;
    this.selectedParticles.push(particle);
}

Painter.prototype.deselect = function() {
    for (var i = 0; i < this.selectedParticles.length; i++)
	this.selectedParticles[i].selected = false;
    this.selectedParticles = [];
}

Painter.prototype.setColor = function(color) {
    if (color.a)
        this.color = color;
}

module.exports = Painter;
