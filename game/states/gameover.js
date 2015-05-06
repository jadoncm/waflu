
'use strict';
function GameOver() {}

GameOver.prototype = {
    init: function(score) {
        this.score = score;
    },
    preload: function () {
    },
    create: function () {
        this.game.add.image(0, 0, 'menu');

        this.sprite = this.game.add.sprite(this.game.width/2, 200, 'warrior', 260);
        this.sprite.width = 128;
        this.sprite.height = 128;
        this.sprite.anchor.set(0.5, 0.5);

        this.sprite.animations.add('fall', [260, 261, 262, 263, 264, 265]);

        var timer = this.game.time.create();
        timer.add(500, function() {
            this.sprite.animations.play('fall', 12, false);
        }, this);
        timer.start();

        this.text =
            this.game.add.bitmapText(this.game.width/2, 400, 'minecraftia',
                                     "The warrior survived\n" + Math.floor(this.score/60) +
                                     " minutes and " + this.score % 60 + " seconds.");
        this.text.align = 'center';
        this.text.anchor.set(0.5, 0.5);

        this.play =
            this.game.add.button(this.game.width/2, 600, 'replay',
                                 function() { this.game.state.start('play'); }, this,
                                 1, 0, 2, 1);
        this.play.anchor.set(0.5, 0.5);
    },
    update: function () {
    }
};
module.exports = GameOver;
