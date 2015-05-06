'use strict';

var FireArrow = function(game, x, y, direction, fluidCG, arrowCG) {
    Phaser.Sprite.call(this, game, x, y, 'fireArrow');
    this.attack = 0.2*this.game.STAT_MAG;
    this.direction = direction;
    this.anchor.setTo(0.5, 0.5);

    this.game.physics.p2.enable(this, false);
    this.body.setCircle(this.game.PARTICLE_SIZE);
    this.body.allowRotation = false;
    this.body.setCollisionGroup(arrowCG);
    this.body.collides(fluidCG);
    this.checkWorldBounds = true;
    this.body.collideWorldBounds = false;
    this.events.onOutOfBounds.add(function() {
        this.destroy();
    }, this);

    if(this.direction == "U"){
  	this.body.rotation -= .75;
  	this.body.velocity.y = -400;
    }
    else if(this.direction == "UL"){
  	this.body.rotation -= 1.4;
  	this.body.velocity.y = -400;
  	this.body.velocity.x = -400;
    }
    else if(this.direction == "UR"){
  	this.body.velocity.y = -400;
  	this.body.velocity.x = 400;
    }
    else if(this.direction == "L"){
  	this.body.rotation -= 2.35;
  	this.body.velocity.x = -400;
    }  
    else if(this.direction == "R"){
  	this.body.rotation += .8;
  	this.body.velocity.x = 400;
    }
    else if(this.direction == "DL"){
  	this.body.rotation -= 3;
  	this.body.velocity.y = 400;
  	this.body.velocity.x = -400;
    }
    else if(this.direction == "DR"){
  	this.body.rotation += 1.5;
  	this.body.velocity.y = 400;
  	this.body.velocity.x = 400;
    }
    else{
  	this.body.rotation += 2.35;
  	this.body.velocity.y = 400;
    } 
};

FireArrow.prototype = Object.create(Phaser.Sprite.prototype);
FireArrow.prototype.constructor = FireArrow;

FireArrow.prototype.update = function() {
    
    // write your prefab's specific update code here
    
};

module.exports = FireArrow;
