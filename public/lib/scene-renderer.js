class SceneRenderer {
	constructor(gl, uniforms) {
		this.gl = gl;
		this.uniforms = uniforms;
	}

	setView(matrix) {
		const { gl, uniforms } = this;
		gl.uniformMatrix4fv(uniforms.view.location, false, matrix);
	}

	setPerspective(perspectiveMatrix) {
		const { gl, uniforms } = this;
		gl.uniformMatrix4fv(uniforms.perspective.location, false, perspectiveMatrix);

	}

	setOrtho(orthoMatrix) {
		const { gl, uniforms } = this;
		gl.uniformMatrix4fv(uniforms.ortho.location, false, orthoMatrix);
	}

	setTime(time) {
		const { gl, uniforms } = this;
		gl.uniform1f(uniforms.time.location, time);
	}
}