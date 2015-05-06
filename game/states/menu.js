'use strict';

function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() { 
      this.game.add.image(0, 0, 'menu');
      this.title = this.game.add.sprite(this.game.width/2, 200, 'title');
      this.title.anchor.set(0.5, 0.5);

      var tween = this.game.add.tween(this.title).to({width: this.title.width * 1.05,
                                                      height: this.title.height * 1.05},
                                                     1000, Phaser.Easing.Quadratic.InOut,
                                                     true, 0, -1);
      tween.yoyo(true);

      this.sprite = this.game.add.sprite(this.game.width/2, 400, 'warrior', 26);
      this.sprite.width = 128;
      this.sprite.height = 128;
      this.sprite.anchor.set(0.5, 0.5);

      this.sprite.animations.add('shootDown', [234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245]);

      var timer = this.game.time.create();
      timer.loop(2000, function() {
          this.sprite.animations.play('shootDown', 12, false);
      }, this);
      timer.start();

      this.play =
          this.game.add.button(this.game.width/2, 600, 'play',
                               function() { this.game.state.start('instructions'); }, this,
                               1, 0, 2, 1);
      this.play.anchor.set(0.5, 0.5);
  },
  update: function() {
  }
};

module.exports = Menu;
