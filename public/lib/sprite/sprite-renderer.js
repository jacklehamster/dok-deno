class SpriteRenderer {
	constructor(bufferRenderer, attributes) {
		this.bufferRenderer = bufferRenderer;
		this.renderedQuads= {};
		this.nextBufferIndex = 0;
		this.recycledRenderedQuads = [];
		this.attributes = attributes;
		this.tempQuadArray = [];
	}

	fetchNextRenderedQuad(providerId) {
		return this.recycledRenderedQuads.length 
			? this.recycledRenderedQuads.pop()
			: {
				bufferIndex: this.nextBufferIndex++,
			};
	}

	updateSprites(spriteProvider) {
		const numQuadsPerSprite = spriteProvider.numQuadsPerSprite();
		const providerId = spriteProvider.id;
		if (!this.renderedQuads[providerId]) {
			this.renderedQuads[providerId] = [];
		}
		const renderList = this.renderedQuads[providerId];
		const numSprites = spriteProvider.count();

		while (renderList.length < numSprites * numQuadsPerSprite) {
			renderList.push(this.fetchNextRenderedQuad(providerId));
		}

		this.tempQuadArray.length = numQuadsPerSprite;
		for (let i = 0; i < numSprites; i++) {
			for (let q = 0; q < numQuadsPerSprite; q++) {
				this.tempQuadArray[q] = renderList[i * numQuadsPerSprite + q];
			}
			const sprite = spriteProvider.getSprite(i);
			this.renderSprite(sprite, this.tempQuadArray);
		}

		while (renderList.length > numSprites * numQuadsPerSprite) {
			this.deleteSprite(renderList.pop());
		}
	}

	renderSprite(sprite, quads) {
//		console.log(`render`, sprite, renderedSprite);
		
	}

	deleteSprite(renderedQuad) {
		console.log(`delete ${renderedQuad}`);
		this.recycledBufferIndex.push(renderedQuad.bufferIndex);
	}

	initializeVertexAttributes(attributes) {
		for (let name in attributes) {
			const attribute = attributes[name];
			if (attribute && !attribute.instances) {
				this.initializeVertexAttribute(name, attribute);
			}
		}
	}

	initializeVertexAttribute(name, attribute) {
		switch (name) {
			case "vertexPosition":
				this.bufferRenderer.setAttribute(attribute, 0,
					new Float32Array(Utils.makeVertexArray(
					    [ -0.5, -0.5 ],
					    [ 0.5, -0.5 ],
					    [ -0.5,  0.5 ],
					    [ 0.5,  0.5 ],
					))
				);
				break;
			default:
				console.warn(`Non-instanced attribute not initialized in Sprite: ${name}.`);
				break;
		}
	}	
}