var Vexation,
    Blast;

// Get an existing Protoblast instance,
// or create a new one
if (typeof __Protoblast != 'undefined') {
	Blast = __Protoblast;
} else {
	Blast = require('protoblast')(false);
}

// Get the Vexation namespace
Vexation = Blast.Bound.Function.getNamespace('Vexation');

require('./vexation.js');
require('./terminal/cursor.js');
require('./terminal/tput.js');

// Export the Vexation namespace
module.exports = Blast.Classes.Vexation;