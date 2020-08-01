class DOM {
	constructor(document) {
		this.document = document;
	}

	load() {
		return new Promise((resolve, reject) => {
			this.document.addEventListener("DOMContentLoaded", () => {
				resolve();
			});
		});
	}
}