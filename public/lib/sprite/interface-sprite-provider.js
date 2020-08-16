class ISpriteProvider {
	constructor() {
		this.id = ISpriteProvider.nextId++;
	}

	count() {
		return 0;
	}

	numQuadsPerSprite() {
		return 1;
	}

	getSprite(index) {
		return null;
	}
}

ISpriteProvider.nextId = 1;