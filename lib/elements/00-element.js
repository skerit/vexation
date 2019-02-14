'use strict';

var VexationNS,
	Element,
	Blast      = __Protoblast,
	Fn         = Blast.Bound.Function;

// Get the Vexation namespace
VexationNS = Fn.getNamespace('Vexation');

/**
 * The Element Class
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Vexation.Vexation}   vexation
 */
Element = Fn.inherits('Vexation.Base', 'Vexation.Element', function Element(vexation) {

	// Store the parent vexation instance
	this.vexation = vexation;

	// Child elements
	this.children = [];
});

/**
 * Get the absolute X coordinate
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Number}
 */
Element.setProperty(function absolute_x() {
	return this.x || 0;
});


/**
 * Get the absolute Y coordinate
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Number}
 */
Element.setProperty(function absolute_y() {
	return this.y || 0;
});

/**
 * Append an element
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Element.setMethod(function append(element) {
	this.children.push(element);
});

Element.setMethod(function render() {

	var buf = this.vexation.terminal.buffer;

	for (let y = this.absolute_y; y < this.absolute_y + this.height; y++) {
		for (let x = this.absolute_x; x < this.absolute_x + this.width; x++) {
			let cmd = '';

			if (this.bg) {
				cmd = this.vexation.terminal.backgroundCommand(...this.bg);
			}

			if (this.content && this.content[x]) {
				cmd += this.content[x];
			}

			// Reset per cell is stupid, but it's just a test
			cmd += '\x1b[0m';

			buf[y][x] = cmd;
		}
	}

	if (this.children && this.children.length) {
		for (let i = 0; i < this.children.length; i++) {
			this.children[i].render();
		}
	}

});