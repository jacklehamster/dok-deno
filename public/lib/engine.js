class Engine {

	async init() {
		this.config = config;
		if (!this.config) {
			throw new Error("Missing config.");
		}
		const dom = new DOM(document);
		await dom.load();
		const canvas = document.getElementById("canvas");

		const gl = canvas.getContext("webgl", this.config.webgl.options.context);
		this.gl = gl;
		const ext = gl.getExtension('ANGLE_instanced_arrays');
		if (!ext) {
			throw new Error('need ANGLE_instanced_arrays');
		}
		gl.getExtension('OES_element_index_uint');

		gl.enable(gl.CULL_FACE);
		gl.cullFace(gl.BACK);

		const shader = new Shader(gl, ext, this.config.webgl);

		this.sceneRenderer = new SceneRenderer(gl, shader.uniforms);

		const INDEXED_BUFFER = this.config.webgl.options.indexedBuffer;

		const quadBuffer = INDEXED_BUFFER 
			? new Float32Array([
			    -0.5, -0.5, 0,
			     0.5, -0.5, 0,
			    -0.5,  0.5, 0,
			     0.5,  0.5, 0,
			])
			:  new Float32Array([
			    -0.5, -0.5, 0,
			     0.5, -0.5, 0,
			    -0.5,  0.5, 0,
			    -0.5,  0.5, 0,
			     0.5, -0.5, 0,
			     0.5,  0.5, 0,
			]);

		const positionBuffer = shader.attributes.position.buffer;
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, quadBuffer, gl.STATIC_DRAW);
		const numVertices = quadBuffer.length / 3;

		const numInstances = 5;
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
		const matrixBuffer = shader.attributes.matrix.buffer;
		gl.bindBuffer(gl.ARRAY_BUFFER, matrixBuffer);
		// just allocate the buffer
		gl.bufferData(gl.ARRAY_BUFFER, matrixData.byteLength, gl.DYNAMIC_DRAW);

		// setup colors, one per instance
		const colorBuffer = shader.attributes.color.buffer; //gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array([
				255, 0, 0, 255,  // red
				0, 255, 0, 255,  // green
				0, 0, 255, 255,  // blue
				255, 0, 255, 255,  // magenta
				0, 255, 255, 255,  // cyan
			]),
		    gl.DYNAMIC_DRAW);


		if (INDEXED_BUFFER) {
			const VERTICES_PER_SPRITE = 4;	//	4 corners

			const INDEX_ARRAY_PER_SPRITE = new Uint32Array([
				0,  1,  2,
				2,  1,  3,
			]);
			const indexBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, numInstances * INDEX_ARRAY_PER_SPRITE.length * Uint32Array.BYTES_PER_ELEMENT, gl.STATIC_DRAW);
			for (let i = 0; i < numInstances; i++) {
				const slotIndices = INDEX_ARRAY_PER_SPRITE.map(value => value + i * VERTICES_PER_SPRITE);
				gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, i * slotIndices.length * Uint32Array.BYTES_PER_ELEMENT, slotIndices);
			}
		}

		if (document.querySelector(".loader")) {
			document.querySelector(".loader").classList.add("loaded");
		}

		this.startRendering(
			ext,
			shader.attributes,
			positionBuffer,
			matrixBuffer,
			colorBuffer,
			matrices,
			matrixData,
			numVertices,
			numInstances,
			INDEXED_BUFFER);
	}

	startRendering(ext, attributes, positionBuffer, matrixBuffer, colorBuffer, matrices, matrixData, numVertices, numInstances, indexedBuffer) {
		const { gl } = this;

		const engine = this;

		function loop(time) {
			const now = Math.floor(time);

			gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

			engine.sceneRenderer.render(time);

			matrices.forEach((mat, index) => {
				mat4.fromTranslation(mat, vec3.fromValues(-.5 + index * 0.25, 0, index - 5));
				mat4.rotateZ(mat, mat, time * 0.001 * 5 * (0.1 + 0.1 * index));
			});
			gl.bindBuffer(gl.ARRAY_BUFFER, matrixBuffer);
			gl.bufferSubData(gl.ARRAY_BUFFER, 0, matrixData);

			//	DRAW CALL
			if (indexedBuffer) {
				ext.drawElementsInstancedANGLE(gl.TRIANGLES, 6, gl.UNSIGNED_INT, 0, numInstances);
			} else {
				ext.drawArraysInstancedANGLE(gl.TRIANGLES, 0, numVertices, numInstances);
			}
		  	requestAnimationFrame(loop);
		}
		requestAnimationFrame(loop);
	}

}