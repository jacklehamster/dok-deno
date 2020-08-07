class DemoSprites extends SpriteStorage {
	constructor(id) {
		super(id, DemoSprites.createSprites());
	}

	static createSprites() {
		return [
			{
				color: 0xFF0000,
			},
			{
				color: 0xFFFF00,
			},
		];
	}
}