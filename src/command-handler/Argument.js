// Argument is the base class for all argument types
// It provides methods to validate and parse relevant arguments
class Argument {
	constructor(commandHandler, name) {
		// The commandHandler that instantiated this argument
		this.commandHandler = commandHandler;

		// The name of the argument
		this.name = name;

		commandHandler.logger.info(`Created argument type ${name}`);
	}

	// Check if an argument can be parsed from the given string
	// Takes a string, a command's arg options and a command message
	// Returns a boolean or a string error message
	validate(val, arg, msg) {
		return this.baseValidate(val, msg);
	}

	// Check if a given string is a valid argument of this type
	// Takes a string and a message
	baseValidate() {
		throw new Error('Argument has no base validate function');
	}

	// Parses an argument from the given string
	// Only takes a string
	// Returns the parsed value
	parse() {
		throw new Error('Argument has no parse function');
	}

	// Check if a string could be the start of the argument
	// Only takes a string
	isPossibleStart() {
		return true;
	}
}

module.exports = Argument;

