// Command represents an executable command
const util = require('../utility');

class Command {
	constructor(client, name, options) {
		this.client = client;
		this.commandHandler = client.commandHandler;
		this.logger = this.commandHandler.logger;
		this.name = name;

		options = Object.assign({
			display: util.toTitleCase(name),
			examples: options.args ? null : [options.name],
			level: 0,
			ownerOnly: false,
			description: '',
			module: 'commands',
			aliases: [],
			args: [],
			throttling: null,
		}, options);
		this._validateOptions(options);

		this.logger.info(`Created command ${this.display} (${this.name})`);
	}

	// Check if a given user can run the command
	// If a guild is provided, the members permission level is checked
	hasPermission(user, guild) {
		// Only bot owners can use owner only commands
		if (this.ownerOnly && !this.commandHandler.isOwner(user.id)) {
			return false;
		}
		return true;
	}

	// Abstract method to run the command
	run() {
		this.logger.warn(`${this.name} was ran but has no run method`);
	}

	// Get the command's display name
	get displayName() {
		return this.display;
	}

	// Get's the registry for this object to be put in
	//  0 - Command
	//  1 - Command Group
	//  2 - Subcommand
	get registryType() {
		return 0;
	}

	// Validate and set command options
	_validateOptions(options) {
		// Username
		const display = options.display;
		if (typeof display !== 'string') {
			this.logger.fatal(`${this.name} command display name "${display}" is not a string`, display);
		}
		this.display = options.display;
		// Examples
		const examples = options.examples;
		if (examples !== null && examples !== undefined && !Array.isArray(examples)) {
			this.logger.fatal(`${this.name}'s examples must be an array or null`, JSON.stringify(examples));
		}
		this.examples = examples;
		// Level
		const level = options.level;
		if (typeof level !== 'number' || !util.isLevel(level)) {
			this.logger.fatal(`${this.name} level must be 0 <= level <= 100`, JSON.stringify(level));
		}
		this.level = level;
		// Owner only
		const ownerOnly = options.ownerOnly;
		if (typeof ownerOnly !== 'boolean' && ownerOnly !== null) {
			this.logger.fatal(`${this.name} ownerOnly must be a boolean`, JSON.stringify(ownerOnly));
		}
		this.ownerOnly = ownerOnly;
		// Description
		const description = options.description;
		if (typeof description !== 'string') {
			this.logger.fatal(`${this.name} description must be a string`, JSON.stringify(description));
		}
		this.description = description;
		// Module
		const module = options.module;
		// TODO: make this check if the module is a registered module
		if (typeof module !== 'string') {
			this.logger.fatal(`${this.name} module must be a string`, JSON.stringify(module));
		}
		this.module = module;
		// Aliases
		const aliases = options.aliases;
		if (aliases !== null && !Array.isArray(aliases)) {
			this.logger.fatal(`${this.name}'s aliases must be an array or null`, JSON.stringify(aliases));
		}
		this.aliases = aliases;
		// Arguments
		const args = options.args;
		// TODO: Validate this
		this.args = args;
		// Throttling
		const throttling = options.throttling;
		// TODO: Validate this
		this.throttling = throttling;
		this.logger.trace(`${this.name}: options validated`);
	}
}

module.exports = Command;

