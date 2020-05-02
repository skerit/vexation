/**
 * The Base Class
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
const Base = Fn.inherits('Informer', 'Vexation', function Base() {});

/**
 * Lookup tput command
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String}   name   The name of the command
 *
 * @return   {String}
 */
Base.setMethod(function lookup(name) {

	var result;

	if (this.tput) {
		result = this.tput.get(name);
	} else if (this.vexation && this.vexation.tput) {
		result = this.vexation.tput.get(name);
	}

	return result || '';
});

/**
 * Write to the output
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String}   str
 */
Base.setMethod(function writeOut(str) {
	process.stdout.write(str);
});
