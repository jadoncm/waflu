'use strict';

var Particle = require('../prefabs/particle');

function Play() {}
Play.prototype = {
    create: function() {
	this.game.PARTICLE_SIZE = 8;

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

	this.color = 0xFFFFFF;
	this.particles = this.game.add.group();
	this.shift = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
	this.z = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
	
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

	this.colorBitmap = this.game.make.bitmapData(800, 800);
	this.colorBitmap.draw('colors', 35, 35);
	this.colorBitmap.update();
	this.colorImage = this.colorBitmap.addToWorld();

	this.tooltip = this.game.make.bitmapData(64, 64);
	this.tooltipSprite = this.game.add.sprite(0, 0, this.tooltip);

	this.game.input.addMoveCallback(this.updateTooltip, this);
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
	    this.mouseSpring = this.game.physics.p2.createSpring(this.mouseBody, bodies[0], 0, 5, 1);
	}
    },

    release: function() {
	this.dragging = false;
	this.game.physics.p2.removeSpring(this.mouseSpring);
    },

    update: function() {
	var mousePos = this.game.input.mousePointer.position;

	if (this.z.isDown) {
	    if (this.game.input.mousePointer.isDown) {
		var color = this.colorBitmap.getPixelRGB(
		    Math.floor(mousePos.x), Math.floor(mousePos.y));
		this.color = Phaser.Color.getColor(color.r, color.g, color.b);
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
	    this.graphics.beginFill(particle.color, 1);
	    this.graphics.drawEllipse(particle.x, particle.y, this.game.PARTICLE_SIZE, this.game.PARTICLE_SIZE);

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
