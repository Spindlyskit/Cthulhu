const Argument = require('../Argument');

// IntegerArgumentType represents a integer of characters
class IntegerArgumentType extends Argument {
	constructor(client) {
		super(client, 'integer');
	}

	// Check if a string can be parsed into an int
	validate(val, arg) {
		const int = Number.parseInt(val);
		if (Number.isNaN(int)) return false;

		if (arg.min !== null && typeof arg.min !== 'undefined' && int < arg.min) {
			return `Please enter a number above or exactly ${arg.min}.`;
		}
		if (arg.max !== null && typeof arg.max !== 'undefined' && int > arg.max) {
			return `Please enter a number below or exactly ${arg.max}.`;
		}

		return true;
	}

	// Check if a string can be converted to an int
	baseValidate(val) {
		return Number.isNaN(Number.parseInt(val));
	}

	// Convert a string integer to an int
	parse(val) {
		return Number.parseInt(val);
	}

	// Check if a string could be the start of an int
	isPossibleStart(val) {
		return this.baseValidate(val);
	}
}

module.exports = IntegerArgumentType;

