'use strict';
var FireArrow = require('../prefabs/fireArrow')

var Warrior = function(game, x, y, fluidCG, warriorCG, arrowCG, wallCG) {
    Phaser.Sprite.call(this, game, x, y, 'warrior');

    this.game.WARRIOR_VELOCITY = 300;
    this.game.WARRIOR_HEALTH = 10000;
    this.game.WARRIOR_SPEED = 200;
    this.health = this.game.WARRIOR_HEALTH;
    this.curDir = "D";
    this.shooting = false;
    this.anchor.setTo(0.5, 0.5);

    this.fluidCG = fluidCG;
    this.arrowCG = arrowCG;
    this.wallCG = wallCG;
    this.game.physics.p2.enable(this, false);
    this.body.setCircle(20);
    this.body.allowRotation = false;
    this.body.fixedRotation = true;
    this.body.setCollisionGroup(warriorCG);
    this.body.collides(fluidCG);
    
    this.animations.add('walkLeft', [117, 118, 119, 120, 121, 122, 123, 124, 125]);
    this.animations.add('walkRight', [143, 144, 145, 146, 147, 148, 149, 150, 151]);
    this.animations.add('walkUp', [104, 105, 106, 107, 108, 109, 110, 111, 112]);
    this.animations.add('walkDown', [130, 131, 132, 133, 134, 135, 136, 137, 138]);
    this.animations.add('shootLeft', [221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232]);
    this.animations.add('shootRight', [247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258]);
    this.animations.add('shootUp', [208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219]);
    this.animations.add('shootDown', [234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245]);

    this.fireArrows = this.game.add.group();
    
    this.score = 0;
    var timer = this.game.time.create();
    timer.loop(1000, function() {
        this.score++;
    }, this);
    timer.start();
};

Warrior.prototype = Object.create(Phaser.Sprite.prototype);
Warrior.prototype.constructor = Warrior;

Warrior.prototype.update = function() {
    this.rotation = 0;

    if (this.body.x < this.game.PAINT_BORDER + 28) {
    	this.body.x = this.game.PAINT_BORDER + 28;
    } else if (this.body.x > this.game.PLAY_WIDTH - this.game.PAINT_BORDER - 28) {
    	this.body.x = this.game.PLAY_WIDTH - this.game.PAINT_BORDER - 28;
    }

    if (this.body.y < this.game.PAINT_BORDER + 30) {
    	this.body.y = this.game.PAINT_BORDER + 30;
    } else if (this.body.y > this.game.PLAY_HEIGHT - this.game.PAINT_BORDER - 43) {
    	this.body.y = this.game.PLAY_HEIGHT - this.game.PAINT_BORDER - 43;
    }
};

Warrior.prototype.loseHealth = function(amount) {
    this.health -= amount;
    if (this.health <= 0) {
        this.game.state.start('gameover', true, false, this.score);
    }
}

Warrior.prototype.stop = function() {
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;

    if (!(this.animations.currentAnim.name.startsWith("shoot") &&
          this.animations.currentAnim.isPlaying)) {
        this.animations.stop();
        switch(this.curDir) {
        case "L":
            this.frame = 117;
            break;
        case "R":
            this.frame = 143;
            break;
        case "U":
        case "UL":
        case "UR":
            this.frame = 104;
            break;
        case "D":
        case "DL":
        case "DR":
            this.frame = 130;
            break;
        }
    }
}

Warrior.prototype.addArrow = function(){
    if (this.shooting)
        return;

    this.shooting = true;
    if(this.curDir == "U" || this.curDir == "UL" || this.curDir == "UR")
        this.animations.play('shootUp', 24, false);
    else if(this.curDir == "L")
        this.animations.play('shootLeft', 24, false);	
    else if(this.curDir == "R")
        this.animations.play('shootRight', 24, false);	
    else //shooting down or angled down
        this.animations.play('shootDown', 24, false);
    var timer = this.game.time.create();
    timer.add(300, function() {
        this.shooting = false;
    }, this);
    timer.start();

    this.fireArrows.add(new FireArrow(this.game, this.x, this.y, this.curDir, this.fluidCG, this.arrowCG, this.wallCG));
}

Warrior.prototype.move = function(direction) {
    this.curDir = direction;
    switch(direction) {
    case "L":
        this.body.velocity.x = -1 * this.game.WARRIOR_VELOCITY;
        break;
    case "R":
        this.body.velocity.x = this.game.WARRIOR_VELOCITY;
        break;
    case "U":
        this.body.velocity.y = -1 * this.game.WARRIOR_VELOCITY;
        break;
    case "D":
        this.body.velocity.y = this.game.WARRIOR_VELOCITY;
        break;
    case "UL":
        this.body.velocity.x = -1 * this.game.WARRIOR_VELOCITY / Math.sqrt(2);
        this.body.velocity.y = -1 * this.game.WARRIOR_VELOCITY / Math.sqrt(2);
        break;
    case "UR":
        this.body.velocity.x = this.game.WARRIOR_VELOCITY / Math.sqrt(2);
        this.body.velocity.y = -1 * this.game.WARRIOR_VELOCITY / Math.sqrt(2);
        break;
    case "DL":
        this.body.velocity.x = -1 * this.game.WARRIOR_VELOCITY / Math.sqrt(2);
        this.body.velocity.y = this.game.WARRIOR_VELOCITY / Math.sqrt(2);
        break;
    case "DR":
        this.body.velocity.x = this.game.WARRIOR_VELOCITY / Math.sqrt(2);
        this.body.velocity.y = this.game.WARRIOR_VELOCITY / Math.sqrt(2);
        break;
    }

    if (!(this.animations.currentAnim.name.startsWith("shoot") &&
          this.animations.currentAnim.isPlaying)) {
        switch(direction) {
        case "L":
            this.animations.play("walkLeft", 24, true);
            break;
        case "R":
            this.animations.play("walkRight", 24, true);
            break;
        case "U":
        case "UL":
        case "UR":
            this.animations.play("walkUp", 24, true);
            break;
        case "D":
        case "DL":
        case "DR":
            this.animations.play("walkDown", 24, true);
            break;
        }
    }
}


//for moving stuff later

/*	standing still shit
	if(this.warrior.curDir == "D" && !this.s.isDown && ){
	this.warrior.animations.play('stillDown', 4, true);
	}

	if(this.warrior.curDir == "U" && !this.w.isDown && ){
	this.warrior.animations.play('stillUp', 4, true);
	}

	if(this.warrior.curDir == "L" && !this.a.isDown){
	this.warrior.animations.play('stillLeft', 4, true);
	}

	if(this.warrior.curDir == "R" && !this.d.isDown){
	this.warrior.animations.play('stillRight', 4, true);
	} */

module.exports = Warrior;
