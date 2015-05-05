'use strict';

var UIGroup = function(game, parent) {
    Phaser.Group.call(this, game, parent);

    this.x = 800;
    this.y = 0;

    this.graphics = this.game.add.graphics(0, 0, this);
    this.graphics.beginFill(0x556270);
    this.graphics.drawRect(0, 0, 300, 800);

    this.color = Phaser.Color.createColor(255, 255, 255);

    this.colorBitmap = this.game.make.bitmapData(300, 300);
    this.colorBitmap.draw('colors', 25, 25, 250, 250);
    this.colorBitmap.update();
    this.colorImage = this.colorBitmap.addToWorld(800, 0);
    // 	    var color = this.colorBitmap.getPixelRGB(Math.floor(x), Math.floor(y));
    // 	    if (color.a) {
    // 		this.tooltipSprite.visible = true;
    // 		this.tooltip.fill(0, 0, 0);
    // 		this.tooltip.rect(1, 1, 62, 62, color.rgba);
		
    // 		this.tooltipSprite.x = x - 32;
    // 		this.tooltipSprite.y = y - 32;

    // 	    } else {
    // 		this.tooltipSprite.visible = false;
    // 	    }
    // 	this.tooltip = this.game.make.bitmapData(64, 64);
    // 	this.tooltipSprite = this.game.add.sprite(0, 0, this.tooltip);

    // 	this.game.input.addMoveCallback(this.updateTooltip, this);
    // 	if (this.z.isDown) {
    // 	    if (mouseDown) {
    // 		this.color = this.colorBitmap.getPixelRGB(
    // 		    Math.floor(mousePos.x), Math.floor(mousePos.y));
    // 	    }
    // 	} else {
    // 	    this.tooltipSprite.visible = false;
    // 	}


};

UIGroup.prototype = Object.create(Phaser.Group.prototype);
UIGroup.prototype.constructor = UIGroup;

module.exports = UIGroup;
