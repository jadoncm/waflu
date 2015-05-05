'use strict';

var Painter = require('../prefabs/painter');
var UIGroup = require('../prefabs/UIGroup');

function Play() {}
Play.prototype = {
    create: function() {
	this.setConstants();
	this.initPhysics();
	this.initMouse();

	this.ui = new UIGroup(this.game);
	this.painter = new Painter(this.game, null, this.paintMaterial, this.fluidCG, this.warriorCG, this.arrowCG);
    },

    setConstants: function() {
	this.game.PARTICLE_SIZE = 8;
	this.game.MAX_VELOCITY = 40;
	this.game.STAT_MAG = 100;
	this.game.PLAY_WIDTH = 800;
	this.game.PLAY_HEIGHT = 800;
	this.game.KILL_TIME = 2500;  // in ms
    },

    initPhysics: function() {
	this.game.world.setBounds(0, 0, this.game.PLAY_WIDTH, this.game.PLAY_HEIGHT);
	this.game.physics.startSystem(Phaser.Physics.P2JS);
	this.game.physics.p2.setImpactEvents(true);

	this.paintMaterial = this.game.physics.p2.createMaterial('paintMaterial');
	this.worldMaterial = this.game.physics.p2.createMaterial('worldMaterial');
	this.contactMaterial = this.game.physics.p2.createContactMaterial(this.paintMaterial, this.worldMaterial, { restitution: 1.0 });
	this.game.physics.p2.setWorldMaterial(this.worldMaterial);

	this.fluidCG = this.game.physics.p2.createCollisionGroup();
	this.arrowCG = this.game.physics.p2.createCollisionGroup();
	this.warriorCG = this.game.physics.p2.createCollisionGroup();
	this.game.physics.p2.updateBoundsCollisionGroup();
    },

    initMouse: function() {
	this.mouseBody = this.game.add.sprite(100, 100);
	this.game.physics.p2.enable(this.mouseBody, false);
	this.mouseBody.body.static = true;
	this.mouseBody.body.setCircle(this.game.PARTICLE_SIZE);
	this.mouseBody.body.data.shapes[0].sensor = true;
	this.game.input.addMoveCallback(function (pointer, x, y, isDown) {
	    this.mouseBody.body.x = x;
	    this.mouseBody.body.y = y;
	}, this);

	this.game.input.onDown.add(this.click, this);
	this.game.input.onUp.add(this.release, this);
    },

    mouseHits: function() {
        var mousePos = this.game.input.mousePointer.position;
	return this.game.physics.p2.hitTest(mousePos, this.painter.particles.children);
    },

    click: function(pointer) {
	if (this.insideSquare) {
	    this.painter.move();
            this.selecting = false;
            this.painter.deselect();
	} else if (!this.mouseHits().length) {
            this.selecting = false;
            this.painter.deselect();
	} else {
	    this.selecting = true;
	}
    },

    release: function() {
	this.selecting = false;
    },

    checkInsideSquare: function() {
        var mousePos = this.game.input.mousePointer.position;
	this.insideSquare = false;
	if (mousePos.x > 150 && mousePos.x < 650)
	    if (mousePos.y > 150 && mousePos.y < 650)
		this.insideSquare = true;
    },

    update: function() {
	var mousePos = this.game.input.mousePointer.position;
	mousePos.x = Math.floor(mousePos.x);
	mousePos.y = Math.floor(mousePos.y);
	var mouseDown = this.game.input.mousePointer.isDown;

	this.ui.update();
        this.painter.update();

        this.checkInsideSquare();

        // select particles
        if (mouseDown && this.selecting) {
	    var bodies = this.mouseHits();
	    if (bodies.length && !bodies[0].selected) {
                this.painter.select(bodies[0].parent.sprite);
	    }
	}

        // drawing partiles
	if (mouseDown && !this.insideSquare && !this.selecting) {

            this.painter.add(mousePos.x, mousePos.y);
	}

	// this.graphics.lineStyle(10, 0xFFFFFF, 255);
	// this.graphics.moveTo(150, 150);
	// this.graphics.lineTo(150, 650);
	// this.graphics.moveTo(150, 650);
	// this.graphics.lineTo(650, 650);
	// this.graphics.moveTo(650, 650);
	// this.graphics.lineTo(650, 150);
	// this.graphics.moveTo(650, 150);
	// this.graphics.lineTo(150, 150);
    }
};

module.exports = Play;
