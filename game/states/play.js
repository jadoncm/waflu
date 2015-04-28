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
    },
    update: function() {
	if (this.game.input.mousePointer.isDown) {
	    if (this.shift.isDown)
		this.particles.add(new Particle(this.game, this.game.input.mousePointer.position.x, this.game.input.mousePointer.position.y, this.particles.total + 1, "player1", this.spriteMaterial, this.player1CG, this.player2CG));
	    else
		this.particles.add(new Particle(this.game, this.game.input.mousePointer.position.x, this.game.input.mousePointer.position.y, this.particles.total + 1, "player2", this.spriteMaterial, this.player2CG, this.player1CG));
	}

	this.particles.forEach(function(particle) {
	    var sprite;
	    for (var i = 0; i < particle.connections.length; i++) {
		sprite = particle.connections[i].sprite;
		if (Math.sqrt(Math.pow(sprite.x - particle.x, 2) + Math.pow(sprite.x - particle.x, 2)) > 40) {
		    this.game.physics.p2.removeSpring(particle.connections[i].spring);
		    particle.connections.splice(i, 1);
		}
	    }
	}, this, true)
    },
};

module.exports = Play;
