/**
 * The Cell Class:
 * Represents a single cell (column/character) on the screen
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Vexation.Line}   line   The parent line this cell is in
 */
const Cell = Fn.inherits('Vexation.Base', function Cell(line) {

	// The parent line
	this.line = line;

	// The character this cell represents
	this.char = '';

	// The foreground color
	this.fg_color = new Vexation.Color();

	// The background color
	this.bg_color = new Vexation.Color();

});

/**
 * Is the given cell the same as this one?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Vexation.Cell}   cell
 *
 * @return   {Boolean}
 */
Cell.setMethod(function equals(cell) {

	if (this.char !== cell.char) {
		return false;
	}

	if (!this.fg_color.equals(cell.fg_color)) {
		return false;
	}

	if (!this.bg_color.equals(cell.bg_color)) {
		return false;
	}

	return true;
});

/**
 * Overwrite the contents of this cell with the given cell
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Vexation.Cell}   cell
 *
 * @return   {Boolean}
 */
Cell.setMethod(function overwrite(cell) {

	if (this.equals(cell)) {
		return false;
	}

	this.char = cell.char;
	this.fg_color.overwrite(cell.fg_color);
	this.bg_color.overwrite(cell.bg_color);

	// Tell the line it's dirty, and needs to be drawn again
	this.line.dirty = true;

	return true;
});

/**
 * Create draw for this cell
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {String}
 */
Cell.setMethod(function createDrawCommand() {

	var result = '';

	if (this.char) {
		result += this.char;
	} else {
		result = ' ';
	}

	return result;
});