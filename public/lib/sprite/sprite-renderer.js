class SpriteRenderer {
	constructor(bufferRenderer, attributes) {
		this.bufferRenderer = bufferRenderer;
		this.renderedSprites = {};
		this.nextBufferIndex = 0;
		this.recycledRenderedSprites = [];
		this.attributes = attributes;
	}

	fetchNextRenderedSprite(providerId) {
		return this.recycledRenderedSprites.length 
			? this.recycledRenderedSprites.pop()
			: {
				providerId,
				updateTime: 0,
				bufferIndex: this.nextBufferIndex++,
				color: 0xFF000000,
			};
	}

	updateSprites(spriteProviders) {
		for (let i = 0; i < spriteProviders.length; i++) {
			const spriteProvider = spriteProviders[i];
			const providerId = spriteProvider.id;
			if (!this.renderedSprites[providerId]) {
				this.renderedSprites[providerId] = [];
			}
			const renderList = this.renderedSprites[providerId];
			const count = spriteProvider.count();

			while (renderList.length < count) {
				renderList.push(this.fetchNextRenderedSprite(providerId));
			}

			for (let i = 0; i < count; i++) {
				const sprite = spriteProvider.getSprite(i);
				this.renderSprite(sprite, renderList[i]);
			}

			while (renderList.length > count) {
				this.deleteSprite(renderList.pop());
			}
		}
	}

	renderSprite(newSprite, renderedSprite) {
//		console.log(`render`, newSprite, renderedSprite);

	}

	deleteSprite(renderedSprite) {
		console.log(`delete ${renderedSprite}`);
		this.recycledBufferIndex.push(renderedSprite.bufferIndex);
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
			case "vertexId":
				this.bufferRenderer.setAttribute(attribute, 0,
					new Uint8Array(Utils.makeVertexArray([0], [1], [2], [3]))
				);
				break;
			default:
				console.warn(`Non-instanced attribute not initialized in Sprite: ${name}.`);
				break;
		}
	}	
}