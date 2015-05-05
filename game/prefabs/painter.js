'use strict';

var Particle = require('../prefabs/particle');

var Painter = function(game, parent, material, fluidCG, warriorCG, arrowCG) {
    Phaser.Group.call(this, game, parent);

    this.pp = 100*this.game.STAT_MAG;
    this.color = Phaser.Color.createColor(255, 255, 255);
    this.fluidCG = fluidCG;
    this.warriorCG = warriorCG;
    this.arrowCG = arrowCG;
    
    this.ppBoost = 10;
    var timer = this.game.time.create();
    timer.loop(50, function() {
        this.pp += this.ppBoost;
    }, this);
    timer.loop(10000, function() {
        this.ppBoost += 2;
    }, this);
    timer.start();
    

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
    	// if (particle.inBox() &&
     //        particle.body.velocity.x < 3 && particle.body.velocity.y < 3 &&
     //        !particle.taggedToKill) {

    	//     particle.taggedToKill = true;
    	//     particle.killTimer = this.game.time.create();
    	//     particle.killTimer.add(this.game.KILL_TIME, function () {
     //            particle.delete();
    	//     }, this);
    	//     particle.killTimer.start();
    	//     return;
    	// }

        if (particle.inBox() && particle.body.velocity.x < 0.1 && particle.body.velocity.y < 0.1 && particle.killable) {
            particle.delete();
            return;
        }

    	this.graphics.beginFill(Phaser.Color.getColor(
            particle.color.r, particle.color.g, particle.color.b
        ), 1);
    	this.graphics.drawEllipse(
            particle.x, particle.y,
            this.game.PARTICLE_SIZE, this.game.PARTICLE_SIZE
        );

    	var sprite;
    	var maxDist = 32;
        for (var spriteid in particle.connections) {
            var sprite = particle.particles[spriteid];
            if (typeof sprite == 'undefined') continue;

            var dist = Math.sqrt(Math.pow(sprite.x - particle.x, 2) + Math.pow(sprite.x - particle.x, 2));
            if (dist > maxDist) {
                particle.deleteSpring(sprite.id);
                sprite.deleteSpring(particle.id);
            }
        }
    }, this, true);

    this.selectedGraphics.clear();
    this.selectedGraphics.lineStyle(2, 0xFFFFFF);
    this.selectedParticles.forEach(function(particle) {
        this.selectedGraphics.arc(particle.x, particle.y, this.game.PARTICLE_SIZE, 0, 2*Math.PI);
    }, this, true);
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

    this.selectedParticles.forEach(function(particle) {
        // velocityF makes the velociuty scaling with pointer position nonlinear - bounded total velocity
        var addedVelocity = this.velocityF(particle.x - mousePos.x, particle.y - mousePos.y);

        particle.body.velocity.x -= addedVelocity.x;
        particle.body.velocity.y -= addedVelocity.y;
    }, this, true);
};

Painter.prototype.add = function(x, y, color) {
    var cost = Math.floor(this.color.s*this.game.STAT_MAG) +
        Math.floor(this.color.h*this.game.STAT_MAG);
    if (this.pp >= cost) {
        var particle =
            new Particle(this.game, x, y,
                         this.particles.total + 1, JSON.parse(JSON.stringify(this.color)),
                         this.paintMaterial, this.fluidCG, this.warriorCG, this.arrowCG)
        this.pp -= particle.attack + particle.health;
        this.particles.add(particle);
    }
}

Painter.prototype.select = function(particle) {
    particle.selected = true;
    this.selectedParticles.push(particle);
}

Painter.prototype.deselect = function() {
    this.selectedParticles.forEach(function (particle) {
        particle.selected = false;
    }, this, true);
    this.selectedParticles = [];
}

Painter.prototype.setColor = function(color) {
    if (color.a) {
        this.color = color;
        Phaser.Color.RGBtoHSV(this.color.r, this.color.g, this.color.b, this.color);
    }
}

module.exports = Painter;
