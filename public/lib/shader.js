class Shader {
	constructor(gl, ext, webgl) {
		this.gl = gl;
		this.ext = ext;
		this.attributes = {};
		this.uniforms = {};
		this.webgl = webgl;
		this.linkShader(this.webgl.vertexShader, this.webgl.fragmentShader);		
	}

	initShader(type, source) {
		if (type !== this.gl.VERTEX_SHADER && type !== this.gl.FRAGMENT_SHADER) {
			throw new Error(`Shader error: ${type}`);
		}
		const shader = this.gl.createShader(type);
		this.gl.shaderSource(shader, source);
		this.gl.compileShader(shader);
		return shader;
	}

	linkShader(vertexShaderCode, fragmentShaderCode) {
		const program = this.program = this.gl.createProgram();
		const vertexShader = this.initShader(this.gl.VERTEX_SHADER, vertexShaderCode);
		const fragmentShader = this.initShader(this.gl.FRAGMENT_SHADER, fragmentShaderCode);
		this.gl.attachShader(program, vertexShader);
		this.gl.attachShader(program, fragmentShader);
		this.gl.linkProgram(program);
		this.gl.useProgram(program);

		if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
		  throw new Error('Unable to initialize the shader program:\n' + this.gl.getProgramInfoLog(program));
		}

		this.initUniforms(program, vertexShaderCode);
		this.initAtttributes(program, vertexShaderCode, this.webgl.options.maxInstanceCount);
	}

	initUniforms(program, vertexShaderCode) {
		const variables = this.getVertexShaderVariables(vertexShaderCode).filter(({attributeType}) => attributeType === "uniform");
		variables.forEach(({name, dataType}) => {
			//	dataType is vec4 / mat4 etc...
			this.uniforms[name] = {
				location: this.gl.getUniformLocation(program, name),
			};
			this.enableLocations(this.uniforms[name].location, dataType);
		});
	}

	initAtttributes(program, vertexShaderCode, maxInstanceCount) {
		const variables = this.getVertexShaderVariables(vertexShaderCode).filter(({attributeType}) => attributeType === "attribute");
		variables.forEach(({name, dataType}) => {
			const location = this.gl.getAttribLocation(program, name);
			if (this.attributes[name] && this.attributes[name].buffer) {
				this.gl.deleteBuffer(this.attributes[name].buffer);
				this.attributes[name].buffer = null;
			}
			this.attributes[name] = this.initializeAttribute(name, dataType, location, this.webgl.attributes[name], maxInstanceCount);
			this.enableLocations(this.attributes[name].location, dataType);
		});
	}

	initializeAttribute(name, dataType, location, attributeConfig, maxInstanceCount) {
		if (!attributeConfig) {
			console.warn(`Attribute ${name} has no configuration.`);
			return;
		}
		const NUM_VERTICES = 6;
		const { gl, ext, attributes } = this;
		const group = dataType.match(/([a-zA-Z]+)(\d?)/);
		const size = !group || group[2]==="" || isNaN(group[2]) ? 1 : parseInt(group[2]);
		const dataStructure = !group ? "vec" : group[1];
		const numRows = dataStructure === "mat" ? size : 1;
		const glType = gl[attributeConfig.type || "FLOAT"];
		const bytesPerInstance = size * numRows * this.getByteSize(glType);

		const buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

		for (let i = 0; i < numRows; i++) {
			const offset = i * size * this.getByteSize(glType);
			gl.vertexAttribPointer(
			  location + i,  // location
			  size,            // size (num values to pull from buffer per iteration)
			  glType,     // type of data in buffer
			  attributeConfig.normalize,        // normalize
			  bytesPerInstance,            // stride (0 = compute from size and type above)
			  offset,            // offset in buffer
			);
			ext.vertexAttribDivisorANGLE(location + i, attributeConfig.instances || 0);			
		}
		gl.bufferData(gl.ARRAY_BUFFER, (attributeConfig.instances ? maxInstanceCount : NUM_VERTICES) * bytesPerInstance, gl[attributeConfig.usage]);

		return { 
			location,
			buffer,
			bytesPerInstance,
		}
	}

 	getByteSize(bufferType) {
 		const { gl } = this;
 		switch(bufferType) {
 			case gl.BYTE:
				return Int8Array.BYTES_PER_ELEMENT;
 			case gl.UNSIGNED_BYTE:
				return Uint8Array.BYTES_PER_ELEMENT;
			case gl.SHORT:
				return Int16Array.BYTES_PER_ELEMENT;
			case gl.UNSIGNED_SHORT:
				return Uint16Array.BYTES_PER_ELEMENT;
			case gl.INT:
				return Int32Array.BYTES_PER_ELEMENT;
			case gl.UNSIGNED_INT:
				return Uint32Array.BYTES_PER_ELEMENT;
			case gl.FLOAT:
				return Float32Array.BYTES_PER_ELEMENT;
 		}
 	}

	enableLocations(loc, dataType) {
		const group = dataType.match(/mat(\d?)/);
		const size = !group || group[1]==="" || isNaN(group[1]) ? 1 : parseInt(group[1]);

		for (let i = 0; i < size; i++) {
			this.gl.enableVertexAttribArray(loc + i);			
		}
	}

	getVertexShaderVariables(vertexShader) {
		const groups = vertexShader.match(/(attribute|uniform) ([\w]+) ([\w]+);/g).map(line => line.match(/(attribute|uniform) ([\w]+) ([\w]+);/));
		return groups.map(([line, attributeType, dataType, name]) => {
			return { line, attributeType, dataType, name };
		})
	}
}
