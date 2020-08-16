attribute vec3 position;
attribute vec2 vertexPosition;
attribute mat4 colors;
attribute mat4 matrix;
attribute float isPerspective;
attribute mat4 textureCoordinates;

uniform float time;
uniform mat4 perspective;
uniform mat4 ortho;
uniform mat4 view;

varying vec4 v_color;
varying vec2 v_textureCoord;

vec4 getCornerValue(mat4 value, vec2 vertexPosition) {
	return mix(
		mix(value[0], value[1], vertexPosition.x + .5), 
		mix(value[2], value[3], vertexPosition.x + .5),
		vertexPosition.y + .5);	
}

void main() {
	float vIsPerspective = (sin(time / 1000.) + 1.) * .5 * isPerspective;
	mat4 projection = vIsPerspective * perspective + (1. - vIsPerspective) * ortho;
	// Multiply the position by the matrix.
	gl_Position = projection * view * (vec4(position, 0) + matrix * vec4(vertexPosition, 0, 1.));
	v_color = getCornerValue(colors, vertexPosition);
	v_textureCoord = getCornerValue(textureCoordinates, vertexPosition).xy / 4096.;
}
