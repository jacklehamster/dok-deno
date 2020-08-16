class DemoSprites extends SpriteStorage {
	constructor() {
		super(DemoSprites.createSprites());
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
				color: [0x0000FF, 0xFF0000, 0x00FF00, 0xFFFF00],
			},
		];
	}
}
