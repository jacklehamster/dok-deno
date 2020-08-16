/**
	Dok-gamelib engine

	Description: Game engine for producing web games easily using JavaScript and WebGL
	Author: jacklehamster
	Sourcode: https://github.com/jacklehamster/dok-gamelib
	Year: 2020
 */


/**
	FocusFixer
  */

class FocusFixer {
	constructor(canvas) {
		this.canvas = canvas;
		this.input = document.createElement("input");
		this.input.style.color = "transparent";
		this.input.style.textShadow = "0 0 0 black";
		this.input.style.backgroundColor = "transparent";
		this.input.style.border = "0px";
		this.input.style.outline = "none";
		this.input.style.position = "absolute";
		this.input.style.top = "-30px";
		this.fix();
		this.listeners = [];

		this.cover = document.createElement("div");
		this.cover.style.backgroundColor = "#000000aa";
		this.cover.style.width = "100%";
		this.cover.style.height = "100%";
		this.cover.style.top = "0px";
		this.cover.style.position = "absolute";
	}

	fix() {
		const { input } = this;
		input.setAttribute("contenteditable", "");
		input.setAttribute("readonly", "");
		input.classList.add("focus-fixer-input");

		window.addEventListener("DOMContentLoaded", () => {
			document.body.appendChild(input);
			this.gainFocus();
		});
		window.addEventListener("focus", () => this.gainFocus());
		window.addEventListener("blur", () => this.lostFocus());
		this.canvas.addEventListener("mousedown", () => this.gainFocus());
		this.canvas.focus();
	}

	addListener(listener) {
		this.listeners.push(listener);
	}

	removeListener(listener) {
		const index = this.listeners.indexOf(listener);
		if (index >= 0) {
			this.listeners[index] = this.listeners[this.listeners.length - 1];
			this.listeners.pop();
		}
	}

	lostFocus() {
		this.focused = false;
		for (let i = 0; i < this.listeners.length; i++) {
			this.listeners[i]("blur");
		}
		document.body.appendChild(this.cover);
	}

	gainFocus() {
		this.input.focus();
		this.focused = true;
		for (let i = 0; i < this.listeners.length; i++) {
			this.listeners[i]("focus");
		}
		if (this.cover.parentElement) {
			this.cover.parentElement.removeChild(this.cover);
		}
	}
}
