const env = process.env;
let writeOutMethod;

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

// If debug mode is on, log the output commands
if (env.DEBUG) {
	writeOutMethod = function writeOut(str) {
		console.log('[DEBUG][writeOut]', JSON.stringify(str));
	}
} else {
	writeOutMethod = function writeOut(str) {
		process.stdout.write(str);
	}
}

/**
 * Write to the output
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String}   str
 */
Base.setMethod(writeOutMethod);
