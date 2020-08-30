class Engine {
	constructor(document, config) {
		this.document = document;
		this.config = config;
		this.onLoopListeners = [];
	}

	async init() {
		const { document, config } = this;
		if (!this.config) {
			throw new Error("Missing config.");
		}
		const dom = new DOM(document);
		await dom.load();
		const canvas = document.getElementById("canvas");
		if (config.viewport.resolution) {
			[ canvas.width, canvas.height ] = config.viewport.resolution;
		}
		if (config.viewport.size) {
			[ canvas.style.width, canvas.style.height ] = config.viewport.size.map(pixels => `${pixels}px`);
		}

		const gl = canvas.getContext("webgl", this.config.webgl.options.context);

		this.gl = gl;
		if (!gl.getExtension('OES_element_index_uint')) {
			throw new Error("OES_element_index_uint not available.");
		}
		const ext = gl.getExtension('ANGLE_instanced_arrays');
		if (!ext) {
			throw new Error('need ANGLE_instanced_arrays.');
		}

		this.focusFixer = new FocusFixer(canvas);

		const shader = new Shader(gl, ext, config.webgl);
		this.shader = shader;

		this.sceneRenderer = new SceneRenderer(gl, shader.uniforms);
		this.bufferRenderer = new BufferRenderer(gl);
		this.spriteRenderer = new SpriteRenderer(this.bufferRenderer);
		this.spriteProviders = [
			new DemoSprites(),
		];
		this.imageLoader = new ImageLoader();
		this.textureAtlas = new TextureManager(gl, shader.uniforms, config.webgl.options);

		const img = await this.imageLoader.loadImage("https://cache-grab.herokuapp.com/https://media.vanityfair.com/photos/5ddd5c759aeeef0008170fc0/master/pass/a-scarlett-johansson-oscars-tout.jpg");
		this.textureAtlas.setImage(img, 0, 0, 0);

		if (document.querySelector(".loader")) {
			document.querySelector(".loader").classList.add("loaded");
		}

		this.startRendering(ext, shader.attributes);
	}

	addOnLoopListener(listener) {
		if (this.onLoopListeners.indexOf(listener) < 0) {
			this.onLoopListeners.push(listener);
		}
	}

	removeOnLoopListener(listener) {
		if (this.onLoopListeners.indexOf(listener) >= 0) {
			this.onLoopListeners.splice(this.onLoopListeners.indexOf(listener), 1);
		}		
	}

	startRendering(ext, attributes) {
		const { gl } = this;
		const engine = this;

		const numInstances = 5;
		const numVerticesPerInstance = 6;

		const matrixBuffer = attributes.matrix.buffer;

		const matrices = [];
		for (let i = 0; i < numInstances; ++i) {
		  matrices.push(new Float32Array(16));
		}

		//	VIEW
		const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
		const fieldOfViewRadians = Math.PI / 2;
		const zNear = .1;
		const zFar = 2000;
		engine.sceneRenderer.setPerspective(mat4.perspective(mat4.create(), fieldOfViewRadians, aspect, zNear, zFar));
		engine.sceneRenderer.setOrtho(mat4.ortho(mat4.create(), -1, 1, -1, 1, zNear, zFar));

		engine.spriteRenderer.initializeVertexAttributes(attributes);

		//	color
		engine.bufferRenderer.setAttribute(attributes.colors, 0, new Uint8Array([
			... Utils.colorToBytes(0xFF0000),
			... Utils.colorToBytes(0xFFFFFF),
			... Utils.colorToBytes(0xFFFFFF),
			... Utils.colorToBytes(0xFFFFFF),
			... Utils.colorToBytes(0x00FF00),
			... Utils.colorToBytes(0xFFFFFF),
			... Utils.colorToBytes(0xFFFFFF),
			... Utils.colorToBytes(0xFFFFFF),
			... Utils.colorToBytes(0x0000FF),
			... Utils.colorToBytes(0xFFFFFF),
			... Utils.colorToBytes(0xFFFFFF),
			... Utils.colorToBytes(0xFFFFFF),
			... Utils.colorToBytes(0xFF00FF),
			... Utils.colorToBytes(0xFFFFFF),
			... Utils.colorToBytes(0xFFFFFF),
			... Utils.colorToBytes(0xFFFFFF),
			... Utils.colorToBytes(0x00FFFF),
			... Utils.colorToBytes(0xFFFFFF),
			... Utils.colorToBytes(0xFFFFFF),
			... Utils.colorToBytes(0xFFFFFF),
		]));

		engine.bufferRenderer.setAttribute(attributes.textureCoordinates, 0, new Uint16Array([
			0, 0, 500, 500,
			1500, 0, 500, 500,
			0, 1500, 500, 500,
			1500, 1500, 500, 500,

			0, 0, 500, 500,
			500, 0, 500, 500,
			0, 500, 500, 500,
			500, 500, 500, 500,
			
			0, 0, 500, 500,
			500, 0, 500, 500,
			0, 500, 500, 500,
			500, 500, 500, 500,
			
			0, 0, 500, 500,
			500, 0, 500, 500,
			0, 500, 500, 500,
			500, 500, 500, 500,
			
			0, 0, 500, 500,
			1500, 0, 500, 500,
			0, 1500, 500, 500,
			1500, 1500, 500, 500,			
		]));

		engine.sceneRenderer.setView(mat4.fromTranslation(mat4.create(), vec3.fromValues(0, 0, 0)));


		function loop(time) {
			if (!engine.focusFixer.focused) {
			  	requestAnimationFrame(loop);
				return;
			}

			const now = Math.round(time);

			gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

			engine.sceneRenderer.setTime(now);
//			engine.sceneRenderer.setView(mat4.fromZRotation(mat4.create(), now * 0.001 * 5 * .1));

			engine.bufferRenderer.setAttribute(attributes.isPerspective, 0, new Uint8Array([
				255, 255, 255, 255, 255
			]));

			for (let i = 0; i < engine.spriteProviders.length; i++) {
				engine.spriteRenderer.updateSprites(engine.spriteProviders[i]);
			}

			matrices.forEach((mat, index) => {
				mat4.identity(mat);
				mat4.fromTranslation(mat, vec3.fromValues(-.5 + index * 0.25, 0, index - 5));
				mat4.rotateZ(mat, mat, now * 0.001 * 5 * (0.1 + 0.1 * index));
				engine.bufferRenderer.setAttribute(attributes.matrix, index, mat);
			});

			//	DRAW CALL
			ext.drawArraysInstancedANGLE(gl.TRIANGLES, 0, numVerticesPerInstance, numInstances);


			for (let i = 0; i < engine.onLoopListeners.length; i++) {
				engine.onLoopListeners[i]();
			}

		  	requestAnimationFrame(loop);
		}
		requestAnimationFrame(loop);
	}

}