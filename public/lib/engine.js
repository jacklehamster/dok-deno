class Engine {
	constructor(document, config) {
		this.document = document;
		this.config = config;
	}

	async init() {
		const { document } = this;
		if (!this.config) {
			throw new Error("Missing config.");
		}
		const dom = new DOM(document);
		await dom.load();
		const canvas = document.getElementById("canvas");

		const gl = canvas.getContext("webgl", this.config.webgl.options.context);
		console.log(gl.getSupportedExtensions());

		this.gl = gl;
		if (!gl.getExtension('OES_element_index_uint')) {
			throw new Error("OES_element_index_uint not available.");
		}
		const ext = gl.getExtension('ANGLE_instanced_arrays');
		if (!ext) {
			throw new Error('need ANGLE_instanced_arrays.');
		}

		if (this.config.webgl.options.cullFace) {
			gl.enable(gl.CULL_FACE);
			gl.cullFace(gl[this.config.webgl.options.cullFace]);
		}

		const shader = new Shader(gl, ext, this.config.webgl);
		this.shader = shader;

		this.sceneRenderer = new SceneRenderer(gl, shader.uniforms);
		this.bufferRenderer = new BufferRenderer(gl, shader.attributes);

		if (document.querySelector(".loader")) {
			document.querySelector(".loader").classList.add("loaded");
		}

		this.startRendering(ext, shader.attributes);
	}

	startRendering(ext, attributes) {
		const { gl } = this;
		const engine = this;

		const numInstances = 5;

		const matrixBuffer = attributes.matrix.buffer;

		const matrixData = new Float32Array(numInstances * 16);
		const matrices = [];
		for (let i = 0; i < numInstances; ++i) {
		  const byteOffsetToMatrix = i * 16 * 4;
		  const numFloatsForView = 16;
		  matrices.push(new Float32Array(
		      matrixData.buffer,
		      byteOffsetToMatrix,
		      numFloatsForView));
		}


		//	VIEW
		const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
		const fieldOfViewRadians = Math.PI / 2;
		const zNear = .1;
		const zFar = 2000;
		engine.sceneRenderer.setPerspective(mat4.perspective(mat4.create(), fieldOfViewRadians, aspect, zNear, zFar));
		engine.sceneRenderer.setOrtho(mat4.ortho(mat4.create(), -1, 1, -1, 1, zNear, zFar));

		//	position
		const quadBuffer = new Float32Array([
		    -0.5, -0.5, 0,
		     0.5, -0.5, 0,
		    -0.5,  0.5, 0,
		    -0.5,  0.5, 0,
		     0.5, -0.5, 0,
		     0.5,  0.5, 0,
		]);
		engine.bufferRenderer.setVertexPosition(quadBuffer);
		const numVerticesPerInstance = quadBuffer.length / 3;

		//	color
		engine.bufferRenderer.setAttribute(attributes.color, 0, new Uint8Array([
			255, 0, 0, 255,  // red
			0, 255, 0, 255,  // green
			0, 0, 255, 255,  // blue
			255, 0, 255, 255,  // magenta
			0, 255, 255, 255,  // cyan
		]));

		function loop(time) {
			const now = Math.floor(time);

			gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

			engine.sceneRenderer.setView(mat4.fromZRotation(mat4.create(), time * 0.001 * 5 * .1));
			engine.bufferRenderer.setAttribute(attributes.isPerspective, 0, new Float32Array([1, 1, 1, 1, 1]));


			matrices.forEach((mat, index) => {
				mat4.fromTranslation(mat, vec3.fromValues(-.5 + index * 0.25, 0, index - 5));
				mat4.rotateZ(mat, mat, time * 0.001 * 5 * (0.1 + 0.1 * index));
				engine.bufferRenderer.setAttribute(attributes.matrix, index, mat);
			});

			//	DRAW CALL
			ext.drawArraysInstancedANGLE(gl.TRIANGLES, 0, numVerticesPerInstance, numInstances);
		  	requestAnimationFrame(loop);
		}
		requestAnimationFrame(loop);
	}

}