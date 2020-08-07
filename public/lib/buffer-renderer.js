class BufferRenderer {
	constructor(gl, attributes) {
		this.gl = gl;
		this.attributes = attributes;
		this.lastBoundBuffer = null;
	}

	setAttribute(attribute, index, typeArray) {
		if (attribute) {
			const { gl } = this;
			if (this.lastBoundBuffer !== attribute.buffer) {
				gl.bindBuffer(gl.ARRAY_BUFFER, attribute.buffer);
				this.lastBoundBuffer = attribute.buffer;
			}
			gl.bufferSubData(gl.ARRAY_BUFFER, index * attribute.bytesPerInstance, typeArray);
		}
	}

	initializeVertexAttributes(attributes) {
		for (let name in attributes) {
			const attribute = attributes[name];
			if (attribute && !attribute.instances) {
				engine.bufferRenderer.initializeVertexAttribute(name, attribute);
			}
		}		
	}

	initializeVertexAttribute(name, attribute) {
		switch (name) {
			case "vertexPosition":
				this.setAttribute(attribute, 0,
					new Float32Array(Utils.makeVertexArray(
					    [ -0.5, -0.5, 0 ],
					    [ 0.5, -0.5, 0 ],
					    [ -0.5,  0.5, 0 ],
					    [ 0.5,  0.5, 0 ],
					))
				);
				break;
			case "vertexId":
				this.setAttribute(attribute, 0,
					new Uint8Array(Utils.makeVertexArray([0], [1], [2], [3]))
				);
				break;
			default:
				console.warn(`Non-instanced attribute not initialized in Sprite: ${name}.`);
				break;
		}
	}
}