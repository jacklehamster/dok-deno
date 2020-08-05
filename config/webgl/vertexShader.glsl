attribute vec3 position;
attribute vec4 color;
attribute mat4 matrix;
attribute float isPerspective;
uniform mat4 perspective;
uniform mat4 ortho;
uniform mat4 view;

varying vec4 v_color;
 
void main() {
	mat4 projection = isPerspective * perspective + (1. - isPerspective) * ortho;
	// Multiply the position by the matrix.
	gl_Position = projection * view * matrix * vec4(position, 1.);
	v_color = color;
}
