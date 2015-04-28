'use strict';

var Particle = require('../prefabs/particle');

function Play() {}
Play.prototype = {
    create: function() {
	this.game.PARTICLE_SIZE = 16;

	this.game.physics.startSystem(Phaser.Physics.P2JS);

	this.game.physics.p2.setImpactEvents(true);

	this.spriteMaterial = this.game.physics.p2.createMaterial('spriteMaterial');
	this.worldMaterial = this.game.physics.p2.createMaterial('worldMaterial');
	this.contactMaterial = this.game.physics.p2.createContactMaterial(this.spriteMaterial, this.worldMaterial, { restitution: 1.0 });

	this.game.physics.p2.setWorldMaterial(this.worldMaterial);

	this.player1CG = this.game.physics.p2.createCollisionGroup();
	this.player2CG = this.game.physics.p2.createCollisionGroup();
	this.game.physics.p2.updateBoundsCollisionGroup();

	this.color = Phaser.Color.createColor(255, 255, 255);
	this.particles = this.game.add.group();
	this.shift = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
	this.z = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
	this.x = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
	this.c = this.game.input.keyboard.addKey(Phaser.Keyboard.C);
	
	this.mouseBody = this.game.add.sprite(100, 100);
	this.mouseSpring = null;
	this.dragSprings = [];
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
	blurX.blur = 40;
	var blurY = this.game.add.filter('BlurY');
	blurY.blur = 40;
	var threshold = this.game.add.filter('Threshold');
	threshold.threshold = 0.5;

	this.graphics.filters = [blurX, blurY, threshold];

	this.colorBitmap = this.game.make.bitmapData(800, 800);
	this.colorBitmap.draw('colors', 35, 35);
	this.colorBitmap.update();
	this.colorImage = this.colorBitmap.addToWorld();

	this.tooltip = this.game.make.bitmapData(64, 64);
	this.tooltipSprite = this.game.add.sprite(0, 0, this.tooltip);

	this.game.input.addMoveCallback(this.updateTooltip, this);

	this.selectedParticles = [];
    },

    updateTooltip: function(pointer, x, y) {
	if (this.z.isDown) {
	    var color = this.colorBitmap.getPixelRGB(Math.floor(x), Math.floor(y));
	    if (color.a) {
		this.tooltipSprite.visible = true;
		this.tooltip.fill(0, 0, 0);
		this.tooltip.rect(1, 1, 62, 62, color.rgba);
		
		this.tooltipSprite.x = x - 32;
		this.tooltipSprite.y = y - 32;

	    } else {
		this.tooltipSprite.visible = false;
	    }
	}
    },

    click: function(pointer) {
	var bodies = this.game.physics.p2.hitTest(pointer.position, this.particles.children);
	if (bodies.length) {
	    this.dragging = true;
	    this.mouseSpring = this.game.physics.p2.createSpring(this.mouseBody, bodies[0], 16, 5, 1);
	}

	if (this.selectedParticles.length) {
		this.dragging = true;
		for (var i = 0; i < this.selectedParticles.length; i++) {
			this.dragSprings.push(this.game.physics.p2.createSpring(this.mouseBody, this.selectedParticles[i], 16, 5, 1));
		}
	}

    },

    release: function() {
	this.dragging = false;
	this.game.physics.p2.removeSpring(this.mouseSpring);

	for (var i = 0; i < this.dragSprings.length; i++) {
		this.game.physics.p2.removeSpring(this.dragSprings[i]);
	}
	this.dragSprings = [];
    },

    update: function() {
	var mousePos = this.game.input.mousePointer.position;

	if (this.z.isDown) {
	    if (this.game.input.mousePointer.isDown) {
		this.color = this.colorBitmap.getPixelRGB(
		    Math.floor(mousePos.x), Math.floor(mousePos.y));
	    }
	    this.colorImage.visible = true;
	} else {
	    this.colorImage.visible = false;
	    this.tooltipSprite.visible = false;
	}

	var bodies = this.game.physics.p2.hitTest(mousePos, this.particles.children);
	if (this.game.input.mousePointer.isDown && !bodies.length && !this.dragging && !this.z.isDown) {
	    if (this.shift.isDown)
		this.particles.add(new Particle(this.game, mousePos.x, mousePos.y, this.particles.total + 1, "player1", this.color, this.spriteMaterial, this.player1CG, this.player2CG));
	    else
		this.particles.add(new Particle(this.game, mousePos.x, mousePos.y, this.particles.total + 1, "player2", this.color, this.spriteMaterial, this.player2CG, this.player1CG));
	}

	this.graphics.clear();
	this.graphics.beginFill(0x000000, 1);
	this.graphics.drawRect(0, 0, 800, 800);
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

	if (this.game.input.mousePointer.isDown) {
		if (this.x.isDown) {
			var bodies = this.game.physics.p2.hitTest(this.game.input.mousePointer.position, this.particles.children);
			if (bodies.length) {
				if (!bodies[0].selected) {
					bodies[0].selected = true;
					this.selectedParticles.push(bodies[0]);
				}
			}
		}
	}

	if (this.c.isDown) {
		for (var i = 0; i < this.selectedParticles.length; i++) {
			this.selectedParticles[i].selected = false;
		}
		this.selectedParticles = [];
	}
    },
};

module.exports = Play;
