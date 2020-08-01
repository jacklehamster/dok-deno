class SceneRenderer {
	constructor(gl, uniforms) {
		this.gl = gl;
		this.uniforms = uniforms;
	}

	render(time) {
		this.renderView(time);
		this.renderProjection(time);
	}

	renderView(time) {
		const { gl, uniforms } = this;
		gl.uniformMatrix4fv(uniforms.view.location, false, mat4.fromZRotation(mat4.create(), time * 0.001 * 5 * .1));
	}

	renderProjection(time) {
		const { gl, uniforms } = this;

		//	VIEW
		const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

		const fieldOfViewRadians = Math.PI / 2;
		const zNear = .1;
		const zFar = 2000;
		const matrix = mat4.perspective(mat4.create(), fieldOfViewRadians, aspect, zNear, zFar);
		//const matrix = mat4.ortho(mat4.create(), -1, 1, -1, 1, zNear, zFar);

		gl.uniformMatrix4fv(uniforms.projection.location, false, matrix);

	}
}