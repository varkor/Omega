var Ω = (function () {
	"use strict";

	// Selectors not currently supported: classes or IDs

	var Ω = function (from) {
		// Ω(null) = null
		if (from === null) {
			return null;
		}

		// Let the user avoid the use of the `new` keyword for succinctness
		if (!(this instanceof Ω)) {
			return new Ω(from);
		}
		
		// Support array-like structures
		if (Array.isArray(from) || from instanceof NodeList || from instanceof HTMLCollection) {
			return Array.from(from).map(object => Ω(object));
		}

		// Creation
		if (typeof from === "undefined") {
			throw new Error("You must call Ω with an argument.");
		}
		if (from instanceof Ω) {
			return from;
		} if (from instanceof HTMLElement) {
			this.element = from;
		} else if (typeof from === "string" || from instanceof String) {
			var selector = from;
			var pseudoClasses = selector.match(/:[a-z-]+/g);
			selector = selector.replace(/:[a-z-]+/g, "");
			var attributes = selector.match(/\[[a-z]+(?:="[a-z0-9]+")?\]/g);
			selector = selector.replace(/\[[a-z]+(?:="[a-z0-9]+")?\]/g, "");
			this.element = document.createElement(selector);
			if (pseudoClasses) {
				pseudoClasses.map(pseudoClass => pseudoClass.slice(1)).forEach(pseudoClass => {
					switch (pseudoClass) {
						case "focus":
							this.element.focus();
							break;
						case "empty":
							break; // Elements are empty by default
						case "target":
							if (window.location.hash.length > 1) {
								this.element.id = window.location.hash.slice(1);
							}
							break;
						case "checked":
							if (this.element instanceof HTMLInputElement) {
								this.element.checked = true;
							}
							break;
						case "enabled":
							break; // Elements are empty by default
						case "disabled":
							if (this.element instanceof HTMLInputElement) {
								this.element.disabled = true;
							}
							break;
						default:
							break; // Ignore unrecognised selectors
					}
				});
			}
			if (attributes) {
				attributes.forEach(attribute => {
					var assignment = attribute.slice(1, -1).split("=");
					this.element.setAttribute(assignment[0], assignment[1].slice(1, -1));
				});
			}
		} else {
			throw new Error("The type of argument passed to Ω could not be recognised as an element.");
		}

		// General Methods
		this.querySelector = selector => {
			return Ω(this.element.querySelector(selector));
		};
		this.querySelectorAll = selector => {
			return Ω(this.element.querySelectorAll(selector));
		};
		this.append = object => {
			if (object !== null) {
				this.element.appendChild(Ω(object).element);
			}
			return this;
		};
		this.appendedTo = object => {
			Ω(object).append(this);
			return this;
		};
		this.withText = text => {
			this.element.appendChild(document.createTextNode(text));
			return this;
		};
		this.clear = () => {
			while (this.element.firstChild) {
				this.element.removeChild(this.element.firstChild);
			}
			return this;
		};
		this.listenFor = (type, callback) => {
			this.element.addEventListener(type, callback);
			return this;
		};
		this.trigger = type => {
			this.element.dispatchEvent(new Event(type));
			return this;
		};
		this.onClick = callback => this.listenFor("click", event => callback());
		this.click = () => this.trigger("click");

		// Specific Methods
		if (this.element instanceof HTMLTableElement) {
			this.row = index => {
				return Ω(this.element.rows[index >= 0 ? index : this.element.rows.length + index]);
			};
			this.rows = () => {
				return Ω(this.element.rows);
			};
			this.addRow = (cells, wrapWithTD) => {
				// Update with rest parameter soon
				var row = Ω(this.element.insertRow());
				if (typeof cells !== "undefined") {
					if (!Array.isArray(cells)) {
						cells = [cells];
					}
					cells.forEach(cell => row.append(wrapWithTD || typeof wrapWithTD === "undefined" ? Ω(`td`).append(cell) : cell));
				}
				return this;
			};
			this.sliceRows = (from, to) => {
				var i, rows = this.element.rows.length;
				for (i = 0; i < from; ++ i) {
					this.element.deleteRow(0);
				}
				for (i = to; i < rows; ++ i) {
					this.element.deleteRow(to - from);
				}
				return this;
			};
		}
		if (this.element instanceof HTMLTableRowElement) {
			this.cell = index => {
				return Ω(this.element.cells[index >= 0 ? index : this.elements.cells + index]);
			};
			this.cells = () => {
				return Ω(this.element.cells);
			};
		}
		if (this.element instanceof HTMLInputElement || this.element instanceof HTMLTextAreaElement || this.element instanceof HTMLSelectElement) {
			this.value = () => {
				return this.element.value;
			};
			this.withValue = value => {
				this.element.value = value;
				return this;
			};
		}
		if (this.element instanceof HTMLInputElement || this.element instanceof HTMLTextAreaElement) {
			this.onInput = callback => this.listenFor("input", event => callback(this.value()));
		};
		if (this.element instanceof HTMLInputElement && ["checkbox", "radio"].indexOf(this.element.type) !== -1) {
			this.checked = () => {
				return this.element.checked;
			};
			this.setChecked = checked => {
				this.element.checked = checked;
				return this;
			};
			this.check = () => this.setChecked(true);
			this.uncheck = () => this.setChecked(false);
			this.onChange = callback => this.listenFor("change", event => callback(this.checked()));
			// Allow the user to use .value and .withValue to get and set the checked status of checkboxes, as well as listening for .onInput
			this.value = this.checked;
			this.withValue = this.setChecked;
			this.onInput = this.onChange;
		}
		if (this.element instanceof HTMLSelectElement) {
			this.withOptions = options => {
				options.forEach(option => this.append(Ω(`option`).withText(option)));
				return this;
			};
			this.onSelect = callback => this.listenFor("change", event => callback(this.element.value));
		}
	};

	return Ω;
}());