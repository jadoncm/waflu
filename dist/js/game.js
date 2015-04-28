(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 800, Phaser.AUTO, 'fluwa');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":3,"./states/gameover":4,"./states/menu":5,"./states/play":6,"./states/preload":7}],2:[function(require,module,exports){
'use strict';

var Particle = function(game, x, y, id, player, material, myCollisionGroup, otherCollisionGroup) {
    Phaser.Sprite.call(this, game, x, y);

    this.game.physics.p2.enable(this, false);
    
    this.id = id;
    this.body.setMaterial(material);
    this.body.setCircle(8);
    this.body.setCollisionGroup(myCollisionGroup);
    this.body.collides(otherCollisionGroup, this.collideOpponent, this);
    this.body.collides(myCollisionGroup, this.collideOwn, this);

    this.connections = [];
};

Particle.prototype = Object.create(Phaser.Sprite.prototype);
Particle.prototype.constructor = Particle;

Particle.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

Particle.prototype.collideOpponent = function(body1, body2) {
    console.log("collide");
}

Particle.prototype.collideOwn = function(body1, body2) {
    if (body1.sprite.id < body2.sprite.id) {
	this.connections.push({
	    sprite: body2.sprite,
	    spring: this.game.physics.p2.createSpring(body1, body2, 16, 8, 0.3)
	});
    }
}

module.exports = Particle;

},{}],3:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
  },
  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],4:[function(require,module,exports){

'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
  },
  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};
module.exports = GameOver;

},{}],5:[function(require,module,exports){

'use strict';
function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.sprite = this.game.add.sprite(this.game.world.centerX, 138, 'yeoman');
    this.sprite.anchor.setTo(0.5, 0.5);

    this.titleText = this.game.add.text(this.game.world.centerX, 300, '\'Allo, \'Allo!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.instructionsText = this.game.add.text(this.game.world.centerX, 400, 'Click anywhere to play "Click The Yeoman Logo"', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionsText.anchor.setTo(0.5, 0.5);

    this.sprite.angle = -20;
    this.game.add.tween(this.sprite).to({angle: 20}, 1000, Phaser.Easing.Linear.NONE, true, 0, 1000, true);
  },
  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],6:[function(require,module,exports){
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
	    var maxDist = 32;
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

},{"../prefabs/particle":2}],7:[function(require,module,exports){

'use strict';
function Preload() {
    this.asset = null;
    this.ready = false;
}

Preload.prototype = {
    preload: function() {
	this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
	this.asset.anchor.setTo(0.5, 0.5);

	this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
	this.load.setPreloadSprite(this.asset);

	this.load.script('filterX', 'https://cdn.rawgit.com/photonstorm/phaser/master/filters/BlurX.js');
	this.load.script('filterY', 'https://cdn.rawgit.com/photonstorm/phaser/master/filters/BlurY.js');
	this.load.script('threshold', 'assets/threshold.js');
    },
    create: function() {
	this.asset.cropEnabled = false;
    },
    update: function() {
	if(!!this.ready) {
	    this.game.state.start('play');
	}
    },
    onLoadComplete: function() {
	this.ready = true;
    }
};

module.exports = Preload;

},{}]},{},[1])