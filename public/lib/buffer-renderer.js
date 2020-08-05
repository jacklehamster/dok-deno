class BufferRenderer {
	constructor(gl, attributes) {
		this.gl = gl;
		this.attributes = attributes;
		this.lastBoundBuffer = null;
	}

	setAttribute(attribute, index, typeArray) {
		const { gl } = this;
		if (this.lastBoundBuffer !== attribute.buffer) {
			gl.bindBuffer(gl.ARRAY_BUFFER, attribute.buffer);
			this.lastBoundBuffer = attribute.buffer;
		}
		gl.bufferSubData(gl.ARRAY_BUFFER, index * attribute.bytesPerInstance, typeArray);
	}

	setVertexPosition(typeArray) {
		const { gl, attributes } = this;
		this.setAttribute(attributes.position, 0, typeArray);
	}
}