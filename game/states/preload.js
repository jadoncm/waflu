
'use strict';
function Preload() {
    this.asset = null;
    this.ready = false;
}

Preload.prototype = {
    preload: function() {
	$('#username-container').hide();
	this.asset = this.add.sprite(this.width/2, this.height/2, 'preloader');
	this.asset.anchor.setTo(0.5, 0.5);

	this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
	this.load.setPreloadSprite(this.asset);

	this.load.script('filterX', 'https://cdn.rawgit.com/photonstorm/phaser/master/filters/BlurX.js');
	this.load.script('filterY', 'https://cdn.rawgit.com/photonstorm/phaser/master/filters/BlurY.js');
	this.load.script('threshold', 'assets/threshold.js');

	this.load.image('colors', 'assets/colors.png');
	this.load.image('startButton', 'assets/button_blank_gray_01.png');
	this.load.image('fireArrow', 'assets/fire-arrow.png');
	this.load.image('background', 'assets/background.jpg');
	this.load.spritesheet('warrior', 'assets/warrior.png', 64, 64, 273);

	this.load.bitmapFont('minecraftia', 'assets/minecraftia.png', 'assets/minecraftia.fnt');
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
