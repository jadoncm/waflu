'use strict';

var UIGroup = function(game, parent) {
    Phaser.Group.call(this, game, parent);
    this.game.UI_WIDTH = 300;

    this.x = this.game.PLAY_WIDTH;
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
    this.info.y = 300;

    this.info.stats = this.game.add.group(this.info);
    this.info.stats.x = 80;
    this.info.health = this.game.add.bitmapText(80, 4, 'minecraftia',
                                                "",
                                                12,
                                                this.info.stats);
    this.info.attack = this.game.add.bitmapText(80, 24, 'minecraftia',
                                                "",
                                                12,
                                                this.info.stats);
    this.info.cost = this.game.add.bitmapText(80, 44, 'minecraftia',
                                              "",
                                              12,
                                              this.info.stats);
    this.infoGraphics = this.game.add.graphics(0, 0, this.info.stats);

    this.info.pp = this.game.add.bitmapText(this.game.UI_WIDTH / 2, 90, 'minecraftia',
                                            "",
                                            16,
                                            this.info);
    this.info.pp.anchor.set(0.5, 0);


}

UIGroup.prototype.updateInfo = function(pp, color) {
    this.info.pp.text = "Paint Points: " + pp;

    var health = Math.floor(color.s*this.game.STAT_MAG);
    var attack = Math.floor(color.h*this.game.STAT_MAG);
    this.info.health.text = "Health: " + health;
    this.info.attack.text = "Attack: " + attack;
    this.info.cost.text = "Cost: " + (health+attack);

    this.infoGraphics.beginFill(Phaser.Color.getColor(
        color.r,
        color.g,
        color.b
    ));
    this.infoGraphics.lineStyle(1, 0x000000);
    this.infoGraphics.drawRect(0, 0, 64, 64);
}

module.exports = UIGroup;
