const Argument = require('../Argument');

// CommandArgumentType represents a bot command
class CommandArgumentType extends Argument {
	constructor(client) {
		super(client, 'command');
	}

	// Currently command has no options so this is the same as baseValidate
	validate(val) {
		return this.baseValidate(val);
	}

	// Check if a command is in the registry
	baseValidate(val) {
		return this.commandHandler.commands.has(val);
	}

	// Just get the value from the registry
	parse(val) {
		return this.commandHandler.commands.get(val);
	}

	// Any string could be at the start of a command
	// We could add more validation here if this causes problems
	isPossibleStart() {
		return true;
	}
}

module.exports = CommandArgumentType;

