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
const Element = Fn.inherits('Vexation.Base', 'Vexation.Element', function Element(vexation) {

	// Store the parent vexation instance
	this.vexation = vexation;

	// Child elements
	this.children = [];

	// The parent element
	this.parent = null;
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

	var result = this.x || 0;

	if (this.parent) {
		result += this.parent.absolute_x;
	}

	return result;
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
	element.parent = this;
});

Element.setMethod(function render() {

	var char_buf = this.vexation.terminal.char_buffer,
	    char,
	    buf = this.vexation.terminal.buffer,
	    cmd,
	    ay,
	    ax,
	    y = 0,
	    x = 0;

	for (ay = this.absolute_y; ay < this.absolute_y + this.height; ay++, y++) {
		for (ax = this.absolute_x; ax < this.absolute_x + this.width; ax++, x++) {
			cmd = '';
			char = ' ';

			if (this.bg) {
				cmd = this.vexation.terminal.backgroundCommand(...this.bg);
			}

			if (this.content && this.content[x]) {
				char = this.content[x];
			}

			// Reset per cell is stupid, but it's just a test
			//cmd += '\x1b[0m';

			if (!buf[ay][ax]) {
				buf[ay][ax] = '';
			}

			buf[ay][ax] += cmd;
			char_buf[ay][ax] = char;
		}
	}

	if (this.children && this.children.length) {
		for (let i = 0; i < this.children.length; i++) {
			this.children[i].render();
		}
	}

	// console.log(this.content);
	// console.log(buf);
	// process.exit();

});