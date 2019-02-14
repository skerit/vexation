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

require('./base.js');
require('./vexation.js');
require('./terminal/terminal.js');
require('./terminal/cursor.js');
require('./terminal/tput.js');
require('./elements/00-element.js');
require('./elements/text.js');

// Export the Vexation namespace
module.exports = Blast.Classes.Vexation;