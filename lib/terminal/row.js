/**
 * The Row Class:
 * Represents a horizontal row of cells
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Vexation.Surface}   surface   The parent surface buffer
 */
const Row = Fn.inherits('Vexation.Base', function Row(surface, width) {

	// Create the computed cache
	this.computed = {
		width  : width || 0,
	};

	// The starting point (always 0 for non-polyons)
	this.x = 0;

	// The buffer this line is in
	this.buffer = surface;

	// The cells in this line
	this.cells = [];

	// Is this line dirty?
	// Meaning: does it need to be drawn on its parent?
	this.dirty = true;
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
Row.computedProperty(function width(new_width, old_width) {

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
 * Get a cell at the given X coordinate
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Number}   x
 *
 * @return   {Vexation.Cell|Boolean}
 */
Row.setMethod(function getCell(x) {

	// Calculate the correct index
	let index = x - this.x;

	return this.getCellByIndex(index);
});

/**
 * Get a cell by its index
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Number}   index
 *
 * @return   {Vexation.Cell|Boolean}
 */
Row.setMethod(function getCellByIndex(index) {

	if (index >= this.computed.width) {
		return false;
	}

	// Create all the cells up to the one we need
	while (this.cells.length <= index) {
		this.cells.push(new Vexation.Cell(this));
	}

	return this.cells[index];
});