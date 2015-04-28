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

var Particle = function(game, x, y, player, material, myCollisionGroup, otherCollisionGroup) {
    Phaser.Sprite.call(this, game, x, y, 'circle');

    this.game.physics.p2.enable(this, false);

    if (player === "player1")
	this.tint = 0xFF0000;
    else
	this.tint = 0x00FF00;

    this.body.setMaterial(material);
    this.body.setCircle(8);
    this.body.setCollisionGroup(myCollisionGroup);
    this.body.collides(otherCollisionGroup, this.collideOpponent, this);
    this.body.collides(myCollisionGroup);
};

Particle.prototype = Object.create(Phaser.Sprite.prototype);
Particle.prototype.constructor = Particle;

Particle.prototype.update = function() {
  
  // write your prefab's specific update code here
  
};

Particle.prototype.collideOpponent = function(body1, body2) {
    console.log("collide");
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
	this.game.physics.p2.gravity.y = 300;

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
		this.particles.add(new Particle(this.game, this.game.input.mousePointer.position.x, this.game.input.mousePointer.position.y, "player1", this.spriteMaterial, this.player1CG, this.player2CG));
	    else
		this.particles.add(new Particle(this.game, this.game.input.mousePointer.position.x, this.game.input.mousePointer.position.y, "player2", this.spriteMaterial, this.player2CG, this.player1CG));
	}
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

    this.load.image('circle', 'assets/circle.png');

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