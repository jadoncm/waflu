'use strict';

var UIGroup = function(game, parent) {
    Phaser.Group.call(this, game, parent);
    this.game.UI_WIDTH = 300;

    this.x = 800;
    this.y = 0;

    this.graphics = this.game.add.graphics(0, 0, this);
    this.graphics.beginFill(0x556270);
    this.graphics.drawRect(0, 0, this.game.UI_WIDTH, this.game.PLAY_HEIGHT);

    this.initColorPicker();

    this.initInfo();
};

UIGroup.prototype = Object.create(Phaser.Group.prototype);
UIGroup.prototype.constructor = UIGroup;

UIGroup.prototype.initColorPicker = function() {
    this.colorBitmap = this.game.make.bitmapData(this.game.UI_WIDTH, this.game.UI_WIDTH);
    this.colorBitmap.draw('colors', 25, 25, this.game.UI_WIDTH - 50, this.game.UI_WIDTH - 50);
    this.colorBitmap.update();
    this.colorImage = this.colorBitmap.addToWorld(this.game.PLAY_WIDTH, 0);

    this.tooltip = this.game.make.bitmapData(64, 64);
    this.tooltipSprite = this.game.add.sprite(0, 0, this.tooltip);
    this.tooltipSprite.visible = false;
}

UIGroup.prototype.updateTooltip = function() {
    var mousePos = this.game.input.mousePointer.position;
    var color = this.getColor();
    if (color.a) {
    	this.tooltipSprite.visible = true;
    	this.tooltip.fill(0, 0, 0);
    	this.tooltip.rect(1, 1, 62, 62, color.rgba);
	
    	this.tooltipSprite.x = mousePos.x - 32;
    	this.tooltipSprite.y = mousePos.y - 32;
    } else {
    	this.tooltipSprite.visible = false;
    }
}

UIGroup.prototype.getColor = function() {
    var mousePos = this.game.input.mousePointer.position;
    return this.colorBitmap.getPixelRGB(Math.floor(mousePos.x) - this.game.PLAY_WIDTH,
					Math.floor(mousePos.y));
}

UIGroup.prototype.update = function() {
    var mousePos = this.game.input.mousePointer.position;

    if (this.selectingColor()) {
	this.updateTooltip();
    } else {
        this.tooltipSprite.visible = false;
    }
}

UIGroup.prototype.selectingColor = function() {
    var mousePos = this.game.input.mousePointer.position;
    return mousePos.x >= this.game.PLAY_WIDTH &&
	mousePos.x < this.game.PLAY_WIDTH + this.game.UI_WIDTH &&
	mousePos.y >= 0 &&
	mousePos.y < this.game.UI_WIDTH;
}

UIGroup.prototype.initInfo = function() {
    this.info = this.game.add.group(this);
    this.info.pp = this.game.add.bitmapText(this.game.UI_WIDTH / 2, 300, 'minecraftia',
                                            "",
                                            20,
                                            this.info);
    this.info.pp.anchor.set(0.5, 0);
}

UIGroup.prototype.updateInfo = function(pp) {
    this.info.pp.text = "Paint Points: " + pp;
}

module.exports = UIGroup;
