class TextureManager {
	constructor(gl, uniforms, webglOptions) {
		this.gl = gl;
		this.glTextures = [];
		this.webglOptions = webglOptions;

		const maxTextureUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
		this.glTextures = new Array(maxTextureUnits).fill(null).map((a, index) => {
			const glTexture = gl.createTexture();
			const width = 1, height = 1;
			gl.activeTexture(gl[`TEXTURE${index}`]);
			gl.bindTexture(gl.TEXTURE_2D, glTexture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			return { glTexture, width, height };
		});

		if (!uniforms.uTextures) {
			console.error(`Missing uTextures uniforms`);
			return;
		}
		gl.uniform1iv(uniforms.uTextures.location, new Array(maxTextureUnits).fill(null).map((a, index) => index));
	}

	setImage(image, index, x, y) {
		const { gl, glTextures, webglOptions } = this;
		const { glTexture, width, height } = glTextures[index];
		gl.activeTexture(gl[`TEXTURE${index}`]);
		gl.bindTexture(gl.TEXTURE_2D, glTexture);
		const textureSize = webglOptions.textureSize;
		if (width < textureSize || height < textureSize) {
			glTextures[index].width = glTextures[index].height = textureSize;
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, glTextures[index].width, glTextures[index].height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
		}
		gl.texSubImage2D(gl.TEXTURE_2D, 0, x || 0, y || 0, gl.RGBA, gl.UNSIGNED_BYTE, image);
		gl.generateMipmap(gl.TEXTURE_2D);
	}


}