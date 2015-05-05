'use strict';

var Particle = require('../prefabs/particle');
var UIGroup = require('../prefabs/UIGroup');

function Play() {}
Play.prototype = {
    create: function() {
	this.color = Phaser.Color.createColor(255, 255, 255);
	this.game.PARTICLE_SIZE = 8;
	this.game.MAX_VELOCITY = 40;
	this.game.STAT_MAG = 100;

	this.game.physics.startSystem(Phaser.Physics.P2JS);

	this.game.physics.p2.setImpactEvents(true);

	this.ui = new UIGroup(this.game);

	this.spriteMaterial = this.game.physics.p2.createMaterial('spriteMaterial');
	this.worldMaterial = this.game.physics.p2.createMaterial('worldMaterial');
	this.contactMaterial = this.game.physics.p2.createContactMaterial(this.spriteMaterial, this.worldMaterial, { restitution: 1.0 });

	this.game.physics.p2.setWorldMaterial(this.worldMaterial);

	this.fluidCG = this.game.physics.p2.createCollisionGroup();
	this.arrowCG = this.game.physics.p2.createCollisionGroup();
	this.warriorCG = this.game.physics.p2.createCollisionGroup();
	this.game.physics.p2.updateBoundsCollisionGroup();

	this.particles = this.game.add.group();
	this.shift = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
	this.z = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
	this.x = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
	this.c = this.game.input.keyboard.addKey(Phaser.Keyboard.C);
	this.v = this.game.input.keyboard.addKey(Phaser.Keyboard.V);
	
	this.mouseBody = this.game.add.sprite(100, 100);
	// mousePos = {x: 0, y: 0};
	this.dragSprings = [];
	this.game.physics.p2.enable(this.mouseBody, true);
	this.mouseBody.body.static = true;
	this.mouseBody.body.setCircle(this.game.PARTICLE_SIZE);
	this.mouseBody.body.data.shapes[0].sensor = true;
	this.game.input.addMoveCallback(function (pointer, x, y, isDown) {
	    this.mouseBody.body.x = x;
	    this.mouseBody.body.y = y;
	}, this);

	this.game.input.onDown.add(this.click, this);
	this.game.input.onUp.add(this.release, this);

	this.dragging = false;

	this.graphics = this.game.add.graphics();
	var blurX = this.game.add.filter('BlurX');
	blurX.blur = 20;
	var blurY = this.game.add.filter('BlurY');
	blurY.blur = 20;
	var threshold = this.game.add.filter('Threshold');
	threshold.threshold = 0.5;

	this.graphics.filters = [blurX, blurY, threshold];



	this.selectedParticles = [];
	this.selectedGraphics = this.game.add.graphics();
    },

    velocityF: function(xDiff, yDiff) {
	var norm = Math.sqrt(Math.pow(xDiff, 2) + Math.pow(yDiff, 2));
	if (norm < 3) {
	    return {x: 0, y: 0};
	} else {
	    return {x: xDiff / norm * Math.min(norm, this.game.MAX_VELOCITY), y: yDiff / norm * Math.min(norm, this.game.MAX_VELOCITY)}
	}
    },

    click: function(pointer) {
	var mousePos = this.game.input.mousePointer.position;
	if (this.insideSquare) {
	    // move particles and deselect them
	    this.selecting = false;
	    for (var i = 0; i < this.selectedParticles.length; i++) {
		this.selectedParticles[i].selected = false;

		// velocityF makes the velociuty scaling with pointer position nonlinear - bounded total velocity
		var addedVelocity = this.velocityF(this.selectedParticles[i].parent.sprite.x - mousePos.x, this.selectedParticles[i].parent.sprite.y - mousePos.y);
		this.selectedParticles[i].velocity[0] += addedVelocity.x;
		this.selectedParticles[i].velocity[1] += addedVelocity.y;
		console.log(addedVelocity);
	    }
	    this.selectedParticles = [];
	} else {
	    // select some particles, or deselect if clicking off a particle
	    var bodies = this.game.physics.p2.hitTest(mousePos, this.particles.children);
	    if (bodies.length == 0) {
		this.selecting = false;
		for (var i = 0; i < this.selectedParticles.length; i++) {
		    this.selectedParticles[i].selected = false;
		}
		this.selectedParticles = [];
	    } else {
		this.selecting = true;
	    }
	}

    },

    release: function() {
	this.selecting = false;
    },

    update: function() {
	var mousePos = this.game.input.mousePointer.position;
	mousePos.x = Math.floor(mousePos.x);
	mousePos.y = Math.floor(mousePos.y);
	var mouseDown = this.game.input.mousePointer.isDown;
	this.insideSquare = false;
	if (mousePos.x > 150 && mousePos.x < 650)
	    if (mousePos.y > 150 && mousePos.y < 650)
		this.insideSquare = true;

	if (mouseDown) {
	    var bodies = this.game.physics.p2.hitTest(mousePos, this.particles.children);
	    if (this.selecting) {
		if (mouseDown && bodies.length && !bodies[0].selected) {
		    bodies[0].selected = true;
		    this.selectedParticles.push(bodies[0]);
		}
	    }
	}
	var bodies = this.game.physics.p2.hitTest(mousePos, this.particles.children);
	if (this.c.isDown) {
	    if (mouseDown && bodies.length && !bodies[0].selected) {
		bodies[0].selected = true;
		this.selectedParticles.push(bodies[0]);
	    }
	}

	if (this.v.isDown) {
	    for (var i = 0; i < this.selectedParticles.length; i++) {
		this.selectedParticles[i].selected = false;
	    }
	}

	if (mouseDown && !this.insideSquare && !this.selecting) {
	    this.particles.add(new Particle(this.game, mousePos.x, mousePos.y, this.particles.total + 1, this.color, this.spriteMaterial, this.fluidCG, this.warriorCG, this.arrowCG));
	}

	this.graphics.clear();
	this.graphics.beginFill(0x000000, 1);
	this.graphics.drawRect(0, 0, 800, 1100);
	this.particles.forEach(function(particle) {
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
	    var particle = this.selectedParticles[i].parent.sprite;
	    this.selectedGraphics.arc(particle.x, particle.y, this.game.PARTICLE_SIZE, 0, 2*Math.PI);
	}
    }
};
    
module.exports = Play;
