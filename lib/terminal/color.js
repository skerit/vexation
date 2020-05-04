/**
 * The Color Class:
 * Represents a color
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Vexation.Line}   line   The parent line this cell is in
 */
const Color = Fn.inherits('Vexation.Base', function Color() {

	this.red = -1;
	this.green = -1;
	this.blue = -1;

});

/**
 * Create a color object from the given parameter
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Mixed}   arg
 *
 * @return   {Color}
 */
Color.setStatic(function from(arg) {

	var result = new Color();

	if (Array.isArray(arg)) {
		result.red = arg[0];
		result.green = arg[1];
		result.blue = arg[2];
	}

	return result;
});

/**
 * Is the given color the same as this one?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Vexation.Color}   color
 *
 * @return   {Boolean}
 */
Color.setMethod(function equals(color) {

	if (!color) {
		return false;
	}

	if (this.red !== color.red) {
		return false;
	}

	if (this.green !== color.green) {
		return false;
	}

	if (this.blue !== color.blue) {
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
Color.setMethod(function overwrite(color) {

	if (this.equals(color)) {
		return false;
	}

	this.red = color.red;
	this.green = color.green;
	this.blue = color.blue;

	return true;
});


/**
 * Get background color command
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Number}   red
 * @param    {Number}   green
 * @param    {Number}   blue
 *
 * @return   {String}
 */
Color.setMethod(function createBgCommand() {
	return '\x1b[48;2;' + this.red + ';' + this.green + ';' + this.blue + 'm';
});