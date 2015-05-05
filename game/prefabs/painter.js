'use strict';

var Particle = require('../prefabs/particle');

var Painter = function(game, parent, material, fluidCG, warriorCG, arrowCG) {
    Phaser.Group.call(this, game, parent);

    this.counter = 0;
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
    this.selectedParticles = {};
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
            particle.selected = false;
            delete this.selectedParticles[particle.id];
            particle.delete();
            return;
        }

        if (particle.inBox()) {
            particle.selected = false;
            delete this.selectedParticles[particle.id];
            if (particle.body.velocity.x < 0.1 && particle.body.velocity.y < 0.1 && particle.killable) {
                particle.delete();
                return;
            }
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

    var p;
    for (var particle1 in this.selectedParticles) {
        p = this.selectedParticles[particle1];
        this.selectedGraphics.arc(p.x, p.y, this.game.PARTICLE_SIZE, 0, 2 * Math.PI);
    }
}

Painter.prototype.velocityF = function(xDiff, yDiff) {
    var norm = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
    if (norm < 3) {
    	return {x: 0, y: 0};
    } else {
    	return {x: xDiff / norm * Math.min(norm, this.game.MAX_VELOCITY) * 4, y: yDiff / norm * Math.min(norm, this.game.MAX_VELOCITY) * 4}
    }
};

Painter.prototype.move = function() {
    var mousePos = this.game.input.mousePointer.position;

    var p;
    for (var particle1 in this.selectedParticles) {
        p = this.selectedParticles[particle1];
        var addedVelocity = this.velocityF(p.x - mousePos.x, p.y - mousePos.y);
        p.body.velocity.x -= addedVelocity.x;
        p.body.velocity.y -= addedVelocity.y;
    }
};

Painter.prototype.add = function(x, y, color) {
    var cost = Math.floor(this.color.s*this.game.STAT_MAG) +
        Math.floor(this.color.h*this.game.STAT_MAG);
    if (this.pp >= cost) {
        var particle =
            new Particle(this.game, x, y,
                         this.counter + 1, JSON.parse(JSON.stringify(this.color)),
                         this.paintMaterial, this.fluidCG, this.warriorCG, this.arrowCG)
        this.pp -= particle.attack + particle.health;
        this.particles.add(particle);
        this.counter += 1;
    }
}

Painter.prototype.select = function(particle) {
    particle.selected = true;
    this.selectedParticles[particle.id] = particle;
}

Painter.prototype.deselect = function() {
    for (var particle1 in this.selectedParticles) {
        this.selectedParticles[particle1].selected = false;
    }
    this.selectedParticles = {};
}

Painter.prototype.setColor = function(color) {
    if (color.a) {
        this.color = color;
        Phaser.Color.RGBtoHSV(this.color.r, this.color.g, this.color.b, this.color);
    }
}

module.exports = Painter;
