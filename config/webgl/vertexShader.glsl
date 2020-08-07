attribute vec3 position;
attribute vec3 vertexPosition;
attribute vec4 color;
attribute mat4 matrix;
attribute float isPerspective;
attribute float vertexId;
uniform float time;
uniform mat4 perspective;
uniform mat4 ortho;
uniform mat4 view;

varying vec4 v_color;
 


void main() {
	float vIsPerspective = (sin(time / 1000.) + 1.) * .5 * isPerspective;
	mat4 projection = vIsPerspective * perspective + (1. - vIsPerspective) * ortho;
	// Multiply the position by the matrix.
	gl_Position = projection * view * (vec4(position, 0) + matrix * vec4(vertexPosition, 1.));
	v_color = vec4(color.xyz, vertexId * .2 + .2);
}
