const Argument = require('../Argument');

// StringArgumentType represents a string of characters
class StringArgumentType extends Argument {
	constructor(client) {
		super(client, 'string');
	}

	// Validating a string is simple, this mainly handles config options
	validate(val, arg) {
		// Min and max length options
		if (arg.min && val.length < arg.min) {
			return `Please keep ${arg.label} above or exactly ${arg.min} characters`;
		}
		if (arg.max && val.length > arg.max) {
			return `Please keep ${arg.label} below or exactly ${arg.max} characters`;
		}

		return this.baseValidate(val);
	}

	// Any string is obviously a valid string
	baseValidate() {
		return true;
	}

	// Parsing a string from a string is really hard
	// This method is so complex no mortal should attempt to comprehend it
	parse(val) {
		return val;
	}

	// Check if a string could be the start of a string
	isPossibleStart() {
		return true;
	}
}

module.exports = StringArgumentType;

