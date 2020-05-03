/**
 * The Line Class:
 * Represents a horizontal line of cells
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Vexation.Surface}   surface   The parent surface buffer
 */
const Line = Fn.inherits('Vexation.Base', function Line(surface) {

	// The buffer this line is in
	this.buffer = surface;

	// The cells in this line
	this.cells = [];

	// Get the width
	this.width = this.buffer.width;

	// Is this line dirty?
	this.dirty = false;
});

/**
 * The width property
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Number}
 */
Line.enforceProperty(function width(new_width, old_width) {

	if (!new_width) {
		new_width = 0;
	}

	// Shorten the line if the width got smaller
	if (this.cells.length > new_width) {
		this.cells.length = new_width;
	}

	return new_width;
});

/**
 * Get a cell at the given X coordinte
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Number}   x
 *
 * @return   {Vexation.Cell|Boolean}
 */
Line.setMethod(function getCell(x) {

	if (x >= this.width) {
		return false;
	}

	if (!this.cells[x]) {
		this.cells[x] = new Vexation.Cell(this);
	}

	return this.cells[x];
});