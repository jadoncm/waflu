Phaser.Filter.Threshold = function (game) {

    Phaser.Filter.call(this, game);

    this.uniforms.threshold = { type: '1f', value: 1.0 };

    this.fragmentSrc = [

        "precision mediump float;",

        "varying vec2       vTextureCoord;",
        "varying vec4       vColor;",
        "uniform sampler2D  uSampler;",
        "uniform float      threshold;",

	"vec3 rgb2hsv(vec3 c)",
	"{",
	"    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);",
	"    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));",
	"    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));",
	"    float d = q.x - min(q.w, q.y);",
	"    float e = 1.0e-10;",
	"    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);",
	"}",
	"",
	"vec3 hsv2rgb(vec3 c)",
	"{",
	"    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);",
	"    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);",
	"    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);",
	"}",

        "void main(void) {",
        "gl_FragColor = texture2D(uSampler, vTextureCoord);",
	"vec3 hsv;",
	"hsv = rgb2hsv(vec3(gl_FragColor.r, gl_FragColor.g, gl_FragColor.b));",
	"   if (hsv.z > threshold)",
        "       gl_FragColor.rgb = hsv2rgb(vec3(hsv.x, hsv.y, 1));",
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
