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

	this.computed = {
		char : ''
	};

	// The parent line
	this.line = line;

	// The foreground color
	this.fg_color = new Vexation.Color();

	// The background color
	this.bg_color = new Vexation.Color();

});

/**
 * The char property
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Number}
 */
Cell.computedProperty(function char(new_char, old_char) {

	if (new_char == null) {
		new_char = '';
	} else if (typeof new_char != 'string') {
		new_char = '' + new_char;
	}

	return new_char;
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

	if (this.computed.char !== cell.computed.char) {
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

	this.char = cell.computed.char;
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

	if (this.computed.char) {
		result += this.computed.char;
	} else {
		result = ' ';
	}

	return result;
});