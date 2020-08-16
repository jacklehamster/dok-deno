class DOM {
	constructor(document) {
		this.document = document;
	}

	async load() {
		return new Promise((resolve, reject) => {
			this.document.addEventListener("DOMContentLoaded", () => {
				resolve(this.document);
			});
		});
	}
}