var Blast;

// Get an existing Protoblast instance,
// or create a new one
if (typeof __Protoblast != 'undefined') {
	Blast = __Protoblast;
} else {
	Blast = require('protoblast')(false);
}

// Get the Vexation namespace
const Vexation = Blast.Bound.Function.getNamespace('Vexation');

// Set the argument info
Blast.arguments.vexation = {
	names  : ['Vexation', 'Blast', 'Bound',      'Classes',      'Fn'],
	values : [ Vexation,   Blast,   Blast.Bound,  Blast.Classes,  Blast.Collection.Function]
};

let options = {

	// The directory to start looking in
	pwd        : __dirname,

	// Do not allow it to be added to the client-side
	client     : false,

	// The argument configuration to use for the wrapper function
	arguments  : 'vexation'
};

Blast.requireAll([
	['base'],
	['vexation'],
	['terminal', 'terminal'],
	['terminal', 'cursor'],
	['terminal', 'tput'],
	['terminal', 'surface'],
	['terminal', 'cell'],
	['terminal', 'row'],
	['terminal', 'color'],
	['terminal', 'computed'],
	['elements', '00-node'],
	['elements', '05-polygon'],
	['elements', 'text'],
], options);

// Export the Vexation namespace
module.exports = Vexation;