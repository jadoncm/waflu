Phaser.Filter.Threshold = function (game) {

    Phaser.Filter.call(this, game);

    this.uniforms.threshold = { type: '1f', value: 1.0 };

    this.fragmentSrc = [

        "precision mediump float;",

        "varying vec2       vTextureCoord;",
        "varying vec4       vColor;",
        "uniform sampler2D  uSampler;",
        "uniform float      threshold;",

        "void main(void) {",
        "gl_FragColor = texture2D(uSampler, vTextureCoord);",
	"   if (gl_FragColor.r + gl_FragColor.g + gl_FragColor.b > threshold)",
        "       gl_FragColor.rgb = vec3(gl_FragColor.r, gl_FragColor.g, gl_FragColor.b);",
        "   else",
        "       gl_FragColor.rgb = vec3(0);",
        "}"
    ];

};

Phaser.Filter.Threshold.prototype = Object.create(Phaser.Filter.prototype);
Phaser.Filter.Threshold.prototype.constructor = Phaser.Filter.Threshold;

/**
 * The strength of the threshold. 1 will make the object black and white, 0 will make the object its normal color
 * @property threshold
 */
Object.defineProperty(Phaser.Filter.Threshold.prototype, 'threshold', {

    get: function() {
        return this.uniforms.threshold.value;
    },

    set: function(value) {
        this.uniforms.threshold.value = value;
    }

});
