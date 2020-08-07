class SpriteStorage extends ISpriteProvider {
	constructor(id, sprites) {
		super(id);
		this.sprites = sprites || [];
	}

	count() {
		return this.sprites.length;
	}

	getSprite(index) {
		if (index < 0 || index >= this.sprites.length) {
			return null;
		}
		return this.sprites[index];
	}	
}