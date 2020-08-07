class Utils {
	static makeVertexArray(row0, row1, row2, row3) {
		return [
			...row0,
			...row1,
			...row2,
			...row2,
			...row1,
			...row3,
		];
	}

	static colorToBytes(color) {
		const R = (color & 0xFF0000) >> 16;
		const G = (color & 0xFF00) >> 8;
		const B = (color & 0xFF);
		const A = ((color & 0xFF000000) >> 24) ^ 0xFF;
		return [R, G, B, A];
	}
}