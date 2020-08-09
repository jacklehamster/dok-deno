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
			{
				color: 0x00FF00,
			},
			{
				color: 0x00FFFF,
			},
			{
				color: 0x0000FF,
			},
		];
	}
}
