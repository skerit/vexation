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
 * Enforce a property and keep it in a cache for fast getting
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String}   str
 */
Base.setStatic(function computedProperty(name, fnc) {

	var has_setter = false;

	if (typeof name == 'function') {
		fnc = name;
		name = fnc.name;
	}

	if (typeof fnc == 'function') {
		has_setter = true;
	}

	this.setProperty(name, function getter() {
		return this.computed[name];
	}, function setter(new_value) {

		if (has_setter) {
			new_value = fnc.call(this, new_value, this.computed[name]);
		}

		this.computed[name] = new_value;

		return new_value;
	});
});

/**
 * Create a numerical computed property
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String}   name
 */
Base.setStatic(function addNumericComputedProperty(name, fnc) {

	if (Array.isArray(name)) {
		let i;

		for (i = 0; i < name.length; i++) {
			this.addNumericComputedProperty(name[i]);
		}

		return;
	}

	let has_setter = false;

	if (typeof name == 'function') {
		fnc = name;
		name = fnc.name;
	}

	if (typeof fnc == 'function') {
		has_setter = true;
	}

	this.setProperty(name, function getter() {
		return this.computed[name];
	}, function setter(new_value) {

		let old_value = this.computed[name] || 0;

		if (typeof new_value != 'number') {
			new_value = parseInt(new_value);
		}

		if (!new_value) {
			new_value = 0;
		}

		if (has_setter) {
			new_value = fnc.call(this, new_value, old_value);
		}

		this.computed[name] = new_value;

		if (new_value !== old_value) {
			this.recalculate();
		}

		return new_value;
	});
});

/**
 * Add a simple computed getter
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String}   name
 */
Base.setStatic(function setComputedPropertyGetter(name) {

	if (Array.isArray(name)) {
		let i;

		for (i = 0; i < name.length; i++) {
			this.setComputedPropertyGetter(name[i]);
		}

		return;
	}

	this.setProperty(name, function getter() {
		return this.computed[name];
	});
});

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
let lookup = function lookup(name) {

	var result;

	if (this.tput) {
		result = this.tput.get(name);
	} else if (this.vexation && this.vexation.tput) {
		result = this.vexation.tput.get(name);
	}

	return result || '';
};

if (env.DEBUG) {
	Base.setMethod('lookup', function debugLookup(name) {

		let result = lookup.call(this, name);

		console.log('[DEBUG][lookup]', name, '»', JSON.stringify(result));

		return result;
	});
} else {
	Base.setMethod(lookup);
}

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

/**
 * Print a single cell
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String}   cmd
 */
Base.setMethod(function writeCell(cmd) {

	// Get the cursor
	let cursor = this.cursor || (this.vexation ? this.vexation.cursor : null);

	// Actually write it out
	this.writeOut(cmd);

	if (cursor) {
		cursor.current_x += 1;
	}

});