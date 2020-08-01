attribute vec3 position;
attribute vec4 color;
attribute mat4 matrix;
uniform mat4 projection;
uniform mat4 view;

varying vec4 v_color;
 
void main() {
  // Multiply the position by the matrix.
	gl_Position = projection * view * matrix * vec4(position, 1.);
	v_color = color;
}
