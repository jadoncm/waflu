'use strict';

var Painter = require('../prefabs/painter');
var UIGroup = require('../prefabs/UIGroup');
var Warrior = require('../prefabs/warrior');

function Play() {}
Play.prototype = {
    create: function() {
	this.setConstants();
	this.initPhysics();
	this.initMouse();
        this.initKey();
        this.bg = this.game.add.image(0, 0, 'background');
        this.bg.width = this.game.PLAY_WIDTH;
        this.bg.height = this.game.PLAY_HEIGHT;

	this.painter = new Painter(this.game, null, this.paintMaterial, this.fluidCG, this.warriorCG, this.arrowCG);
	this.warrior = new Warrior(this.game, this.game.PLAY_WIDTH / 2, this.game.PLAY_HEIGHT / 2, this.fluidCG, this.warriorCG, this.arrowCG, this.wallCG);
	this.game.add.existing(this.warrior);

        this.initBox();
        this.initWalls();

	this.ui = new UIGroup(this.game);
    this.started = this.game.time.time;
    },

    setConstants: function() {
	this.game.PARTICLE_SIZE = 8;
	this.game.MAX_VELOCITY = 100;
	this.game.STAT_MAG = 100;
	this.game.PLAY_WIDTH = 800;
	this.game.PLAY_HEIGHT = 800;
	this.game.KILL_TIME = 2500;  // in ms
        this.game.PAINT_BORDER = 150;
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
	this.wallCG = this.game.physics.p2.createCollisionGroup();
	this.game.physics.p2.updateBoundsCollisionGroup();
    },

    initMouse: function() {
	this.mouseBody = this.game.add.sprite(100, 100);
	this.game.physics.p2.enable(this.mouseBody, true);
	this.mouseBody.body.static = true;
	this.mouseBody.body.setCircle(this.game.PARTICLE_SIZE * 4);
	this.mouseBody.body.data.shapes[0].sensor = true;
	this.game.input.addMoveCallback(function (pointer, x, y, isDown) {
	    this.mouseBody.body.x = x;
	    this.mouseBody.body.y = y;
	}, this);

	this.game.input.onDown.add(this.click, this);
	this.game.input.onUp.add(this.release, this);

        this.insideSquare = false;
        this.insidePlay = true;
    },

    initKey: function() {
	this.w = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
	this.s = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
	this.a = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
	this.d = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
	this.shift = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
	this.space = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },

    initBox: function() {
        this.boxGraphics = this.game.add.graphics();
        this.boxGraphics.lineStyle(8, 0xFFFFFF);
        this.boxGraphics.drawRect(this.game.PAINT_BORDER, this.game.PAINT_BORDER,
                                  this.game.PLAY_WIDTH - 2*this.game.PAINT_BORDER,
                                  this.game.PLAY_HEIGHT - 2*this.game.PAINT_BORDER);
    },

    initWalls: function() {
	// this.game.physics.p2.updateBoundsCollisionGroup();
        // var right = this.game.add.sprite(this.game.PLAY_WIDTH - wallSize, 0)
        // right.width = wallSize;
        // right.height = this.game.PLAY_HEIGHT;

        // var top = this.game.add.sprite(0, 0)
        // top.width = this.game.PLAY_WIDTH;
        // top.height = wallSize;

        // var bottom = this.game.add.sprite(0, this.game.PLAY_HEIGHT - wallSize);
        // bottom.width = this.game.PLAY_WIDTH;
        // bottom.height = wallSize;

        // var walls = [left, right, top, bottom];
        // for (var i = 0; i < walls.length; i++) {
        //     this.game.physics.p2.enable(walls[i], true);
        //     walls[i].body.setCollisionGroup(this.wallCG);
	//     walls[i].body.static = true;
        // }

        // left.body.setRectangle(100, 100);
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
	if (mousePos.x > this.game.PAINT_BORDER &&
            mousePos.x < this.game.PLAY_WIDTH - this.game.PAINT_BORDER &&
            mousePos.y > this.game.PAINT_BORDER &&
            mousePos.y < this.game.PLAY_HEIGHT - this.game.PAINT_BORDER)
	    this.insideSquare = true;
    },

    checkInsidePlay: function() {
        var mousePos = this.game.input.mousePointer.position;
	this.insidePlay = false;
	if (mousePos.x >= 0 &&
            mousePos.x < this.game.PLAY_WIDTH &&
            mousePos.y >= 0 &&
            mousePos.y < this.game.PLAY_HEIGHT)
	    this.insidePlay = true;
    },

    update: function() {

	var mousePos = this.game.input.mousePointer.position;
	mousePos.x = Math.floor(mousePos.x);
	mousePos.y = Math.floor(mousePos.y);
	var mouseDown = this.game.input.mousePointer.isDown;

	this.checkInsidePlay();
	this.checkInsideSquare();

	// select particles
	if (mouseDown && this.selecting) {
	    var bodies = this.mouseHits();
	    if (bodies.length && !bodies[0].parent.sprite.selected) {
	        this.painter.select(bodies[0].parent.sprite);
	    }
	}

	// drawing particles
	if (mouseDown && !this.insideSquare && !this.selecting && this.insidePlay) {
	    this.painter.add(mousePos.x, mousePos.y);
	}

	// set color
	if (mouseDown && this.ui.selectingColor()) {
	    this.painter.setColor(this.ui.getColor());
	}

	this.ui.update();
	this.painter.update();
	this.ui.updateInfo(this.painter.pp, this.painter.color,
                           this.warrior.health, this.warrior.score);

	if (this.a.isDown){
	    this.warrior.move("L");
	}
	if (this.d.isDown){
	    this.warrior.move("R");
	}
	if (this.w.isDown){
	    if(this.a.isDown){
		this.warrior.move("UL");
	    }
	    else if(this.d.isDown){
		this.warrior.move("UR");
	    }
	    else{
		this.warrior.move("U");
	    }
	}
	if (this.s.isDown){
	    if(this.a.isDown){
		this.warrior.move("DL");
	    }
	    else if(this.d.isDown){
		this.warrior.move("DR");
	    }
	    else{
		this.warrior.move("D");
	    }
	}

	if (this.space.isDown){
	    this.warrior.addArrow();								
	}

        if (!(this.w.isDown || this.a.isDown || this.s.isDown || this.d.isDown))
            this.warrior.stop();
    }
};

module.exports = Play;
