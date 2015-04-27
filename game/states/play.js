'use strict';

var Particle = require('../prefabs/particle');

function Play() {}
Play.prototype = {
    create: function() {
	this.game.physics.startSystem(Phaser.Physics.P2JS);

	this.game.physics.p2.gravity.y = 300;

	this.spriteMaterial = this.game.physics.p2.createMaterial('spriteMaterial');
	this.worldMaterial = this.game.physics.p2.createMaterial('worldMaterial');
	this.contactMaterial = this.game.physics.p2.createContactMaterial(this.spriteMaterial, this.worldMaterial, { restitution: 1.0 });

	this.game.physics.p2.setWorldMaterial(this.worldMaterial);

	this.particles = this.game.add.group();
	for (var i = 0; i < 100; i++) {
	    this.particles.add(new Particle(this.game, Math.floor(800*Math.random()), Math.floor(800*Math.random()), this.spriteMaterial));
	}
    },
    update: function() {

    },
};

module.exports = Play;
