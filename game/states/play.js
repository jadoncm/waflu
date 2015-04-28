'use strict';

var Particle = require('../prefabs/particle');

function Play() {}
Play.prototype = {
    create: function() {
	this.game.physics.startSystem(Phaser.Physics.P2JS);

	this.game.physics.p2.setImpactEvents(true);
	// this.game.physics.p2.gravity.y = 300;

	this.spriteMaterial = this.game.physics.p2.createMaterial('spriteMaterial');
	this.worldMaterial = this.game.physics.p2.createMaterial('worldMaterial');
	this.contactMaterial = this.game.physics.p2.createContactMaterial(this.spriteMaterial, this.worldMaterial, { restitution: 1.0 });

	this.game.physics.p2.setWorldMaterial(this.worldMaterial);

	this.player1CG = this.game.physics.p2.createCollisionGroup();
	this.player2CG = this.game.physics.p2.createCollisionGroup();
	this.game.physics.p2.updateBoundsCollisionGroup();

	this.particles = this.game.add.group();
	this.shift = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
	
	this.mouseBody = this.game.add.sprite(100, 100);
	this.mouseSpring = null;
	this.game.physics.p2.enable(this.mouseBody, true);
	this.mouseBody.body.static = true;
	this.mouseBody.body.setCircle(10);
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
	threshold.threshold = 1;

	this.graphics.filters = [blurX, blurY, threshold];
    },
    click: function (pointer) {
	var bodies = this.game.physics.p2.hitTest(pointer.position, this.particles.children);
	if (bodies.length) {
	    this.dragging = true;
	    this.mouseSpring = this.game.physics.p2.createSpring(this.mouseBody, bodies[0], 0, 5, 1);
	}
    },
    release: function () {
	this.dragging = false;
	this.game.physics.p2.removeSpring(this.mouseSpring);
    },
    update: function() {
	var bodies = this.game.physics.p2.hitTest(this.game.input.mousePointer.position, this.particles.children);
	if (this.game.input.mousePointer.isDown && !bodies.length && !this.dragging) {
	    if (this.shift.isDown)
		this.particles.add(new Particle(this.game, this.game.input.mousePointer.position.x, this.game.input.mousePointer.position.y, this.particles.total + 1, "player1", this.spriteMaterial, this.player1CG, this.player2CG));
	    else
		this.particles.add(new Particle(this.game, this.game.input.mousePointer.position.x, this.game.input.mousePointer.position.y, this.particles.total + 1, "player2", this.spriteMaterial, this.player2CG, this.player1CG));
	}

	this.graphics.clear();
	this.graphics.beginFill(0x000000, 1);
	this.graphics.drawRect(0, 0, 800, 800);
	this.graphics.beginFill(0xFFFFFF, 1);
	this.particles.forEach(function(particle) {
	    this.graphics.drawEllipse(particle.x, particle.y, 8, 8);

	    var sprite;
	    var maxDist = 64;
	    for (var i = 0; i < particle.connections.length; i++) {
		sprite = particle.connections[i].sprite;
		if (Math.sqrt(Math.pow(sprite.x - particle.x, 2) + Math.pow(sprite.x - particle.x, 2)) > maxDist) {
		    this.game.physics.p2.removeSpring(particle.connections[i].spring);
		    particle.connections.splice(i, 1);
		}
	    }
	}, this, true);
    },
};

module.exports = Play;
