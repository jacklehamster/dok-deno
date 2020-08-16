precision mediump float;

const int NUM_TEXTURES = 16;

uniform sampler2D uTextures[NUM_TEXTURES];

varying vec4 v_color;
varying vec2 v_textureCoord;

void main() {
	gl_FragColor = mix(texture2D(uTextures[0], v_textureCoord), v_color, .5);
//	gl_FragColor = v_color;
}
