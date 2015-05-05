'use strict';
var FireArrow = require('../prefabs/fireArrow')

var Warrior = function(game, x, y, fluidCG, warriorCG, arrowCG, wallCG) {
    Phaser.Sprite.call(this, game, x, y, 'warrior');

    this.game.WARRIOR_VELOCITY = 300;
    this.game.WARRIOR_HEALTH = 10000;
    this.health = this.game.WARRIOR_HEALTH;
    this.curDir = "D";
    this.lastShot = 0;
    //anchor
    this.anchor.setTo(0.5, 0.5);

    this.fluidCG = fluidCG;
    this.arrowCG = arrowCG;
    this.wallCG = wallCG;
    this.game.physics.p2.enable(this, true);
    this.body.setCircle(20);
    this.body.allowRotation = false;
    this.body.fixedRotation = true;
    this.body.setCollisionGroup(warriorCG);
    this.body.collides(fluidCG);
    
    this.animations.add('stillLeft', [169, 170, 171, 172, 173, 174], 6);
    this.animations.add('stillRight', [195, 196, 197, 198, 199, 200], 6);
    this.animations.add('stillUp', [156, 157, 158, 159, 160, 161], 6);
    this.animations.add('stillDown', [182, 183, 184, 185, 186, 187], 6);
    this.animations.add('walkLeft', [117, 118, 119, 120, 121, 122, 123, 124, 125], 9);
    this.animations.add('walkRight', [143, 144, 145, 146, 147, 148, 149, 150, 151], 9);
    this.animations.add('walkUp', [104, 105, 106, 107, 108, 109, 110, 111, 112], 9);
    this.animations.add('walkDown', [130, 131, 132, 133, 134, 135, 136, 137, 138], 9);
    this.animations.add('shootLeft', [221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233], 13);
    this.animations.add('shootRight', [247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258, 259], 13);
    this.animations.add('shootUp', [208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220], 13);
    this.animations.add('shootDown', [234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246], 13);
    this.animations.add('faint', [260, 261, 262, 163, 164, 165], 6);
    this.animations.add('nova', [39, 40, 41, 42, 43, 44, 45], 7);
    this.animations.play('stillDown', 4, true);

    this.fireArrows = this.game.add.group();
};

Warrior.prototype = Object.create(Phaser.Sprite.prototype);
Warrior.prototype.constructor = Warrior;

Warrior.prototype.update = function() {
    this.rotation = 0;
};

Warrior.prototype.loseHealth = function(amount) {
    this.health -= amount;
}

Warrior.prototype.stop = function() {
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;
    this.animations.stop();
}

Warrior.prototype.addArrow = function(){
    if(!(this.game.time.time - this.lastShot > 300)){
	return;
    }
    else{
	this.lastShot = this.game.time.time;
    }

    // if(this.curDir == "U" || this.curDir == "UL" || this.curDir == "UR"){
    //     this.animations.play('shootUp', 30, false);
    // }
    // else if(this.curDir == "L"){
    //     this.animations.play('shootLeft', 30, false);	
    // }
    // else if(this.curDir == "R"){
    //     this.animations.play('shootRight', 30, false);	
    // }
    // else { //shooting down or angled down
    //     this.animations.play('shootDown', 30, false);
    // }

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
