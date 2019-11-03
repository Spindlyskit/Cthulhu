// ArgumentString parses arguments from a given string
// Command name parsing it not performed here, that is done by the handler itself
const util = require('../utility');

class ArgumentString {
	constructor(msg, rawString, commandArgs) {
		// The command message that instantiated this ArgumentString
		this.msg = msg;
		this.commandHandler = msg.commandHandler;
		this.client = msg.commandHandler.client;

		// The raw message content with the prefix and command removed
		this.rawString = rawString;

		// The command arguments options
		this.commandArgs = commandArgs;

		// The arguments we have parsed
		this._args = this._split();
		this.args = this._parse();
	}

	// Take a raw arg string and break it into component arguments
	// For example 'arg1 "another arg" arg3' would become ['arg1', 'another arg', 'arg3']
	_split() {
		const re = this.commandHandler.argumentRegex;
		const rawString = this.rawString;
		const args = [];

		for (let result = re.exec(rawString); result; result = re.exec(rawString)) {
			args.push(result[2] || result[3]);
		}

		return args;
	}

	// Format the arguments to match the command arguments
	_parse() {
		const commandArgs = this.commandArgs;
		const rawArgs = this._args;
		const parsedArgs = {};

		for (let i = 0; i < commandArgs.length; i++) {
			const arg = commandArgs[i];
			const label = arg.label || arg.name;
			const type = this.commandHandler.arguments.get(arg.type);
			if (!type) {
				this.commandHandler.logger.warn(
					`${arg.type} is not an argument type`
				);
				return this.msg.reject('An internal error occured');
			}

			const isLastArg = i + 1 === commandArgs.length;
			// Use all of rawArgs if this is the final command arg
			let rawArg = isLastArg ?
				rawArgs.join(' ') :
				rawArgs.shift();

			// If we don't get an arg, try to use the default, otherwise reject
			if (!rawArg) {
				if (arg.default !== undefined) {
					parsedArgs[arg.name] = arg.default;
					break;
				} else {
					return this.msg.reject(`Please provide ${util.indefiniteArticle(arg.type)} for ${label}`);
				}
			}

			if (!type.validate(rawArg, arg, this.msg)) {
				return this.msg.reject(`"${rawArg}" is not a valid ${type.name}`);
			}
			const parsed = type.parse(rawArg);
			parsedArgs[arg.name] = parsed;
		}

		return parsedArgs;
	}
}

module.exports = ArgumentString;

