class BufferRenderer {
	constructor(gl) {
		this.gl = gl;
		this.lastBoundBuffer = null;
	}

	setAttribute(attribute, index, typeArray) {
		if (!attribute) {
			console.warn("No attribute.");
			return;
		}
		const { gl } = this;
		if (this.lastBoundBuffer !== attribute.buffer) {
			gl.bindBuffer(gl.ARRAY_BUFFER, attribute.buffer);
			this.lastBoundBuffer = attribute.buffer;
		}
		gl.bufferSubData(gl.ARRAY_BUFFER, index * attribute.bytesPerInstance, typeArray);
	}
}