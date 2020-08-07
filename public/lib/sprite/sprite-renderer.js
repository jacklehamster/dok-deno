class SpriteRenderer {
	constructor(bufferRenderer) {
		this.bufferRenderer = bufferRenderer;
		this.renderedSprites = {};
		this.nextBufferIndex = 0;
		this.recycledRenderedSprites = [];
	}

	fetchNextRenderedSprite(providerId) {
		return this.recycledRenderedSprites.length 
			? this.recycledRenderedSprites.pop()
			: {
				providerId,
				updateTime: 0,
				bufferIndex: this.nextBufferIndex++,
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
}